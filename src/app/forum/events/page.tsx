"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import FollowAlongLabs from './follow-along-labs';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Coffee,
  ExternalLink,
  Flame,
  HelpCircle,
  Pause,
  Play,
  Radio,
  RotateCcw,
  Send,
  Video,
  Volume2,
  VolumeX,
} from "lucide-react";

type ReactionKey = "resilience" | "withYou" | "rocket";

interface GrittyWin {
  id: string;
  name: string;
  track: string;
  text: string;
  reactions: Record<ReactionKey, number>;
}

interface StuckTicket {
  id: string;
  learnerName: string;
  module: string;
  description: string;
  timeAgo: string;
  claimedBy?: string;
}

const initialWins: GrittyWin[] = [
  {
    id: "w1",
    name: "Marcus",
    track: "Cybersecurity",
    text: "Failed the subnetting quiz 4 times this week, but just scored 95% on my 5th attempt!",
    reactions: { resilience: 8, withYou: 5, rocket: 12 },
  },
  {
    id: "w2",
    name: "Elena",
    track: "IT Support",
    text: "Configured my first Linux server partition without nuking the VM filesystem!",
    reactions: { resilience: 6, withYou: 9, rocket: 7 },
  },
  {
    id: "w3",
    name: "Devon",
    track: "Project Management",
    text: "Studied for 45 minutes after working a 10-hour shift and putting the kids to bed.",
    reactions: { resilience: 15, withYou: 14, rocket: 19 },
  },
];

const initialTickets: StuckTicket[] = [
  {
    id: "1",
    learnerName: "Marcus T.",
    module: "Cybersecurity Mod 3",
    description: "My iptables drop rule is blocking local loopback and crashing the script.",
    timeAgo: "8m ago",
  },
  {
    id: "2",
    learnerName: "Sarah K.",
    module: "IT Support Lab 2",
    description: "Can't get SSH keys to authenticate on the Google Cloud VM.",
    timeAgo: "14m ago",
  },
];

export default function WeeklySyncHub() {
  const [onlineCount] = useState(19);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [pomoMinutes, setPomoMinutes] = useState(25);
  const [pomoSeconds, setPomoSeconds] = useState(0);
  const [isPomoRunning, setIsPomoRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [stuckTickets, setStuckTickets] = useState<StuckTicket[]>(initialTickets);
  const [showBenchModal, setShowBenchModal] = useState(false);
  const [newTicketModule, setNewTicketModule] = useState("");
  const [newTicketDesc, setNewTicketDesc] = useState("");
  const [wins, setWins] = useState<GrittyWin[]>(initialWins);
  const [winInput, setWinInput] = useState("");
  const [rainVolume, setRainVolume] = useState(0.25);
  const rainRef = useRef<HTMLAudioElement | null>(null);
  const rainPendingRef = useRef(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSendNudge = (type: "coffee" | "highfive") => {
    if (type === "coffee") {
      triggerToast("☕ You sent a warm coffee boost to everyone studying!");
      return;
    }

    triggerToast("👏 High-five sent! You just energized 19 fellow learners.");
  };

  useEffect(() => {
    if (!isPomoRunning) return;

    const timer = window.setInterval(() => {
      if (pomoSeconds > 0) {
        setPomoSeconds((prev) => prev - 1);
        return;
      }

      if (pomoMinutes > 0) {
        setPomoMinutes((prev) => prev - 1);
        setPomoSeconds(59);
        return;
      }

      if (!isBreak) {
        setIsBreak(true);
        setPomoMinutes(5);
        setPomoSeconds(0);
        triggerToast("🎉 Pomodoro complete! Take a 5-minute breather.");
      } else {
        setIsBreak(false);
        setPomoMinutes(25);
        setPomoSeconds(0);
        triggerToast("⚡ Break over! Ready for another 25-minute sprint?");
      }

      setIsPomoRunning(false);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isBreak, isPomoRunning, pomoMinutes, pomoSeconds]);

  const toggleAmbientSound = async () => {
    if (rainPendingRef.current) return;
    const audio = rainRef.current;
    if (!audio) return;
    if (!audio.paused) { audio.pause(); return; }
    rainPendingRef.current = true;
    try { await audio.play(); }
    catch { triggerToast("Rain couldn't start. Please try again."); }
    finally { rainPendingRef.current = false; }
  };

  useEffect(() => { if (rainRef.current) rainRef.current.volume = rainVolume; }, [rainVolume]);
  useEffect(() => {
    const audio = rainRef.current;
    return () => { audio?.pause(); };
  }, []);

  const resetPomodoro = () => {
    setIsPomoRunning(false);
    setIsBreak(false);
    setPomoMinutes(25);
    setPomoSeconds(0);
  };

  const handleClaimTicket = (id: string) => {
    setStuckTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === id ? { ...ticket, claimedBy: "You (Active Screen-Share)" } : ticket
      )
    );

    triggerToast("🤝 Pulling up a chair! Connecting you to learner's huddle...");
  };

  const handleCreateTicket = (e: FormEvent) => {
    e.preventDefault();

    if (!newTicketModule.trim() || !newTicketDesc.trim()) return;

    const ticket: StuckTicket = {
      id: Date.now().toString(),
      learnerName: "You",
      module: newTicketModule.trim(),
      description: newTicketDesc.trim(),
      timeAgo: "Just now",
    };

    setStuckTickets((prev) => [ticket, ...prev]);
    setNewTicketModule("");
    setNewTicketDesc("");
    setShowBenchModal(false);
    triggerToast("🛋️ You are on the Bench! A peer or mentor will pull up a chair shortly.");
  };

  const handleReactWin = (id: string, type: ReactionKey) => {
    setWins((prev) =>
      prev.map((win) => {
        if (win.id !== id) return win;

        return {
          ...win,
          reactions: {
            ...win.reactions,
            [type]: win.reactions[type] + 1,
          },
        };
      })
    );
  };

  const handlePostWin = (e: FormEvent) => {
    e.preventDefault();

    if (!winInput.trim()) return;

    const newWin: GrittyWin = {
      id: Date.now().toString(),
      name: "You",
      track: "Coursera Track",
      text: winInput.trim(),
      reactions: { resilience: 1, withYou: 1, rocket: 1 },
    };

    setWins((prev) => [newWin, ...prev]);
    setWinInput("");
    triggerToast("🚀 Gritty win posted! Your persistence inspires the cohort.");
  };

  return (
    <div className="min-h-screen bg-[#0d0f13] text-white">
      {toastMessage && (
        <div className="fixed right-4 top-4 z-50 rounded-xl border border-blue-500/40 bg-[#17191d] px-4 py-2 text-sm font-semibold text-blue-100 shadow-lg shadow-blue-950/30">
          {toastMessage}
        </div>
      )}

      <section
        aria-label="Presence Radar"
        className="sticky top-0 z-40 border-b border-gray-800 bg-[#17191d]/90 px-4 py-3 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-500" />
            </span>
            <span className="text-sm font-medium text-gray-200">
              <strong className="font-bold text-white">{onlineCount} LeadWise learners</strong> grinding through labs right now
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSendNudge("coffee")}
              className="flex items-center gap-1.5 rounded-xl border border-gray-700 bg-gray-800/80 px-3 py-1.5 text-xs font-semibold text-gray-300 transition hover:border-blue-500/60 hover:text-white"
            >
              <Coffee size={14} className="text-neutral-400" />
              <span>Send Warm Coffee</span>
            </button>
            <button
              onClick={() => handleSendNudge("highfive")}
              className="flex items-center gap-1.5 rounded-xl border border-gray-700 bg-gray-800/80 px-3 py-1.5 text-xs font-semibold text-gray-300 transition hover:border-blue-500/60 hover:text-white"
            >
              <span>👏 High Five All</span>
            </button>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl space-y-12 px-4 py-10">
        <header className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-300">
            <Radio size={12} className="animate-pulse" /> Community Living Room
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
            Belonging Before Brilliance
          </h1>
          <p className="mt-3 text-base text-gray-400 md:text-lg">
            "Because brilliance is everywhere. Belonging is rare." Drop in, co-work, share roadblocks, or celebrate gritty wins.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-gray-800 bg-[#17191d] p-6 transition hover:border-blue-500/30">
            <div className="mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
                <BookOpen size={16} /> Room A: Silent Library
              </span>
              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-xs text-blue-400">
                14 Focusers
              </span>
            </div>

            <h3 className="mb-1 text-lg font-bold text-white">
              {isBreak ? "☕ Break Window" : "Quiet Focus Sprint"}
            </h3>
            <p className="mb-6 text-xs text-gray-400">
              Mics muted, zero pressure body doubling. Work side-by-side with peers.
            </p>

            <div className="mb-6 rounded-2xl border border-gray-800/80 bg-[#121417] py-4 text-center">
              <div className="font-mono text-4xl font-black tracking-wider text-white">
                {String(pomoMinutes).padStart(2, "0")}:{String(pomoSeconds).padStart(2, "0")}
              </div>
              <div className="mt-1 text-[11px] font-semibold uppercase text-gray-500">
                {isBreak ? "Rest & Stretch" : "Deep Lab Focus (25m)"}
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsPomoRunning((prev) => !prev)}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-blue-500"
              >
                {isPomoRunning ? <Pause size={14} /> : <Play size={14} />}
                {isPomoRunning ? "Pause" : "Start Sprint"}
              </button>
              <button
                onClick={resetPomodoro}
                title="Reset Timer"
                className="rounded-xl border border-gray-700 bg-gray-800 p-2.5 text-gray-300 transition hover:bg-gray-700"
              >
                <RotateCcw size={14} />
              </button>
              <button
                onClick={toggleAmbientSound}
                title={isAmbientPlaying ? "Pause gentle rain" : "Play gentle rain"}
                aria-pressed={isAmbientPlaying}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-semibold transition ${
                  isAmbientPlaying
                    ? "border-blue-500/50 bg-blue-950/40 text-[#47b3ff]"
                    : "border-gray-700 bg-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                {isAmbientPlaying ? <Volume2 size={14} /> : <VolumeX size={14} />}
                <span>{isAmbientPlaying ? "Rain On" : "Gentle Rain"}</span>
              </button>
            </div>
            <audio ref={rainRef} src="/audio/gentle-rain.mp3" loop preload="none" onPlaying={() => setIsAmbientPlaying(true)} onPause={() => setIsAmbientPlaying(false)} onError={() => { setIsAmbientPlaying(false); triggerToast("Rain couldn't load. Please try again."); }} />
            <label className="focus-rain-volume">
              <Volume2 size={16} aria-hidden="true" /> Rain volume
              <input type="range" min="0" max="1" step="0.05" value={rainVolume} onChange={event => setRainVolume(Number(event.target.value))} aria-label="Rain volume" />
            </label>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-[#17191d] p-6 transition hover:border-blue-500/30">
            <div className="mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
                <Coffee size={16} /> Room B: The Break Room
              </span>
              <span className="rounded-full border border-neutral-500/20 bg-neutral-500/10 px-2 py-0.5 text-xs text-neutral-400">
                3 in Watercooler
              </span>
            </div>

            <h3 className="mb-1 text-lg font-bold text-white">Casual Voice Lounge</h3>
            <p className="mb-6 text-xs text-gray-400">
              Step away from the screen for 5 minutes. Grab water, chat about your week, or relax.
            </p>

            <div className="mb-6 rounded-2xl border border-gray-800/80 bg-[#121417] p-4">
              <div className="mb-1 text-xs font-bold uppercase tracking-wider text-blue-300">
                Today&apos;s Prompt:
              </div>
              <p className="text-sm italic text-gray-300">
                "What&apos;s one tech term that sounded like complete nonsense until this week?"
              </p>
            </div>

            <a
              href="https://meet.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-700 bg-gray-800 px-3 py-3 text-xs font-bold text-white transition hover:bg-[#25282e]"
            >
              <span>Join Break Voice Channel</span>
              <ExternalLink size={14} />
            </a>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-[#17191d] p-6 transition hover:border-blue-500/30">
            <div className="mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
                <HelpCircle size={16} /> Room C: The Stuck Bench
              </span>
              <span className="rounded-full border border-neutral-500/20 bg-neutral-500/10 px-2 py-0.5 text-xs text-neutral-400">
                {stuckTickets.length} Waiting
              </span>
            </div>

            <h3 className="mb-1 text-lg font-bold text-white">No Question is Too Basic</h3>
            <p className="mb-4 text-xs text-gray-400">
              Hate banging your head against syntax errors? Signal for a 15-minute screen-share.
            </p>

            <div className="mb-4 max-h-48 space-y-2 overflow-y-auto pr-1">
              {stuckTickets.map((ticket) => (
                <div key={ticket.id} className="rounded-xl border border-gray-800 bg-[#121417] p-3 text-left">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-200">{ticket.learnerName}</span>
                    <span className="text-gray-500">{ticket.timeAgo}</span>
                  </div>
                  <div className="mb-1 text-[11px] font-semibold text-blue-400">{ticket.module}</div>
                  <p className="mb-2 text-xs text-gray-400">{ticket.description}</p>

                  {ticket.claimedBy ? (
                    <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-400">
                      {ticket.claimedBy}
                    </span>
                  ) : (
                    <button
                      onClick={() => handleClaimTicket(ticket.id)}
                      className="w-full rounded-lg border border-blue-500/30 bg-blue-600/20 py-1 text-center text-[11px] font-bold text-blue-300 transition hover:bg-blue-600/40"
                    >
                      🪑 Pull Up a Chair (Unblock 15m)
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowBenchModal(true)}
              className="w-full rounded-2xl border border-neutral-600 bg-neutral-800 px-3 py-3 text-xs font-bold text-white transition hover:border-neutral-500 hover:bg-neutral-700"
            >
              Sit on the Bench (Ask for Help)
            </button>
          </div>
        </section>

        {showBenchModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl border border-gray-700 bg-[#17191d] p-6">
              <h3 className="mb-2 text-xl font-bold text-white">Pull Up to the Stuck Bench</h3>
              <p className="mb-4 text-xs text-gray-400">
                What hurdle are you facing? A fellow peer or mentor will hop into a 15-minute screen share with you.
              </p>

              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-300">
                    Course Module or Lab Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google Cybersecurity Week 3 - Linux Bash"
                    value={newTicketModule}
                    onChange={(e) => setNewTicketModule(e.target.value)}
                    className="w-full rounded-xl border border-gray-700 bg-[#121417] px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-300">
                    What is happening? (Paste error code or symptom)
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. Terminal says Permission Denied even after I run chmod +x..."
                    value={newTicketDesc}
                    onChange={(e) => setNewTicketDesc(e.target.value)}
                    className="w-full rounded-xl border border-gray-700 bg-[#121417] px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowBenchModal(false)}
                    className="rounded-xl px-4 py-2 text-xs font-bold text-gray-400 transition hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white transition hover:bg-blue-500"
                  >
                    Post to Bench
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <FollowAlongLabs />

        <section className="rounded-3xl border border-gray-800 bg-[#17191d] p-6 md:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mb-1 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
                <Flame size={16} /> The Anti-Podium Feed
              </div>
              <h3 className="text-2xl font-bold text-white">The Gritty Wins</h3>
              <p className="mt-1 text-xs text-gray-400">
                No podium finishes required. We celebrate the messy, stubborn breakthroughs that take true grit.
              </p>
            </div>
          </div>

          <form onSubmit={handlePostWin} className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="What gave you a hard time this week that you pushed through anyway?"
                value={winInput}
                onChange={(e) => setWinInput(e.target.value)}
                className="w-full rounded-2xl border border-gray-700 bg-[#121417] py-4 pl-5 pr-28 text-sm text-white transition focus:border-[#47b3ff] focus:outline-none"
              />
              <button
                type="submit"
                className="absolute bottom-2 right-2 top-2 flex items-center gap-1.5 rounded-xl bg-white px-5 text-xs font-bold text-[#17191d] transition hover:bg-[#47b3ff]"
              >
                <span>Share</span>
                <Send size={13} />
              </button>
            </div>
          </form>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {wins.map((win) => (
              <div
                key={win.id}
                className="flex min-h-[220px] flex-col justify-between rounded-2xl border border-gray-800/80 bg-[#121417] p-5"
              >
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{win.name}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400/80">
                      {win.track}
                    </span>
                  </div>
                  <p className="mb-4 text-sm leading-relaxed text-gray-300">"{win.text}"</p>
                </div>

                <div className="flex items-center gap-2 border-t border-gray-800 pt-2">
                  <button
                    onClick={() => handleReactWin(win.id, "resilience")}
                    className="flex items-center gap-1 rounded-lg bg-gray-800/60 px-2.5 py-1 text-[11px] font-semibold text-gray-300 transition hover:bg-gray-800"
                  >
                    <span>👏</span> <span>{win.reactions.resilience}</span>
                  </button>
                  <button
                    onClick={() => handleReactWin(win.id, "withYou")}
                    className="flex items-center gap-1 rounded-lg bg-gray-800/60 px-2.5 py-1 text-[11px] font-semibold text-gray-300 transition hover:bg-gray-800"
                  >
                    <span>❤️</span> <span>{win.reactions.withYou}</span>
                  </button>
                  <button
                    onClick={() => handleReactWin(win.id, "rocket")}
                    className="flex items-center gap-1 rounded-lg bg-gray-800/60 px-2.5 py-1 text-[11px] font-semibold text-gray-300 transition hover:bg-gray-800"
                  >
                    <span>🚀</span> <span>{win.reactions.rocket}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden rounded-3xl border border-gray-800 bg-[#17191d] px-4 py-12 text-center">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent" />
          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-300">
              <Video size={12} /> 1-on-1 Guidance
            </div>
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Live Weekly Meet</h2>
            <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-gray-400 md:text-lg">
              Need dedicated support? Learners can now book a live sync with a LeadWise admin to unblock technical hurdles or discuss career goals.
            </p>
            <a
              href={process.env.NEXT_PUBLIC_CALENDAR_LINK || "https://calendar.app.google/1AXYeyfAXczZ2wi1A"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-2xl bg-white px-10 py-5 font-black text-[#25282e] shadow-2xl transition hover:bg-[#47b3ff]"
            >
              <CalendarDays size={20} />
              <span>Schedule on Google Calendar</span>
              <ArrowRight size={20} />
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
