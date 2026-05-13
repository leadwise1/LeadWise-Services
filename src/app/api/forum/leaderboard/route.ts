import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const leaderboardRef = db.collection("artifacts").doc("leadwise-web").collection("public").doc("data").collection("leaderboard");
    // Get top 20 learners ordered by points descending
    const snapshot = await leaderboardRef
      .orderBy("points", "desc")
      .limit(20)
      .get();
    
    const leaderboardData = snapshot.docs.map((doc, index) => {
      const data = doc.data();
      return {
        id: doc.id,
        rank: index + 1,
        name: data.name || "Anonymous Learner",
        points: data.points || 0,
        coursesCompleted: data.coursesCompleted || 0,
        trend: index % 2 === 0 ? "up" : "same", // Mock trend
      };
    });

    return NextResponse.json({ success: true, data: leaderboardData });
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return NextResponse.json({ error: 'Failed to load leaderboard' }, { status: 500 });
  }
}
