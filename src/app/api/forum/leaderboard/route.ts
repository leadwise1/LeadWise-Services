import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getEnrollmentReports, type CourseraEnrollmentReport } from '@/lib/coursera';

export async function GET(request: NextRequest) {
  try {
    let token =
      request.cookies.get('coursera_token')?.value ||
      process.env.COURSERA_ACCESS_TOKEN ||
      process.env.COURSERA_BEARER_TOKEN ||
      process.env.COURSERA_API_KEY;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          data: [],
          needsAuth: true,
          error: 'Coursera requires an API key or bearer token for enrollment reports. Add COURSERA_API_KEY, COURSERA_ACCESS_TOKEN, or COURSERA_BEARER_TOKEN on the server.',
        },
        { status: 401 }
      );
    }

    const enrollments = await getEnrollmentReports(token);
    const leaderboardData = buildLeaderboard(enrollments);

    if (adminDb && leaderboardData.length > 0) {
      const leaderboardRef = adminDb.collection("artifacts").doc("leadwise-web").collection("public").doc("data").collection("leaderboard");
      const batch = adminDb.batch();

      leaderboardData.forEach((learner) => {
        batch.set(leaderboardRef.doc(learner.id), {
          userId: learner.id,
          name: learner.name,
          points: learner.points,
          coursesCompleted: learner.coursesCompleted,
          totalCourses: learner.totalCourses,
          lastUpdated: new Date(),
        }, { merge: true });
      });

      await batch.commit();
    }

    return NextResponse.json({
      success: true,
      data: leaderboardData.slice(0, 20),
      source: 'coursera',
      totalLearners: leaderboardData.length,
    });
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return NextResponse.json(
      {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Failed to load Coursera learners',
      },
      { status: 500 }
    );
  }
}

function buildLeaderboard(enrollments: CourseraEnrollmentReport[]) {
  const learners = new Map<string, {
    id: string;
    name: string;
    points: number;
    coursesCompleted: number;
    totalCourses: number;
  }>();

  for (const enrollment of enrollments) {
    if (isInactiveEnrollment(enrollment)) continue;

    const id = getLearnerId(enrollment);
    const current = learners.get(id) || {
      id,
      name: getLearnerName(enrollment),
      points: 0,
      coursesCompleted: 0,
      totalCourses: 0,
    };

    const progress = getEnrollmentProgress(enrollment);
    current.totalCourses += 1;
    current.points += Math.round(progress * 100);
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

function getLearnerId(enrollment: CourseraEnrollmentReport) {
  return String(
    enrollment.learnerId ||
    enrollment.userId ||
    enrollment.externalId ||
    enrollment.email ||
    enrollment.id
  );
}

function getLearnerName(enrollment: CourseraEnrollmentReport) {
  return String(
    enrollment.name ||
    enrollment.userName ||
    enrollment.fullName ||
    enrollment.email ||
    'Anonymous Learner'
  );
}

function getEnrollmentProgress(enrollment: CourseraEnrollmentReport) {
  const rawProgress =
    enrollment.progress ??
    enrollment.overallProgress ??
    enrollment.grade ??
    0;

  const progress = Number(rawProgress);
  if (!Number.isFinite(progress)) return 0;
  return progress > 1 ? progress : progress * 100;
}

function isCompletedEnrollment(enrollment: CourseraEnrollmentReport, progress: number) {
  const status = String(enrollment.status || enrollment.enrollmentStatus || '').toLowerCase();
  return Boolean(enrollment.completedAt) || status.includes('complete') || progress >= 100;
}

function isInactiveEnrollment(enrollment: CourseraEnrollmentReport) {
  const status = String(enrollment.status || enrollment.enrollmentStatus || '').toLowerCase();
  return Boolean(enrollment.deletedAt || enrollment.isDeleted) ||
    status.includes('deleted') ||
    status.includes('unenrolled') ||
    status.includes('dropped');
}
