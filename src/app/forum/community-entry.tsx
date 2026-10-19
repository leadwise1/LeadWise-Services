'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { learnerRequest, signInLearner, unifiedOnboarding } from '@/lib/learner-auth';

export default function CommunityEntry() {
  const [member, setMember] = useState(false);
  const [canLink, setCanLink] = useState(false);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!unifiedOnboarding) { setBusy(false); return; }
    let generation = 0;
    const unsubscribe = onAuthStateChanged(auth, async user => {
      const request = ++generation;
      setMember(false); setCanLink(false); setError('');
      if (!user || user.isAnonymous) { setBusy(false); return; }
      setBusy(true);
      try {
        const account = await learnerRequest();
        if (request === generation) { setMember(account.member); setCanLink(account.canLinkExisting && !account.intakeComplete); }
      } catch (err) { if (request === generation) setError(err instanceof Error ? err.message : 'Unable to connect.'); }
      finally { if (request === generation) setBusy(false); }
    });
    return () => { generation++; unsubscribe(); };
  }, []);
  async function join() {
    setBusy(true); setError('');
    try {
      await signInLearner();
      await learnerRequest('POST', { joinCommunity: true });
      window.location.assign('/forum/courses');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to join. Please retry.');
      setBusy(false);
    }
  }
  async function connectIntake() {
    setBusy(true); setError('');
    try {
      await learnerRequest('POST', { claimExisting: true });
      window.location.assign('/forum/courses');
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to connect your enrollment.'); setBusy(false); }
  }
  if (!unifiedOnboarding) return null;
  return <section aria-label="Community signup and enrollment" className="rounded-2xl border border-purple-400/30 bg-purple-500/10 p-6 mb-10">
    <h2 className="text-2xl font-bold mb-3">{member ? 'You are part of the community.' : 'Join the community. Start your learning journey.'}</h2>
    <p className="text-neutral-300 mb-5">Sign in once to join, then select Free Courses in the left menu and complete the enrollment intake. Your name and email stay in the private admin ledger; the LMI report uses an anonymous ID.</p>
    <p className="text-sm text-neutral-400 mb-5">Your first name is used in the community. Joining does not submit an intake or enroll you in a course.</p>
    {error && <p role="alert" className="text-amber-300 mb-4">{error}</p>}
    {busy ? <p role="status">Connecting your community account…</p>
      : <div className="flex flex-wrap gap-4">
        {member ? <Link href="/forum/courses" className="bg-purple-600 rounded-xl px-5 py-3 font-bold">Explore free courses →</Link>
          : <button onClick={join} className="bg-purple-600 rounded-xl px-5 py-3 font-bold">Sign in and join community</button>}
        {canLink && <button onClick={connectIntake} className="border border-purple-300/40 rounded-xl px-5 py-3">Connect my existing enrollment</button>}
      </div>}
  </section>;
}
