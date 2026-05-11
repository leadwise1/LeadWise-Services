"use client";

import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Star, TrendingUp, Loader2 } from 'lucide-react';

interface Learner {
  id: string;
  rank: number;
  name: string;
  points: number;
  coursesCompleted: number;
  trend: string;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<Learner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch('/api/forum/leaderboard');
        const data = await res.json();
        if (data.success) {
          setLeaderboard(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchLeaderboard();
  }, []);

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-400" />
            Global Leaderboard
          </h2>
          <p className="text-neutral-400">Rankings based on Coursera progress and forum engagement.</p>
        </div>
        
        {/* Personal Stats Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center gap-5 shadow-lg">
          <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
            <Star className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-neutral-500 font-semibold tracking-wider">YOUR RANK</p>
            <p className="text-xl font-bold text-white">---</p>
          </div>
          <div className="h-10 w-px bg-neutral-800 mx-2"></div>
          <div>
            <p className="text-xs text-neutral-500 font-semibold tracking-wider">TOTAL XP</p>
            <p className="text-xl font-bold text-blue-400">---</p>
          </div>
        </div>
      </div>
      
      {/* Leaderboard Table */}
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl min-h-[400px]">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-neutral-800 text-xs font-semibold text-neutral-500 uppercase tracking-wider bg-neutral-900">
          <div className="col-span-2 md:col-span-1 text-center">Rank</div>
          <div className="col-span-6 md:col-span-5">Learner</div>
          <div className="col-span-4 md:col-span-3 text-center">Courses Completed</div>
          <div className="hidden md:block col-span-3 text-right pr-4">Total Points</div>
        </div>

        {/* Table Body */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-neutral-500 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p>Syncing Coursera data...</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-neutral-500">
            <Trophy className="w-12 h-12 text-neutral-800 mb-4" />
            <p>No learners on the leaderboard yet. Check your progress to appear here!</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-neutral-800/50">
            {leaderboard.map((user) => (
              <div 
                key={user.id} 
                className={`grid grid-cols-12 gap-4 p-4 items-center transition-colors hover:bg-neutral-800/80 ${user.rank === 1 ? 'bg-yellow-500/5 hover:bg-yellow-500/10 border-l-4 border-l-yellow-500' : 'border-l-4 border-l-transparent'}`}
              >
                {/* Rank */}
                <div className="col-span-2 md:col-span-1 flex justify-center">
                  {user.rank === 1 ? (
                    <div className="bg-yellow-500/20 text-yellow-500 w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                      <Trophy className="w-4 h-4" />
                    </div>
                  ) : user.rank === 2 ? (
                    <div className="bg-neutral-300/20 text-neutral-300 w-8 h-8 rounded-full flex items-center justify-center font-bold">
                      <Medal className="w-4 h-4" />
                    </div>
                  ) : user.rank === 3 ? (
                    <div className="bg-orange-500/20 text-orange-400 w-8 h-8 rounded-full flex items-center justify-center font-bold">
                      <Medal className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="text-neutral-500 font-bold text-lg">#{user.rank}</div>
                  )}
                </div>

                {/* User Info */}
                <div className="col-span-6 md:col-span-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-inner shrink-0">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-100">{user.name}</h4>
                    <p className="text-xs text-neutral-500 flex items-center gap-1.5 mt-0.5">
                      {user.trend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-400" />}
                      {user.trend === 'up' ? 'Moving up' : 'Holding steady'}
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div className="col-span-4 md:col-span-3 flex justify-center">
                  <div className="flex items-center gap-2 bg-neutral-950/50 px-3 py-1.5 rounded-full border border-neutral-800">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-medium text-neutral-300">{user.coursesCompleted}/8</span>
                  </div>
                </div>

                {/* Points */}
                <div className="hidden md:flex col-span-3 justify-end items-center pr-4">
                  <div className="flex items-baseline gap-1">
                    <span className="font-bold text-white text-xl font-mono">
                      {user.points.toLocaleString()}
                    </span>
                    <span className="text-xs text-blue-400 font-semibold tracking-wider">XP</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
