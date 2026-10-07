use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  MessageSquare,
  ArrowBigUp,
  Share2,
  Trash2,
  Sparkles,
  HelpCircle,
  CircleHelp,
  Trophy,
  Flame,
  Send,
  MoreVertical,
  SlidersHorizontal,
  X,
  CheckCircle2,
  AlertTriangle,
  TriangleAlert,
  Code2,
  Volume2,
  VolumeX,
  Bookmark
} from 'lucide-react';

// Safe icon fallbacks across different versions of lucide-react
const QuestionIcon = CircleHelp || HelpCircle;
const WarningIcon = TriangleAlert || AlertTriangle;

const playHoloTone = (freq = 520, type = 'sine', duration = 0.08, enabled = true) => {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
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
    // Ignore audio restrictions gracefully in restricted browser policies
  }
};

const CornerBrackets = () => (
  <>
    <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t-2 border-l-2 border-purple-400/30 rounded-tl-sm pointer-events-none group-hover:border-fuchsia-300 transition-all" />
    <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t-2 border-r-2 border-purple-400/30 rounded-tr-sm pointer-events-none group-hover:border-fuchsia-300 transition-all" />
    <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b-2 border-l-2 border-purple-400/30 rounded-bl-sm pointer-events-none group-hover:border-fuchsia-300 transition-all" />
    <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b-2 border-r-2 border-purple-400/30 rounded-br-sm pointer-events-none group-hover:border-fuchsia-300 transition-all" />
  </>
);

const INITIAL_FORUM_POSTS = [
  {
    id: 'post-101',
    author: 'Elena Rostova',
    authorRole: 'Cybersecurity Student',
    authorInitials: 'ER',
    postType: 'question', // question, win, thought
    title: 'How do you structure your home lab for practicing Wireshark & packet inspection?',
    content: `Hey everyone! Currently on the network analysis module and trying to isolate packet captures between a virtual Kali machine and Ubuntu server in VirtualBox.\n\nAre you all using host-only adapters or internal networks to keep malware traffic contained? Would love to see diagrams or workflow setups if anyone has built this out already!`,
    tags: ['Networking', 'Cybersecurity', 'HomeLab'],
    likes: 19,
    hasLiked: false,
    timestamp: '25m ago',
    comments: [
      {
        id: 'c-1',
        author: 'Marcus Vance',
        authorRole: 'DevOps Alum',
        content: 'I highly recommend setting up an internal virtual network on a separate subnet. That way none of your packets spill into your home router WAN adapter.',
        timestamp: '15m ago',
        likes: 4
      }
    ]
  },
  {
    id: 'post-102',
    author: 'Jamal Washington',
    authorRole: 'Cloud Computing Learner',
    authorInitials: 'JW',
    postType: 'win',
    title: 'Passed my AWS Cloud Practitioner exam on my first attempt today! 🎉',
    content: `When I started 3 months ago with no tech background, subnet CIDR blocks and IAM policies looked like hieroglyphics. Huge shoutout to the LeadWise study room crew who drilled flashcards with me at 9 PM on Thursdays!\n\nTo anyone struggling through their first terminal commands: don't give up. Belonging before brilliance is 100% real.`,
    tags: ['Win', 'AWS', 'Milestone'],
    likes: 42,
    hasLiked: true,
    timestamp: '2h ago',
    comments: [
      {
        id: 'c-2',
        author: 'Priya Patel',
        authorRole: 'FullStack Learner',
        content: 'SO PROUD OF YOU JAMAL! Setting the standard for all of us!',
        timestamp: '1h ago',
        likes: 6
      },
      {
        id: 'c-3',
        author: 'Sam Chen',
        authorRole: 'LeadWise Mentor',
        content: 'Incredible work! Next stop: Solutions Architect Associate 🚀',
        timestamp: '45m ago',
        likes: 3
      }
    ]
  },
  {
    id: 'post-103',
    author: 'Taylor Brooks',
    authorRole: 'FullStack Learner',
    authorInitials: 'TB',
    postType: 'thought',
    title: 'Understanding recursion clicked today after drawing call stacks on paper',
    content: `If anyone else gets stuck in loops trying to mentally trace recursive calls, stop looking at the screen. Get a notebook, draw boxes for each call stack frame, and physically write the return values as they pop off. \n\nLearning in public has really helped demystify coding for me. Hope this small tip helps someone!`,
    tags: ['JavaScript', 'StudyTips', 'FullStack'],
    likes: 27,
    hasLiked: false,
    timestamp: '4h ago',
    comments: []
  }
];

export default function LeadWiseCommunityForum({
  sessionToken = 'valid-token',
  currentUserName = 'You (Learner)',
  currentUserRole = 'Cloud Track Learner'
}) {
  const [posts, setPosts] = useState(INITIAL_FORUM_POSTS);
  const [filterType, setFilterType] = useState('all'); // all, question, win, thought
  const [searchQuery, setSearchQuery] = useState('');
  const [cardDensity, setCardDensity] = useState('standard'); // compact, standard, expanded
  const [sfxEnabled, setSfxEnabled] = useState(true);

  // Expanded post bodies state for "Show More" truncation
  const [expandedContentIds, setExpandedContentIds] = useState(new Set());

  // Composer state
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [composerType, setComposerType] = useState('thought');
  const [composerTitle, setComposerTitle] = useState('');
  const [composerContent, setComposerContent] = useState('');
  const [composerTags, setComposerTags] = useState('General');

  // Comment input per post
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentText, setCommentText] = useState('');

  // Delete Confirmation Modal State
  const [postToDelete, setPostToDelete] = useState(null);

  // Toast notification state
  const [toast, setToast] = useState(null);

  // Mounted flag to eliminate Next.js hydration mismatches
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const showToast = useCallback((title, message, icon = '✨') => {
    setToast({ title, message, icon });
    const timer = setTimeout(() => {
      setToast(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  const filteredPosts = useMemo(() => {
    let result = [...posts];

    if (filterType !== 'all') {
      result = result.filter((p) => p.postType === filterType);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return result;
  }, [posts, filterType, searchQuery]);

  const handleCreatePost = (e) => {
    e.preventDefault();
    const title = composerTitle.trim();
    const content = composerContent.trim();

    if (!title || !content) {
      showToast('Incomplete Note', 'Please provide both a title and message.', '⚠️');
      return;
    }

    playHoloTone(640, 'triangle', 0.1, sfxEnabled);

    const tagsArray = composerTags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const newPost = {
      id: `post-${Date.now()}`,
      author: currentUserName,
      authorRole: currentUserRole,
      authorInitials: currentUserName.substring(0, 2).toUpperCase(),
      postType: composerType,
      title,
      content,
      tags: tagsArray.length > 0 ? tagsArray : ['Community'],
      likes: 1,
      hasLiked: true,
      timestamp: 'Just now',
      comments: []
    };

    setPosts([newPost, ...posts]);
    setComposerTitle('');
    setComposerContent('');
    setComposerTags('General');
    setIsComposerOpen(false);
    showToast('Published to Collective!', 'Your post is now live on the forum feed.', '🚀');
  };

  const confirmDeletePost = () => {
    if (!postToDelete) return;

    playHoloTone(400, 'sawtooth', 0.1, sfxEnabled);
    setPosts((prev) => prev.filter((p) => p.id !== postToDelete.id));
    showToast('Post Removed', 'The item has been deleted from your feed.', '🗑️');
    setPostToDelete(null);
  };

  const handleToggleLike = (postId) => {
    playHoloTone(700, 'sine', 0.06, sfxEnabled);
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextLiked = !p.hasLiked;
          return {
            ...p,
            hasLiked: nextLiked,
            likes: nextLiked ? p.likes + 1 : Math.max(0, p.likes - 1)
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId, e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    playHoloTone(600, 'sine', 0.07, sfxEnabled);
    const newCommentObj = {
      id: `c-${Date.now()}`,
      author: currentUserName,
      authorRole: currentUserRole,
      content: commentText.trim(),
      timestamp: 'Just now',
      likes: 0
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...(p.comments || []), newCommentObj]
          };
        }
        return p;
      })
    );

    setCommentText('');
    showToast('Reply Appended', 'Your thought has been shared in the thread.', '💬');
  };

  const toggleExpandContent = (id) => {
    setExpandedContentIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const renderTypeBadge = (type) => {
    switch (type) {
      case 'question':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/30">
            <QuestionIcon className="w-3 h-3" /> Question &amp; Help
          </span>
        );
      case 'win':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/30">
            <Trophy className="w-3 h-3" /> Learning Win
          </span>
        );
      case 'thought':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-400/30">
            <Sparkles className="w-3 h-3" /> Discussion
          </span>
        );
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#07090e] text-slate-100 flex items-center justify-center font-mono text-xs text-purple-300/60">
        Loading LeadWise Community Stream...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-fuchsia-500 selection:text-white flex flex-col relative">
      {/* Background Matrix & Holographic Glow */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 50% -10%, rgba(216, 180, 254, 0.16), transparent 70%),
            radial-gradient(ellipse 60% 40% at 90% 100%, rgba(192, 132, 252, 0.12), transparent 60%),
            linear-gradient(rgba(216, 180, 254, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(216, 180, 254, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 36px 36px, 36px 36px'
        }}
      />

      {/* Forum Top Bar */}
      <header className="sticky top-0 z-40 border-b border-purple-500/20 bg-[#07090e]/85 backdrop-blur-xl shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-400/50 flex items-center justify-center text-purple-200 shadow-[0_0_15px_rgba(216,180,254,0.3)]">
              <MessageSquare className="w-5 h-5 text-fuchsia-300" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-white flex items-center gap-2">
                LeadWise{' '}
                <span className="bg-gradient-to-r from-purple-200 via-fuchsia-200 to-pink-300 bg-clip-text text-transparent">
                  Community Feed
                </span>
              </h1>
              <p className="text-[11px] text-purple-200/60 font-mono">
                Ask questions, share breakthroughs &amp; connect
              </p>
            </div>
          </div>

          {/* Controls: Audio feedback & Density */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSfxEnabled(!sfxEnabled)}
              className="p-2 rounded-xl bg-purple-950/30 border border-purple-400/20 text-purple-300 hover:border-purple-300 text-xs transition"
              title="Toggle Audio Feedback"
            >
              {sfxEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* View Density / Card Size Controller */}
            <div className="hidden sm:flex items-center bg-purple-950/30 border border-purple-400/20 rounded-xl p-1 text-[11px] font-mono text-purple-200">
              <button
                onClick={() => setCardDensity('compact')}
                className={`px-2 py-1 rounded-lg transition ${
                  cardDensity === 'compact'
                    ? 'bg-purple-400 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Compact view (short card height)"
              >
                Compact
              </button>
              <button
                onClick={() => setCardDensity('standard')}
                className={`px-2 py-1 rounded-lg transition ${
                  cardDensity === 'standard'
                    ? 'bg-purple-400 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Standard comfortable card view"
              >
                Standard
              </button>
              <button
                onClick={() => setCardDensity('expanded')}
                className={`px-2 py-1 rounded-lg transition ${
                  cardDensity === 'expanded'
                    ? 'bg-purple-400 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Full expanded text view"
              >
                Expanded
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Forum Stream */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 relative z-10 space-y-6">
        {/* Quick Social Composer Trigger */}
        <section className="relative rounded-2xl p-4 sm:p-5 border border-purple-400/30 bg-gradient-to-br from-[#191c2a]/80 to-[#0e101a]/90 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <CornerBrackets />

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center font-bold text-white shadow-md text-sm">
              {currentUserName.substring(0, 2).toUpperCase()}
            </div>

            <button
              onClick={() => {
                playHoloTone(550, 'sine', 0.05, sfxEnabled);
                setIsComposerOpen(true);
              }}
              className="flex-1 text-left px-4 py-3 bg-[#0d0f17]/90 hover:bg-[#121520] border border-purple-400/25 hover:border-purple-300/50 rounded-xl text-slate-400 hover:text-slate-200 text-xs sm:text-sm transition flex items-center justify-between"
            >
              <span>Share a thought, ask a technical question, or celebrate a win...</span>
              <Sparkles className="w-4 h-4 text-fuchsia-400 ml-2 shrink-0" />
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-purple-500/15 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setComposerType('question');
                  setIsComposerOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-400/25 transition flex items-center gap-1.5"
              >
                <QuestionIcon className="w-3.5 h-3.5" /> Ask Question
              </button>
              <button
                onClick={() => {
                  setComposerType('win');
                  setIsComposerOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-400/25 transition flex items-center gap-1.5"
              >
                <Trophy className="w-3.5 h-3.5" /> Share Win
              </button>
              <button
                onClick={() => {
                  setComposerType('thought');
                  setIsComposerOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-400/25 transition flex items-center gap-1.5"
              >
                <Code2 className="w-3.5 h-3.5" /> Post Tip
              </button>
            </div>

            <span className="text-[11px] text-purple-300/50 font-mono hidden sm:inline">
              Visible to all verified learners
            </span>
          </div>
        </section>

        {/* Filters and Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-500/20 pb-3">
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => {
                setFilterType('all');
                playHoloTone(500, 'sine', 0.04, sfxEnabled);
              }}
              className={`px-3 py-1.5 rounded-lg transition font-medium ${
                filterType === 'all'
                  ? 'bg-purple-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(216,180,254,0.3)]'
                  : 'text-purple-200/70 hover:text-purple-200 bg-purple-950/20'
              }`}
            >
              All Posts
            </button>
            <button
              onClick={() => {
                setFilterType('question');
                playHoloTone(500, 'sine', 0.04, sfxEnabled);
              }}
              className={`px-3 py-1.5 rounded-lg transition font-medium ${
                filterType === 'question'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(251,191,36,0.3)]'
                  : 'text-purple-200/70 hover:text-purple-200 bg-purple-950/20'
              }`}
            >
              Questions &amp; Help
            </button>
            <button
              onClick={() => {
                setFilterType('win');
                playHoloTone(500, 'sine', 0.04, sfxEnabled);
              }}
              className={`px-3 py-1.5 rounded-lg transition font-medium ${
                filterType === 'win'
                  ? 'bg-emerald-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(52,211,153,0.3)]'
                  : 'text-purple-200/70 hover:text-purple-200 bg-purple-950/20'
              }`}
            >
              Wins &amp; Milestones
            </button>
            <button
              onClick={() => {
                setFilterType('thought');
                playHoloTone(500, 'sine', 0.04, sfxEnabled);
              }}
              className={`px-3 py-1.5 rounded-lg transition font-medium ${
                filterType === 'thought'
                  ? 'bg-fuchsia-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(232,121,249,0.3)]'
                  : 'text-purple-200/70 hover:text-purple-200 bg-purple-950/20'
              }`}
            >
              Discussions
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search feed, authors, tags..."
              className="px-3 py-1.5 text-xs bg-purple-950/30 border border-purple-400/25 rounded-xl text-slate-200 placeholder-purple-300/40 focus:outline-none focus:border-purple-400 w-48 sm:w-56"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Post Feed List */}
        <section className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-dashed border-purple-400/25 bg-[#10121a]/50">
              <MessageSquare className="w-8 h-8 text-purple-400 mx-auto mb-2 opacity-60" />
              <h3 className="text-sm font-bold text-white mb-1">NO_COMMUNITY_POSTS_FOUND</h3>
              <p className="text-xs text-slate-400">Be the first to share an update or question with your peers!</p>
            </div>
          ) : (
            filteredPosts.map((post) => {
              const isExpanded =
                cardDensity === 'expanded' || expandedContentIds.has(post.id);
              const isVeryLong = post.content.length > 220;

              return (
                <article
                  key={post.id}
                  className="group relative rounded-2xl p-5 border border-purple-400/20 hover:border-purple-400/45 transition-all bg-gradient-to-br from-[#161824]/85 to-[#0e101a]/95 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
                >
                  <CornerBrackets />

                  {/* Header: Author & Options */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-400/40 flex items-center justify-center text-xs font-extrabold text-purple-200 shadow-[0_0_10px_rgba(216,180,254,0.2)]">
                        {post.authorInitials || post.author.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-white">{post.author}</h4>
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-purple-950/60 text-purple-300 border border-purple-400/30 font-mono">
                            {post.authorRole || 'Verified Learner'}
                          </span>
                        </div>
                        <span className="text-[10px] text-purple-300/60 font-mono">{post.timestamp}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {renderTypeBadge(post.postType)}

                      {/* Delete action button */}
                      <button
                        onClick={() => setPostToDelete(post)}
                        title="Delete this post"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-pink-400 hover:bg-pink-500/10 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Post Title */}
                  <h3 className="text-sm sm:text-base font-bold text-white mb-2 leading-snug">
                    {post.title}
                  </h3>

                  {/* Post Content with Size / Length Control */}
                  <div className="text-xs sm:text-[13px] text-slate-300 leading-relaxed whitespace-pre-line font-normal">
                    {cardDensity === 'compact' && !isExpanded ? (
                      <p className="line-clamp-2">{post.content}</p>
                    ) : !isExpanded && isVeryLong ? (
                      <>
                        <p>{post.content.slice(0, 220)}...</p>
                        <button
                          onClick={() => toggleExpandContent(post.id)}
                          className="mt-1 text-xs font-semibold text-fuchsia-300 hover:text-fuchsia-200 inline-flex items-center"
                        >
                          Show more
                        </button>
                      </>
                    ) : (
                      <>
                        <p>{post.content}</p>
                        {isVeryLong && cardDensity !== 'expanded' && (
                          <button
                            onClick={() => toggleExpandContent(post.id)}
                            className="mt-1 text-xs font-semibold text-purple-300 hover:text-purple-200 inline-flex items-center"
                          >
                            Show less
                          </button>
                        )}
                      </>
                    )}
                  </div>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {post.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-950/40 text-purple-300/80 border border-purple-400/20"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Engagement Bar: Likes & Comments */}
                  <div className="mt-4 pt-3 border-t border-purple-500/15 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleLike(post.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition ${
                          post.hasLiked
                            ? 'bg-fuchsia-500/20 text-fuchsia-200 border-fuchsia-400/50 shadow-[0_0_12px_rgba(232,121,249,0.3)]'
                            : 'bg-purple-950/30 text-purple-200 border-purple-400/20 hover:border-purple-300'
                        }`}
                      >
                        <ArrowBigUp
                          className={`w-4 h-4 ${
                            post.hasLiked ? 'fill-fuchsia-300 text-fuchsia-300' : ''
                          }`}
                        />
                        <span className="font-mono text-xs">{post.likes} Boosts</span>
                      </button>

                      <button
                        onClick={() =>
                          setActiveCommentPostId(
                            activeCommentPostId === post.id ? null : post.id
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/30 text-purple-200 border border-purple-400/20 hover:border-purple-300 transition"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="font-mono text-xs">
                          {post.comments ? post.comments.length : 0} Replies
                        </span>
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        playHoloTone(520, 'sine', 0.05, sfxEnabled);
                        showToast('Link Copied', 'Post address saved to clipboard.', '🔗');
                      }}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
                      title="Share post"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Inline Discussion & Comment Stream */}
                  {activeCommentPostId === post.id && (
                    <div className="mt-4 pt-3 border-t border-white/[0.08] space-y-3 bg-[#0a0c12]/70 rounded-xl p-3">
                      {post.comments && post.comments.length > 0 ? (
                        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                          {post.comments.map((comment) => (
                            <div
                              key={comment.id}
                              className="p-2.5 rounded-xl bg-[#12141e] border border-white/[0.05] text-xs"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-purple-300">
                                  {comment.author}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  {comment.timestamp}
                                </span>
                              </div>
                              <p className="text-slate-300 leading-relaxed">
                                {comment.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 italic py-1 text-center">
                          No replies yet. Join the conversation below!
                        </p>
                      )}

                      {/* Reply Input Box */}
                      <form
                        onSubmit={(e) => handleAddComment(post.id, e)}
                        className="flex gap-2 pt-1"
                      >
                        <input
                          type="text"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Write a helpful response or cheer them on..."
                          required
                          className="flex-1 px-3 py-2 bg-[#0e1017] border border-purple-400/25 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-400"
                        />
                        <button
                          type="submit"
                          className="px-3.5 py-2 bg-gradient-to-r from-purple-400 to-fuchsia-400 hover:from-purple-300 hover:to-fuchsia-300 text-slate-950 font-bold rounded-xl text-xs transition flex items-center gap-1 shadow-md"
                        >
                          <Send className="w-3 h-3" />
                          Reply
                        </button>
                      </form>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </section>
      </main>

      {/* Social Post Composer Modal */}
      {isComposerOpen && (
        <div className="fixed inset-0 bg-[#0c0e14]/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="relative rounded-3xl w-full max-w-lg border border-purple-400/35 bg-gradient-to-br from-[#191c2a]/95 to-[#0e101a]/95 backdrop-blur-2xl shadow-[0_0_50px_rgba(216,180,254,0.2)] overflow-hidden">
            <CornerBrackets />

            <div className="px-6 py-4 border-b border-white/[0.08] flex justify-between items-center bg-[#13151f]/80">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-400 animate-pulse" />
                <h3 className="font-bold text-sm text-white tracking-wide">
                  Create Community Post
                </h3>
              </div>
              <button
                onClick={() => setIsComposerOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="p-6 space-y-4 text-xs">
              {/* Post Type Selector */}
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Post Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setComposerType('thought')}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                      composerType === 'thought'
                        ? 'border-purple-400 bg-purple-950 text-purple-200 shadow-[0_0_10px_rgba(216,180,254,0.3)]'
                        : 'border-white/10 bg-[#0e1017] text-slate-400 hover:border-purple-400/30'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Discussion
                  </button>
                  <button
                    type="button"
                    onClick={() => setComposerType('question')}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                      composerType === 'question'
                        ? 'border-amber-400 bg-amber-950/40 text-amber-200 shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                        : 'border-white/10 bg-[#0e1017] text-slate-400 hover:border-amber-400/30'
                    }`}
                  >
                    <QuestionIcon className="w-3.5 h-3.5" /> Question
                  </button>
                  <button
                    type="button"
                    onClick={() => setComposerType('win')}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                      composerType === 'win'
                        ? 'border-emerald-400 bg-emerald-950/40 text-emerald-200 shadow-[0_0_10px_rgba(52,211,153,0.3)]'
                        : 'border-white/10 bg-[#0e1017] text-slate-400 hover:border-emerald-400/30'
                    }`}
                  >
                    <Trophy className="w-3.5 h-3.5" /> Small Win
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Topic Headline
                </label>
                <input
                  type="text"
                  value={composerTitle}
                  onChange={(e) => setComposerTitle(e.target.value)}
                  required
                  placeholder={
                    composerType === 'question'
                      ? 'e.g. How do I fix CORS in my Express backend?'
                      : composerType === 'win'
                      ? 'e.g. Finally deployed my portfolio on Vercel!'
                      : 'e.g. A quick tip for memorizing HTTP status codes'
                  }
                  className="w-full px-3.5 py-2.5 bg-[#0e1017] border border-white/[0.1] rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-400"
                />
              </div>

              {/* Content Description */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-medium">Your Message</label>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {composerContent.length} chars
                  </span>
                </div>
                <textarea
                  value={composerContent}
                  onChange={(e) => setComposerContent(e.target.value)}
                  required
                  rows={5}
                  placeholder="Share details, snippets, steps you tried, or what worked..."
                  className="w-full px-3.5 py-2.5 bg-[#0e1017] border border-white/[0.1] rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-400"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={composerTags}
                  onChange={(e) => setComposerTags(e.target.value)}
                  placeholder="e.g. Cloud, Docker, Wireshark, Resume"
                  className="w-full px-3.5 py-2.5 bg-[#0e1017] border border-white/[0.1] rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-400"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsComposerOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 hover:from-purple-300 hover:to-fuchsia-300 text-slate-950 rounded-xl shadow-lg transition flex items-center gap-1.5"
                >
                  Post to Community
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Holographic Delete Confirmation Modal (Zero browser alert/confirm) */}
      {postToDelete && (
        <div className="fixed inset-0 bg-[#0c0e14]/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="relative rounded-3xl w-full max-w-sm border border-pink-400/40 bg-gradient-to-br from-[#1c1420]/95 to-[#0e101a]/95 backdrop-blur-2xl shadow-[0_0_50px_rgba(244,114,182,0.25)] p-6 text-center">
            <CornerBrackets />

            <div className="w-12 h-12 rounded-2xl bg-pink-950/60 border border-pink-400/50 flex items-center justify-center text-pink-300 mx-auto mb-3 shadow-[0_0_20px_rgba(244,114,182,0.3)]">
              <WarningIcon className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-white mb-1.5">Delete This Post?</h3>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              Are you sure you want to remove &quot;{postToDelete.title.slice(0, 32)}...&quot;? This cannot be undone.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setPostToDelete(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-purple-950/40 text-slate-300 hover:text-white border border-purple-400/25 transition"
              >
                Keep Post
              </button>
              <button
                onClick={confirmDeletePost}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-pink-500 hover:bg-pink-400 text-slate-950 shadow-[0_0_15px_rgba(244,114,182,0.4)] transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Holographic Non-blocking Toast */}
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
