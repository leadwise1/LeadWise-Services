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
    let firstName = typeof event.firstName === 'string' ? event.firstName.trim() : '';
    let lastName = typeof event.lastName === 'string' ? event.lastName.trim() : '';
    // Older pending notifications predate names in the outbox. Read only the matching private intake.
    if ((!firstName || !lastName) && typeof event.email === 'string') {
      const email = event.email.trim().toLowerCase();
      const intake = (await adminDb.collection('users').doc(email.replace(/[^a-z0-9]/g, '_'))
        .collection('profile').doc('intake').get()).data();
      if (typeof intake?.email === 'string' && intake.email.trim().toLowerCase() === email) {
        if (!firstName && typeof intake.firstName === 'string') firstName = intake.firstName.trim();
        if (!lastName && typeof intake.lastName === 'string') lastName = intake.lastName.trim();
      }
    }
    const result = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: 'LeadWise Enrollments <' + (process.env.RESEND_FROM_EMAIL || 'enrollments@letsleadwise.org') + '>',
      to: [process.env.NOTIFY_EMAIL || 'mentor@letsleadwise.org'],
      subject: 'New LeadWise course enrollment request',
      text: `First name: ${firstName || 'Not provided — check the private intake'}\nLast name: ${lastName || 'Not provided — check the private intake'}\nVerified learner: ${event.email}\nCourse: ${event.courseTitle}\nStatus: Pending. Please provision access using the existing LeadWise process.\nLearner UID: ${uid}`,
    }, { idempotencyKey: 'learner-enrollment-' + eventId });
    if (!result.error) await ref.update({ status: 'Sent', sentAt: new Date().toISOString() });
  } catch {
    // Intake remains successful. Staff can retry Pending outbox records.
    console.warn('Enrollment notification pending; saved request retained.');
  }
}
