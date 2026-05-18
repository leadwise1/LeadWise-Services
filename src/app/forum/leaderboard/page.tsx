"use client";
import React, { useState, useEffect } from 'react';
import { Trophy, Star, Loader2, TrendingUp, Crown, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from "../../../lib/utils";

interface Learner {
  id: string;
  name: string;
  points: number;
  coursesCompleted: number;
  totalCourses?: number;
  estimatedHours?: number;
}

const PodiumItem = ({ user, rank, delay }: { user: Learner; rank: number; delay: number }) => {
  const isFirst = rank === 1;
  const isSecond = rank === 2;
  const isThird = rank === 3;

  const rankConfig = {
    1: { color: "text-yellow-400", border: "border-yellow-500/50", bg: "from-yellow-500/20 to-transparent", height: "h-64 md:h-80", scale: 1.1 },
    2: { color: "text-slate-300", border: "border-slate-400/50", bg: "from-slate-400/10 to-transparent", height: "h-48 md:h-64", scale: 1.0 },
    3: { color: "text-amber-600", border: "border-amber-700/50", bg: "from-amber-700/10 to-transparent", height: "h-36 md:h-48", scale: 0.95 },
  }[rank as 1 | 2 | 3];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className={cn(
        "relative flex flex-col items-center justify-end group",
        isFirst ? "order-2 z-20" : isSecond ? "order-1 z-10" : "order-3 z-10"
      )}
    >
      {/* Avatar Section */}
      <motion.div 
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: delay + 0.5 }}
        className="relative mb-4"
      >
        {isFirst && (
          <>
            <motion.div
              initial={{ rotate: -10, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: delay + 0.5, type: "spring" }}
              className="absolute -top-8 left-1/2 -translate-x-1/2 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)] z-30"
            >
              <Crown size={32} fill="currentColor" />
            </motion.div>
            {/* Sparkles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  scale: [0, 1, 0],
                  x: (i % 2 === 0 ? 1 : -1) * (Math.random() * 40 + 20),
                  y: -(Math.random() * 40 + 20)
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  delay: delay + 1 + (i * 0.2),
                  ease: "easeOut"
                }}
                className="absolute top-0 left-1/2 w-1 h-1 bg-yellow-400 rounded-full"
              />
            ))}
          </>
        )}
        <div className={cn(
          "w-16 h-16 md:w-24 md:h-24 rounded-full border-4 flex items-center justify-center text-2xl md:text-4xl font-bold bg-neutral-800 shadow-2xl relative overflow-hidden",
          rankConfig.border
        )}>
           <div className={cn("absolute inset-0 opacity-20 bg-gradient-to-b", rankConfig.bg)} />
           <span className="relative z-10 text-white">
             {user.name?.split(' ').map(n => n[0]).join('') || "U"}
           </span>
        </div>
        <div className={cn(
          "absolute -bottom-2 -right-1 w-8 h-8 md:w-10 md:h-10 rounded-full bg-neutral-900 border-2 flex items-center justify-center font-black shadow-xl",
          rankConfig.border,
          rankConfig.color
        )}>
          {rank}
        </div>
      </motion.div>

      {/* Info Card */}
      <div className="text-center mb-4 px-2">
        <h4 className="font-bold text-white text-sm md:text-lg truncate max-w-[120px] md:max-w-[180px] mb-1">
          {user.name}
        </h4>
        <div className="flex items-center justify-center gap-1">
          <span className={cn("text-xs md:text-sm font-bold", rankConfig.color)}>
            {user.points.toLocaleString()}
          </span>
          <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-tighter">XP</span>
        </div>
      </div>

      {/* The Pedestal */}
      <div
        className={cn(
          "w-24 md:w-40 bg-gradient-to-b border-t-2 rounded-t-2xl shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.5)] flex flex-col items-center pt-4",
          rankConfig.bg.replace('from-', 'from-').replace('to-transparent', 'to-neutral-900/40'),
          rankConfig.border,
          rankConfig.height
        )}
      >
        <Star className={cn("w-6 h-6 mb-2 opacity-50", rankConfig.color)} />
        <span className="text-[10px] md:text-xs text-neutral-500 font-bold uppercase tracking-widest">
          {user.coursesCompleted} Courses
        </span>
        {user.estimatedHours ? (
          <span className="text-[9px] text-blue-400/80 font-bold uppercase tracking-tighter mt-1">
            {Math.round(user.estimatedHours)} Hours Invested
          </span>
        ) : null}
      </div>
    </motion.div>
  );
};

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<Learner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    let isMounted = true;

    async function fetchLeaderboard() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/forum/leaderboard', { cache: 'no-store' });
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          if (isMounted) {
            setError(payload.error || 'Unable to load Coursera learner data.');
            setLeaderboard([]);
          }
          return;
        }

        if (isMounted) {
          setLeaderboard(payload.data || []);
        }
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unable to load Coursera learner data.');
          setLeaderboard([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchLeaderboard();
    const interval = window.setInterval(fetchLeaderboard, 15 * 60 * 1000);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, []);

  const topThree = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  return (
    <div className="min-h-screen bg-[#090A0F] text-white selection:bg-[#FFBEA0] selection:text-[#1B2735]">
      {/* Navigation */}
      <div className="border-b border-white/5 bg-black/20 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex gap-8">
            <Link 
              href="/forum/leaderboard"
              className={`py-4 text-sm font-bold transition-colors border-b-2 ${pathname === '/forum/leaderboard' ? 'border-[#FFBEA0] text-[#FFBEA0]' : 'border-transparent text-gray-500 hover:text-white'}`}
            >
              Leaderboard
            </Link>
            <Link 
              href="/forum/events"
              className={`py-4 text-sm font-bold transition-colors border-b-2 ${pathname === '/forum/events' ? 'border-[#FFBEA0] text-[#FFBEA0]' : 'border-transparent text-gray-500 hover:text-white'}`}
            >
              Weekly Sync
            </Link>
          </div>
        </div>
      </div>

      <main className="p-6 md:p-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-400" /> Champions Circle
            </h2>
            <p className="text-neutral-400">The elite learners leading the Cybersecurity frontier.</p>
          </div>

          <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 flex items-center gap-5 shadow-lg backdrop-blur-sm">
            <TrendingUp className="w-6 h-6 text-[#FFBEA0]" />
            <div>
              <p className="text-[10px] text-neutral-500 font-bold tracking-[0.2em] uppercase">Current Season</p>
              <p className="text-sm font-bold text-white">May 2026 Audit</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 text-neutral-500 gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-12 h-12 text-blue-500" />
            </motion.div>
            <p className="text-lg font-medium animate-pulse">Syncing Coursera ledger data...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-96 text-neutral-400 gap-4 text-center">
            <AlertTriangle className="w-12 h-12 text-amber-400" />
            <div>
              <p className="text-lg font-bold text-white">Coursera learner sync failed</p>
              <p className="text-sm text-neutral-500 max-w-xl mt-2">{error}</p>
            </div>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-neutral-400 gap-3 text-center">
            <Trophy className="w-12 h-12 text-neutral-700" />
            <p className="text-lg font-bold text-white">No current Coursera enrollments found</p>
            <p className="text-sm text-neutral-500">The leaderboard will populate as enrolled learners appear in Coursera.</p>
          </div>
        ) : (
          <>
            {/* Podium Section */}
            <div className="grid grid-cols-3 items-end justify-center mb-16 gap-2 md:gap-6 px-2">
              {topThree[1] && <PodiumItem user={topThree[1]} rank={2} delay={0.2} />}
              {topThree[0] && <PodiumItem user={topThree[0]} rank={1} delay={0} />}
              {topThree[2] && <PodiumItem user={topThree[2]} rank={3} delay={0.4} />}
            </div>

            {/* List Section */}
            <div className="bg-neutral-900/30 border border-neutral-800/50 rounded-3xl overflow-hidden backdrop-blur-sm">
              <div className="p-6 border-b border-neutral-800/50 flex items-center justify-between bg-neutral-900/50">
                <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                  <Star className="w-4 h-4" /> Global Rankings
                </h3>
                <span className="text-xs text-neutral-600 font-medium">Updated every 15 minutes</span>
              </div>

              <div className="grid grid-cols-12 gap-4 p-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest bg-neutral-900/20">
                <div className="col-span-2 text-center">Pos</div>
                <div className="col-span-6">Learner</div>
                <div className="col-span-4 text-right pr-4">Progress Score</div>
              </div>

              <div className="flex flex-col divide-y divide-neutral-800/30">
                {remaining.map((user, index) => {
                  const pos = index + 4;
                  return (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: (index) * 0.05 }}
                      key={user.id} 
                      className="grid grid-cols-12 gap-4 p-5 items-center transition-all hover:bg-white/5"
                    >
                      <div className="col-span-2 flex justify-center">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center font-black text-xs border",
                          "border-neutral-800 text-neutral-500"
                        )}>
                          {pos}
                        </div>
                      </div>
                      <div className="col-span-6 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0 border-2 border-neutral-800 bg-neutral-800">
                          {user.name?.split(' ').map(n => n[0]).join('') || "U"}
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="font-bold text-neutral-100 truncate text-sm md:text-base">{user.name || "Anonymous Learner"}</h4>
                          <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-tight">
                            {user.coursesCompleted} / {user.totalCourses || 9} Courses Complete
                          </p>
                        </div>
                      {user.estimatedHours ? (
                        <div className="hidden md:flex ml-auto px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 uppercase">
                          {Math.round(user.estimatedHours)}h Spent
                        </div>
                      ) : null}
                      </div>
                      <div className="col-span-4 flex flex-col items-end pr-4">
                        <span className="font-black text-base md:text-lg text-white">
                          {user.points.toLocaleString()}
                        </span>
                        <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest -mt-1">XP Points</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
