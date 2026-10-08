import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function authorizeCommunityAdmin(request: NextRequest) {
  if (!adminAuth) return NextResponse.json({ error: 'Community administration unavailable.' }, { status: 503 });
  const token = request.headers.get('authorization')?.match(/^Bearer (.+)$/)?.[1];
  if (!token) return NextResponse.json({ error: 'Please sign in to manage the community.' }, { status: 401 });
  try {
    const user = await adminAuth.verifyIdToken(token, true);
    const email = (process.env.COMMUNITY_ADMIN_EMAIL || 'lakhani@letsleadwise.org').trim().toLowerCase();
    const emailMatches = email && user.email_verified === true && user.email?.toLowerCase() === email && user.firebase?.sign_in_provider === 'google.com';
    if (emailMatches) return null;
    return NextResponse.json({ error: 'This account cannot manage the community.' }, { status: 403 });
  } catch {
    return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 });
  }
}
