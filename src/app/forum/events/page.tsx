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
  Loader2,
  Pin
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

    const MOCK_SESSIONS: Session[] = [
      {
        id: "mock1",
        title: "OFFICIAL SYNC",
        status: "LIVE NOW",
        topic: "Cybersecurity Module 3: Network Security Lab",
        desc: "Stuck on the firewall configuration? Join our live lab sync where we walk through the common pitfalls in the Module 3 labs.",
        mentor: "Sarah Jenkins",
        attendees: 42
      },
      {
        id: "mock2",
        title: "CAREER WORKSHOP",
        status: "UPCOMING",
        topic: "Optimizing your LeadWise Resume for ATS",
        desc: "Learn how to use the LeadWise resume builder to ensure your Google certifications are parsed correctly by recruitment bots.",
        mentor: "Alex Kwong",
        attendees: 128
      }
    ];

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: Session[] = [];
      snapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() } as Session);
      });
      
      if (fetched.length === 0) {
        setSessions(MOCK_SESSIONS);
      } else {
        setSessions(fetched);
      }
      setLoading(false);
    }, (error) => {
      console.error("Sessions subscribe error:", error);
      setSessions(MOCK_SESSIONS);
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
            <h2 className="text-3xl font-bold flex items-center gap-3 relative">
              <CalendarDays className="text-[#FFBEA0]" /> Weekly Syncs
              {!loading && <span className="absolute -top-1 -right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Live Connection Active" />}
            </h2>
            <a 
              href={process.env.NEXT_PUBLIC_CALENDAR_LINK || "https://calendar.app.google/1AXYeyfAXczZ2wi1A"}
              target="_blank"
              rel="noopener noreferrer"
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
                <div key={session.id} className={`bg-neutral-900/80 border ${session.status?.toUpperCase() === 'LIVE NOW' ? 'border-red-500/50' : 'border-neutral-800'} rounded-2xl p-6 transition-all hover:border-neutral-700`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${session.status?.toUpperCase() === 'LIVE NOW' ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-blue-500/20 text-blue-400'}`}>
                      {session.status || "Upcoming"}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <Users size={14} /> {session.attendees || 0} Attending
                    </div>
                  </div>
                  <h3 className="text-xs font-bold text-neutral-500 uppercase mb-1">{session.title || "Special Session"}</h3>
                  <h4 className="text-xl font-bold mb-3">{session.topic || "Cybersecurity Progress & Open Q&A"}</h4>
                  {session.desc ? (
                    <p className="text-sm text-neutral-400 mb-6">{session.desc}</p>
                  ) : (
                    <div className="text-sm text-neutral-400 mb-6 bg-[#0B0C10] p-6 rounded-xl border-2 border-dashed border-neutral-700 relative overflow-hidden space-y-6 shadow-inner">
                      
                      <div className="flex items-center justify-center -mt-2 mb-4">
                        <div className="bg-[#FFBEA0] text-[#1B2735] px-4 py-1.5 font-black transform -rotate-2 shadow-lg shadow-[#FFBEA0]/10 uppercase tracking-widest text-xs flex items-center gap-2">
                          <Pin size={14} className="text-[#1B2735]" /> Virtual Bulletin Board
                        </div>
                      </div>

                      <div className="text-center bg-white/5 border border-white/10 rounded-lg p-4 transform rotate-1">
                        <h5 className="font-bold text-white text-base">Resources for U.S. Graduates</h5>
                        <p className="text-xs mt-1 text-neutral-300">Advance your job search with these tools at <a href="https://careercircle.com/google" className="text-blue-400 hover:text-blue-300 font-bold underline decoration-blue-500/50" target="_blank" rel="noopener noreferrer">careercircle.com/google</a></p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                        {/* Note 1 */}
                        <div className="bg-yellow-500/10 border border-yellow-500/20 p-5 rounded shadow-lg transform -rotate-2 hover:rotate-0 transition-transform relative hover:z-10 group">
                          <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm mx-auto absolute -top-1.5 left-1/2 -translate-x-1/2 border border-red-700 group-hover:scale-110 transition-transform"></div>
                          <h6 className="text-yellow-200 font-bold text-sm mb-1.5 mt-1">Employer Connections</h6>
                          <p className="text-xs text-yellow-100/70 leading-relaxed">Access the Employer Consortium and connect directly with partners like Gartner, Verizon, and Siemens.</p>
                        </div>

                        {/* Note 2 */}
                        <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded shadow-lg transform rotate-2 hover:rotate-0 transition-transform relative hover:z-10 group">
                          <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-sm mx-auto absolute -top-1.5 left-1/2 -translate-x-1/2 border border-yellow-600 group-hover:scale-110 transition-transform"></div>
                          <h6 className="text-blue-200 font-bold text-sm mb-1.5 mt-1">360° Profiles</h6>
                          <p className="text-xs text-blue-100/70 leading-relaxed">Showcase your skills, lessons, and enrich your profile with career assessments to stand out to employers.</p>
                        </div>

                        {/* Note 3 */}
                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded shadow-lg transform -rotate-1 hover:rotate-0 transition-transform relative hover:z-10 group">
                          <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm mx-auto absolute -top-1.5 left-1/2 -translate-x-1/2 border border-blue-700 group-hover:scale-110 transition-transform"></div>
                          <h6 className="text-emerald-200 font-bold text-sm mb-1.5 mt-1">Career Prep Support</h6>
                          <p className="text-xs text-emerald-100/70 leading-relaxed">Get guidance on career paths, a resume builder, interview prep, and exclusive Grow with Google content.</p>
                        </div>

                        {/* Note 4 */}
                        <div className="bg-rose-500/10 border border-rose-500/20 p-5 rounded shadow-lg transform rotate-1 hover:rotate-0 transition-transform relative hover:z-10 group">
                          <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm mx-auto absolute -top-1.5 left-1/2 -translate-x-1/2 border border-emerald-700 group-hover:scale-110 transition-transform"></div>
                          <h6 className="text-rose-200 font-bold text-sm mb-1.5 mt-1">1:1 Coaching</h6>
                          <p className="text-xs text-rose-100/70 leading-relaxed">Receive personalized job search support through 1:1 sessions with specialized CareerCircle Advocates.</p>
                        </div>
                      </div>

                      <div className="mt-6 bg-white/5 p-5 rounded-lg border border-white/10 transform -rotate-1 shadow-md relative hover:rotate-0 transition-transform hover:z-10">
                        <div className="absolute top-2 left-3 w-2 h-2 rounded-full bg-white/20"></div>
                        <div className="absolute top-2 right-3 w-2 h-2 rounded-full bg-white/20"></div>
                        <div className="absolute bottom-2 left-3 w-2 h-2 rounded-full bg-white/20"></div>
                        <div className="absolute bottom-2 right-3 w-2 h-2 rounded-full bg-white/20"></div>
                        
                        <h6 className="text-white font-bold text-sm mb-3 flex items-center justify-center gap-2">
                          <Flag size={14} className="text-[#FFBEA0]" /> More Resources for Certificate Grads
                        </h6>
                        <div className="space-y-3">
                          <p className="text-xs leading-relaxed text-neutral-300">
                            <strong className="text-white font-semibold">Cybersecurity:</strong> 30% discount on the CompTIA Security+ exam and CertMaster practice.
                          </p>
                          <p className="text-xs leading-relaxed text-neutral-300">
                            <strong className="text-white font-semibold">Project Management:</strong> Discount on Certified Associate in Project Management, plus 40% off PSM I.
                          </p>
                          <p className="text-xs leading-relaxed text-neutral-300">
                            <strong className="text-white font-semibold">IT Support:</strong> 30% discount on the CompTIA A+ certification exam.
                          </p>
                        </div>
                        <div className="pt-4 border-t border-white/10 mt-4 text-center">
                          <a href="https://grow.google/career-dreamer" className="inline-flex items-center gap-1.5 text-xs font-bold text-black bg-[#FFBEA0] hover:bg-white px-4 py-2 rounded-full transition-colors shadow-lg" target="_blank" rel="noopener noreferrer">
                            Explore Career Dreamer <ArrowRight size={12} />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold">
                        {(session.mentor || "LeadWise Admin").split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-xs text-neutral-300">By {session.mentor || "LeadWise Admin"}</span>
                    </div>
                    <button className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-sm transition ${session.status?.toUpperCase() === 'LIVE NOW' ? 'bg-red-600 hover:bg-red-700' : 'bg-[#FFBEA0] text-[#1B2735] hover:bg-white'}`}>
                      {session.status?.toUpperCase() === 'LIVE NOW' ? <><Radio size={16}/> Join Meeting</> : 'RSVP'}
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
              href={process.env.NEXT_PUBLIC_CALENDAR_LINK || "https://calendar.app.google/1AXYeyfAXczZ2wi1A"} 
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
