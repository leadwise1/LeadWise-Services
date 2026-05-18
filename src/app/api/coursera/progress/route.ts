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
    console.log('/api/coursera/progress: Syncing individual student ledger.');
    
    // The Coursera Reporting API returns a list of enrollments.
    const progress = calculateProgress(data);
    
    // 🔥 THE SYNC ENGINE: Save to Firestore Leaderboard
    try {
      if (!adminDb) {
        console.warn('/api/coursera/progress: Skipping Firestore sync as adminDb is not initialized.');
        throw new Error('Database connection unavailable');
      }

      // DATA MAPPING PER ARCHITECTURAL GUIDANCE:
      // Use the same ID logic as xAPI (Email-based) for consistency.
      const rawEmail = data.learnerEmail || data.email;
      let userId = data.externalId || data.userId || data.learnerId || "anonymous_learner";
      
      if (rawEmail) {
        userId = rawEmail.replace(/[.#$[\]]/g, '_');
      }
      
      // Name: Map to learnerName or definition.name (aliased here for resilience)
      const userName = data.learnerName || data.definition?.name || data.userName || data.fullName || data.name || "Coursera Learner";
      
      // Path Alignment: artifacts -> leadwise-web -> public -> data -> leaderboard
      const leaderboardRef = adminDb.collection("artifacts")
        .doc("leadwise-web")
        .collection("public")
        .doc("data")
        .collection("leaderboard");
      
      await leaderboardRef.doc(userId).set({
        userId: userId,
        name: userName,
        // Polling sync ensures the completion count is accurate, 
        // but we keep the points incremental to allow for xAPI bonuses.
        estimatedHours: progress.estimatedHours || 0,
        coursesCompleted: progress.completed,
        totalCourses: progress.total,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        syncMethod: 'polling'
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
