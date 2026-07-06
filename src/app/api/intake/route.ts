import { NextRequest, NextResponse } from "next/server";
import { adminDb, admin } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, zipCode, householdIncome, employmentStatus, courseId, courseTitle } = body;

    // Basic validation
    if (!firstName || !email || !zipCode || !householdIncome || !employmentStatus || !courseId) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (!adminDb) {
      console.error("Intake API: Firebase Admin not initialized.");
      return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
    }

    await adminDb.collection("learner_intakes").add({
      firstName,
      lastName,
      email,
      zipCode,
      householdIncome,
      employmentStatus,
      courseId,
      courseTitle,
      enrolledAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: unknown) {
    console.error("Intake API error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
