'use client';
import { useEffect, useRef, useState } from 'react';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

type RecordRow = { id: string; firstName?: string; lastName?: string; email?: string; zipCode: string; householdIncome: string; employmentStatus: string; status: string; enrolledAt: string | null; courseTitle: string };
type Report = 'lmi' | 'private';
export default function AdminPage() {
  const [report, setReport] = useState<Report>('lmi');
  const [rows, setRows] = useState<RecordRow[]>([]);
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [month, setMonth] = useState('');
  const [income, setIncome] = useState('All');
  const generation = useRef(0);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      const request = ++generation.current;
      setRows([]); setError('');
      setSignedIn(Boolean(user && !user.isAnonymous)); setLoading(true);
      if (!user || user.isAnonymous) { setLoading(false); return; }
      try {
        const token = await user.getIdToken();
        const response = await fetch('/api/admin/intake-data?report=' + report, {
          cache: 'no-store', headers: { Authorization: 'Bearer ' + token },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || data.message || 'This account is not authorized for intake reports.');
        if (request === generation.current) setRows(data);
      } catch (err) {
        if (request === generation.current) setError(err instanceof Error ? err.message : 'Unable to load report.');
      } finally { if (request === generation.current) setLoading(false); }
    });
    return () => { generation.current++; unsubscribe(); };
  }, [report]);
  async function login() {
    setError('');
    try { await signInWithPopup(auth, new GoogleAuthProvider()); }
    catch { setError('Sign-in did not finish. Please retry with your authorized admin Google account.'); }
  }
  function switchReport(next: Report) {
    generation.current++; setRows([]); setLoading(true); setReport(next);
  }
  const filtered = rows.filter(row => (!month || row.enrolledAt?.startsWith(month)) && (income === 'All' || row.householdIncome === income));
  return <main className="min-h-screen bg-gray-50 text-slate-900 p-5 md:p-10 print:p-0 print:bg-white">
    <div className="max-w-7xl mx-auto">
      <nav className="flex flex-wrap gap-5 mb-8 print:hidden"><Link href="/learner" className="underline">Learner hub</Link><Link href="/forum/manage" className="underline">Community management</Link>{signedIn && <button onClick={() => signOut(auth)} className="underline">Sign out</button>}</nav>
      <h1 className="font-bold text-3xl">{report === 'lmi' ? 'Anonymous LMI report' : 'Private learner ledger'}</h1>
      <p className="my-3 text-slate-600">{report === 'lmi' ? 'Anonymous learner IDs, ZIP code, income bracket, employment, course, status and intake date. Names and emails are excluded by the server.' : 'Internal use: names, emails and learner intake details. Keep this ledger private.'}</p>
      <p className="text-sm mb-6">Period: {month || 'All available dates'} · Records: {filtered.length} · Income filter: {income}</p>
      {error && <p role="alert" className="border border-red-300 bg-red-50 p-4 mb-5 print:hidden">{error}</p>}
      {!signedIn ? <section className="p-6 bg-white border rounded-xl print:hidden"><h2 className="text-xl font-bold mb-3">Authorized administrator access</h2><button onClick={login} className="bg-purple-700 text-white rounded-lg px-5 py-3">Sign in with Google</button></section>
      : <><div className="flex flex-wrap gap-4 items-center my-6 print:hidden">
        <button disabled={report === 'lmi'} onClick={() => switchReport('lmi')} className="border rounded-lg px-4 py-2 disabled:bg-purple-100">Anonymous LMI report</button>
        <button disabled={report === 'private'} onClick={() => switchReport('private')} className="border rounded-lg px-4 py-2 disabled:bg-purple-100">Private learner ledger</button>
        <label>Month <input type="month" value={month} onChange={e => setMonth(e.target.value)} className="border rounded-lg p-2" /></label>
        <button onClick={() => setMonth('')} className="underline">All dates</button>
        <label>Income <select value={income} onChange={e => setIncome(e.target.value)} className="border rounded-lg p-2">{['All', '0-25k', '25-50k', '50-75k', '75k+'].map(value => <option key={value}>{value}</option>)}</select></label>
        <button disabled={loading || Boolean(error)} onClick={() => window.print()} className="bg-purple-700 text-white rounded-lg px-4 py-2 disabled:opacity-40">Print / Save PDF</button>
      </div>
      {loading ? <p role="status">Loading report…</p> : <div className="overflow-x-auto bg-white border rounded-xl print:overflow-visible"><table className="w-full text-left text-sm">
        <thead><tr className="bg-gray-100 border-b">{['Learner ID', ...(report === 'private' ? ['Name', 'Email'] : []), 'ZIP', 'Income', 'Employment', 'Course', 'Status', 'Intake date'].map(label => <th key={label} className="p-3">{label}</th>)}</tr></thead>
        <tbody>{filtered.map((row, index) => <tr key={row.id + index} className="border-b">
          <td className="p-3 font-mono">{row.id}</td>
          {report === 'private' && <><td className="p-3">{row.firstName} {row.lastName}</td><td className="p-3">{row.email}</td></>}
          <td className="p-3">{row.zipCode}</td><td className="p-3">{row.householdIncome}</td><td className="p-3">{row.employmentStatus}</td><td className="p-3">{row.courseTitle}</td><td className="p-3">{row.status}</td><td className="p-3">{row.enrolledAt ? row.enrolledAt.slice(0, 10) : 'Unknown'}</td>
        </tr>)}</tbody>
      </table>{filtered.length === 0 && <p className="p-5">No matching records.</p>}</div>}</>}
    </div>
  </main>;
}
