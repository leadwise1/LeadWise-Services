"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MessageCircle, ArrowUp, Loader2, User, Clock, ShieldCheck } from 'lucide-react';
import { db, auth } from "@/lib/firebase";
import PostText from '../../post-text';
import { getCommunityName } from '../../community-profile';
import { saveCommunityUpdate } from '../../community-api';
import { doc, onSnapshot, collection, query, orderBy, Timestamp } from "firebase/firestore";
import Link from 'next/link';

const appId = "leadwise-web";
const ADMIN_UID = process.env.NEXT_PUBLIC_ADMIN_UID;

interface Comment {
  id: string;
  author: string;
  authorId?: string;
  content: string;
  createdAt: Timestamp | null;
}

interface Post {
  id: string;
  title: string;
  author: string;
  authorId?: string;
  category: string;
  replies: number;
  upvotes: number;
  createdAt: Timestamp | null;
  content?: string;
}

export default function PostDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [upvoting, setUpvoting] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [commentError, setCommentError] = useState("");
  const [actionError, setActionError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [replyName, setReplyName] = useState("");

  useEffect(() => { setReplyName(getCommunityName() || ""); }, []);

  useEffect(() => {
    if (!id || !db) {
      setLoadError("This discussion couldn't load. Please try again shortly.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError("");
    setCommentError("");

    // Listen to post details
    const postRef = doc(db, 'artifacts', appId, 'public', 'data', 'forumPosts', id as string);
    let cancelled = false;
    let poll: ReturnType<typeof setInterval> | undefined;
    const loadFromServer = async () => {
      try {
        const response = await fetch(`/api/forum/posts/${id}`, { cache: 'no-store' });
        if (cancelled) return;
        if (response.status === 404) { setPost(null); setLoading(false); return; }
        if (!response.ok) throw new Error('Discussion unavailable');
        const result = await response.json();
        if (cancelled) return;
        setPost({ ...result.post, createdAt: result.post.createdAtMillis ? Timestamp.fromMillis(result.post.createdAtMillis) : null });
        setComments(result.comments.map((comment: Comment & { createdAtMillis: number | null }) => ({ ...comment, createdAt: comment.createdAtMillis ? Timestamp.fromMillis(comment.createdAtMillis) : null })));
        setLoadError("");
        setCommentError("");
      } catch {
        if (!cancelled) setLoadError("This discussion couldn't load. Please try again shortly.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    const startFallback = () => {
      if (poll) return;
      void loadFromServer();
      poll = setInterval(() => { if (!document.hidden) void loadFromServer(); }, 30000);
    };
    const unsubscribePost = onSnapshot(postRef, (docSnap) => {
      if (docSnap.exists() && !docSnap.data()?.deleted) {
        const data = docSnap.data();
        setPost({
          id: docSnap.id,
          title: data.title,
          author: data.author,
          authorId: data.authorId,
          category: data.category,
          replies: data.replies || 0,
          upvotes: data.upvotes || 0,
          createdAt: data.createdAt,
          content: data.content || ""
        });
      } else {
        setPost(null);
      }
      setLoading(false);
    }, () => {
      startFallback();
    });

    // Listen to comments
    const commentsRef = collection(db, 'artifacts', appId, 'public', 'data', 'forumPosts', id as string, 'comments');
    const q = query(commentsRef, orderBy("createdAt", "asc"));
    const unsubscribeComments = onSnapshot(q, (snapshot) => {
      const fetchedComments: Comment[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        fetchedComments.push({
          id: doc.id,
          author: data.author || "Anonymous",
          authorId: data.authorId,
          content: data.content || "",
          createdAt: data.createdAt
        });
      });
      setComments(fetchedComments);
    }, startFallback);

    return () => {
      cancelled = true;
      if (poll) clearInterval(poll);
      unsubscribePost();
      unsubscribeComments();
    };
  }, [id, retryCount]);

  const handleUpvote = async () => {
    if (!id || !db || upvoting) return;
    setUpvoting(true);
    setActionError("");
    try {
      await saveCommunityUpdate(`/api/forum/posts/${id}`, { action: 'upvote' });
      setRetryCount(count => count + 1);
    } catch (error) {
      console.error("Failed to upvote:", error);
      setActionError("Your upvote didn't save. Please try again.");
    } finally {
      setUpvoting(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !replyName.trim() || !id || !db || isSubmitting) return;

    setIsSubmitting(true);
    setActionError("");
    try {
      const authorName = replyName.trim();
      await saveCommunityUpdate(`/api/forum/posts/${id}`, { author: authorName, content: newComment.trim() });

      setNewComment("");
      setRetryCount(count => count + 1);
    } catch (error) {
      console.error("Failed to add comment:", error);
      setActionError("Your reply couldn't be saved. Your text is still here; please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#17191d] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (loadError) {
    return <div role="alert" className="p-8 text-center">
      <p className="mb-4 text-neutral-300">{loadError}</p>
      <button onClick={() => setRetryCount(count => count + 1)} className="bg-blue-600 rounded-lg px-4 py-2">Try again</button>
      <Link href="/forum/discussions" className="block mt-4 text-blue-300">Back to open forum</Link>
    </div>;
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#17191d] flex flex-col items-center justify-center text-white p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Post not found</h2>
        <p className="text-neutral-400 mb-8">The discussion you are looking for may have been removed or doesn't exist.</p>
        <button onClick={() => router.push('/forum/discussions')} className="bg-blue-600 px-6 py-2 rounded-full font-medium">
          Back to Forum
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#17191d] text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <button
          onClick={() => router.push('/forum/discussions')}
          className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Discussions
        </button>

        {/* Post Content */}
        <article className="border-b border-neutral-800 pb-8 mb-8">
          <div className="flex items-start gap-3 sm:gap-6">
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={handleUpvote}
                aria-label="Upvote this post"
                disabled={upvoting}
                className="text-neutral-500 hover:text-blue-400 transition-colors p-2 rounded-xl hover:bg-blue-400/10 active:scale-90 disabled:opacity-50"
              >
                <ArrowUp className="w-6 h-6" />
              </button>
              <span className="font-bold text-lg text-neutral-200">{post.upvotes}</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20">
                  {['Announcements', 'Opportunities', 'Workshops', 'Networking'].includes(post.category) ? post.category : 'Open forum'}
                </span>
                <span className="text-xs text-neutral-500">•</span>
                <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                  {post.authorId === ADMIN_UID ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  ) : (
                    <User className="w-3.5 h-3.5" />
                  )}
                  <span className={post.authorId === ADMIN_UID ? "text-blue-400 font-bold" : ""}>{post.author}</span>
                </div>
                <span className="text-xs text-neutral-500">•</span>
                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <Clock className="w-3.5 h-3.5" />
                  {post.createdAt ? new Date(post.createdAt.toMillis()).toLocaleDateString() : "Just now"}
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold mb-6 leading-tight break-words">{post.title}</h1>

              {post.content && <div className="text-neutral-300 leading-relaxed text-lg whitespace-pre-wrap break-words"><PostText text={post.content} /></div>}
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
            <MessageCircle className="w-5 h-5 text-blue-400" />
            {comments.length} {comments.length === 1 ? 'reply' : 'replies'}
          </h3>

          {/* Comment Form */}
          <form onSubmit={handleAddComment} className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 mb-10">
            <label htmlFor="reply-name" className="block mb-2 text-sm text-neutral-300">Name shown on your reply</label>
            <input id="reply-name" required maxLength={60} value={replyName} onChange={e => setReplyName(e.target.value)} className="mb-4 w-full rounded-lg border border-neutral-800 bg-neutral-950 p-3 text-white" />
            <label htmlFor="community-reply" className="block mb-3 text-neutral-300">Share a reply</label>
            <textarea
              id="community-reply"
              maxLength={10000}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share an explanation, an experience, or a little encouragement."
              className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl p-4 min-h-[120px] focus:outline-none focus:border-blue-500 transition-all resize-none mb-4"
              required
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !newComment.trim() || !replyName.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? 'Posting...' : 'Post reply'}
              </button>
            </div>
            {actionError && <p role="alert" className="text-red-300 mt-4">{actionError}</p>}
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {commentError ? <div role="alert" className="text-center py-6"><p className="text-neutral-300">{commentError}</p><button onClick={() => setRetryCount(count => count + 1)} className="mt-3 text-blue-300">Try again</button></div> : comments.length === 0 ? (
              <div className="text-center py-10 text-neutral-500 border border-dashed border-neutral-800 rounded-2xl">
                No comments yet. Be the first to reply!
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="bg-neutral-900/30 border border-neutral-800/50 rounded-2xl p-6 transition-colors hover:bg-neutral-900/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-800 flex items-center justify-center text-[10px] font-bold">
                      {comment.authorId === ADMIN_UID ? <ShieldCheck className="w-4 h-4 text-blue-400" /> : comment.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className={`text-sm font-bold ${comment.authorId === ADMIN_UID ? "text-blue-400" : "text-white"}`}>
                      {comment.author}
                      {comment.authorId === ADMIN_UID && " (Admin)"}
                    </span>
                    <span className="text-xs text-neutral-600">
                      {comment.createdAt ? new Date(comment.createdAt.toMillis()).toLocaleDateString() : "Just now"}
                    </span>
                  </div>
                  <p className="text-neutral-300 leading-relaxed whitespace-pre-wrap break-words">
                    <PostText text={comment.content} />
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
