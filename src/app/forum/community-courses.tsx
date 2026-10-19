'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { learnerRequest, unifiedOnboarding } from '@/lib/learner-auth';
import { CoursesPage } from '@/components/course-catalog-page';
import CommunityEntry from './community-entry';

export default function CommunityCourses({ intake = false }: { intake?: boolean }) {
  const [member, setMember] = useState(false);
  const [ready, setReady] = useState(!unifiedOnboarding);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!unifiedOnboarding) return;
    let generation = 0;
    const unsubscribe = onAuthStateChanged(auth, async user => {
      const request = ++generation;
      setMember(false); setError('');
      if (!user || user.isAnonymous) { setReady(true); return; }
      setReady(false);
      try {
        const account = await learnerRequest();
        if (request === generation) setMember(account.member);
      } catch { if (request === generation) setError('Unable to confirm community membership. Please retry before enrolling.'); }
      finally { if (request === generation) setReady(true); }
    });
    return () => { generation++; unsubscribe(); };
  }, []);
  return <div>
    <header className="p-6 md:p-10 border-b border-white/10">
      <h1 className="font-bold text-3xl mb-3">{intake ? 'Enrollment intake' : 'Free courses'}</h1>
      <p className="text-neutral-300">{intake ? 'Choose a course below, then complete the existing intake form to request enrollment.' : 'Your free course pathways, right here in the community. Choose a course to enroll through intake.'}</p>
    </header>
    {!ready ? <p role="status" className="p-6">Checking your community account…</p>
      : unifiedOnboarding && !member ? <div className="p-6 md:p-10">{error && <p role="alert" className="text-amber-300 mb-4">{error}</p>}<CommunityEntry /></div>
      : <CoursesPage embedded />}
  </div>;
}
