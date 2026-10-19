'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { learnerRequest, signInLearner, unifiedOnboarding } from '@/lib/learner-auth';
import { COURSES } from '@/lib/course-catalog';

type Account = { intakeComplete: boolean; member: boolean; displayName: string; canLinkExisting: boolean; enrollments: { courseId: string; status: string }[] };
type Discussion = { id: string; title: string; category: string };
export default function LearnerHub() {
  const [signedIn, setSignedIn] = useState(false);
  const [account, setAccount] = useState<Account | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  useEffect(() => {
    if (!unifiedOnboarding) { setBusy(false); return; }
    let generation = 0;
    const unsubscribe = onAuthStateChanged(auth, async user => {
      const current = ++generation;
      setAccount(null); setError(''); setDiscussions([]);
      setSignedIn(Boolean(user && !user.isAnonymous));
      if (!user || user.isAnonymous) { setBusy(false); return; }
      setBusy(true);
      try {
        const data = await learnerRequest();
        if (current !== generation) return;
        setAccount(data);
        if (data.member) {
          const response = await fetch('/api/forum/posts', { cache: 'no-store' });
          if (response.ok) {
            const posts = await response.json();
            if (current === generation) setDiscussions((posts.data || []).slice(0, 3));
          }
        }
      } catch (err) { if (current === generation) setError(err instanceof Error ? err.message : 'Unable to connect. Please retry.'); }
      finally { if (current === generation) setBusy(false); }
    });
    return () => { generation++; unsubscribe(); };
  }, []);
  async function connect() {
    setBusy(true); setError('');
    try { await signInLearner(); }
    catch { setError('Sign-in did not finish. Retry, or use your existing account provider.'); setBusy(false); }
  }
  async function linkExisting() {
    setBusy(true); setError('');
    try { await learnerRequest('POST', { claimExisting: true }); setAccount(await learnerRequest()); }
    catch (err) { setError(err instanceof Error ? err.message : 'Unable to link your record.'); }
    finally { setBusy(false); }
  }
  return <main className="min-h-screen bg-[#0c0c0e] text-white px-5 py-8">
    <div className="max-w-6xl mx-auto">
      <nav aria-label="Learner navigation" className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <Link href="/" className="font-bold text-xl">LeadWise Foundation</Link>
        <div className="flex gap-5 text-sm"><Link href="/courses">Free courses</Link><Link href="/forum">Community</Link>{signedIn && <button onClick={async () => { await signOut(auth); }} className="text-purple-300">Sign out</button>}</div>
      </nav>
      <header className="py-12 max-w-3xl">
        <p className="text-purple-300 text-sm tracking-widest uppercase mb-3">Learn. Connect. Move forward.</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-5">{account?.member ? `Welcome, ${account.displayName}.` : 'Your learning journey starts here.'}</h1>
        <p className="text-neutral-300 text-lg">Free learning pathways, a community that belongs to you, and practical tools for your next step.</p>
      </header>
      {error && <p role="alert" className="border border-amber-400/40 bg-amber-400/10 p-4 rounded-xl mb-6">{error} <button className="underline" onClick={() => window.location.reload()}>Retry</button></p>}
      {!unifiedOnboarding ? <section className="p-6 rounded-2xl border border-purple-400/30"><h2 className="text-xl font-semibold">Learner hub preview</h2><p className="my-3 text-neutral-300">Unified onboarding is being prepared. Continue using your existing courses and community.</p><Link href="/courses" className="underline text-purple-300">Explore free courses</Link></section>
      : busy ? <p role="status" className="p-6">Connecting to your learner account…</p>
      : !signedIn ? <section className="rounded-2xl border border-purple-400/30 bg-purple-500/10 p-7 mb-8">
        <h2 className="text-2xl font-bold mb-3">One account. Your courses and community.</h2>
        <p className="text-neutral-300 mb-5">Continue with the Google account you use for learning. Complete the existing intake once, then come back here whenever you need.</p>
        <button onClick={connect} className="rounded-xl bg-purple-600 px-6 py-3 font-bold">Continue with Google</button>
        <p className="text-sm text-neutral-400 mt-4">Already enrolled with another email or account provider? Keep using your existing access and contact <a href="mailto:mentor@letsleadwise.org" className="underline">mentor@letsleadwise.org</a> for linking support.</p>
      </section>
      : !account ? <p>Your learner account could not be loaded. Please retry before submitting an intake.</p>
      : !account.member ? <section className="rounded-2xl border border-purple-400/30 p-7 mb-8">
        <h2 className="text-2xl font-bold mb-3">{account.canLinkExisting ? 'Your enrollment record is ready to connect.' : 'Choose your free course and complete intake.'}</h2>
        <p className="text-neutral-300 mb-5">Your intake details stay private. Your first name will be used as your community name. External course enrollment remains subject to LeadWise provisioning.</p>
        {account.canLinkExisting ? <button onClick={linkExisting} className="rounded-xl bg-purple-600 px-6 py-3 font-bold">Connect my enrollment and join community</button> : <Link href="/courses" className="inline-block rounded-xl bg-purple-600 px-6 py-3 font-bold">Choose a free course</Link>}
      </section>
      : <section className="grid md:grid-cols-3 gap-4 mb-10" aria-label="Your learner resources">
        {[['/forum/discussions', 'Your community', 'Ask questions, share progress, and meet fellow learners.'], ['/forum/events', 'Community events', 'Join weekly syncs and follow-along labs.'], ['/pathfinder', 'Your next step', 'Explore career pathways and build your direction.']].map(([href, title, description]) => <Link key={href} href={href} className="border border-purple-400/25 rounded-2xl p-6 hover:bg-purple-500/10"><h2 className="font-bold text-xl mb-2">{title} →</h2><p className="text-neutral-300">{description}</p></Link>)}
      </section>}
      <section aria-labelledby="courses-heading" className="my-10">
        <h2 id="courses-heading" className="text-2xl font-bold mb-5">Free learning pathways</h2>
        <div className="grid md:grid-cols-3 gap-4">{COURSES.map(course => {
          const enrollment = account?.enrollments.find(item => item.courseId === course.id);
          return <article key={course.id} className="border border-white/15 rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="font-bold text-xl">{course.title}</h3><p className="text-neutral-300 text-sm">{course.subtitle}</p>
            {enrollment && <p className="text-purple-300 text-sm">Enrollment: {enrollment.status}</p>}
            <Link href="/courses" className="mt-auto text-purple-300 underline">View course and enrollment</Link>
          </article>;
        })}</div>
        <p className="text-sm text-neutral-400 mt-4">Community membership is immediate after intake. A course request marked Pending still needs LeadWise to provision access on the course provider.</p>
      </section>
      {account?.member && <section aria-labelledby="community-heading" className="my-10 border-t border-white/10 pt-8">
        <div className="flex justify-between gap-4"><h2 id="community-heading" className="text-2xl font-bold">From the community</h2><Link href="/forum/discussions" className="text-purple-300">Open forum →</Link></div>
        {discussions.length ? <ul className="mt-4 divide-y divide-white/10">{discussions.map(post => <li key={post.id} className="py-4"><Link href={`/forum/post/${encodeURIComponent(post.id)}`} className="underline">{post.title}</Link><p className="text-sm text-neutral-400">{post.category}</p></li>)}</ul> : <p className="mt-4 text-neutral-300">Visit the forum to meet the community and join a conversation.</p>}
      </section>}
    </div>
  </main>;
}
