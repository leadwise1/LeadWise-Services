import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { adminDb, adminAuth, admin } from "@/lib/firebase-admin";
import { labPhase, sessionMillis } from "@/lib/lab-session";

const schema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("rsvp"),
    displayName: z.string().trim().max(60).default(""),
  }),
  z.object({
    action: z.literal("checkpoint"),
    checkpoint: z.enum(["green", "yellow", "red"]),
  }),
]);

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  if (!adminDb || !adminAuth)
    return NextResponse.json(
      { error: "Community connection unavailable." },
      { status: 503 },
    );
  const token = request.headers
    .get("authorization")
    ?.match(/^Bearer (.+)$/)?.[1];
  if (!token)
    return NextResponse.json(
      { error: "Please reconnect to the community." },
      { status: 401 },
    );
  let uid: string;
  try {
    uid = (await adminAuth.verifyIdToken(token)).uid;
  } catch {
    return NextResponse.json(
      { error: "Please reconnect to the community." },
      { status: 401 },
    );
  }
  const { id } = await context.params;
  if (!id || id.length > 150 || id.includes("/"))
    return NextResponse.json({ error: "Invalid lab." }, { status: 400 });
  let body;
  try {
    body = schema.safeParse(await request.json());
  } catch {
    return NextResponse.json(
      { error: "Please check your response." },
      { status: 400 },
    );
  }
  if (!body.success)
    return NextResponse.json(
      { error: "Please check your response." },
      { status: 400 },
    );
  const action = body.data;
  try {
    const ref = adminDb
      .collection("artifacts")
      .doc("leadwise-web")
      .collection("public")
      .doc("data")
      .collection("sessions")
      .doc(id);
    await adminDb.runTransaction(async (transaction) => {
      const session = await transaction.get(ref);
      if (!session.exists) throw new Error("NOT_FOUND");
      const data = session.data()!;
      const phase = labPhase(
        sessionMillis(data.startsAt),
        sessionMillis(data.endsAt),
        Date.now(),
      );
      if (action.action === "checkpoint" && phase !== "live")
        throw new Error("NOT_LIVE");
      const announcedDate =
        typeof data.eventDate === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(data.eventDate) &&
        Date.parse(`${data.eventDate}T23:59:59Z`) > Date.now();
      if (
        action.action === "rsvp" &&
        (phase === "ended" || (phase === "unscheduled" && !announcedDate))
      )
        throw new Error("NOT_SCHEDULED");
      // One document per verified learner makes repeat RSVPs and check-ins idempotent.
      const participant = ref.collection("participants").doc(uid);
      const existing = await transaction.get(participant);
      transaction.set(participant, {
        ...(existing.data() || {}),
        ...(action.action === "rsvp"
          ? { rsvped: true, displayName: action.displayName }
          : { checkpoint: action.checkpoint }),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "NOT_FOUND")
      return NextResponse.json(
        { error: "This lab is no longer available." },
        { status: 404 },
      );
    if (message === "NOT_LIVE")
      return NextResponse.json(
        { error: "Checkpoints open when the lab starts." },
        { status: 409 },
      );
    if (message === "NOT_SCHEDULED")
      return NextResponse.json(
        { error: "Please wait for the next scheduled lab." },
        { status: 409 },
      );
    console.error("Unable to save lab response:", error);
    return NextResponse.json(
      { error: "Your response could not be saved. Please try again." },
      { status: 503 },
    );
  }
}
