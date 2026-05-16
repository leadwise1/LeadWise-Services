'use client';
import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  MessageSquare, 
  Rocket,
  CheckCircle2,
  Flag,
  CalendarDays,
  Radio,
  Video,
  ArrowRight,
  PlusCircle,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";

// LeadWise Coursera Partnership Configuration
const COURSERA_ORG = {
  name: "LeadWise Foundation",
  slug: "gwg-ent-leadwise-foundation",
  id: "PHXqt_bBMgu9thbuJnsLvQ"
};

interface Session {
  id: string;
  title: string;
  status: string;
  topic: string;
  desc: string;
  mentor: string;
  attendees: number;
}

export default function EventsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const q = query(
      collection(db, "artifacts", "leadwise-web", "public", "data", "sessions"),
      orderBy("status", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: Session[] = [];
      snapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() } as Session);
      });
      setSessions(fetched);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#090A0F] text-white selection:bg-[#FFBEA0] selection:text-[#1B2735]">
      {/* Tab Navigation */}
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

      <main className="p-6 md:p-10 max-w-4xl mx-auto space-y-16">
        {/* Sessions Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <CalendarDays className="text-[#FFBEA0]" /> Weekly Syncs
            </h2>
            <a 
              href={`https://www.coursera.org/programs/${COURSERA_ORG.slug}`}
              target="_blank"
              className="text-xs font-bold uppercase tracking-widest bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:bg-white/10 transition text-gray-400 hover:text-[#FFBEA0] flex items-center justify-center"
            >
              Sync to Google Calendar
            </a>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-neutral-500 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#FFBEA0]" />
              <p>Fetching sync sessions...</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {sessions.map((session) => (
                <div key={session.id} className={`bg-neutral-900/80 border ${session.status === 'LIVE NOW' ? 'border-red-500/50' : 'border-neutral-800'} rounded-2xl p-6 transition-all hover:border-neutral-700`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${session.status === 'LIVE NOW' ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-blue-500/20 text-blue-400'}`}>
                      {session.status}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <Users size={14} /> {session.attendees} Attending
                    </div>
                  </div>
                  <h3 className="text-xs font-bold text-neutral-500 uppercase mb-1">{session.title}</h3>
                  <h4 className="text-xl font-bold mb-3">{session.topic}</h4>
                  <p className="text-sm text-neutral-400 mb-6">{session.desc}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold">
                        {session.mentor?.split(' ').map(n => n[0]).join('') || "LR"}
                      </div>
                      <span className="text-xs text-neutral-300">By {session.mentor}</span>
                    </div>
                    <button className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-sm transition ${session.status === 'LIVE NOW' ? 'bg-red-600 hover:bg-red-700' : 'bg-[#FFBEA0] text-[#1B2735] hover:bg-white'}`}>
                      {session.status === 'LIVE NOW' ? <><Radio size={16}/> Join Meeting</> : 'RSVP'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Admin Booking Section */}
        <section className="bg-gradient-to-br from-[#1B2735] to-black border border-white/10 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold mb-6 uppercase tracking-widest">
              <Video size={12} /> 1-on-1 Guidance
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Live Weekly Meet</h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-8 text-lg leading-relaxed">
              Need dedicated support? Learners can now book a live sync with a LeadWise admin to unblock technical hurdles or discuss career goals.
            </p>
            <a 
              href="https://calendar.google.com/calendar/appointments/schedules" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white text-[#1B2735] px-10 py-5 rounded-2xl font-black hover:bg-[#FFBEA0] transition-all transform hover:scale-[1.02] shadow-2xl hover:shadow-[#FFBEA0]/20 group"
            >
              <CalendarDays size={20} className="group-hover:rotate-12 transition-transform" />
              Schedule on Google Calendar
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </section>

      </main>
    </div>
  );
}
