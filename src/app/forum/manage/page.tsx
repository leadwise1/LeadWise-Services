'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import * as Dialog from '@radix-ui/react-dialog';
import { Plus, Pencil, Trash2, X, Save, LogIn, LogOut, Loader2, Search, RefreshCw } from 'lucide-react';

const categories = ['General Discussion', 'Announcements', 'Opportunities', 'Workshops', 'Networking'];
type Post = { id: string; title: string; content: string; author: string; category: string; timeAgo: string };
type Draft = { id?: string; title: string; content: string; category: string };
const emptyDraft = (): Draft => ({ title: '', content: '', category: 'Announcements' });

export default function ManageCommunityPage() {
  const [status, setStatus] = useState<'loading' | 'signed-out' | 'denied' | 'ready'>('loading');
  const [posts, setPosts] = useState<Post[]>([]);
  const [query, setQuery] = useState('');
  const [board, setBoard] = useState('All posts');
  const [draft, setDraft] = useState<Draft | null>(null);
  const [removing, setRemoving] = useState<Post | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [editorError, setEditorError] = useState('');
  const [notice, setNotice] = useState('');

  async function request(path: string, method = 'GET', body?: object) {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error('Please sign in again.');
    const response = await fetch(path, {
      method, cache: 'no-store',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'The request could not be completed.');
    return result;
  }

  async function loadPosts() {
    const result = await request('/api/forum/posts');
    setPosts(result.data);
  }

  useEffect(() => {
    let cancelled = false;
    let revision = 0;
    const unsubscribe = onAuthStateChanged(auth, async user => {
      const currentRevision = ++revision;
      setPosts([]);
      setError('');
      setDraft(null);
      setRemoving(null);
      if (!user) { setStatus('signed-out'); return; }
      setStatus('loading');
      try {
        const token = await user.getIdToken();
        const response = await fetch('/api/forum/admin', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
        if (cancelled || currentRevision !== revision) return;
        if (response.status === 401 || response.status === 403) { setStatus(user.isAnonymous ? 'signed-out' : 'denied'); return; }
        if (!response.ok) throw new Error('Community management could not load. Please try again.');
        const feed = await fetch('/api/forum/posts', { cache: 'no-store' });
        if (!feed.ok) throw new Error('Posts could not load. Please try again.');
        const result = await feed.json();
        if (!cancelled && currentRevision === revision) { setPosts(result.data); setStatus('ready'); }
      } catch (failure) {
        if (!cancelled && currentRevision === revision) { setError(failure instanceof Error ? failure.message : 'Sign-in could not be checked.'); setStatus('signed-out'); }
      }
    });
    return () => { cancelled = true; unsubscribe(); };
  }, []);

  async function login() {
    setBusy(true); setError('');
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (failure) {
      const code = (failure as { code?: string }).code;
      setError(code === 'auth/popup-closed-by-user' ? 'Sign-in was cancelled.' : 'Google sign-in could not finish. Please try again.');
    } finally { setBusy(false); }
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!draft || busy) return;
    setBusy(true); setEditorError('');
    try {
      const fields = { title: draft.title, content: draft.content, category: draft.category };
      await request(draft.id ? `/api/forum/posts/${encodeURIComponent(draft.id)}` : '/api/forum/posts', draft.id ? 'PATCH' : 'POST', draft.id ? fields : { ...fields, author: auth.currentUser?.displayName || 'LeadWise' });
      const edited = Boolean(draft.id);
      setDraft(null); setNotice(edited ? 'Changes saved.' : 'Post added.');
      await loadPosts().catch(() => setError('Your changes were saved, but posts could not be refreshed.'));
    } catch (failure) { setEditorError(failure instanceof Error ? failure.message : 'Changes could not be saved.'); }
    finally { setBusy(false); }
  }

  async function remove() {
    if (!removing || busy) return;
    setBusy(true); setEditorError('');
    try {
      await request(`/api/forum/posts/${encodeURIComponent(removing.id)}`, 'DELETE');
      setPosts(current => current.filter(post => post.id !== removing.id));
      setRemoving(null); setNotice('Post removed.');
      await loadPosts().catch(() => setError('The post was removed, but posts could not be refreshed.'));
    } catch (failure) { setEditorError(failure instanceof Error ? failure.message : 'The post could not be removed.'); }
    finally { setBusy(false); }
  }

  const visible = posts.filter(post => (board === 'All posts' || (board === 'Discussions' ? post.category === 'General Discussion' : post.category !== 'General Discussion')) && `${post.title} ${post.content} ${post.author}`.toLowerCase().includes(query.toLowerCase()));

  return <div className="community-management p-5 md:p-10 max-w-6xl mx-auto text-white">
    <header className="community-header flex flex-wrap justify-between items-center gap-4 pb-6 mb-6">
      <h1 className="text-2xl font-bold">Manage community</h1>
      {status === 'ready' && <div className="flex gap-2">
        <button className="community-secondary p-3 rounded-md" title="Refresh posts" aria-label="Refresh posts" disabled={busy} onClick={() => { setError(''); void loadPosts().catch(() => setError('Posts could not be refreshed.')); }}><RefreshCw size={18} /></button>
        <button className="community-primary flex items-center gap-2 px-4 py-2 rounded-md" onClick={() => { setDraft(emptyDraft()); setEditorError(''); setNotice(''); }}><Plus size={18} /> Add post</button>
        <button className="community-secondary p-3 rounded-md" title="Sign out" aria-label="Sign out" onClick={() => { void signOut(auth).catch(() => setError('Sign-out failed. Please try again.')); }}><LogOut size={18} /></button>
      </div>}
    </header>
    {error && <p role="alert" className="text-red-300 mb-4">{error}</p>}
    {notice && <p role="status" className="text-blue-300 mb-4">{notice}</p>}
    {status === 'loading' ? <div role="status" className="flex items-center gap-3 py-12"><Loader2 className="animate-spin" /> Checking access...</div> : status !== 'ready' ? <section className="max-w-md py-10">
      <h2 className="text-xl font-semibold mb-4">Administrator sign-in</h2>
      {status === 'denied' && <p className="text-neutral-300 mb-5">This Google account does not have community management access.</p>}
      <button className="community-primary flex items-center gap-2 px-5 py-3 rounded-md" disabled={busy} onClick={() => void login()}><LogIn size={18} /> {busy ? 'Signing in...' : status === 'denied' ? 'Use another Google account' : 'Sign in with Google'}</button>
    </section> : <>
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <select aria-label="Post type" value={board} onChange={event => setBoard(event.target.value)} className="bg-neutral-900 border border-neutral-700 rounded-md p-3">{['All posts', 'Bulletin notices', 'Discussions'].map(value => <option key={value}>{value}</option>)}</select>
        <label className="flex items-center gap-2 border border-neutral-700 rounded-md p-3 bg-neutral-900 flex-1 min-w-[180px]"><Search size={18} /><input aria-label="Search posts" className="bg-transparent outline-none min-w-0 w-full" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search posts..." /></label>
      </div>
      <div className="divide-y divide-neutral-800 border-y border-neutral-800">
        {visible.length === 0 && <p className="py-10 text-neutral-400">No posts found.</p>}
        {visible.map(post => <article key={post.id} className="py-5 flex gap-4 items-start justify-between">
          <div className="min-w-0"><p className="text-xs text-neutral-400 mb-2">{post.category} · {post.author} · {post.timeAgo}</p><h2 className="font-semibold text-base break-words">{post.title}</h2><p className="text-sm text-neutral-400 line-clamp-2 mt-2 break-words whitespace-pre-wrap">{post.content}</p></div>
          <div className="flex shrink-0 gap-1"><button className="p-3 rounded-md hover:bg-neutral-800" title="Edit post" aria-label={`Edit ${post.title}`} onClick={() => { setDraft({ id: post.id, title: post.title, content: post.content, category: post.category }); setEditorError(''); setNotice(''); }}><Pencil size={18} /></button><button className="p-3 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-red-300" title="Delete post" aria-label={`Delete ${post.title}`} onClick={() => { setRemoving(post); setEditorError(''); setNotice(''); }}><Trash2 size={18} /></button></div>
        </article>)}
      </div>
    </>}
    <Dialog.Root open={!!draft} onOpenChange={open => { if (!open && !busy) setDraft(null); }}>
      <Dialog.Portal><Dialog.Overlay className="fixed inset-0 bg-black/70 z-50" /><Dialog.Content className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%_-_32px)] max-w-xl max-h-[90dvh] overflow-y-auto rounded-lg bg-neutral-900 border border-neutral-700 p-6 text-white">
        <Dialog.Title className="text-xl font-semibold pr-8">{draft?.id ? 'Edit post' : 'Add post'}</Dialog.Title><Dialog.Description className="text-sm text-neutral-400 mt-2">{draft?.id ? 'Update the title, category, and details.' : 'Share a bulletin notice or start a discussion.'}</Dialog.Description>
        <Dialog.Close aria-label="Close editor" title="Close editor" disabled={busy} className="absolute right-4 top-4 p-2"><X size={18} /></Dialog.Close>
        {draft && <form onSubmit={save} className="mt-6 space-y-4">
          <label className="block text-sm">Category<select className="block w-full bg-neutral-950 border border-neutral-700 rounded-md p-3 mt-2" value={draft.category} onChange={event => setDraft({ ...draft, category: event.target.value })}>{categories.map(category => <option key={category}>{category}</option>)}</select></label>
          <label className="block text-sm">Title<input required maxLength={200} className="block w-full bg-neutral-950 border border-neutral-700 rounded-md p-3 mt-2" value={draft.title} onChange={event => setDraft({ ...draft, title: event.target.value })} /></label>
          <label className="block text-sm">Details<textarea required={draft.category !== 'General Discussion'} maxLength={10000} rows={7} className="block w-full bg-neutral-950 border border-neutral-700 rounded-md p-3 mt-2" value={draft.content} onChange={event => setDraft({ ...draft, content: event.target.value })} /></label>
          {editorError && <p role="alert" className="text-red-300">{editorError}</p>}
          <div className="flex justify-end gap-3"><Dialog.Close disabled={busy} className="community-secondary rounded-md px-4 py-2">Cancel</Dialog.Close><button disabled={busy || !draft.title.trim()} className="community-primary rounded-md px-4 py-2 flex items-center gap-2" type="submit"><Save size={18} /> {busy ? 'Saving...' : 'Save'}</button></div>
        </form>}
      </Dialog.Content></Dialog.Portal>
    </Dialog.Root>
    <Dialog.Root open={!!removing} onOpenChange={open => { if (!open && !busy) setRemoving(null); }}>
      <Dialog.Portal><Dialog.Overlay className="fixed inset-0 bg-black/70 z-50" /><Dialog.Content className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%_-_32px)] max-w-md rounded-lg bg-neutral-900 border border-neutral-700 p-6 text-white">
        <Dialog.Title className="text-xl font-semibold">Remove this post?</Dialog.Title><Dialog.Description className="text-neutral-300 mt-4 break-words">{removing?.title}</Dialog.Description>
        {editorError && <p role="alert" className="text-red-300 mt-4">{editorError}</p>}
        <div className="flex justify-end gap-3 mt-6"><Dialog.Close disabled={busy} className="community-secondary rounded-md px-4 py-2">Cancel</Dialog.Close><button disabled={busy} onClick={() => void remove()} className="border border-red-400/50 bg-red-950 rounded-md px-4 py-2 flex items-center gap-2"><Trash2 size={18} /> {busy ? 'Removing...' : 'Remove'}</button></div>
      </Dialog.Content></Dialog.Portal>
    </Dialog.Root>
  </div>;
}
