"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MessageCircle, ArrowUp, Loader2, User, Clock, ShieldCheck } from 'lucide-react';
import { db, auth } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc, increment, collection, query, orderBy, serverTimestamp, runTransaction, Timestamp } from "firebase/firestore";
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

  useEffect(() => {
    if (!id || !db) return;

    // Listen to post details
    const postRef = doc(db, 'artifacts', appId, 'public', 'data', 'forumPosts', id as string);
    const unsubscribePost = onSnapshot(postRef, (docSnap) => {
      if (docSnap.exists()) {
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
          content: data.content || "No content provided."
        });
      } else {
        setPost(null);
      }
      setLoading(false);
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
    });

    return () => {
      unsubscribePost();
      unsubscribeComments();
    };
  }, [id]);

  const handleUpvote = async () => {
    if (!id || !db || upvoting) return;
    setUpvoting(true);
    try {
      const postRef = doc(db, 'artifacts', appId, 'public', 'data', 'forumPosts', id as string);
      await updateDoc(postRef, { upvotes: increment(1) });
    } catch (error) {
      console.error("Failed to upvote:", error);
    } finally {
      setUpvoting(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !id || !db || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const postRef = doc(db, 'artifacts', appId, 'public', 'data', 'forumPosts', id as string);
      const commentsRef = collection(postRef, 'comments');
      const currentUser = auth.currentUser;
      
      // Use a transaction to atomically add comment and increment reply count
      await runTransaction(db, async (transaction) => {
        const commentDocRef = doc(commentsRef);
        transaction.set(commentDocRef, {
          author: currentUser?.displayName || "LeadWise Student",
          authorId: currentUser?.uid,
          content: newComment,
          createdAt: serverTimestamp()
        });
        
        transaction.update(postRef, { 
          replies: increment(1) 
        });
      });

      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090A0F] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#090A0F] flex flex-col items-center justify-center text-white p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Post not found</h2>
        <p className="text-neutral-400 mb-8">The discussion you are looking for may have been removed or doesn't exist.</p>
        <button onClick={() => router.push('/forum')} className="bg-blue-600 px-6 py-2 rounded-full font-medium">
          Back to Forum
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090A0F] text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <button 
          onClick={() => router.push('/forum')}
          className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Discussions
        </button>

        {/* Post Content */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 mb-10 shadow-2xl">
          <div className="flex items-start gap-6">
            <div className="flex flex-col items-center gap-2">
              <button 
                onClick={handleUpvote}
                disabled={upvoting}
                className="text-neutral-500 hover:text-emerald-400 transition-colors p-2 rounded-xl hover:bg-emerald-400/10 active:scale-90 disabled:opacity-50"
              >
                <ArrowUp className="w-6 h-6" />
              </button>
              <span className="font-bold text-lg text-neutral-200">{post.upvotes}</span>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20">
                  {post.category}
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

              <h1 className="text-3xl font-bold mb-6 leading-tight">{post.title}</h1>
              
              <div className="text-neutral-300 leading-relaxed text-lg whitespace-pre-wrap">
                {post.content}
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
            <MessageCircle className="w-5 h-5 text-blue-400" />
            {comments.length} Comments
          </h3>

          {/* Comment Form */}
          <form onSubmit={handleAddComment} className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 mb-10">
            <textarea 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="What are your thoughts?"
              className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl p-4 min-h-[120px] focus:outline-none focus:border-blue-500 transition-all resize-none mb-4"
              required
            />
            <div className="flex justify-end">
              <button 
                type="submit" 
                disabled={isSubmitting || !newComment.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Post Comment
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
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
                  <p className="text-neutral-300 text-sm leading-relaxed">
                    {comment.content}
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
