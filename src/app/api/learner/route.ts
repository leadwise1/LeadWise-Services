import { COURSES } from '@/lib/course-catalog';
import { notifyEnrollment } from '@/lib/learner-notifications';
import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth, admin } from '@/lib/firebase-admin';
import { createHash, randomUUID } from 'node:crypto';
import { z } from 'zod';

export const runtime = 'nodejs';
const intakeSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(254),
  zipCode: z.string().trim().min(1).max(20),
  householdIncome: z.enum(['0-25k', '25-50k', '50-75k', '75k+']),
  employmentStatus: z.string().trim().min(1).max(80),
  courseId: z.enum(['google-cybersecurity-cert', 'data-analytics', 'google-ai-cert']),
  courseTitle: z.string().trim().min(1).max(160),
  consent: z.literal(true),
});
const reply = (data: object, status = 200) => NextResponse.json(data, { status, headers: { 'Cache-Control': 'private, no-store' } });
async function identify(req: NextRequest) {
  if (process.env.UNIFIED_ONBOARDING_ENABLED !== 'true') return { error: reply({ error: 'Learner onboarding is not enabled.' }, 404) };
  if (!adminDb || !adminAuth) return { error: reply({ error: 'Learner service unavailable. Please try again later.' }, 503) };
  const token = req.headers.get('authorization')?.match(/^Bearer (.+)$/)?.[1];
  if (!token) return { error: reply({ error: 'Please sign in.' }, 401) };
  try {
    const user = await adminAuth.verifyIdToken(token, true);
    if (!user.email || user.email_verified !== true || user.firebase?.sign_in_provider === 'anonymous')
      return { error: reply({ error: 'Please sign in with a verified email account.' }, 403) };
    return { user, email: user.email.trim().toLowerCase() };
  } catch { return { error: reply({ error: 'Please sign in again.' }, 401) }; }
}
function legacyId(email: string) { return email.replace(/[^a-z0-9]/g, '_'); }
function sameEmail(value: unknown, email: string) { return typeof value === 'string' && value.trim().toLowerCase() === email; }

export async function GET(req: NextRequest) {
  const identity = await identify(req);
  if (identity.error) return identity.error;
  const { user, email } = identity;
  try {
    const [account, legacy, requests] = await Promise.all([
      adminDb!.collection('learner_accounts').doc(user!.uid).get(),
      adminDb!.collection('users').doc(legacyId(email!)).collection('profile').doc('intake').get(),
      adminDb!.collection('learner_accounts').doc(user!.uid).collection('enrollments').get(),
    ]);
    const profile = account.data();
    const existing = legacy.data();
    return reply({
      intakeComplete: profile?.intakeComplete === true,
      member: profile?.communityMember === true,
      displayName: profile?.displayName || '',
      canLinkExisting: legacy.exists && sameEmail(existing?.email, email!) && existing?.consent === true,
      enrollments: requests.docs.map(doc => ({ courseId: doc.id, status: doc.data().status })),
    });
  } catch { return reply({ error: 'Unable to load your learner account. Please retry.' }, 503); }
}

export async function POST(req: NextRequest) {
  const identity = await identify(req);
  if (identity.error) return identity.error;
  const { user, email } = identity;
  let body;
  try { body = await req.json(); } catch { return reply({ error: 'Invalid request.' }, 400); }
  const claim = body?.claimExisting === true;
  const parsed = intakeSchema.safeParse(body);
  if (!claim && !parsed.success) return reply({ error: 'Please complete all intake fields and consent.' }, 400);
  if (!claim && !sameEmail(parsed.data!.email, email!)) return reply({ error: 'Use the email address of your signed-in account.' }, 403);
  const db = adminDb!;
  const accountRef = db.collection('learner_accounts').doc(user!.uid);
  const legacyRef = db.collection('users').doc(legacyId(email!)).collection('profile').doc('intake');
  try {
    const result = await db.runTransaction(async tx => {
      const [account, legacy] = await Promise.all([tx.get(accountRef), tx.get(legacyRef)]);
      const old = legacy.data();
      if (legacy.exists && !sameEmail(old?.email, email!)) return { conflict: true };
      if (account.exists && account.data()?.email !== email) return { conflict: true };
      if (claim && (!legacy.exists || old?.consent !== true)) return { missing: true };
      const intake = claim ? old! : parsed.data!;
      const courseId = intake.courseId;
      const courseTitle = (claim ? old?.courseTitle || old?.targetCourse : COURSES.find(course => course.id === parsed.data?.courseId)?.title) || 'Existing enrollment';
      if (typeof courseId !== 'string' || !/^[a-z0-9-]{1,100}$/.test(courseId)) return { missing: true };
      const enrollmentRef = accountRef.collection('enrollments').doc(courseId);
      const enrollment = await tx.get(enrollmentRef);
      const now = new Date().toISOString();
      if (!account.exists) tx.set(accountRef, {
        uid: user!.uid, email, legacyParticipantId: legacyRef.parent.parent!.id,
        displayName: intake.firstName, intakeComplete: true, communityMember: true,
        joinedAt: now, consentVersion: 'existing-intake-v1',
      });
      if (!enrollment.exists) {
        const status = legacy.exists && old?.courseId === courseId ? old.status || 'Pending' : 'Pending';
        tx.set(enrollmentRef, { courseId, courseTitle, status, requestedAt: now });
        if (!claim) {
          // Transactional outbox; no email or external-provider action runs in a transaction.
          const eventId = createHash('sha256').update(user!.uid + ':' + courseId).digest('hex');
          tx.set(db.collection('learner_enrollment_outbox').doc(eventId), {
            uid: user!.uid, courseId, courseTitle, email, status: 'Pending', createdAt: now,
          });
        }
      }
      // Preserve every existing intake, status, timestamp and grant-report row.
      if (!legacy.exists) {
        tx.set(legacyRef, {
          ...parsed.data!, courseTitle, participantId: legacyRef.parent.parent!.id,
          targetCourse: courseTitle, status: 'Pending', enrolledAt: now,
          lmiVerified: ['0-25k', '25-50k'].includes(intake.householdIncome),
        });
        const studentId = 'user_' + randomUUID();
        tx.set(db.collection('learner_intakes').doc(studentId), {
          studentId, zipCode: intake.zipCode, incomeBracket: intake.householdIncome,
          employmentStatus: intake.employmentStatus, courseId, courseTitle,
          status: 'Pending', enrolledAt: admin.firestore.FieldValue.serverTimestamp(),
          lmiVerified: ['0-25k', '25-50k'].includes(intake.householdIncome),
        });
      }
      return { success: true, next: '/learner', alreadySubmitted: enrollment.exists };
    });
    if ('conflict' in result) return reply({ error: 'This record needs a staff review before linking. Contact mentor@letsleadwise.org.' }, 409);
    if ('missing' in result) return reply({ error: 'Please complete the course intake to join.' }, 409);
    if (!claim && parsed.success) await notifyEnrollment(user!.uid, parsed.data.courseId);
    return reply(result);
  } catch { return reply({ error: 'Your request could not be saved. Please retry.' }, 503); }
}
