import React from 'react';
import { Calendar, Video, Clock, Users, PlusCircle, ExternalLink, CalendarDays, Radio } from 'lucide-react';

const UPCOMING_EVENTS = [
  {
    id: 1,
    title: "Cybersecurity Basics Q&A",
    course: "Foundations of Cybersecurity",
    mentor: "Alex Rivers",
    date: "Today",
    time: "Ongoing",
    attendees: 128,
    isLive: true,
    description: "Drop in to ask any questions about the foundational concepts. We will cover the CIA triad and basic threat modeling."
  },
  {
    id: 2,
    title: "Linux & SQL Lab Walkthrough",
    course: "Tools of the Trade: Linux and SQL",
    mentor: "Sarah Jenkins",
    date: "Tomorrow",
    time: "6:00 PM EST",
    attendees: 42,
    isLive: false,
    description: "Stuck on the permissions lab? We will walk through it step-by-step in a live terminal environment."
  },
  {
    id: 3,
    title: "Python Automation Study Group",
    course: "Automate Cybersecurity Tasks with Python",
    mentor: "Marcus Doe",
    date: "Friday, Nov 12",
    time: "5:00 PM EST",
    attendees: 15,
    isLive: false,
    description: "Collaborative coding session. Bring your scripts and let's debug them together."
  }
];

export default function EventsPage() {
  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <CalendarDays className="w-8 h-8 text-emerald-400" />
            Weekly Syncs
          </h2>
          <p className="text-neutral-400">Join live mentor sessions and study groups to accelerate your learning.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-lg">
          <Calendar className="w-5 h-5" />
          Sync to Google Calendar
        </button>
      </div>

      {/* Grid of Events */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {UPCOMING_EVENTS.map((event) => (
          <div 
            key={event.id} 
            className={`group relative flex flex-col bg-neutral-900/80 border rounded-2xl overflow-hidden transition-all hover:-translate-y-1 shadow-lg ${event.isLive ? 'border-red-500/50 shadow-red-500/10' : 'border-neutral-800 hover:border-neutral-700'}`}
          >
            {/* Live Indicator or Date Badge */}
            <div className="p-5 pb-0">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-300">
                  {event.course}
                </span>
                {event.isLive ? (
                  <span className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse">
                    <Radio className="w-3 h-3" /> LIVE NOW
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Clock className="w-3 h-3" /> {event.date}
                  </span>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                {event.title}
              </h3>
              <p className="text-sm text-neutral-400 line-clamp-2 mb-4">
                {event.description}
              </p>
            </div>

            {/* Details Footer */}
            <div className="mt-auto p-5 pt-4 border-t border-neutral-800/50 bg-neutral-950/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-[10px] font-bold">
                    {event.mentor.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="text-xs text-neutral-400">By {event.mentor}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <Users className="w-3.5 h-3.5" />
                  {event.attendees} Attending
                </div>
              </div>
              
              <button 
                className={`w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                  event.isLive 
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20' 
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20'
                }`}
              >
                <Video className="w-4 h-4" />
                {event.isLive ? 'Join Meeting' : 'RSVP'}
              </button>
            </div>
          </div>
        ))}

        {/* Request a Sync Card */}
        <div className="flex flex-col items-center justify-center bg-neutral-950 border border-dashed border-neutral-700 hover:border-neutral-500 hover:bg-neutral-900 transition-colors rounded-2xl p-8 text-center cursor-pointer min-h-[300px]">
          <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mb-4 text-neutral-400">
            <PlusCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Request a Topic</h3>
          <p className="text-sm text-neutral-400">Need help with something specific? Request a new sync session.</p>
        </div>
      </div>
    </div>
  );
}
