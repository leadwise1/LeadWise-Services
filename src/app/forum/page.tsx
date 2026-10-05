"use client";

import React, { useState, useEffect, Suspense } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Search, PlusCircle, Flame, Clock, MessageCircle, ArrowUp, Loader2, X, Trash2, Shield, Zap } from 'lucide-react';
import { db, auth } from "@/lib/firebase";
import { signInAnonymously, updateProfile } from "firebase/auth";
import { collection, onSnapshot, doc, query, orderBy, deleteDoc } from "firebase/firestore";
import { getCommunityName } from './community-profile';
import { saveCommunityUpdate } from './community-api';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Define a constant for the collection path to ensure consistency across the forum
const FORUM_COLLECTION_PATH = ['artifacts', 'leadwise-web', 'public', 'data', 'forumPosts'] as const;
const BULLETIN_CATEGORIES = ['Announcements', 'Opportunities', 'Workshops', 'Networking'];
import { motion, AnimatePresence } from 'framer-motion';

interface Post {
  id: string;
  title: string;
  author: string;
  authorId?: string;
  category: string;
  replies: number;
  upvotes: number;
  timeAgo: string;
  hot: boolean;
  createdAt?: any;
  badges?: string[];
  isAdmin?: boolean;
  content?: string;
}

function IntakeModal({ 
  isOpen, 
  onClose, 
  onComplete
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onComplete: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    displayName: ""
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !formData.displayName.trim()) return;
    setLoading(true);
    setError("");

    try {
      if (!auth) throw new Error("Community connection unavailable");
      if (!auth.currentUser) await signInAnonymously(auth);
      if (!auth.currentUser) throw new Error("Community connection unavailable");
      const displayName = formData.displayName.trim();
      await updateProfile(auth.currentUser, { displayName });
      localStorage.setItem("leadwise_community_profile", JSON.stringify({ displayName }));
      onComplete();
    } catch (error) {
      console.error("Intake failed:", error);
      setError("Your profile couldn't be saved. Your answers are still here; please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={open => { if (!open && !loading) onClose(); }}>
      <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm" />
      <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl w-[calc(100%-2rem)] max-w-md max-h-[90dvh] overflow-y-auto">
        <div className="bg-purple-700 p-6 text-white">
          <Dialog.Title className="text-xl font-bold">Join the learner community</Dialog.Title>
          <Dialog.Description className="text-sm text-white/90 mt-2">Learners, alumni, and instructors are welcome.</Dialog.Description>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-neutral-200">
          <label htmlFor="community-name" className="block text-sm font-medium">Name shown on your posts</label>
          <input id="community-name" required autoComplete="nickname" maxLength={60} value={formData.displayName} onChange={e => setFormData({ displayName: e.target.value })} className="w-full bg-neutral-950 text-white p-3 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none" />
          <p className="text-sm text-neutral-400">Posts and replies are public. Share thoughtfully and look out for each other.</p>
          <Link href="/forum/rules" className="text-sm text-purple-300 underline">Community charter</Link>

          <div className="flex justify-between pt-4 border-t border-neutral-700 mt-4">
              <button type="button" disabled={loading} onClick={onClose} className="px-4 py-2 text-neutral-300 hover:text-white">Cancel</button>
              <button type="submit" disabled={loading} className="bg-purple-700 text-white px-8 py-2 rounded-lg font-bold hover:bg-purple-600 disabled:opacity-50">
                {loading ? "Joining..." : "Join community"}
              </button>
          </div>
          {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
        </form>
      </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// --- MAIN FORUM PAGE CONTENT ---
function ForumPageContent() {
  const searchParams = useSearchParams();
  const isBulletin = searchParams.get('board') === 'bulletin';
  const [bulletinCategory, setBulletinCategory] = useState("All updates");
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"Trending" | "Recent" | "Awaiting replies">("Recent");
  const [feedError, setFeedError] = useState("");
  const [actionError, setActionError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [currentUserName, setCurrentUserName] = useState("Anonymous Student");
  
  // Gating State
  const [isEnrolled, setIsEnrolled] = useState<boolean | null>(null);
  const [intakeOpen, setIntakeOpen] = useState(false);
  
  // New Post Form State
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("General Discussion");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [upvotingIds, setUpvotingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setNewCategory(isBulletin ? "Announcements" : "General Discussion");
    setActiveFilter("Recent");
    setSearchQuery("");
  }, [isBulletin]);

  // --- CHECK ENROLLMENT & GET NAME ---
  useEffect(() => {
    const name = getCommunityName();
    setIsEnrolled(Boolean(name));
    if (name) setCurrentUserName(name);
  }, []);

  // --- REAL-TIME DATA SYNC ---
  useEffect(() => {
    setLoading(true);
    setFeedError("");
    if (!db) {
      setFeedError("We couldn't connect to the community. Please try again shortly.");
      setLoading(false);
      return;
    }

    const postsRef = collection(db, ...FORUM_COLLECTION_PATH);
    
    const q = query(postsRef, orderBy(activeFilter === "Trending" ? "upvotes" : "createdAt", "desc"));

    let cancelled = false;
    let poll: ReturnType<typeof setInterval> | undefined;
    const loadFromServer = async () => {
      try {
        const response = await fetch('/api/forum/posts', { cache: 'no-store' });
        if (!response.ok) throw new Error('Feed unavailable');
        const result = await response.json();
        if (cancelled) return;
        const fetched = result.data as (Post & { createdAtMillis: number })[];
        fetched.sort((a, b) => activeFilter === 'Trending' ? b.upvotes - a.upvotes : b.createdAtMillis - a.createdAtMillis);
        setPosts(fetched);
        setFeedError("");
      } catch {
        if (!cancelled) setFeedError("Discussions couldn't load. Please try again shortly.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts: Post[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        fetchedPosts.push({
          id: doc.id,
          title: data.title || "Untitled",
          author: data.author || "Anonymous Student",
          authorId: data.authorId || "",
          category: data.category || "General",
          replies: data.replies || 0,
          upvotes: data.upvotes || 0,
          timeAgo: data.createdAt ? new Date(data.createdAt.toMillis()).toLocaleDateString() : "Just now",
          hot: data.upvotes > 5,
          createdAt: data.createdAt,
          badges: data.badges || [],
          isAdmin: data.isAdmin || false,
          content: data.content || ""
        });
      });
      setPosts(fetchedPosts);
      setFeedError("");
      setLoading(false);
    }, (error) => {
      void loadFromServer();
      poll = setInterval(() => { if (!document.hidden) void loadFromServer(); }, 30000);
    });

    return () => { cancelled = true; unsubscribe(); if (poll) clearInterval(poll); };
  }, [activeFilter, retryCount]);

  const handleUpvote = async (e: React.MouseEvent, postId: string) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    if (!db || upvotingIds.has(postId)) return;

    setUpvotingIds(prev => new Set(prev).add(postId));
    setActionError("");

    try {
      await saveCommunityUpdate(`/api/forum/posts/${postId}`, { action: 'upvote' });
      setRetryCount(count => count + 1);
    } catch (error) {
      console.error("Failed to upvote:", error);
      setActionError("Your upvote didn't save. Please try again.");
    } finally {
      setUpvotingIds(prev => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
    }
  };

  const handleDeletePost = async (e: React.MouseEvent, postId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const postRef = doc(db, ...FORUM_COLLECTION_PATH, postId);
      await deleteDoc(postRef);
    } catch (error) {
      console.error("Failed to delete post:", error);
      alert("Delete failed. You likely need to update your Firestore Rules to allow deletions.");
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    console.log("New post submission started...");
    e.preventDefault();
    if (!newTitle.trim() || !db || isSubmitting) return;
    
    setIsSubmitting(true);
    setActionError("");
    try {
      await saveCommunityUpdate('/api/forum/posts', {
        title: newTitle.trim(),
        content: newContent.trim(),
        category: newCategory,
        author: currentUserName, 
      });
      
      setNewTitle("");
      setNewContent("");
      setIsModalOpen(false);
      setRetryCount(count => count + 1);
    } catch (error) {
      console.error("Failed to create post:", error);
      setActionError("Your question couldn't be posted. Your text is still here; please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayedPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (post.content || "").toLowerCase().includes(searchQuery.toLowerCase());
    const isBulletinPost = BULLETIN_CATEGORIES.includes(post.category);
    const matchesBoard = isBulletin ? isBulletinPost && (bulletinCategory === "All updates" || post.category === bulletinCategory) : !isBulletinPost;
    return matchesSearch && matchesBoard && (activeFilter !== "Awaiting replies" || post.replies === 0);
  });

  // Show a blank screen briefly while checking enrollment status to prevent flash
  if (isEnrolled === null) return <div className="min-h-screen bg-[#090A0F]"></div>;

  return (
    <div className="community-feed p-5 sm:p-6 md:p-10 max-w-5xl mx-auto relative min-h-screen text-white">
      {/* Header */}
      <div className="community-header flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">{isBulletin ? "Bulletin board" : "Open forum"}</h2>
          <p className="text-neutral-300">{isBulletin ? "Opportunities, workshops, and connections for learners, alumni, and instructors." : "Questions, everyday thoughts, and small wins. A shared space for learners, alumni, and instructors."}</p>
        </div>
        <button 
          onClick={() => isEnrolled ? setIsModalOpen(true) : setIntakeOpen(true)}
          className="community-primary flex items-center justify-center gap-2 px-5 py-3 rounded-md font-semibold transition-all active:scale-95 shrink-0"
        >
          <PlusCircle className="w-5 h-5" />
          {isBulletin ? "Post an update" : "Share something"}
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="community-tabs flex gap-1 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <button 
            onClick={() => setActiveFilter("Trending")}
            aria-pressed={activeFilter === "Trending"}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === "Trending" ? "bg-neutral-800 text-white shadow-inner" : "bg-transparent text-neutral-400 hover:bg-neutral-800 hover:text-white"}`}
          >
            <Flame className={`w-4 h-4 ${activeFilter === "Trending" ? "text-orange-400" : ""}`} /> Trending
          </button>
          <button 
            onClick={() => setActiveFilter("Recent")}
            aria-pressed={activeFilter === "Recent"}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === "Recent" ? "bg-neutral-800 text-white shadow-inner" : "bg-transparent text-neutral-400 hover:bg-neutral-800 hover:text-white"}`}
          >
            <Clock className={`w-4 h-4 ${activeFilter === "Recent" ? "text-blue-400" : ""}`} /> Recent
          </button>
          {!isBulletin && <button onClick={() => setActiveFilter("Awaiting replies")} aria-pressed={activeFilter === "Awaiting replies"} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${activeFilter === "Awaiting replies" ? "bg-emerald-500/15 text-emerald-300" : "text-neutral-400 hover:bg-neutral-800 hover:text-white"}`}>
            <MessageCircle className="w-4 h-4" /> Awaiting replies
          </button>}
        </div>
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            id="forum-search"
            name="forum-search"
            aria-label={isBulletin ? "Search bulletin board" : "Search community discussions"}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isBulletin ? "Search updates..." : "Search discussions..."}
            className="w-full bg-neutral-900 border border-neutral-700 text-white text-sm rounded-md pl-10 pr-4 py-3 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all placeholder:text-neutral-400"
          />
        </div>
      </div>
      {isBulletin && <div className="mb-6 flex items-center gap-3 flex-wrap">
        <label htmlFor="bulletin-category" className="text-sm text-neutral-300">Show</label>
        <select id="bulletin-category" value={bulletinCategory} onChange={e => setBulletinCategory(e.target.value)} className="bg-neutral-900 border border-neutral-700 text-white rounded-lg p-2">
          {['All updates', ...BULLETIN_CATEGORIES].map(category => <option key={category}>{category}</option>)}
        </select>
      </div>}

      {/* 3. ACCOUNTABILITY SYNC BANNER: Urgent anchor to prevent dropouts */}
      {isEnrolled && (
        <div className="border-y border-neutral-800 py-5 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="text-amber-300 p-2">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-white mb-1">Need to talk it through?</h4>
              <p className="text-neutral-300">Sometimes a conversation helps. Bring your questions to a check-in.</p>
            </div>
          </div>
          <a 
            href={process.env.NEXT_PUBLIC_CALENDAR_LINK || "https://calendar.app.google/1AXYeyfAXczZ2wi1A"} 
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap bg-white text-blue-600 px-6 py-2.5 rounded-xl font-black hover:bg-[#FFBEA0] transition-all hover:scale-105 shadow-lg shadow-black/20"
          >
            Book a check-in
          </a>
        </div>
      )}

      {/* Community feed */}
      {actionError && !isModalOpen && <p role="alert" className="mb-4 text-red-300">{actionError}</p>}
        <div className="flex flex-col gap-4 min-h-[400px]">
          {feedError ? (
            <div role="alert" className="py-10 text-center border border-neutral-800 rounded-lg p-6">
              <p className="text-neutral-300 mb-4">{feedError}</p>
              <button onClick={() => setRetryCount(count => count + 1)} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Try again</button>
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-500 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="animate-pulse">Syncing live discussions...</p>
            </div>
          ) : displayedPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-500 border border-dashed border-neutral-800 bg-neutral-900/20 rounded-2xl p-8 text-center transition-all hover:bg-neutral-900/50">
              <MessageCircle className="w-12 h-12 text-neutral-700 mb-4" />
              <p className="text-lg text-white mb-2 font-medium">{searchQuery ? "No matching posts" : isBulletin ? "No updates here yet" : activeFilter === "Awaiting replies" ? "No questions awaiting replies" : "Start with what's on your mind"}</p>
              <p className="text-neutral-400 mb-6">{searchQuery ? "Try a different phrase." : isBulletin ? "Have an opportunity, workshop, or announcement to share with learners and alumni?" : activeFilter === "Awaiting replies" ? "Explore recent conversations or ask a question of your own." : "What are you learning, and where could a little support help?"}</p>
              <button 
                onClick={() => isEnrolled ? setIsModalOpen(true) : setIntakeOpen(true)}
                className="text-blue-400 font-medium hover:text-blue-300 transition-colors"
              >
                {isBulletin ? "Post an update" : "Ask a question"}
              </button>
            </div>
          ) : (
            <AnimatePresence>
              {displayedPosts.map((post, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  key={post.id}
                >
                    <article className="community-post group border border-neutral-800 p-5 rounded-lg">
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center gap-1 min-w-[40px]">
                          <motion.button 
                            whileTap={{ scale: 0.8 }}
                            whileHover={{ scale: 1.1 }}
                            onClick={(e) => handleUpvote(e, post.id)}
                            disabled={upvotingIds.has(post.id)}
                            className="text-neutral-500 hover:text-emerald-400 transition-colors p-1.5 rounded-lg hover:bg-emerald-400/10 active:scale-90 disabled:opacity-50"
                            title="Upvote this post"
                          >
                            <ArrowUp className="w-5 h-5" />
                          </motion.button>
                          <span className={`font-semibold text-sm transition-colors ${post.hot ? 'text-orange-400' : 'text-neutral-300'}`}>
                            {post.upvotes}
                          </span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-neutral-800/80 border border-neutral-700/50 text-neutral-300">
                              {isBulletin ? post.category : "Open forum"}
                            </span>
                            <span className="text-xs text-neutral-500">•</span>
                            <span className="text-xs text-neutral-400 font-medium flex items-center gap-1">
                              Posted by {post.author}
                              {/* Admin badge */}
                              {(post.isAdmin || post.authorId === process.env.NEXT_PUBLIC_ADMIN_UID) && (
                                <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black ml-1 flex items-center gap-1 uppercase tracking-tighter shadow-sm shadow-blue-500/50">
                                  Admin <Shield size={10} />
                                </span>
                              )}
                              {/* Custom Badges */}
                              {post.badges && post.badges.map((badge, idx) => (
                                <span key={idx} className="bg-purple-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold ml-1 uppercase tracking-tighter shadow-sm">
                                  {badge}
                                </span>
                              ))}
                            </span>
                            <span className="text-xs text-neutral-500">{post.timeAgo}</span>
                            {post.hot && (
                              <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded border border-orange-400/20 ml-auto sm:ml-2">
                                <Flame className="w-3 h-3" /> Trending
                              </span>
                            )}
                            {process.env.NEXT_PUBLIC_ADMIN_UID && auth?.currentUser?.uid === process.env.NEXT_PUBLIC_ADMIN_UID && (
                              <button 
                                onClick={(e) => handleDeletePost(e, post.id)}
                                className="ml-2 text-neutral-600 hover:text-red-400 transition-colors p-1"
                                title="Delete post"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                          
                          <h3 className="text-lg font-semibold text-neutral-100 group-hover:text-blue-400 transition-colors mb-2 leading-snug break-words">
                            <Link href={`/forum/post/${post.id}`} className="block line-clamp-4 hover:text-purple-300">{post.title}</Link>
                          </h3>
                          {post.content && <p className="text-neutral-300 leading-relaxed line-clamp-3 break-words whitespace-pre-wrap">{post.content}</p>}
                          
                          <div className="flex items-center gap-4 mt-4">
                            <div className="flex items-center gap-1.5 text-neutral-500 text-sm group-hover:text-neutral-400 transition-colors">
                              <MessageCircle className="w-4 h-4" />
                              <span className={`font-medium ${post.replies === 0 ? 'text-emerald-300' : ''}`}>{post.replies === 0 ? isBulletin ? "Discuss this update" : "Be the first to help" : `${post.replies} ${post.replies === 1 ? "reply" : "replies"}`}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

      {/* INTAKE MODAL (Triggered if not enrolled) */}
      <IntakeModal 
        isOpen={intakeOpen} 
        onClose={() => setIntakeOpen(false)} 
        onComplete={() => {
          setIsEnrolled(true);
          setIntakeOpen(false);
          setCurrentUserName(getCommunityName() || "LeadWise Learner");
          setIsModalOpen(true);
        }} 
      />

      {/* NEW POST MODAL */}
      <Dialog.Root open={isModalOpen} onOpenChange={open => { if (!isSubmitting) { setIsModalOpen(open); setActionError(""); } }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-neutral-900 text-white border border-neutral-800 rounded-lg w-[calc(100%-2rem)] max-w-lg max-h-[90dvh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between mb-6 border-b border-neutral-800 pb-4">
              <Dialog.Title className="text-xl font-bold text-white">{isBulletin ? "Share a community update" : "What's on your mind?"}</Dialog.Title>
              <button disabled={isSubmitting} aria-label="Close question" onClick={() => setIsModalOpen(false)} className="text-neutral-500 hover:text-white hover:bg-neutral-800 p-1.5 rounded-md transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <Dialog.Description className="sr-only">Ask a question or share your progress with other learners.</Dialog.Description>
            
            <form onSubmit={handleCreatePost} className="flex flex-col gap-5">
              {isBulletin && <div>
                <label htmlFor="newCategory" className="block text-sm font-medium text-neutral-300 mb-2">{isBulletin ? "Update type" : "Course channel"}</label>
                <select id="newCategory" name="category" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl p-3.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow appearance-none">
                  {BULLETIN_CATEGORIES.map(category => <option key={category}>{category}</option>)}
                </select>
              </div>}
              <div>
                <label htmlFor="newTitle" className="block text-sm font-medium text-neutral-300 mb-2">{isBulletin ? "Update title" : "Topic"}</label>
                <input autoFocus id="newTitle" name="title" maxLength={200} value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder={isBulletin ? "What's coming up?" : "What do Linux file permissions mean?"} className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label htmlFor="newContent" className="block text-sm font-medium text-neutral-300 mb-2">{isBulletin ? "Details" : "A little more context (optional)"}</label>
                <textarea id="newContent" required={isBulletin} value={newContent} onChange={e => setNewContent(e.target.value)} maxLength={10000} placeholder={isBulletin ? "Who is it for? Include dates, deadlines, location, and a link for more information." : "Which lesson are you on? What have you tried, and what is still unclear?"} className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg p-3 min-h-[140px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              {actionError && <p role="alert" className="text-red-300">{actionError}</p>}
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-neutral-800">
                <button type="button" disabled={isSubmitting} onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg font-medium transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting || !newTitle.trim()} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-medium transition-all active:scale-95">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {isSubmitting ? "Posting..." : "Post to the community"}
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

// --- MAIN FORUM PAGE WRAPPER ---
export default function ForumPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#090A0F] flex items-center justify-center text-white"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>}>
      <ForumPageContent />
    </Suspense>
  );
}
