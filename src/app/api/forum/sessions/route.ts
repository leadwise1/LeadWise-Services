import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { sessionMillis, validMeetUrl } from "@/lib/lab-session";

export async function GET(request: NextRequest) {
  if (!adminDb)
    return NextResponse.json(
      { error: "Labs are temporarily unavailable." },
      { status: 503 },
    );
  try {
    const token = request.headers
      .get("authorization")
      ?.match(/^Bearer (.+)$/)?.[1];
    let uid: string | undefined;
    if (token) {
      if (!adminAuth)
        return NextResponse.json(
          { error: "Please reconnect to the community." },
          { status: 503 },
        );
      try {
        uid = (await adminAuth.verifyIdToken(token)).uid;
      } catch {
        return NextResponse.json(
          { error: "Please reconnect to the community." },
          { status: 401 },
        );
      }
    }
    const snapshot = await adminDb
      .collection("artifacts")
      .doc("leadwise-web")
      .collection("public")
      .doc("data")
      .collection("sessions")
      .limit(50)
      .get();
    const sessions = await Promise.all(
      snapshot.docs
        .filter((doc) => {
          const data = doc.data();
          return (
            typeof data.topic === "string" || typeof data.title === "string"
          );
        })
        .map(async (doc) => {
          const data = doc.data();
          const participants = await doc.ref.collection("participants").get();
          const counts = { green: 0, yellow: 0, red: 0 };
          const attendees: string[] = [];
          let rsvped = false;
          let checkpoint: string | null = null;
          let attendeeCount = 0;
          for (const participant of participants.docs) {
            const value = participant.data();
            if (value.rsvped) {
              attendeeCount++;
              if (attendees.length < 3 && value.displayName)
                attendees.push(value.displayName);
            }
            if (
              value.checkpoint === "green" ||
              value.checkpoint === "yellow" ||
              value.checkpoint === "red"
            )
              counts[value.checkpoint as keyof typeof counts]++;
            if (participant.id === uid) {
              rsvped = Boolean(value.rsvped);
              checkpoint = value.checkpoint || null;
            }
          }
          const startsAt = sessionMillis(data.startsAt);
          const endsAt = sessionMillis(data.endsAt);
          return {
            id: doc.id,
            topic: data.topic || data.title || "Follow-Along Lab",
            desc: data.desc || "",
            mentor: data.mentor || "LeadWise host",
            startsAt,
            endsAt,
            eventDate:
              typeof data.eventDate === "string" ? data.eventDate : null,
            timeZone: "America/Chicago",
            meetUrl: validMeetUrl(data.meetUrl),
            attendeeCount,
            attendees,
            counts,
            rsvped,
            checkpoint,
            prep: Array.isArray(data.prep)
              ? data.prep
                  .filter((item: unknown) => typeof item === "string")
                  .slice(0, 10)
              : [
                  "Open your practice lab and terminal",
                  "Keep your notes nearby",
                ],
            clue: typeof data.clue === "string" ? data.clue : "",
          };
        }),
    );
    sessions.sort(
      (a, b) => (a.startsAt ?? Infinity) - (b.startsAt ?? Infinity),
    );
    return NextResponse.json(
      { sessions },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Unable to load labs:", error);
    return NextResponse.json(
      { error: "Labs could not be loaded. Please try again." },
      { status: 503 },
    );
  }
}
