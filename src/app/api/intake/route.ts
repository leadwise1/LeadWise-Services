import { NextRequest, NextResponse } from "next/server";
import { adminDb, admin } from "@/lib/firebase-admin";

/** Generate a short anonymized student ID, e.g. "user_7HsNxt" */
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
    const { zipCode, householdIncome, employmentStatus, courseId, courseTitle } = body;

    // Only validate what we actually store — no name or email persisted
    if (!zipCode || !householdIncome || !employmentStatus || !courseId) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (!adminDb) {
      console.error("Intake API: Firebase Admin not initialized.");
      return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
    }

    const studentId = generateAnonymousId();

    // ✅ Only anonymous demographic data is stored — NO name, NO email
    await adminDb.collection("learner_intakes").doc(studentId).set({
      studentId,
      zipCode,
      incomeBracket: householdIncome,
      employmentStatus,
      courseId,
      courseTitle,
      status: "Active",
      enrolledAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, studentId }, { status: 200 });
  } catch (err: unknown) {
    console.error("Intake API error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
