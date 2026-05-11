import { NextRequest, NextResponse } from 'next/server';
import { getStudentProgress, calculateProgress } from '@/lib/coursera';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('coursera_token')?.value;

  if (!token) {
    console.warn('/api/coursera/progress: No coursera_token found in request cookies.');
    return NextResponse.json({ error: 'Not authenticated with Coursera' }, { status: 401 });
  }

  try {
    console.log('/api/coursera/progress: Attempting to fetch progress with token.');
    const data = await getStudentProgress(token);
    
    // The Coursera Reporting API returns a list of enrollments.
    const progress = calculateProgress(data);
    
    // 🔥 THE SYNC ENGINE: Save to Firestore Leaderboard
    try {
      // In a full app, we would query Coursera for the user's name. 
      // For this implementation, we use a placeholder or decode their JWT token.
      const userId = token.substring(0, 15); // Hash/mock ID based on token
      
      await setDoc(doc(db, "leaderboard", userId), {
        userId: userId,
        name: "Coursera Learner", // You would replace this with actual profile name
        points: progress.percentage * 100, // XP = percentage * 100
        coursesCompleted: progress.completed,
        totalCourses: progress.total,
        lastUpdated: serverTimestamp()
      }, { merge: true });
      
      console.log('/api/coursera/progress: Synced to Leaderboard!');
    } catch (dbError) {
      console.error('Failed to sync leaderboard data:', dbError);
    }
    
    console.log('/api/coursera/progress: Successfully retrieved and calculated progress.');

    return NextResponse.json({
      success: true,
      ...progress
    });
  } catch (error) {
    console.error('Failed to fetch progress:', error);
    return NextResponse.json({ error: 'Failed to fetch progress from Coursera' }, { status: 500 });
  }
}
