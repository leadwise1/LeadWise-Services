import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Missing Authorization header" }, { status: 401 });
    }

    const password = authHeader.split(" ")[1];
    if (password !== "LeadWise2025") {
      return NextResponse.json({ message: "Invalid Access Code" }, { status: 401 });
    }

    if (!adminDb) {
      console.error("Admin API: Firebase Admin not initialized.");
      return NextResponse.json({ message: "Server configuration error." }, { status: 500 });
    }

    const snapshot = await adminDb.collection("learner_intakes").orderBy("enrolledAt", "desc").get();
    
    const students = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: data.studentId || doc.id,
        zipCode: data.zipCode || "N/A",
        householdIncome: data.incomeBracket || "N/A",
        employmentStatus: data.employmentStatus || "N/A",
        status: data.status || "Active",
        enrolledAt: data.enrolledAt ? data.enrolledAt.toDate().toISOString() : new Date().toISOString()
      };
    });

    return NextResponse.json(students, { status: 200 });
  } catch (err: unknown) {
    console.error("Admin API error:", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
