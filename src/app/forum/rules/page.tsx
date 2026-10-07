"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Sparkles,
  MessageSquare,
  ArrowBigUp,
  Plus,
  Headphones,
  Target,
  Volume2,
  VolumeX,
  X,
  ShieldCheck,
  Terminal,
  Flame,
  Send,
  Loader2,
  Filter,
  Users,
  ScrollText,
  CheckCircle2,
  Heart,
  Zap,
  ArrowRight
} from 'lucide-react';

type PostCategory = 'Networking' | 'General Discussion';
type TechTag = 'Cloud/DevOps' | 'Cybersecurity' | 'FullStack' | 'Data & AI';

type ForumComment = {
  author: string;
  authorId: string;
  content: string;
  timestamp?: string;
};

type ForumPost = {
  id: string;
  title: string;
  content: string;
  category: PostCategory;
  techTag?: TechTag | string;
  author: string;
  authorId: string;
  upvotes: number;
  replies: number;
  timeAgo: string;
  comments: ForumComment[];
};

type ToastState = {
  title: string;
  message: string;
  icon: string;
};

const playHoloTone = (freq = 520, type: OscillatorType = 'sine', duration = 0.1, enabled = true) => {
  if (!enabled || typeof window === 'undefined') return;

  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Graceful fallback if audio is restricted by autoplay policies
  }
};

const CornerBrackets = () => (
  <>
    <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-purple-300/40 rounded-tl-sm pointer-events-none group-hover:border-fuchsia-300 group-hover:drop-shadow-[0_0_8px_rgba(232,121,249,0.7)]" />
    <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 border-purple-300/40 rounded-tr-sm pointer-events-none group-hover:border-fuchsia-300 group-hover:drop-shadow-[0_0_8px_rgba(232,121,249,0.7)]" />
    <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b-2 border-l-2 border-purple-300/40 rounded-bl-sm pointer-events-none group-hover:border-fuchsia-300 group-hover:drop-shadow-[0_0_8px_rgba(232,121,249,0.7)]" />
    <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 border-purple-300/40 rounded-br-sm pointer-events-none group-hover:border-fuchsia-300 group-hover:drop-shadow-[0_0_8px_rgba(232,121,249,0.7)]" />
  </>
);

const INITIAL_POSTS: ForumPost[] = [
  {
    id: 'post-1',
    title: 'Free Linux Foundation & Kubernetes Workshop this Saturday!',
    content: 'Found an open registration voucher for container security and CKAD prep. Let us group up in the Live Study Room 2 hours prior to work on hands-on cluster drills together.',
    category: 'Networking',
    techTag: 'Cloud/DevOps',
    author: 'Sam',
    authorId: 'verified-learner',
    upvotes: 28,
    replies: 3,
    timeAgo: '15m ago',
    comments: [
      { author: 'Jordan', authorId: 'verified-learner', content: 'Huge find! RSVPing right now.' },
      { author: 'Elena', authorId: 'verified-learner', content: 'Count me in for the Live Study Room prep session.' },
      { author: 'Marcus', authorId: 'verified-learner', content: 'Does this cover ingress controllers? Looking forward!' }
    ]
  },
  {
    id: 'post-2',
    title: 'A small win: Deployed my first CI/CD pipeline on Docker',
    content: 'I finished my first lesson and automated testing passed! If anyone is stuck on asynchronous Node streams or Auth tokens, happy to hop into the voice room and share notes.',
    category: 'General Discussion',
    techTag: 'FullStack',
    author: 'Taylor',
    authorId: 'verified-learner',
    upvotes: 35,
    replies: 2,
    timeAgo: '1h ago',
    comments: [
      { author: 'Sam', authorId: 'verified-learner', content: 'Awesome job! Automating testing early prevents so many headaches.' },
      { author: 'Priya', authorId: 'verified-learner', content: 'Congratulations Taylor! Would love to peek at your YAML workflow.' }
    ]
  },
  {
    id: 'post-3',
    title: 'Mock Technical Interview Pair Wanted (Networking & SOC Basics)',
    content: 'Preparing for junior SOC analyst / IT support interviews. Looking for a study partner to run 45-minute timed sessions on subnetting, Wireshark, and HTTP protocols on Tuesday evenings.',
    category: 'Networking',
    techTag: 'Cybersecurity',
    author: 'Alex',
    authorId: 'verified-learner',
    upvotes: 19,
    replies: 1,
    timeAgo: '3h ago',
    comments: [
      { author: 'Priya', authorId: 'verified-learner', content: 'I am on the same track! Sent you a ping in the study room.' }
    ]
  }
];

export default function LeadWiseForumPage({ sessionToken = 'valid-token' }: { sessionToken?: string }) {
  const [posts, setPosts] = useState<ForumPost[]>(INITIAL_POSTS);
  const [filterCategory, setFilterCategory] = useState<PostCategory | 'all'>('all');
  const [sortByUpvotes, setSortByUpvotes] = useState(true);
  const [activePost, setActivePost] = useState<ForumPost | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [liveUsersCount, setLiveUsersCount] = useState(38);
  const [formAuthor, setFormAuthor] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState<PostCategory>('Networking');
  const [formTechTag, setFormTechTag] = useState<TechTag>('Cloud/DevOps');
  const [replyAuthor, setReplyAuthor] = useState('');
  const [replyContent, setReplyContent] = useState('');

  const showToast = useCallback((title: string, message: string, icon = '✨') => {
    setToast({ title, message, icon });
    const timer = window.setTimeout(() => {
      setToast(null);
    }, 3800);
    return () => window.clearTimeout(timer);
  }, []);

  const fetchPostsFromApi = useCallback(async () => {
    try {
      const res = await fetch('/api/forum/posts', {
        headers: sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}
      });
      if (res.ok) {
        const json = await res.json();
        if (json && Array.isArray(json.data) && json.data.length > 0) {
          setPosts(json.data as ForumPost[]);
        }
      }
    } catch {
      // Fallback silently to client state (offline/mock environment)
    }
  }, [sessionToken]);

  useEffect(() => {
    fetchPostsFromApi();
  }, [fetchPostsFromApi]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setLiveUsersCount(prev => Math.max(28, prev + (Math.floor(Math.random() * 3) - 1)));
    }, 12000);
    return () => window.clearInterval(interval);
  }, []);

  const filteredPosts = useMemo(() => {
    let list = [...posts];

    if (filterCategory !== 'all') {
      list = list.filter(p => p.category === filterCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        (p.techTag && p.techTag.toLowerCase().includes(q))
      );
    }

    if (sortByUpvotes) {
      list.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
    } else {
      list.sort((a, b) => b.id.localeCompare(a.id));
    }

    return list;
  }, [posts, filterCategory, searchQuery, sortByUpvotes]);

  const handleCreatePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const title = formTitle.trim();
    const content = formContent.trim();
    const author = formAuthor.trim();
    const category = formCategory;
    const techTag = formTechTag;

    if (!title || !content || !author) {
      showToast('Missing Fields', 'Please complete title, author, and description.', '⚠️');
      return;
    }

    if (category !== 'General Discussion' && category !== 'Networking') {
      showToast('Validation Error', 'Category must be General Discussion or Networking.', '⚠️');
      return;
    }

    setIsSubmitting(true);
    playHoloTone(620, 'triangle', 0.1, sfxEnabled);

    const payload = { title, content, category, author, techTag };

    try {
      const res = await fetch('/api/forum/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {})
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const responseData = await res.json();
        const createdPost: ForumPost = {
          id: responseData?.data?.id || `post-${Date.now()}`,
          title,
          content,
          category,
          techTag,
          author,
          authorId: 'verified-learner',
          upvotes: 0,
          replies: 0,
          timeAgo: 'Just now',
          comments: []
        };
        setPosts(prev => [createdPost, ...prev]);
      } else {
        const fallbackPost: ForumPost = {
          id: `post-${Date.now()}`,
          title,
          content,
          category,
          techTag,
          author,
          authorId: 'verified-learner',
          upvotes: 0,
          replies: 0,
          timeAgo: 'Just now',
          comments: []
        };
        setPosts(prev => [fallbackPost, ...prev]);
      }

      showToast('Opportunity Shared!', `Broadcast to ${category}`, '✨');
      setIsCreateOpen(false);
      setFormTitle('');
      setFormContent('');
      setFormAuthor('');
    } catch {
      const fallbackPost: ForumPost = {
        id: `post-${Date.now()}`,
        title,
        content,
        category,
        techTag,
        author,
        authorId: 'verified-learner',
        upvotes: 0,
        replies: 0,
        timeAgo: 'Just now',
        comments: []
      };
      setPosts(prev => [fallbackPost, ...prev]);
      setIsCreateOpen(false);
      showToast('Posted to Collective', 'Note added to board.', '✨');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpvote = async (postId: string, e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.stopPropagation();
    playHoloTone(700, 'sine', 0.08, sfxEnabled);

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const nextUpvotes = (p.upvotes || 0) + 1;
        if (activePost && activePost.id === postId) {
          setActivePost({ ...activePost, upvotes: nextUpvotes });
        }
        return { ...p, upvotes: nextUpvotes };
      }
      return p;
    }));

    showToast('Signal Boosted!', 'Sent peer endorsement.', '⚡');

    try {
      await fetch(`/api/forum/posts/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {})
        },
        body: JSON.stringify({ action: 'upvote' })
      });
    } catch {
      // Retain optimistic UI state
    }
  };

  const handleSendReply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!activePost) return;

    const author = replyAuthor.trim();
    const content = replyContent.trim();
    if (!author || !content) return;

    playHoloTone(650, 'sine', 0.09, sfxEnabled);

    const newComment: ForumComment = {
      author,
      authorId: 'verified-learner',
      content,
      timestamp: 'Just now'
    };

    const updatedComments = [...(activePost.comments || []), newComment];
    const updatedPost: ForumPost = {
      ...activePost,
      comments: updatedComments,
      replies: updatedComments.length
    };

    setActivePost(updatedPost);
    setPosts(prev => prev.map(p => p.id === activePost.id ? updatedPost : p));
    setReplyContent('');

    try {
      await fetch(`/api/forum/posts/${activePost.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {})
        },
        body: JSON.stringify({ author, content })
      });
    } catch {
      // Local optimistic update stays active
    }

    showToast('Comment Appended', `Reply added by ${author}`, '💬');
  };

  const openDetail = async (post: ForumPost) => {
    playHoloTone(550, 'sine', 0.06, sfxEnabled);
    setActivePost(post);
    setIsDetailOpen(true);

    try {
      const res = await fetch(`/api/forum/posts/${post.id}`, {
        headers: sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}
      });
      if (res.ok) {
        const json = await res.json();
        if (json && json.comments) {
          setActivePost(prev => prev ? {
            ...prev,
            comments: json.comments,
            replies: json.comments.length
          } : prev);
        }
      }
    } catch {
      // Fallback to currently seeded comments
    }
  };

  const getTechTagBadge = (tag?: string) => {
    switch (tag) {
      case 'Cybersecurity':
        return 'bg-pink-500/15 text-pink-300 border-pink-400/40 shadow-[0_0_12px_rgba(244,114,182,0.18)]';
      case 'FullStack':
        return 'bg-blue-500/15 text-blue-300 border-blue-400/40 shadow-[0_0_12px_rgba(96,165,250,0.18)]';
      case 'Data & AI':
        return 'bg-amber-500/15 text-amber-300 border-amber-400/40 shadow-[0_0_12px_rgba(251,191,36,0.18)]';
      case 'Cloud/DevOps':
      default:
        return 'bg-purple-500/15 text-purple-300 border-purple-400/40 shadow-[0_0_12px_rgba(216,180,254,0.18)]';
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans relative selection:bg-fuchsia-500 selection:text-white flex flex-col">
      <div
        className="fixed inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 50% -10%, rgba(216, 180, 254, 0.18), transparent 70%),
            radial-gradient(ellipse 60% 40% at 90% 100%, rgba(192, 132, 252, 0.12), transparent 60%),
            linear-gradient(rgba(216, 180, 254, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(216, 180, 254, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 36px 36px, 36px 36px'
        }}
      />

      <header className="sticky top-0 z-30 border-b border-purple-500/20 bg-[#07090e]/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10 rounded-xl bg-purple-950/60 backdrop-blur-md border border-purple-400/50 flex items-center justify-center text-purple-300 shadow-[0_0_15px_rgba(216,180,254,0.25)]">
              <span className="absolute inset-0 rounded-xl bg-purple-400/20 animate-pulse pointer-events-none" />
              <Terminal className="w-5 h-5 text-fuchsia-300 relative z-10" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white drop-shadow-[0_0_10px_rgba(216,180,254,0.3)]">
                  LeadWise <span className="bg-gradient-to-r from-purple-200 via-fuchsia-200 to-pink-300 bg-clip-text text-transparent font-black">Community Forum</span>
                </h1>
                <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-950/40 text-purple-300 border border-purple-400/30">
                  ⬡ HoloGrid
                </span>
              </div>
              <p className="text-xs text-purple-200/60 font-mono">Where learners, mentors, and career changers connect</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4 text-xs font-medium text-slate-300 border border-purple-400/25 px-5 py-1.5 rounded-2xl bg-purple-950/25 backdrop-blur-md shadow-inner">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
              <span>Live Labs: <strong className="text-emerald-300 font-semibold">4 Active</strong></span>
            </div>
            <span className="text-purple-400/30">|</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-fuchsia-400 shadow-[0_0_8px_#e879f9] animate-pulse" />
              <span>Study Room: <strong className="text-fuchsia-300 font-semibold">{liveUsersCount} Online</strong></span>
            </div>
            <span className="text-purple-400/30">|</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
              <span>Mentors: <strong className="text-amber-300 font-semibold">2 Open Slots</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                const nextState = !sfxEnabled;
                setSfxEnabled(nextState);
                playHoloTone(500, 'sine', 0.05, nextState);
                showToast(nextState ? 'Audio SFX On' : 'Audio Muted', 'Holographic tone feedback updated.');
              }}
              className="p-2 rounded-xl bg-purple-950/40 border border-purple-400/30 hover:border-purple-300 text-purple-300 transition text-xs flex items-center gap-1.5"
              title="Toggle Sound Effects"
            >
              {sfxEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              <span className="font-mono text-[11px] hidden sm:inline">{sfxEnabled ? 'SFX: ON' : 'SFX: OFF'}</span>
            </button>

            <button
              onClick={() => {
                playHoloTone(600, 'sine', 0.06, sfxEnabled);
                setIsCreateOpen(true);
              }}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 hover:from-purple-300 hover:to-pink-300 text-slate-950 font-extrabold px-4 py-2 rounded-xl shadow-[0_0_18px_rgba(216,180,254,0.25)] transition"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Share Opportunity
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 relative z-10">
        <section className="relative rounded-3xl p-6 sm:p-9 text-center overflow-hidden border border-purple-400/25 bg-gradient-to-br from-[#191c2a]/70 to-[#0e101a]/85 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.12)]">
          <CornerBrackets />
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[34rem] h-56 bg-gradient-to-b from-purple-500/25 via-fuchsia-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-300 text-[10px] font-bold uppercase tracking-[0.2em] mb-5">
              <ShieldCheck className="w-3.5 h-3.5" /> Community Charter
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              Welcome to the LeadWise Tech Collective
            </h2>
            <p className="text-base sm:text-lg font-bold bg-gradient-to-r from-white via-fuchsia-200 to-purple-300 bg-clip-text text-transparent mb-3">
              A shared space for learners, alumni, instructors, and career changers exploring technology together.
            </p>
            <p className="text-xs sm:text-sm text-slate-300/80 leading-relaxed font-light max-w-2xl mx-auto">
              You don&apos;t have to learn alone. This is a support system where we ask questions, share what we&apos;re discovering, and help each other move forward.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  playHoloTone(580, 'sine', 0.1, sfxEnabled);
                  showToast('Live Study Room', 'Connecting to voice room channel...');
                }}
                className="text-xs font-semibold px-4 py-2.5 rounded-xl bg-purple-950/50 hover:bg-purple-900/60 text-purple-200 border border-purple-400/35 hover:border-purple-300 transition flex items-center gap-2 shadow-[0_0_15px_rgba(216,180,254,0.15)] hover:shadow-[0_0_20px_rgba(216,180,254,0.3)] backdrop-blur-md"
              >
                <Headphones className="w-4 h-4 text-fuchsia-400" />
                Enter Live Study Voice Room
              </button>

              <button
                onClick={() => {
                  playHoloTone(640, 'sine', 0.1, sfxEnabled);
                  showToast('1-on-1 Mentorship', 'Opening mentor booking schedules (2 slots available).');
                }}
                className="text-xs font-semibold px-4 py-2.5 rounded-xl bg-fuchsia-950/40 hover:bg-fuchsia-900/50 text-fuchsia-200 border border-fuchsia-400/35 hover:border-fuchsia-300 transition flex items-center gap-2 shadow-[0_0_15px_rgba(232,121,249,0.15)] hover:shadow-[0_0_20px_rgba(232,121,249,0.3)] backdrop-blur-md"
              >
                <Target className="w-4 h-4 text-purple-300" />
                Book 1-on-1 Mentorship
              </button>
            </div>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-purple-500/20 bg-[#111827]/60 p-5 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-400/30 flex items-center justify-center text-purple-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white">Belonging before brilliance</h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Because brilliance is everywhere. Belonging is rare.
            </p>
          </div>

          <div className="rounded-2xl border border-fuchsia-500/20 bg-[#111827]/60 p-5 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 border border-fuchsia-400/30 flex items-center justify-center text-fuchsia-300">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white">Our Mission</h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              LeadWise connects technology education with human support and makes room for questions, practice, mentorship, and confidence.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-[#111827]/60 p-5 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
                <ScrollText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white">We are building</h3>
            </div>
            <ul className="text-sm text-slate-300 space-y-2">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Curious problem-solvers</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Confident learners</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Career-ready professionals</li>
            </ul>
          </div>
        </section>

        <section className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-purple-500/20 pb-4">
          <div className="inline-flex rounded-xl bg-purple-950/30 backdrop-blur-md p-1 border border-purple-400/25 text-xs shadow-inner">
            <button
              onClick={() => { setFilterCategory('all'); playHoloTone(480, 'sine', 0.04, sfxEnabled); }}
              className={`px-3.5 py-1.5 rounded-lg transition font-medium ${
                filterCategory === 'all'
                  ? 'bg-gradient-to-r from-purple-400 to-fuchsia-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(216,180,254,0.3)]'
                  : 'text-purple-200/70 hover:text-purple-200'
              }`}
            >
              All Opportunities
            </button>
            <button
              onClick={() => { setFilterCategory('Networking'); playHoloTone(480, 'sine', 0.04, sfxEnabled); }}
              className={`px-3.5 py-1.5 rounded-lg transition font-medium ${
                filterCategory === 'Networking'
                  ? 'bg-gradient-to-r from-purple-400 to-fuchsia-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(216,180,254,0.3)]'
                  : 'text-purple-200/70 hover:text-purple-200'
              }`}
            >
              Networking & Workshops
            </button>
            <button
              onClick={() => { setFilterCategory('General Discussion'); playHoloTone(480, 'sine', 0.04, sfxEnabled); }}
              className={`px-3.5 py-1.5 rounded-lg transition font-medium ${
                filterCategory === 'General Discussion'
                  ? 'bg-gradient-to-r from-purple-400 to-fuchsia-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(216,180,254,0.3)]'
                  : 'text-purple-200/70 hover:text-purple-200'
              }`}
            >
              General Discussion & Wins
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tracks, Docker, AWS..."
                className="px-3 py-1.5 pl-8 bg-purple-950/25 border border-purple-400/20 rounded-xl text-xs text-slate-100 placeholder-purple-300/40 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
              />
              <Filter className="w-3.5 h-3.5 text-purple-300/50 absolute left-2.5 top-2.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-2 text-slate-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <button
              onClick={() => {
                setSortByUpvotes(!sortByUpvotes);
                playHoloTone(520, 'sine', 0.05, sfxEnabled);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-purple-950/40 backdrop-blur-md border border-purple-400/25 text-purple-200 hover:text-white hover:border-purple-300 hover:shadow-[0_0_15px_rgba(216,180,254,0.2)] transition flex items-center gap-2"
            >
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              {sortByUpvotes ? 'Top Boosted' : 'Recent First'}
            </button>
          </div>
        </section>

        <section className="mt-6">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-block p-8 rounded-3xl max-w-md border border-dashed border-purple-400/30 bg-[#12141c]/60 backdrop-blur-md">
                <Terminal className="w-8 h-8 text-purple-400 mx-auto mb-2 opacity-80" />
                <h3 className="text-sm font-bold text-white mb-1">NO_OPPORTUNITIES_FOUND</h3>
                <p className="text-xs text-slate-400 mb-4">No discussions or workshops match this filter.</p>
                <button
                  onClick={() => setIsCreateOpen(true)}
                  className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-400/40 rounded-xl text-xs font-bold transition"
                >
                  + Broadcast First Note
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {filteredPosts.map(post => {
                const isNetworking = post.category === 'Networking';
                const catBadgeClass = isNetworking
                  ? 'bg-purple-500/20 text-purple-200 border-purple-400/40 shadow-[0_0_10px_rgba(216,180,254,0.15)]'
                  : 'bg-fuchsia-500/20 text-fuchsia-200 border-fuchsia-400/40 shadow-[0_0_10px_rgba(232,121,249,0.15)]';

                return (
                  <div
                    key={post.id}
                    onClick={() => openDetail(post)}
                    className="group relative rounded-2xl p-5 flex flex-col justify-between min-h-[250px] cursor-pointer transition-all duration-300 bg-gradient-to-br from-[#191c2a]/65 to-[#0e101a]/80 backdrop-blur-xl border border-purple-500/15 hover:border-purple-400/35 hover:shadow-[0_0_30px_rgba(168,85,247,0.08)]"
                  >
                    <CornerBrackets />

                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full border backdrop-blur-md uppercase ${catBadgeClass}`}>
                            {post.category}
                          </span>
                          {post.techTag && (
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border backdrop-blur-md ${getTechTagBadge(post.techTag)}`}>
                              #{post.techTag}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-purple-300/60">{post.timeAgo || 'Just now'}</span>
                      </div>

                      <h3 className="text-base font-bold text-white group-hover:text-purple-200 transition-colors leading-snug mb-2 drop-shadow-sm">
                        {post.title}
                      </h3>

                      <p className="text-xs text-slate-300/90 leading-relaxed line-clamp-4 font-normal">
                        {post.content}
                      </p>
                    </div>

                    <div
                      className="pt-4 mt-4 border-t border-purple-500/15 flex items-center justify-between text-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-purple-950/80 border border-purple-400/40 flex items-center justify-center text-[10px] text-purple-200 font-bold shadow-[0_0_8px_rgba(216,180,254,0.2)]">
                          {post.author.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-slate-300 font-medium text-xs leading-none">{post.author}</span>
                          <span className="text-[9px] text-fuchsia-300/70 font-mono">verified-learner</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleUpvote(post.id, e)}
                          title="Boost signal"
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-950/50 backdrop-blur-md border border-purple-400/35 hover:border-purple-300 text-purple-200 font-bold transition"
                        >
                          <ArrowBigUp className="w-4 h-4 text-purple-300 fill-purple-300/30" />
                          <span className="font-mono text-xs">{post.upvotes || 0}</span>
                        </button>

                        <button
                          onClick={() => openDetail(post)}
                          title="View discussion thread"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-950/30 backdrop-blur-md border border-purple-400/20 hover:border-purple-400/40 text-purple-300/80 transition"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span className="font-mono text-xs">{post.replies || 0}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {isDetailOpen && activePost && (
        <div className="fixed inset-0 bg-[#0c0e14]/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="relative rounded-3xl w-full max-w-xl border border-purple-400/35 bg-gradient-to-br from-[#191c2a]/90 to-[#0e101a]/95 backdrop-blur-2xl shadow-[0_0_60px_rgba(216,180,254,0.18)]">
            <CornerBrackets />

            <div className="px-6 py-4 border-b border-white/[0.08] flex justify-between items-start bg-[#13151f]/80">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                    {activePost.category}
                  </span>
                  {activePost.techTag && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30">
                      #{activePost.techTag}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-lg text-white tracking-tight leading-snug">
                  {activePost.title}
                </h3>
              </div>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 border-b border-white/[0.08] bg-[#0f1118]/70 overflow-y-auto">
              <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">
                {activePost.content}
              </p>

              <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-purple-950 flex items-center justify-center text-purple-300 font-bold text-[10px] border border-purple-400/40">
                    {activePost.author.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-purple-300 font-semibold">{activePost.author}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-500/20 font-mono">
                    Verified Learner
                  </span>
                </div>

                <button
                  onClick={(e) => handleUpvote(activePost.id, e)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-950/40 border border-purple-400/30 text-purple-200 hover:border-purple-300 transition"
                >
                  <ArrowBigUp className="w-4 h-4 fill-purple-300/30" />
                  <span className="font-mono font-bold text-xs">{activePost.upvotes || 0} Boosts</span>
                </button>
              </div>
            </div>

            <div className="px-6 py-2.5 bg-[#13151f]/80 border-b border-white/[0.08] text-xs font-semibold text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-purple-300" />
                Peer Responses &amp; Study Notes
              </span>
              <span className="text-purple-300 font-mono text-[11px]">
                {activePost.comments?.length || 0} Responses
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-[#0a0c12]">
              {(!activePost.comments || activePost.comments.length === 0) ? (
                <p className="text-xs text-slate-500 italic text-center py-4">
                  No replies yet. Be the first learner to connect!
                </p>
              ) : (
                activePost.comments.map((comment, idx) => (
                  <div key={idx} className="rounded-xl p-3.5 text-xs border border-white/[0.06] bg-[#12141c]">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-purple-300">{comment.author}</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-fuchsia-400" />
                      </div>
                      <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-500/20 font-mono">
                        Learner
                      </span>
                    </div>
                    <p className="text-slate-300 leading-normal">{comment.content}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSendReply} className="p-4 border-t border-white/[0.08] bg-[#13151f] flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={replyAuthor}
                  onChange={(e) => setReplyAuthor(e.target.value)}
                  placeholder="Your Name"
                  required
                  className="w-1/3 px-3 py-2 bg-[#0c0e14] border border-white/[0.1] rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-400"
                />
                <input
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Share advice, links, or connect..."
                  required
                  className="flex-1 px-3 py-2 bg-[#0c0e14] border border-white/[0.1] rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-purple-400 to-fuchsia-400 hover:from-purple-300 hover:to-fuchsia-300 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  Reply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCreateOpen && (
        <div className="fixed inset-0 bg-[#0c0e14]/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="relative rounded-3xl w-full max-w-lg border border-purple-400/35 bg-gradient-to-br from-[#191c2a]/95 to-[#0e101a]/95 backdrop-blur-2xl shadow-[0_0_50px_rgba(216,180,254,0.2)]">
            <CornerBrackets />

            <div className="px-6 py-4 border-b border-white/[0.08] flex justify-between items-center bg-[#13151f]/80">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-400 animate-ping" />
                <h3 className="font-bold text-sm text-white tracking-wide">
                  Share Opportunity with the Collective
                </h3>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1 flex items-center justify-between">
                  <span>Your Handle / Name</span>
                  <span className="text-[10px] text-fuchsia-300 font-mono">Identity: Verified Learner</span>
                </label>
                <input
                  type="text"
                  value={formAuthor}
                  onChange={(e) => setFormAuthor(e.target.value)}
                  required
                  placeholder="e.g. Alex"
                  className="w-full px-3.5 py-2.5 bg-[#0e1017] border border-white/[0.1] rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Category (LeadWise Channel)
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as PostCategory)}
                  className="w-full px-3.5 py-2.5 bg-[#0e1017] border border-white/[0.1] rounded-xl text-slate-100 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
                >
                  <option value="Networking">Networking (Workshops, Meetups, Referrals)</option>
                  <option value="General Discussion">General Discussion (Wins, Questions, Roadmap)</option>
                </select>
                <p className="text-[10px] text-slate-500 mt-1 font-mono">
                  Strictly conforms to your backend schema (/api/forum/posts).
                </p>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Opportunity / Post Title
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  required
                  placeholder="e.g. Free AWS Cloud Practitioner Voucher Study Group"
                  className="w-full px-3.5 py-2.5 bg-[#0e1017] border border-white/[0.1] rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Description &amp; Details
                </label>
                <textarea
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  required
                  rows={4}
                  placeholder="Share dates, links, vouchers, or study hours in the voice room..."
                  className="w-full px-3.5 py-2.5 bg-[#0e1017] border border-white/[0.1] rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 text-[11px]">IT Career Track Badge</label>
                <div className="flex flex-wrap gap-1.5">
                  {['Cloud/DevOps', 'Cybersecurity', 'FullStack', 'Data & AI'].map(track => (
                    <button
                      key={track}
                      type="button"
                      onClick={() => {
                        setFormTechTag(track as TechTag);
                        playHoloTone(600, 'sine', 0.04, sfxEnabled);
                      }}
                      className={`px-2.5 py-1 rounded-lg border text-xs font-mono transition ${
                        formTechTag === track
                          ? 'border-fuchsia-400 bg-purple-950 text-fuchsia-200 shadow-[0_0_10px_rgba(216,180,254,0.3)]'
                          : 'border-white/10 bg-[#0e1017] text-slate-400 hover:border-purple-400/40'
                      }`}
                    >
                      #{track}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 hover:from-purple-300 hover:to-fuchsia-300 text-slate-950 rounded-xl shadow-lg transition flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Broadcasting...
                    </>
                  ) : (
                    'Post to Collective'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 transition-all duration-300">
          <div className="rounded-2xl px-4 py-3 border border-purple-400/40 flex items-center gap-3 bg-[#161822]/95 backdrop-blur-xl shadow-2xl">
            <span className="text-lg">{toast.icon}</span>
            <div className="text-xs">
              <p className="font-bold text-white leading-tight">{toast.title}</p>
              <p className="text-slate-400 text-[11px]">{toast.message}</p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-white ml-2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
