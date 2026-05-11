import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

export async function GET() {
  try {
    const leaderboardRef = collection(db, "leaderboard");
    // Get top 20 learners ordered by points descending
    const q = query(leaderboardRef, orderBy("points", "desc"), limit(20));
    
    const snapshot = await getDocs(q);
    
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
