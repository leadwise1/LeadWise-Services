"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { Search, PlusCircle, Flame, Clock, MessageCircle, ArrowUp, Loader2, X, Lock, Filter, Trash2, Shield, Zap } from 'lucide-react';
import { db, auth } from "@/lib/firebase";
import { signInAnonymously } from "firebase/auth";
import { collection, addDoc, serverTimestamp, onSnapshot, doc, updateDoc, increment, query, orderBy, setDoc, deleteDoc, where } from "firebase/firestore";
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Define a constant for the collection path to ensure consistency across the forum
const appId = "leadwise-web";
const FORUM_COLLECTION_PATH = ['artifacts', 'leadwise-web', 'public', 'data', 'forumPosts'] as const;

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
}

// --- INTAKE FORM COMPONENT (Gated Access) ---
function IntakeModal({ 
  isOpen, 
  onClose, 
  onComplete, 
  targetResource 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onComplete: () => void;
  targetResource: string;
}) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    zipCode: "",
    householdIncome: "",
    householdSize: "",
    employmentStatus: "",
    consent: false
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Intake form submission started...");
    e.preventDefault();
    setLoading(true);

    try {
      let uid = `demo-${Date.now()}`;
      
      if (auth) {
        if (!auth.currentUser) await signInAnonymously(auth);
        if (auth.currentUser) uid = auth.currentUser.uid;
      }

      const intakeRecord = {
        ...formData,
        participantId: uid,
        enrolledAt: new Date().toISOString(),
        targetCourse: targetResource,
        status: "Enrolled",
        lmiVerified: true, 
      };

      // 1. Save locally FIRST to bypass gate immediately
      localStorage.setItem("leadwise_intake", JSON.stringify(intakeRecord));

      // 2. Attempt Cloud Save Safely
      if (db && auth?.currentUser) {
        try {
          // merge: true ensures it doesn't fail if the document already exists
          await setDoc(doc(db, "artifacts", appId, "users", uid, "profile", "intake"), intakeRecord, { merge: true });
        } catch (dbError: any) {
          console.warn("Firestore save skipped. Rules may be blocking updates, but student is allowed in.", dbError.message);
        }
      } 

      // 3. Unlock the UI!
      onComplete();
    } catch (error) {
      console.error("Intake failed:", error);
      alert("Error saving intake. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-blue-600 p-6 text-white">
          <h2 className="text-xl font-bold">Community Access</h2>
          <p className="text-sm opacity-90">Step {step} of 3: {step === 1 ? 'Contact Info' : step === 2 ? 'Eligibility' : 'Consent'}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-gray-900">
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input id="firstName" name="firstName" required className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input id="lastName" name="lastName" required className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input id="email" name="email" type="email" required className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                <input id="zipCode" name="zipCode" required maxLength={5} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 75001" value={formData.zipCode} onChange={(e) => setFormData({...formData, zipCode: e.target.value})} />
                <p className="text-xs text-gray-500 mt-1">Used for LMI census tract verification.</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 mb-4 border border-blue-100">
                This information is required for our grant funding and allows us to keep this forum and weekly syncs <strong>100% free</strong>.
              </div>
              <div>
                <label htmlFor="householdIncome" className="block text-sm font-medium text-gray-700 mb-1">Annual Household Income</label>
                <select id="householdIncome" name="householdIncome" required className="w-full p-2 border border-gray-300 rounded-md" value={formData.householdIncome} onChange={(e) => setFormData({...formData, householdIncome: e.target.value})}>
                  <option value="">Select Range...</option>
                  <option value="0-25k">$0 - $25,000</option>
                  <option value="25-50k">$25,001 - $50,000</option>
                  <option value="50-75k">$50,001 - $75,000</option>
                  <option value="75k+">$75,001+</option>
                </select>
              </div>
              <div>
                <label htmlFor="householdSize" className="block text-sm font-medium text-gray-700 mb-1">Household Size</label>
                <select id="householdSize" name="householdSize" required className="w-full p-2 border border-gray-300 rounded-md" value={formData.householdSize} onChange={(e) => setFormData({...formData, householdSize: e.target.value})}>
                  <option value="">Select Size...</option>
                  <option value="1">1 Person</option>
                  <option value="2">2 People</option>
                  <option value="3">3 People</option>
                  <option value="4+">4+ People</option>
                </select>
              </div>
              <div>
                <label htmlFor="employmentStatus" className="block text-sm font-medium text-gray-700 mb-1">Employment Status</label>
                <select id="employmentStatus" name="employmentStatus" required className="w-full p-2 border border-gray-300 rounded-md" value={formData.employmentStatus} onChange={(e) => setFormData({...formData, employmentStatus: e.target.value})}>
                  <option value="">Select Status...</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="part-time">Part-Time</option>
                  <option value="full-time">Full-Time</option>
                  <option value="student">Student</option>
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
               <div className="border p-4 rounded-lg bg-gray-50 text-sm space-y-2">
                 <h3 className="font-bold text-gray-900">Community Agreement</h3>
                 <p>By clicking "Submit", I certify that the information provided is true. I understand LeadWise Foundation will use this data in aggregate form for grant reporting.</p>
                 <p>I agree to follow the community guidelines and participate respectfully in the forum.</p>
               </div>
               <label htmlFor="consent" className="flex items-start gap-3 p-2 cursor-pointer hover:bg-gray-100 rounded-md">
                 <input id="consent" name="consent" type="checkbox" required className="mt-1" checked={formData.consent} onChange={(e) => setFormData({...formData, consent: e.target.checked})} />
                 <span className="text-sm font-medium text-gray-700">I Agree to the terms.</span>
               </label>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t mt-4">
            {step > 1 ? (
              <button type="button" onClick={() => setStep(step - 1)} className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium">Back</button>
            ) : (
              <button type="button" onClick={onClose} className="px-4 py-2 text-gray-500 hover:text-gray-700">Cancel</button>
            )}

            {step < 3 ? (
              <button type="button" onClick={() => {
                  if (step === 1 && (!formData.firstName || !formData.email || !formData.zipCode)) return alert("Please fill in all fields");
                  if (step === 2 && (!formData.householdIncome || !formData.employmentStatus)) return alert("Please verify eligibility");
                  setStep(step + 1);
                }} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">Next Step</button>
            ) : (
              <button type="submit" disabled={loading} className="bg-emerald-500 text-white px-8 py-2 rounded-lg font-bold hover:bg-emerald-600 disabled:opacity-50">
                {loading ? "Unlocking..." : "Unlock Community"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

// --- MAIN FORUM PAGE CONTENT ---
function ForumPageContent() {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category');
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"Trending" | "Recent">("Trending");
  const [currentUserName, setCurrentUserName] = useState("Anonymous Student");
  
  // Gating State
  const [isEnrolled, setIsEnrolled] = useState<boolean | null>(null);
  const [intakeOpen, setIntakeOpen] = useState(false);
  
  // New Post Form State
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("General Discussion");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [upvotingIds, setUpvotingIds] = useState<Set<string>>(new Set());

  // --- CHECK ENROLLMENT & GET NAME ---
  useEffect(() => {
    try {
      const intakeData = localStorage.getItem("leadwise_intake");
      if (intakeData) {
        setIsEnrolled(true);
        const parsed = JSON.parse(intakeData);
        if (parsed.firstName && parsed.lastName) {
          setCurrentUserName(`${parsed.firstName} ${parsed.lastName.charAt(0)}.`);
        }
      } else {
        setIsEnrolled(false);
      }
    } catch (e) {
      setIsEnrolled(false);
    }
  }, []);

  // --- REAL-TIME DATA SYNC ---
  useEffect(() => {
    if (!db || isEnrolled === false) return; // Only fetch if enrolled or loading

    const postsRef = collection(db, ...FORUM_COLLECTION_PATH);
    
    // 1. DYNAMIC CHANNEL FILTERING: Connects the sidebar tabs to the feed
    let q;
    if (categoryFilter) {
      q = query(
        postsRef, 
        where("category", "==", categoryFilter),
        orderBy(activeFilter === "Trending" ? "upvotes" : "createdAt", "desc")
      );
    } else {
      q = query(postsRef, orderBy(activeFilter === "Trending" ? "upvotes" : "createdAt", "desc"));
    }

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
          createdAt: data.createdAt
        });
      });
      setPosts(fetchedPosts);
      setLoading(false);
    }, (error) => {
      // More detailed error logging to catch the "Missing Index" link
      if (error.code === 'failed-precondition') {
        console.error("Firestore Index Required: Check the following URL to create it:", error.message);
      } else {
        console.error("Live feed error:", error.code, error.message);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [activeFilter, isEnrolled, categoryFilter]);

  const handleUpvote = async (e: React.MouseEvent, postId: string) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    if (!db || upvotingIds.has(postId)) return;

    setUpvotingIds(prev => new Set(prev).add(postId));

    try {
      const postRef = doc(db, ...FORUM_COLLECTION_PATH, postId);
      await updateDoc(postRef, { upvotes: increment(1) });
    } catch (error) {
      console.error("Failed to upvote:", error);
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
    if (!newTitle.trim() || !db) return;
    
    setIsSubmitting(true);
    try {
      const postsRef = collection(db, ...FORUM_COLLECTION_PATH);
      const currentAuthorId = auth?.currentUser?.uid || "anonymous";
      await addDoc(postsRef, {
        title: newTitle,
        category: newCategory,
        author: currentUserName, 
        authorId: currentAuthorId, // Attach channel tag and author UID
        replies: 0,
        upvotes: 0,
        createdAt: serverTimestamp(),
      });
      
      setNewTitle("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create post:", error);
      alert("Failed to post. Check your Firebase Security Rules for public writes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayedPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || post.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Show a blank screen briefly while checking enrollment status to prevent flash
  if (isEnrolled === null) return <div className="min-h-screen bg-[#090A0F]"></div>;

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto relative bg-[#090A0F] min-h-screen text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Discussions</h2>
          <p className="text-neutral-400">Connect, ask questions, and share your progress.</p>
        </div>
        <button 
          onClick={() => isEnrolled ? setIsModalOpen(true) : setIntakeOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-lg shadow-blue-500/20 active:scale-95"
        >
          <PlusCircle className="w-5 h-5" />
          New Post
        </button>
      </div>

      {/* Category Indicator (if active) */}
      {categoryFilter && (
        <div className="flex items-center justify-between bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-8 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">Filtered by Category</p>
              <p className="text-lg font-bold text-white">{categoryFilter}</p>
            </div>
          </div>
          <Link href="/forum" className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <X className="w-4 h-4" /> Clear Filter
          </Link>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <button 
            onClick={() => setActiveFilter("Trending")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === "Trending" ? "bg-neutral-800 text-white shadow-inner" : "bg-transparent text-neutral-400 hover:bg-neutral-800 hover:text-white"}`}
          >
            <Flame className={`w-4 h-4 ${activeFilter === "Trending" ? "text-orange-400" : ""}`} /> Trending
          </button>
          <button 
            onClick={() => setActiveFilter("Recent")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === "Recent" ? "bg-neutral-800 text-white shadow-inner" : "bg-transparent text-neutral-400 hover:bg-neutral-800 hover:text-white"}`}
          >
            <Clock className={`w-4 h-4 ${activeFilter === "Recent" ? "text-blue-400" : ""}`} /> Recent
          </button>
        </div>
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            id="forum-search"
            name="forum-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search discussions..." 
            className="w-full bg-neutral-900 border border-neutral-800 text-white text-sm rounded-full pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-neutral-600"
          />
        </div>
      </div>

      {/* 3. ACCOUNTABILITY SYNC BANNER: Urgent anchor to prevent dropouts */}
      {isEnrolled && (
        <div className="bg-gradient-to-r from-blue-600/20 to-emerald-600/20 border border-blue-500/30 rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-500/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-white mb-1">💡 Stuck on a lab module?</h4>
              <p className="text-sm text-neutral-300 font-medium">Don't struggle alone. Grab your weekly 15-minute sync with your mentor to clear any roadblocks!</p>
            </div>
          </div>
          <a 
            href="https://calendar.google.com/calendar/appointments/schedules" 
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap bg-white text-blue-600 px-6 py-2.5 rounded-xl font-black hover:bg-[#FFBEA0] transition-all hover:scale-105 shadow-lg shadow-black/20"
          >
            👉 Book Check-in Room
          </a>
        </div>
      )}

      {/* Post Feed / GATED VIEW */}
      {!isEnrolled ? (
        <div className="relative border border-neutral-800 rounded-2xl overflow-hidden min-h-[400px]">
           {/* Fake Blurred Background */}
           <div className="absolute inset-0 blur-md opacity-30 pointer-events-none select-none flex flex-col gap-4 p-5">
               <div className="h-28 bg-neutral-800 rounded-xl w-full"></div>
               <div className="h-28 bg-neutral-800 rounded-xl w-full"></div>
               <div className="h-28 bg-neutral-800 rounded-xl w-full"></div>
           </div>
           
           {/* Overlay Content */}
           <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10 bg-black/60">
              <div className="bg-blue-600/20 p-4 rounded-full mb-5 border border-blue-500/30">
                <Lock className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Community Locked</h3>
              <p className="text-neutral-300 max-w-md mb-8">
                Complete your brief grant compliance intake form to unlock the Cybersecurity discussion board, live events, and the leaderboard.
              </p>
              <button 
                onClick={() => setIntakeOpen(true)} 
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-lg shadow-emerald-500/20 hover:-translate-y-1"
              >
                Unlock Access Now
              </button>
           </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-500 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="animate-pulse">Syncing live discussions...</p>
            </div>
          ) : displayedPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-500 border border-dashed border-neutral-800 bg-neutral-900/20 rounded-2xl p-8 text-center transition-all hover:bg-neutral-900/50">
              <MessageCircle className="w-12 h-12 text-neutral-700 mb-4" />
              <p className="text-lg text-white mb-2 font-medium">It's quiet in here...</p>
              <p className="text-sm text-neutral-400 mb-6">Be the first to start a conversation or ask a question!</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="text-blue-400 font-medium hover:text-blue-300 transition-colors"
              >
                + Start a discussion
              </button>
            </div>
          ) : (
            displayedPosts.map((post) => (
              <Link href={`/forum/post/${post.id}`} key={post.id} className="block group">
                <div className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 p-5 rounded-2xl transition-all hover:shadow-lg hover:shadow-black/50 hover:-translate-y-0.5 cursor-pointer">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-1 min-w-[40px]">
                      <button 
                        onClick={(e) => handleUpvote(e, post.id)}
                        disabled={upvotingIds.has(post.id)}
                        className="text-neutral-500 hover:text-emerald-400 transition-colors p-1.5 rounded-lg hover:bg-emerald-400/10 active:scale-90 disabled:opacity-50"
                        title="Upvote this post"
                      >
                        <ArrowUp className="w-5 h-5" />
                      </button>
                      <span className={`font-semibold text-sm transition-colors ${post.hot ? 'text-orange-400' : 'text-neutral-300'}`}>
                        {post.upvotes}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-neutral-800/80 border border-neutral-700/50 text-neutral-300">
                          {post.category}
                        </span>
                        <span className="text-xs text-neutral-500">•</span>
                        <span className="text-xs text-neutral-400 font-medium flex items-center gap-1">
                          Posted by {post.author}
                          {/* 2. ADMIN SHIELD BADGE: Stylized visual confirmation for students */}
                          {post.authorId === process.env.NEXT_PUBLIC_ADMIN_UID && (
                            <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black ml-1 flex items-center gap-1 uppercase tracking-tighter shadow-sm shadow-blue-500/50">
                              Admin <Shield size={10} />
                            </span>
                          )}
                        </span>
                        <span className="text-xs text-neutral-500">{post.timeAgo}</span>
                        {post.hot && (
                          <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded border border-orange-400/20 ml-auto sm:ml-2">
                            <Flame className="w-3 h-3" /> Trending
                          </span>
                        )}
                        {auth?.currentUser?.uid === process.env.NEXT_PUBLIC_ADMIN_UID && (
                          <button 
                            onClick={(e) => handleDeletePost(e, post.id)}
                            className="ml-2 text-neutral-600 hover:text-red-400 transition-colors p-1"
                            title="Delete post"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-semibold text-neutral-100 group-hover:text-blue-400 transition-colors mb-2 leading-snug">
                        {post.title}
                      </h3>
                      
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-1.5 text-neutral-500 text-sm group-hover:text-neutral-400 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span className="font-medium">{post.replies} Replies</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      {/* INTAKE MODAL (Triggered if not enrolled) */}
      <IntakeModal 
        isOpen={intakeOpen} 
        onClose={() => setIntakeOpen(false)} 
        onComplete={() => {
          setIsEnrolled(true);
          const intakeData = localStorage.getItem("leadwise_intake");
          if (intakeData) {
             const parsed = JSON.parse(intakeData);
             setCurrentUserName(`${parsed.firstName} ${parsed.lastName.charAt(0)}.`);
          }
        }} 
        targetResource="Cybersecurity Forum" 
      />

      {/* NEW POST MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6 border-b border-neutral-800 pb-4">
              <h3 className="text-xl font-bold text-white">Start a Discussion</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-500 hover:text-white hover:bg-neutral-800 p-1.5 rounded-md transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreatePost} className="flex flex-col gap-5">
              <div>
                <label htmlFor="newCategory" className="block text-sm font-medium text-neutral-300 mb-2">Course Channel</label>
                <select id="newCategory" name="category" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl p-3.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow appearance-none">
                  <option value="General Discussion">General Discussion</option>
                  <option value="Foundations of Cybersecurity">Foundations of Cybersecurity</option>
                  <option value="Networks and Network Security">Networks and Network Security</option>
                  <option value="Automate Cybersecurity Tasks with Python">Automate Cybersecurity Tasks with Python</option>
                  <option value="Tools of the Trade: Linux and SQL">Tools of the Trade: Linux and SQL</option>
                </select>
              </div>
              <div>
                <label htmlFor="newTitle" className="block text-sm font-medium text-neutral-300 mb-2">Your Question or Topic</label>
                <textarea id="newTitle" name="title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g., Stuck on Week 3 Linux Permissions Lab - Help?" className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl p-4 min-h-[140px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none transition-shadow placeholder:text-neutral-600" required />
              </div>
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-neutral-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg font-medium transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting || !newTitle.trim()} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-medium transition-all active:scale-95">
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

// --- MAIN FORUM PAGE WRAPPER ---
export default function ForumPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#090A0F] flex items-center justify-center text-white"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>}>
      <ForumPageContent />
    </Suspense>
  );
}
