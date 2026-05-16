"use client";
import React, { useState, useEffect } from 'react';
import { Trophy, Star, Loader2, MessageSquare, TrendingUp } from 'lucide-react';
import { db } from "@/lib/firebase";
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot 
} from "firebase/firestore";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Learner {
  id: string;
  name: string;
  points: number;
  coursesCompleted: number;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<Learner[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const q = query(
      collection(db, "artifacts", "leadwise-web", "public", "data", "leaderboard"),
      orderBy("points", "desc"),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const players: Learner[] = [];
      snapshot.forEach((doc) => {
        players.push({ id: doc.id, ...doc.data() } as Learner);
      });
      setLeaderboard(players);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#090A0F] text-white selection:bg-[#FFBEA0] selection:text-[#1B2735]">
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-400" /> Global Leaderboard
            </h2>
            <p className="text-neutral-400">Rankings based on Coursera progress and forum engagement.</p>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center gap-5 shadow-lg text-white">
            <Star className="w-6 h-6 text-blue-400" />
            <div>
              <p className="text-xs text-neutral-500 font-semibold tracking-wider">TOP XP</p>
              <p className="text-xl font-bold text-white">{leaderboard[0]?.points?.toLocaleString() || "---"}</p>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl min-h-[400px]">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-neutral-800 text-xs font-semibold text-neutral-500 uppercase tracking-wider bg-neutral-900">
            <div className="col-span-2 md:col-span-1 text-center">Rank</div>
            <div className="col-span-6 md:col-span-5">Learner</div>
            <div className="col-span-4 md:col-span-3 text-center">Courses Completed</div>
            <div className="hidden md:block col-span-3 text-right pr-4">Total Points</div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-500 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p>Syncing Coursera data...</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-neutral-800/50">
              {leaderboard.map((user, index) => (
                <div key={user.id} className={`grid grid-cols-12 gap-4 p-4 items-center transition-colors hover:bg-neutral-800/80 ${index === 0 ? 'bg-yellow-500/5 border-l-4 border-l-yellow-500' : 'border-l-4 border-l-transparent'}`}>
                  <div className="col-span-2 md:col-span-1 flex justify-center">
                     <div className="text-neutral-500 font-bold text-lg">#{index + 1}</div>
                  </div>
                  <div className="col-span-6 md:col-span-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {user.name?.split(' ').map(n => n[0]).join('') || "U"}
                    </div>
                    <div>
                      <h4 className="font-semibold text-neutral-100">{user.name}</h4>
                    </div>
                  </div>
                  <div className="col-span-4 md:col-span-3 flex justify-center">
                    <span className="text-sm font-medium text-neutral-300">{user.coursesCompleted}/8</span>
                  </div>
                  <div className="hidden md:flex col-span-3 justify-end items-center pr-4">
                    <span className="font-bold text-white text-xl">{user.points.toLocaleString()} <span className="text-xs text-blue-400">XP</span></span>
                  </div>
                </div>
              ))}
            </div>
          )}
         </div>
      </main>
   </div>
  );
}