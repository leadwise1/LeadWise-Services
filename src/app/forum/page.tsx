"use client";

import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, Flame, Clock, MessageCircle, ArrowUp, Loader2, X } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  author: string;
  category: string;
  replies: number;
  upvotes: number;
  timeAgo: string;
  hot: boolean;
}

export default function ForumPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Post Form State
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("General Discussion");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/forum/posts');
      const data = await res.json();
      if (data.success) {
        setPosts(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/forum/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          category: newCategory,
          author: "Sarah Jenkins" // Mocking the logged-in user for now
        })
      });
      
      if (res.ok) {
        setNewTitle("");
        setIsModalOpen(false);
        // Refresh the feed
        fetchPosts();
      }
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Discussions</h2>
          <p className="text-neutral-400">Connect, ask questions, and share your progress.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-lg shadow-blue-500/20"
        >
          <PlusCircle className="w-5 h-5" />
          New Post
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <button className="flex items-center gap-2 px-4 py-2 bg-neutral-800 text-white rounded-full text-sm font-medium whitespace-nowrap">
            <Flame className="w-4 h-4 text-orange-400" /> Trending
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-transparent text-neutral-400 hover:bg-neutral-800 hover:text-white rounded-full text-sm font-medium transition-colors whitespace-nowrap">
            <Clock className="w-4 h-4" /> Recent
          </button>
        </div>
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input 
            type="text" 
            placeholder="Search discussions..." 
            className="w-full bg-neutral-900 border border-neutral-800 text-white text-sm rounded-full pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Post Feed */}
      <div className="flex flex-col gap-4 min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-neutral-500 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p>Loading discussions...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-neutral-500 border border-dashed border-neutral-800 rounded-2xl">
            <MessageCircle className="w-12 h-12 text-neutral-800 mb-4" />
            <p>No posts yet. Be the first to start a discussion!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="group bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 p-5 rounded-2xl transition-all cursor-pointer shadow-sm">
              <div className="flex gap-4">
                {/* Upvote Column */}
                <div className="flex flex-col items-center gap-1 min-w-[40px]">
                  <button className="text-neutral-500 hover:text-emerald-400 transition-colors p-1 rounded-md hover:bg-emerald-400/10">
                    <ArrowUp className="w-5 h-5" />
                  </button>
                  <span className={`font-semibold text-sm ${post.hot ? 'text-orange-400' : 'text-neutral-300'}`}>
                    {post.upvotes}
                  </span>
                </div>
                
                {/* Content Column */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300">
                      {post.category}
                    </span>
                    <span className="text-xs text-neutral-500">•</span>
                    <span className="text-xs text-neutral-500">Posted by {post.author}</span>
                    <span className="text-xs text-neutral-500">{post.timeAgo}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-neutral-100 group-hover:text-blue-400 transition-colors mb-2">
                    {post.title}
                  </h3>
                  
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5 text-neutral-400 text-sm">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.replies} Replies</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Post Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg shadow-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Start a Discussion</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreatePost} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Course Channel</label>
                <select 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="General Discussion">General Discussion</option>
                  <option value="Foundations of Cybersecurity">Foundations of Cybersecurity</option>
                  <option value="Networks and Network Security">Networks and Network Security</option>
                  <option value="Tools of the Trade: Linux and SQL">Tools of the Trade: Linux and SQL</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Your Question or Topic</label>
                <textarea 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Stuck on Week 3 Linux Permissions Lab - Help?"
                  className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg p-3 min-h-[120px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-neutral-400 hover:text-white font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Post Discussion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
