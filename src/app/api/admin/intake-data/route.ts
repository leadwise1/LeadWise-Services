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
    const legacySnapshot = await adminDb.collectionGroup("profile").get();
    
    let students = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: data.studentId || doc.id,
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        email: data.email || null,
        zipCode: data.zipCode || "N/A",
        householdIncome: data.incomeBracket || data.householdIncome || "N/A",
        employmentStatus: data.employmentStatus || "N/A",
        status: data.status || "Active",
        enrolledAt: data.enrolledAt ? data.enrolledAt.toDate().toISOString() : new Date().toISOString()
      };
    });

    legacySnapshot.docs.forEach(doc => {
      if (doc.id === "intake" || doc.data().email) {
        const data = doc.data();
        students.push({
          id: data.participantId || data.studentId || doc.ref.parent.parent?.id || doc.id,
          firstName: data.firstName || null,
          lastName: data.lastName || null,
          email: data.email || null,
          zipCode: data.zipCode || "N/A",
          householdIncome: data.incomeBracket || data.householdIncome || "N/A",
          employmentStatus: data.employmentStatus || "N/A",
          status: data.status || "Active",
          enrolledAt: data.enrolledAt ? (typeof data.enrolledAt === 'string' ? data.enrolledAt : data.enrolledAt.toDate().toISOString()) : new Date().toISOString()
        });
      }
    });

    // Sort combined results by enrolledAt descending
    students.sort((a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime());


    return NextResponse.json(students, { status: 200 });
  } catch (err: unknown) {
    console.error("Admin API error:", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
