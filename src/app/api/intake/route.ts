import { NextRequest, NextResponse } from "next/server";
import { adminDb, admin } from "@/lib/firebase-admin";

/** Generate a short anonymized student ID for LMI grant reports, e.g. "user_7HsNxt" */
function generateAnonymousId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "user_";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      firstName, lastName, email,
      zipCode, householdIncome, employmentStatus,
      courseId, courseTitle, consent,
    } = body;

    // Validate all required fields
    if (!firstName || !lastName || !email || !zipCode || !householdIncome || !employmentStatus || !courseId) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (!adminDb) {
      console.error("Intake API: Firebase Admin not initialized.");
      return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
    }

    const enrolledAt = new Date().toISOString();

    // ── PATH 1: Full learner profile in users/{participantId}/intake ────────────
    // Used by admin to look up and sign learners up on Coursera.
    // Keyed by a stable ID derived from the email so duplicate submissions are idempotent.
    const participantId = email.toLowerCase().replace(/[^a-z0-9]/g, "_");

    await adminDb
      .collection("users")
      .doc(participantId)
      .collection("profile")
      .doc("intake")
      .set({
        participantId,
        firstName,
        lastName,
        email,
        zipCode,
        householdIncome,
        employmentStatus,
        targetCourse: courseTitle,
        courseId,
        consent: consent ?? false,
        status: "Enrolled",
        enrolledAt,
        lmiVerified: ["0-25k", "25-50k"].includes(householdIncome),
      }, { merge: true });

    // ── PATH 2: Anonymous demographic record in learner_intakes ─────────────────
    // Used for LMI grant reporting only — NO name or email stored here.
    const anonymousId = generateAnonymousId();

    await adminDb.collection("learner_intakes").doc(anonymousId).set({
      studentId: anonymousId,
      zipCode,
      incomeBracket: householdIncome,
      employmentStatus,
      courseId,
      courseTitle,
      status: "Active",
      enrolledAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, studentId: anonymousId }, { status: 200 });
  } catch (err: unknown) {
    console.error("Intake API error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
