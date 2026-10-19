'use client';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, linkWithPopup, signInWithPopup } from 'firebase/auth';

export const unifiedOnboarding = process.env.NEXT_PUBLIC_UNIFIED_ONBOARDING === 'true';

export async function signInLearner() {
  await auth.authStateReady();
  if (auth.currentUser && !auth.currentUser.isAnonymous) return auth.currentUser;
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  if (auth.currentUser?.isAnonymous) {
    try { return (await linkWithPopup(auth.currentUser, provider)).user; }
    catch (error) {
      if ((error as { code?: string }).code !== 'auth/credential-already-in-use') throw error;
      // Existing accounts keep their UID. Guest contributions are never reassigned or deleted.
    }
  }
  return (await signInWithPopup(auth, provider)).user;
}

export async function learnerRequest(method = 'GET', body?: object) {
  await auth.authStateReady();
  const user = auth.currentUser;
  if (!user || user.isAnonymous) throw new Error('Please sign in to continue.');
  const token = await user.getIdToken();
  const response = await fetch('/api/learner', {
    method, cache: 'no-store',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Unable to load your learner account. Please retry.');
  return data;
}
