import { adminDb } from '@/lib/firebase-admin';
import { createHash } from 'node:crypto';
import { Resend } from 'resend';

// The durable outbox survives notification failures. Do not enable delivery in test previews.
export async function notifyEnrollment(uid: string, courseId: string) {
  if (!adminDb || process.env.LEARNER_NOTIFICATIONS_ENABLED !== 'true' || !process.env.RESEND_API_KEY) return;
  const eventId = createHash('sha256').update(uid + ':' + courseId).digest('hex');
  const ref = adminDb.collection('learner_enrollment_outbox').doc(eventId);
  try {
    const event = (await ref.get()).data();
    if (!event || event.status !== 'Pending') return;
    const result = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: 'LeadWise Enrollments <' + (process.env.RESEND_FROM_EMAIL || 'enrollments@letsleadwise.org') + '>',
      to: [process.env.NOTIFY_EMAIL || 'mentor@letsleadwise.org'],
      subject: 'New LeadWise course enrollment request',
      text: `Verified learner: ${event.email}\nCourse: ${event.courseTitle}\nStatus: Pending. Please provision access using the existing LeadWise process.\nLearner UID: ${uid}`,
    }, { idempotencyKey: 'learner-enrollment-' + eventId });
    if (!result.error) await ref.update({ status: 'Sent', sentAt: new Date().toISOString() });
  } catch {
    // Intake remains successful. Staff can retry Pending outbox records.
    console.warn('Enrollment notification pending; saved request retained.');
  }
}
