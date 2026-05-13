import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET() {
  try {
    // 1. Fallback for missing database (Admin SDK not initialized)
    if (!adminDb) {
      console.warn("Leaderboard API: Database not initialized. Returning mock data.");
      return NextResponse.json({ 
        success: true, 
        data: getMockLeaderboard(),
        isMock: true 
      });
    }

    const leaderboardRef = adminDb.collection("artifacts").doc("leadwise-web").collection("public").doc("data").collection("leaderboard");
    
    // 2. Fetch real data
    try {
      // Get top 20 learners ordered by points descending
      const snapshot = await leaderboardRef
        .orderBy("points", "desc")
        .limit(20)
        .get();
      
      if (snapshot.empty) {
        return NextResponse.json({ success: true, data: [] });
      }

      const leaderboardData = snapshot.docs.map((doc, index) => {
        const data = doc.data();
        return {
          id: doc.id,
          rank: index + 1,
          name: data.name || "Anonymous Learner",
          points: data.points || 0,
          coursesCompleted: data.coursesCompleted || 0,
          trend: index % 2 === 0 ? "up" : "same",
        };
      });

      return NextResponse.json({ success: true, data: leaderboardData });
    } catch (dbError: any) {
      console.error("Firestore Leaderboard Error:", dbError.message);
      // Fallback to mock if index is missing or other Firestore issues occur
      return NextResponse.json({ 
        success: true, 
        data: getMockLeaderboard(),
        isMock: true,
        error: dbError.message 
      });
    }
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return NextResponse.json({ error: 'Failed to load leaderboard' }, { status: 500 });
  }
}

function getMockLeaderboard() {
  return [
    { id: "1", rank: 1, name: "Sarah J.", points: 12500, coursesCompleted: 8, trend: "up" },
    { id: "2", rank: 2, name: "Michael R.", points: 11200, coursesCompleted: 7, trend: "same" },
    { id: "3", rank: 3, name: "Alex K.", points: 9800, coursesCompleted: 6, trend: "up" },
    { id: "4", rank: 4, name: "David L.", points: 8500, coursesCompleted: 5, trend: "same" },
    { id: "5", rank: 5, name: "Maria G.", points: 7200, coursesCompleted: 4, trend: "up" },
  ];
}
