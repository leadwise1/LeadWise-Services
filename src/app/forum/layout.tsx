import React from 'react';
import Link from 'next/link';
import { MessageSquare, Trophy, Calendar, BookOpen, Users, ArrowLeft, Shield } from 'lucide-react';

export default function ForumLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 border-r border-neutral-800 bg-neutral-900/50 p-6 flex flex-col gap-6">
        <div>
          <Link href="/admin" className="text-sm text-neutral-400 hover:text-white flex items-center gap-2 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            LeadWise Hub
          </h1>
          <p className="text-xs text-neutral-500 mt-1">Community & Support</p>
        </div>

        <nav className="flex flex-col gap-2">
          <Link href="/forum" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-500/10 text-blue-400">
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">Discussions</span>
          </Link>
          <Link href="/forum/leaderboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors">
            <Trophy className="w-5 h-5" />
            <span className="font-medium">Leaderboard</span>
          </Link>
          <Link href="/forum/events" className="flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Weekly Syncs</span>
          </Link>
          <Link href="/forum/rules" className="flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors">
            <Shield className="w-5 h-5" />
            <span className="font-medium">Community Charter</span>
          </Link>
        </nav>

        <div className="mt-4">
          <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3 px-3">
            Course Channels
          </h3>
          <div className="flex flex-col gap-1">
            <Link href="/forum?category=Foundations of Cybersecurity" className="flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm">Foundations of Cyber</span>
            </Link>
            <Link href="/forum?category=Networks and Network Security" className="flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm">Networks & Security</span>
            </Link>
            <Link href="/forum?category=Automate Cybersecurity Tasks with Python" className="flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm">Automate with Python</span>
            </Link>
          </div>
        </div>

        <div className="mt-auto p-4 rounded-xl border border-blue-500/20 bg-blue-500/5">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span className="font-medium text-sm text-blue-100">142 Online</span>
          </div>
          <p className="text-xs text-neutral-400">Join the live study room</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
