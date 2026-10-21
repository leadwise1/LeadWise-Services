import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { authorizeCommunityAdmin } from '@/lib/community-admin';

function isoDate(value: unknown): string | null {
  try {
    const date = typeof value === 'string' ? new Date(value) :
      value && typeof (value as { toDate?: unknown }).toDate === 'function' ? (value as { toDate: () => Date }).toDate() : null;
    return date && Number.isFinite(date.getTime()) ? date.toISOString() : null;
  } catch { return null; }
}
const text = (value: unknown) => typeof value === 'string' ? value : 'N/A';
export async function GET(req: NextRequest) {
  const denied = await authorizeCommunityAdmin(req);
  if (denied) return denied;
  if (!adminDb) return NextResponse.json({ message: 'Report service unavailable.' }, { status: 503 });
  const report = req.nextUrl.searchParams.get('report') || 'lmi';
  if (!['lmi', 'private'].includes(report)) return NextResponse.json({ message: 'Unknown report.' }, { status: 400 });
  try {
    // Query exactly one dataset. Names and emails never enter an LMI report response.
    const snapshot = report === 'lmi'
      ? await adminDb.collection('learner_intakes').get()
      : await adminDb.collectionGroup('profile').get();
    const rows = snapshot.docs.filter(doc => report === 'lmi' || doc.id === 'intake').map((doc, index) => {
      const data = doc.data();
      const storedId = data.studentId || doc.id;
      // Accept the two random ID formats emitted by LeadWise intake; never use an email-derived legacy ID.
      const anonymousId = typeof storedId === 'string' && /^user_(?:[A-Za-z0-9]{6}|[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/.test(storedId)
        ? storedId : 'Learner-' + String(index + 1).padStart(5, '0');
      const common = {
        id: report === 'lmi' ? anonymousId : text(data.participantId || doc.ref.parent.parent?.id),
        zipCode: text(data.zipCode),
        householdIncome: text(data.incomeBracket || data.householdIncome),
        employmentStatus: text(data.employmentStatus),
        status: text(data.status), enrolledAt: isoDate(data.enrolledAt),
        courseTitle: text(data.courseTitle || data.targetCourse),
      };
      return report === 'lmi' ? common : {
        ...common, firstName: text(data.firstName), lastName: text(data.lastName), email: text(data.email),
      };
    });
    rows.sort((a, b) => (b.enrolledAt || '').localeCompare(a.enrolledAt || ''));
    return NextResponse.json(rows, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch { return NextResponse.json({ message: 'Unable to load report. Please retry.' }, { status: 503 }); }
}
