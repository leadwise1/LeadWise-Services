import { NextRequest, NextResponse } from 'next/server';
import { adminDb, admin } from '@/lib/firebase-admin';

/**
 * Coursera xAPI Tracking Endpoint
 * Receives real-time learner statements from Coursera.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // xAPI sends statements in an array or single object
    const statements = Array.isArray(body) ? body : [body];

    console.log(`🚀 xAPI: Received ${statements.length} statements from Coursera.`);

    if (!adminDb) return NextResponse.json({ success: false }, { status: 500 });

    for (const statement of statements) {
      const email = statement.actor?.mbox?.replace('mailto:', '');
      const verb = statement.verb?.display?.['en-US'] || statement.verb?.id;
      const courseName = statement.object?.definition?.name?.['en-US'];
      
      // Map xAPI completion to XP points
      if (email && (verb === 'completed' || verb === 'passed')) {
        const userId = email.replace(/[.#$[\]]/g, '_'); // Firestore safe ID

        const leaderboardRef = adminDb.collection("artifacts")
          .doc("leadwise-web")
          .collection("public")
          .doc("data")
          .collection("leaderboard");

        const activityRef = adminDb.collection("artifacts")
          .doc("leadwise-web")
          .collection("public")
          .doc("data")
          .collection("recentActivity");

        const userName = statement.actor?.name || "Cyber Guardian";

        // Incremental Update: Add 1000 XP for every course completed via xAPI push
        await leaderboardRef.doc(userId).set({
          userId,
          name: userName,
          points: admin.firestore.FieldValue.increment(1000),
          coursesCompleted: admin.firestore.FieldValue.increment(1),
          lastActivity: courseName,
          lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        // Log to Activity Feed for the "Live Ticker"
        await activityRef.add({
          userName,
          message: `Just completed: ${courseName}`,
          timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log(`✅ xAPI Sync: ${email} earned 1000 XP for ${courseName}`);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('xAPI Endpoint Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// xAPI standard requires support for HEAD and GET on the tracking URL
export async function HEAD() {
  return new Response(null, { status: 200 });
}

export async function GET() {
  return NextResponse.json({ version: "1.0.3" });
}