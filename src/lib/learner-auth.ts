'use client';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, linkWithPopup, signInWithCredential, signInWithPopup, type AuthError } from 'firebase/auth';

export const unifiedOnboarding = process.env.NEXT_PUBLIC_UNIFIED_ONBOARDING === 'true';

export async function signInLearner() {
  // Callers enable sign-in after auth initialization. Keep the popup on the click's call stack.
  if (auth.currentUser && !auth.currentUser.isAnonymous) return auth.currentUser;
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  if (auth.currentUser?.isAnonymous) {
    try { return (await linkWithPopup(auth.currentUser, provider)).user; }
    catch (error) {
      if ((error as { code?: string }).code !== 'auth/credential-already-in-use') throw error;
      // Reuse the completed Google sign-in instead of opening a second, blocked popup.
      const credential = GoogleAuthProvider.credentialFromError(error as AuthError);
      if (!credential) throw error;
      return (await signInWithCredential(auth, credential)).user;
    }
  }
  return (await signInWithPopup(auth, provider)).user;
}

export function learnerSignInError(error: unknown) {
  switch ((error as { code?: string } | null)?.code) {
    case 'auth/popup-blocked':
      return 'Your browser blocked the Google sign-in window. Allow pop-ups for services.letsleadwise.org, then select Sign in with Google again. If you are using an in-app browser, open this page in Chrome, Safari, or Edge instead.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Google sign-in was not completed. Select Sign in with Google to try again.';
    case 'auth/unauthorized-domain':
      return 'Sign-in is not available on this address. Please use https://services.letsleadwise.org/forum.';
    case 'auth/network-request-failed':
      return 'Google sign-in could not connect. Check your internet connection and try again.';
    default:
      return error instanceof Error ? error.message : 'Unable to sign in. Please try again.';
  }
}

export async function learnerRequest(method = 'GET', body?: object, view?: 'intake') {
  await auth.authStateReady();
  const user = auth.currentUser;
  if (!user || user.isAnonymous) throw new Error('Please sign in to continue.');
  const token = await user.getIdToken();
  const response = await fetch(view === 'intake' ? '/api/learner?view=intake' : '/api/learner', {
    method, cache: 'no-store',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Unable to load your learner account. Please retry.');
  return data;
}
