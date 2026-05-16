import { NextRequest, NextResponse } from 'next/server';
import { getStudentProgress, calculateProgress, getClientCredentialsToken } from '@/lib/coursera';
import { adminDb, admin } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  let token = request.cookies.get('coursera_token')?.value;

  if (!token) {
    console.info('/api/coursera/progress: No coursera_token found in cookies. Fetching Client Credentials token.');
    try {
      token = await getClientCredentialsToken();
    } catch (tokenError) {
      console.error('Failed to get Client Credentials token:', tokenError);
      return NextResponse.json({ error: 'Failed to authenticate with Coursera' }, { status: 401 });
    }
  }

  if (!token) {
    return NextResponse.json({ error: 'Failed to authenticate with Coursera' }, { status: 401 });
  }

  try {
    console.log('/api/coursera/progress: Attempting to fetch progress.');
    const data = await getStudentProgress(token);
    
    // The Coursera Reporting API returns a list of enrollments.
    const progress = calculateProgress(data);
    
    // 🔥 THE SYNC ENGINE: Save to Firestore Leaderboard
    try {
      // For Client Credentials, we might be fetching organizational data.
      // If data contains a specific user, use that. Otherwise use a fallback.
      const userId = data.userId || "system_sync"; 
      
      const leaderboardRef = adminDb.collection("artifacts").doc("leadwise-web").collection("public").doc("data").collection("leaderboard");
      
      await leaderboardRef.doc(userId).set({
        userId: userId,
        name: data.userName || "Coursera Learner",
        points: progress.percentage * 100,
        coursesCompleted: progress.completed,
        totalCourses: progress.total,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      
      console.log('/api/coursera/progress: Synced to Leaderboard!');
    } catch (dbError) {
      console.error('Failed to sync leaderboard data:', dbError);
    }
    
    return NextResponse.json({
      success: true,
      ...progress
    });
  } catch (error) {
    console.error('Failed to fetch progress:', error);
    return NextResponse.json({ error: 'Failed to fetch progress from Coursera' }, { status: 500 });
  }
}
