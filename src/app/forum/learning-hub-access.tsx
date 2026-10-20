'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { learnerRequest, unifiedOnboarding } from '@/lib/learner-auth';
import CommunityEntry from './community-entry';

export default function LearningHubAccess({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'guest' | 'member' | 'error'>(unifiedOnboarding ? 'loading' : 'member');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!unifiedOnboarding) return;
    let generation = 0;
    const unsubscribe = onAuthStateChanged(auth, async user => {
      const request = ++generation;
      if (!user || user.isAnonymous) { setStatus('guest'); return; }
      setStatus('loading');
      try {
        const account = await learnerRequest();
        if (request === generation) setStatus(account.member ? 'member' : 'guest');
      } catch { if (request === generation) setStatus('error'); }
    });
    return () => { generation++; unsubscribe(); };
  }, [attempt]);
  if (status === 'member') return <>{children}</>;
  return <main className="w-full min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_#1a102b_0%,_#0c0c0e_100%)]">
    <div className="w-full max-w-2xl">
      <a href="/" className="text-purple-300 text-sm">← Back to LeadWise Services</a>
      <p className="text-purple-300 text-sm font-bold tracking-widest uppercase mt-10 mb-4">Learn. Connect. Grow.</p>
      <h1 className="text-4xl md:text-5xl font-bold mb-5">LW Learning Hub</h1>
      <p className="text-neutral-300 text-lg mb-8">Your home for free courses, community conversations, and career support. Create your account or sign in to enter.</p>
      {status === 'loading' ? <p role="status">Checking your account…</p>
        : status === 'error' ? <div role="alert"><p>We couldn’t verify your account. Please try again.</p><button onClick={() => setAttempt(value => value + 1)} className="mt-4 bg-purple-600 rounded-xl px-5 py-3">Retry</button></div>
        : <CommunityEntry />}
      <p className="text-sm text-neutral-400 mt-5">Join the hub → Choose a free course → Request enrollment → Receive your access link by email.</p>
    </div>
  </main>;
}
