import { NextRequest, NextResponse } from 'next/server';
import { adminDb, admin } from '@/lib/firebase-admin';
import { getEnrollmentReports, getClientCredentialsToken, type CourseraEnrollmentReport } from '@/lib/coursera';

// Force the route to be dynamic to avoid build-time static generation errors
export const dynamic = 'force-dynamic';

interface LeaderboardEntry {
  id: string;
  userId: string;
  name: string;
  points: number;
  coursesCompleted: number;
  totalCourses: number;
  estimatedHours: number;
  rank?: number;
  trend?: string;
  lastUpdated?: any;
}

export async function GET(request: NextRequest): Promise<Response> {
  try {
    // Use System Token (Client Credentials) for bulk leaderboard sync.
    // This avoids user-scoped token limitations and prevents 401/403 errors during bulk operations.
    const token = await getClientCredentialsToken();

    if (!token) {
      return NextResponse.json({
        success: false,
        data: [],
        needsAuth: true,
        error: 'Coursera requires an API key or bearer token for enrollment reports. Add COURSERA_API_KEY, COURSERA_ACCESS_TOKEN, or COURSERA_BEARER_TOKEN on the server.',
      }, { status: 401 });
    }

    let enrollments: CourseraEnrollmentReport[] = [];
    let syncError = null;

    try {
      // Attempt to fetch fresh data from Coursera
      enrollments = await getEnrollmentReports(token);
    } catch (err: any) {
      console.warn('Coursera Sync Warning: Fetch failed, falling back to Firestore cache.', err.message);
      syncError = err.message;
      
      // If fetch fails, we skip the Firestore write but still attempt to read 
      // from the existing leaderboard collection below.
    }

    const leaderboardData = buildLeaderboard(enrollments);

    // Only attempt write if we actually fetched new data
    if (adminDb && leaderboardData.length > 0) {
      // Path Alignment: artifacts -> leadwise-web -> public -> data -> leaderboard
      const leaderboardRef = adminDb.collection("artifacts")
        .doc("leadwise-web")
        .collection("public")
        .doc("data")
        .collection("leaderboard");
        
      const batch = adminDb.batch();

      leaderboardData.forEach((learner) => {
        batch.set(leaderboardRef.doc(learner.id), {
          userId: learner.id,
          name: learner.name,
          points: learner.points,
          coursesCompleted: learner.coursesCompleted,
          totalCourses: learner.totalCourses,
          estimatedHours: learner.estimatedHours || 0,
          lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
      });

      await batch.commit();
    }

    let finalData: LeaderboardEntry[] = leaderboardData;

    // Fallback: If no new data was fetched, read the current rankings from Firestore
    if (finalData.length === 0 && adminDb) {
      const snapshot = await adminDb.collection("artifacts").doc("leadwise-web").collection("public").doc("data").collection("leaderboard")
        .orderBy("points", "desc")
        .limit(20)
        .get();
      
      finalData = snapshot.docs.map(doc => {
        const data = doc.data();
        return { 
          id: doc.id, 
          userId: data.userId || doc.id,
          name: data.name || "Anonymous",
          points: data.points || 0,
          coursesCompleted: data.coursesCompleted || 0,
          totalCourses: data.totalCourses || 9,
          estimatedHours: data.estimatedHours || 0,
          lastUpdated: data.lastUpdated
        } as LeaderboardEntry;
      });
    }

    return NextResponse.json({
      success: true,
      data: finalData.slice(0, 20),
      source: 'coursera',
      syncError: syncError,
      totalLearners: finalData.length,
    });
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return NextResponse.json({
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'Failed to load Coursera learners',
    }, { status: 500 });
  }
}

function buildLeaderboard(enrollments: CourseraEnrollmentReport[]): LeaderboardEntry[] {
  const learners = new Map<string, LeaderboardEntry>();

  for (const enrollment of enrollments) {
    if (isInactiveEnrollment(enrollment)) continue;

    const id = getLearnerId(enrollment);
    const current = learners.get(id) || {
      id,
      userId: id,
      name: getLearnerName(enrollment),
      points: 0,
      coursesCompleted: 0,
      totalCourses: 0,
      estimatedHours: 0,
    };

    const progress = getEnrollmentProgress(enrollment);
    current.totalCourses += 1;
    current.points += Math.round(progress * 100);
    current.estimatedHours += Number(enrollment.estimatedLearningHours || 0);
    if (isCompletedEnrollment(enrollment, progress)) {
      current.coursesCompleted += 1;
    }

    learners.set(id, current);
  }

  return Array.from(learners.values())
    .sort((a, b) => b.points - a.points)
    .map((learner, index) => ({
      ...learner,
      rank: index + 1,
      trend: 'same',
    }));
}

function getLearnerId(enrollment: CourseraEnrollmentReport): string {
  return String(
    enrollment.learnerId ||
    enrollment.userId ||
    enrollment.externalId ||
    enrollment.email ||
    enrollment.id
  );
}

function getLearnerName(enrollment: CourseraEnrollmentReport): string {
  return String(
    enrollment.name ||
    enrollment.userName ||
    enrollment.fullName ||
    enrollment.email ||
    'Anonymous Learner'
  );
}

function getEnrollmentProgress(enrollment: CourseraEnrollmentReport): number {
  const rawProgress =
    enrollment.progress ??
    enrollment.overallProgress ??
    enrollment.grade ??
    0;

  const progress = Number(rawProgress);
  if (!Number.isFinite(progress)) return 0;
  return progress > 1 ? progress : progress * 100;
}

function isCompletedEnrollment(enrollment: CourseraEnrollmentReport, progress: number): boolean {
  const status = String(enrollment.status || enrollment.enrollmentStatus || '').toLowerCase();
  return Boolean(enrollment.completedAt) || status.includes('complete') || progress >= 100;
}

function isInactiveEnrollment(enrollment: CourseraEnrollmentReport): boolean {
  const status = String(enrollment.status || enrollment.enrollmentStatus || '').toLowerCase();
  return Boolean(enrollment.deletedAt || enrollment.isDeleted) ||
    status.includes('deleted') ||
    status.includes('unenrolled') ||
    status.includes('dropped');
}
