import { Video, CalendarDays, ArrowRight, Flame, Coffee, Sparkles, Play, Pause, RotateCcw, Volume2, VolumeX, HelpCircle, CheckCircle2, AlertTriangle, Users, MessageSquare, Radio, BookOpen, Send, PlusCircle, ExternalLink, } from "lucide-react";
// --- TYPES ---
interface GrittyWin {
id: string;
name: string;
track: string;
text: string;
reactions: {
resilience: number;
withYou: number;
rocket: number;
};
}interface StuckTicket {
id: string;
learnerName: string;
module: string;
description: string;
timeAgo: string;
claimedBy?: string;
}export default function WeeklySyncHub() {
// --- 1. AMBIENT PRESENCE & NUDGE STATE ---
const $$onlineCount, setOnlineCount$$ = useState(19);
const $$toastMessage, setToastMessage$$ = useState<string | null>(null);const triggerToast = (msg: string) => {
setToastMessage(msg);
setTimeout(() => setToastMessage(null), 3500);
};const handleSendNudge = (type: "coffee" | "highfive") => {
if (type === "coffee") {
triggerToast("☕ You sent a warm coffee boost to everyone studying!");
} else {
triggerToast("👏 High-five sent! You just energized 19 fellow learners.");
}
};// --- 2. POMODORO TIMER & SOUNDSCAPE STATE ---
const $$pomoMinutes, setPomoMinutes$$ = useState(25);
const $$pomoSeconds, setPomoSeconds$$ = useState(0);
const $$isPomoRunning, setIsPomoRunning$$ = useState(false);
const $$isBreak, setIsBreak$$ = useState(false);
const $$isAmbientPlaying, setIsAmbientPlaying$$ = useState(false);// Web Audio API Synthesized Ambient Sound (Soft Brown Noise - No external assets required)
const audioCtxRef = useRef<AudioContext | null>(null);
const noiseNodeRef = useRef<AudioNode | null>(null);const toggleAmbientSound = () => {
if (isAmbientPlaying) {
if (audioCtxRef.current) {
audioCtxRef.current.close();
audioCtxRef.current = null;
}
setIsAmbientPlaying(false);
} else {
try {
const AudioContextClass =
window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
const ctx = new AudioContextClass();
const bufferSize = ctx.sampleRate * 2;
const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
const data = buffer.getChannelData(0);
let lastOut = 0.0;    // Generate soft brown noise (gentle rain/lo-fi hum profile)
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 0.15; // Comfortable background volume
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);

    noise.connect(gainNode);
    gainNode.connect(ctx.destination);
    noise.start(0);

    audioCtxRef.current = ctx;
    noiseNodeRef.current = noise;
    setIsAmbientPlaying(true);
  } catch (err) {
    console.error("Audio API error:", err);
  }
}

};useEffect(() => {
let timer: NodeJS.Timeout | null = null;
if (isPomoRunning) {
timer = setInterval(() => {
if (pomoSeconds > 0) {
setPomoSeconds((prev) => prev - 1);
} else if (pomoMinutes > 0) {
setPomoMinutes((prev) => prev - 1);
setPomoSeconds(59);
} else {
// Timer finished
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
}
}, 1000);
}
return () => {
if (timer) clearInterval(timer);
};
}, $$isPomoRunning, pomoMinutes, pomoSeconds, isBreak$$);const resetPomodoro = () => {
setIsPomoRunning(false);
setIsBreak(false);
setPomoMinutes(25);
setPomoSeconds(0);
};// --- 3. THE STUCK BENCH STATE ---
const $$stuckTickets, setStuckTickets$$ = useState<StuckTicket>([
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
]);
const $$showBenchModal, setShowBenchModal$$ = useState(false);
const $$newTicketModule, setNewTicketModule$$ = useState("");
const $$newTicketDesc, setNewTicketDesc$$ = useState("");const handleClaimTicket = (id: string) => {
setStuckTickets((prev) =>
prev.map((t) => (t.id === id ? { ...t, claimedBy: "You (Active Screen-Share)" } : t))
);
triggerToast("🤝 Pulling up a chair! Connecting you to learner's huddle...");
};const handleCreateTicket = (e: React.FormEvent) => {
e.preventDefault();
if (!newTicketModule || !newTicketDesc) return;
const ticket: StuckTicket = {
id: Date.now().toString(),
learnerName: "You",
module: newTicketModule,
description: newTicketDesc,
timeAgo: "Just now",
};
setStuckTickets($$ticket, ...stuckTickets$$);
setNewTicketModule("");
setNewTicketDesc("");
setShowBenchModal(false);
triggerToast("🛋️ You are on the Bench! A peer or mentor will pull up a chair shortly.");
};// --- 4. THE GRITTY WINS STATE ---
const $$wins, setWins$$ = useState<GrittyWin>([
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
]);
const $$winInput, setWinInput$$ = useState("");const handleReactWin = (id: string, type: "resilience" | "withYou" | "rocket") => {
setWins((prev) =>
prev.map((w) => {
if (w.id === id) {
return {
...w,
reactions: {
...w.reactions,
$$type$$: w.reactions$$type$$ + 1,
},
};
}
return w;
})
);
};const handlePostWin = (e: React.FormEvent) => {
e.preventDefault();
if (!winInput.trim()) return;
const newWin: GrittyWin = {
id: Date.now().toString(),
name: "You",
track: "Coursera Track",
text: winInput,
reactions: { resilience: 1, withYou: 1, rocket: 1 },
};
setWins($$newWin, ...wins$$);
setWinInput("");
triggerToast("🚀 Gritty win posted! Your persistence inspires the cohort.");
};// --- 5. INTERACTIVE LAB CHECKPOINT ---
const $$checkpointStatus, setCheckpointStatus$$ = useState<"idle" | "green" | "yellow" | "red">("idle");return ({/* --- AMBIENT TOAST NOTIFICATION --- */}
{toastMessage && ({toastMessage})}  {/* --- PRESENCE RADAR BAR --- */}
  <section aria-label="Presence Radar" className="border-b border-gray-800 bg-[#17191d]/90 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
    <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
        <span className="text-sm font-medium text-gray-200">
          <strong className="text-white font-bold">{onlineCount} LeadWise learners</strong> grinding through labs right now
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => handleSendNudge("coffee")}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-gray-800/80 hover:bg-[#25282e] text-gray-300 hover:text-white border border-gray-700 hover:border-fuchsia-500/30 transition-all"
        >
          <Coffee size={14} className="text-amber-400" />
          <span>Send Warm Coffee</span>
        </button>
        <button
          onClick={() => handleSendNudge("highfive")}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-gray-800/80 hover:bg-[#25282e] text-gray-300 hover:text-white border border-gray-700 hover:border-fuchsia-500/30 transition-all"
        >
          <span>👏 High Five All</span>
        </button>
      </div>
    </div>
  </section>

  <main className="max-w-6xl mx-auto px-4 py-10 space-y-12">
    {/* --- HEADER BANNER --- */}
    <header className="text-center max-w-2xl mx-auto">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-300 text-xs font-bold mb-4 uppercase tracking-widest">
        <Radio size={12} className="animate-pulse" /> Community Living Room
      </div>
      <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
        Belonging Before Brilliance
      </h1>
      <p className="text-gray-400 mt-3 text-base md:text-lg">
        "Because brilliance is everywhere. Belonging is rare." Drop in, co-work, share roadblocks, or celebrate gritty wins.
      </p>
    </header>

    {/* --- SECTION 1: THE VIRTUAL STUDY HALL & DROP-IN ROOMS --- */}
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Card A: Silent Library & Synchronized Pomodoro */}
      <div className="bg-[#17191d] border border-gray-800 rounded-3xl p-6 flex flex-col justify-between hover:border-fuchsia-500/30 transition-all">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-fuchsia-400">
              <BookOpen size={16} /> Room A: Silent Library
            </span>
            <span className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
              14 Focusers
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">
            {isBreak ? "☕ Break Window" : "Quiet Focus Sprint"}
          </h3>
          <p className="text-xs text-gray-400 mb-6">
            Mics muted, zero pressure body doubling. Work side-by-side with peers.
          </p>

          {/* Timer Display */}
          <div className="text-center py-4 bg-[#121417] rounded-2xl border border-gray-800/80 mb-6">
            <div className="text-4xl font-black font-mono tracking-wider text-white">
              {String(pomoMinutes).padStart(2, "0")}:{String(pomoSeconds).padStart(2, "0")}
            </div>
            <div className="text-[11px] text-gray-500 uppercase mt-1 font-semibold">
              {isBreak ? "Rest & Stretch" : "Deep Lab Focus (25m)"}
            </div>
          </div>

          {/* Timer Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setIsPomoRunning(!isPomoRunning)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-fuchsia-600 hover:bg-fuchsia-500 text-white transition-all"
            >
              {isPomoRunning ? <Pause size={14} /> : <Play size={14} />}
              {isPomoRunning ? "Pause" : "Start Sprint"}
            </button>
            <button
              onClick={resetPomodoro}
              title="Reset Timer"
              className="p-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 transition-all"
            >
              <RotateCcw size={14} />
            </button>
            <button
              onClick={toggleAmbientSound}
              title={isAmbientPlaying ? "Mute Lo-Fi Rain" : "Play Lo-Fi Rain Audio"}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                isAmbientPlaying
                  ? "bg-fuchsia-950/40 border-fuchsia-500/50 text-[#f0abfc]"
                  : "bg-gray-800 border-gray-700 text-gray-400 hover:text-white"
              }`}
            >
              {isAmbientPlaying ? <Volume2 size={14} /> : <VolumeX size={14} />}
              <span>{isAmbientPlaying ? "Lo-Fi Rain On" : "Lo-Fi Rain"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Card B: The Break Room */}
      <div className="bg-[#17191d] border border-gray-800 rounded-3xl p-6 flex flex-col justify-between hover:border-fuchsia-500/30 transition-all">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Coffee size={16} /> Room B: The Break Room
            </span>
            <span className="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">
              3 in Watercooler
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Casual Voice Lounge</h3>
          <p className="text-xs text-gray-400 mb-6">
            Step away from the screen for 5 minutes. Grab water, chat about your week, or relax.
          </p>

          <div className="p-4 rounded-2xl bg-[#121417] border border-gray-800/80 mb-6">
            <div className="text-xs font-bold text-fuchsia-300 uppercase tracking-wider mb-1">
              Today's Prompt:
            </div>
            <p className="text-sm text-gray-300 italic">
              "What's one tech term that sounded like complete nonsense until this week?"
            </p>
          </div>
        </div>

        <a
          href="https://meet.google.com" 
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-xs bg-gray-800 hover:bg-[#25282e] text-white border border-gray-700 hover:border-gray-600 transition-all"
        >
          <span>Join Break Voice Channel</span>
          <ExternalLink size={14} />
        </a>
      </div>

      {/* Card C: The Stuck Bench (Rescue Pod) */}
      <div className="bg-[#17191d] border border-gray-800 rounded-3xl p-6 flex flex-col justify-between hover:border-fuchsia-500/30 transition-all">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400">
              <HelpCircle size={16} /> Room C: The Stuck Bench
            </span>
            <span className="text-xs bg-rose-500/10 border border-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full">
              {stuckTickets.length} Waiting
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No Question is Too Basic</h3>
          <p className="text-xs text-gray-400 mb-4">
            Hate banging your head against syntax errors? Signal for a 15-minute screen-share.
          </p>

          {/* Bench Tickets Feed */}
          <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-1">
            {stuckTickets.map((t) => (
              <div
                key={t.id}
                className="p-3 bg-[#121417] border border-gray-800 rounded-xl text-left"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-gray-200">{t.learnerName}</span>
                  <span className="text-gray-500">{t.timeAgo}</span>
                </div>
                <div className="text-[11px] font-semibold text-fuchsia-400 mb-1">
                  {t.module}
                </div>
                <p className="text-xs text-gray-400 line-clamp-2 mb-2">{t.description}</p>
                {t.claimedBy ? (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    {t.claimedBy}
                  </span>
                ) : (
                  <button
                    onClick={() => handleClaimTicket(t.id)}
                    className="w-full text-center py-1 text-[11px] font-bold bg-fuchsia-600/20 hover:bg-fuchsia-600/40 text-fuchsia-300 border border-fuchsia-500/30 rounded-lg transition-all"
                  >
                    🪑 Pull Up a Chair (Unblock 15m)
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowBenchModal(true)}
          className="w-full py-3 rounded-2xl font-bold text-xs bg-rose-600/90 hover:bg-rose-500 text-white transition-all shadow-lg shadow-rose-950/20"
        >
          Sit on the Bench (Ask for Help)
        </button>
      </div>
    </section>

    {/* --- MODAL: SIT ON THE BENCH --- */}
    {showBenchModal && (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-[#17191d] border border-gray-700 rounded-3xl max-w-md w-full p-6 relative">
          <h3 className="text-xl font-bold text-white mb-2">Pull Up to the Stuck Bench</h3>
          <p className="text-xs text-gray-400 mb-4">
            What hurdle are you facing? A fellow peer or mentor will hop into a 15-minute screen share with you.
          </p>
          <form onSubmit={handleCreateTicket} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Course Module or Lab Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Google Cybersecurity Week 3 - Linux Bash"
                value={newTicketModule}
                onChange={(e) => setNewTicketModule(e.target.value)}
                className="w-full bg-[#121417] border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                What is happening? (Paste error code or symptom)
              </label>
              <textarea
                rows={3}
                required
                placeholder="e.g. Terminal says Permission Denied even after I run chmod +x..."
                value={newTicketDesc}
                onChange={(e) => setNewTicketDesc(e.target.value)}
                className="w-full bg-[#121417] border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowBenchModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-fuchsia-600 hover:bg-fuchsia-500 text-white transition-all"
              >
                Post to Bench
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    {/* --- SECTION 2: INTERACTIVE FOLLOW-ALONG LAB MEETUP CARD --- */}
    <section className="bg-gradient-to-r from-[#17191d] via-[#1c1a24] to-[#17191d] border border-fuchsia-500/30 rounded-3xl p-6 md:p-8 relative overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" /> Live Interactive Lab
          </span>
          <span className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded-full border border-gray-700">
            Driver & Navigator Format
          </span>
        </div>
        <div className="text-xs text-gray-400">
          Prerequisite: <strong className="text-fuchsia-300">Coursera Lab #4 ready in side tab</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-bold text-white mb-2">
            "Break My Setup": Troubleshooting Firewalls Live
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            We have prepared an intentionally broken cloud virtual machine with corrupted iptables rules.
            Touch the keys, suggest diagnostic commands, and troubleshoot errors together in real time.
          </p>
          
          {/* Traffic Light Checkpoints */}
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
              Traffic Light Checkpoint: Are you keeping pace with the instructor?
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setCheckpointStatus("green");
                  triggerToast("🟢 Logged: You're good to go!");
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                  checkpointStatus === "green"
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                    : "bg-gray-800/80 border-gray-700 text-gray-300 hover:text-white"
                }`}
              >
                <CheckCircle2 size={15} className="text-emerald-400" />
                <span>🟢 Command Worked, Moving On</span>
              </button>
              <button
                onClick={() => {
                  setCheckpointStatus("yellow");
                  triggerToast("🟡 Speaker alerted: Pausing 60s for catch-up.");
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                  checkpointStatus === "yellow"
                    ? "bg-amber-500/20 border-amber-500 text-amber-300"
                    : "bg-gray-800/80 border-gray-700 text-gray-300 hover:text-white"
                }`}
              >
                <span>🟡 Need 60 Seconds</span>
              </button>
              <button
                onClick={() => {
                  setCheckpointStatus("red");
                  triggerToast("🔴 Assistance requested: Mentor looking at chat!");
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                  checkpointStatus === "red"
                    ? "bg-rose-500/20 border-rose-500 text-rose-300"
                    : "bg-gray-800/80 border-gray-700 text-gray-300 hover:text-white"
                }`}
              >
                <AlertTriangle size={15} className="text-rose-400" />
                <span>🔴 Got Error Code</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 justify-center items-center lg:items-end">
          <a
            href="https://meet.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-black text-sm bg-[#f0abfc] text-[#17191d] hover:bg-white transition-all transform hover:scale-[1.02] shadow-xl"
          >
            <Video size={18} />
            <span>Join Lab Stream</span>
          </a>
          <span className="text-[11px] text-gray-400">
            Driver: Alum Marcus T. • Navigator: LeadWise Mentor
          </span>
        </div>
      </div>
    </section>

    {/* --- SECTION 3: THE GRITTY WINS (THE ANTI-PODIUM) --- */}
    <section className="bg-[#17191d] border border-gray-800 rounded-3xl p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-fuchsia-400 mb-1">
            <Flame size={16} /> The Anti-Podium Feed
          </div>
          <h3 className="text-2xl font-bold text-white">The Gritty Wins</h3>
          <p className="text-xs text-gray-400 mt-1">
            No podium finishes required. We celebrate the messy, stubborn breakthroughs that take true grit.
          </p>
        </div>
      </div>

      {/* Win Input Box */}
      <form onSubmit={handlePostWin} className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="What gave you a hard time this week that you pushed through anyway?"
            value={winInput}
            onChange={(e) => setWinInput(e.target.value)}
            className="w-full bg-[#121417] border border-gray-700 rounded-2xl py-4 pl-5 pr-28 text-sm text-white focus:outline-none focus:border-[#f0abfc] transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 px-5 bg-white text-[#17191d] hover:bg-[#f0abfc] font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
          >
            <span>Share</span>
            <Send size={13} />
          </button>
        </div>
      </form>

      {/* Wins Stream */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {wins.map((win) => (
          <div
            key={win.id}
            className="bg-[#121417] border border-gray-800/80 rounded-2xl p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white">{win.name}</span>
                <span className="text-[10px] text-fuchsia-400/80 uppercase font-bold tracking-wider">
                  {win.track}
                </span>
              </div>
              <p className="text-sm text-gray-300 mb-4 leading-relaxed">"{win.text}"</p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-gray-800">
              <button
                onClick={() => handleReactWin(win.id, "resilience")}
                className="flex items-center gap-1 text-[11px] font-semibold bg-gray-800/60 hover:bg-gray-800 text-gray-300 px-2.5 py-1 rounded-lg transition-all"
              >
                <span>👏</span> <span>{win.reactions.resilience}</span>
              </button>
              <button
                onClick={() => handleReactWin(win.id, "withYou")}
                className="flex items-center gap-1 text-[11px] font-semibold bg-gray-800/60 hover:bg-gray-800 text-gray-300 px-2.5 py-1 rounded-lg transition-all"
              >
                <span>❤️</span> <span>{win.reactions.withYou}</span>
              </button>
              <button
                onClick={() => handleReactWin(win.id, "rocket")}
                className="flex items-center gap-1 text-[11px] font-semibold bg-gray-800/60 hover:bg-gray-800 text-gray-300 px-2.5 py-1 rounded-lg transition-all"
              >
                <span>🚀</span> <span>{win.reactions.rocket}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* --- SECTION 4: YOUR ORIGINAL 1-ON-1 GUIDANCE SECTION --- */}
    <section className="text-center py-12 px-4 bg-[#17191d] border border-gray-800 rounded-3xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-500/5 to-transparent pointer-events-none" />
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/20 border border-fuchsia-500/30 text-fuchsia-300 text-xs font-bold mb-6 uppercase tracking-widest">
          <Video size={12} /> 1-on-1 Guidance
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Live Weekly Meet</h2>
        <p className="text-gray-400 max-w-xl mx-auto mb-8 text-base md:text-lg leading-relaxed">
          Need dedicated support? Learners can now book a live sync with a LeadWise admin to unblock technical hurdles or discuss career goals.
        </p>
        <a
          href={process.env.NEXT_PUBLIC_CALENDAR_LINK || "https://calendar.app.google/1AXYeyfAXczZ2wi1A"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-white text-[#25282e] px-10 py-5 rounded-2xl font-black hover:bg-[#f0abfc] transition-all transform hover:scale-[1.02] shadow-2xl hover:shadow-[#f0abfc]/20 group"
        >
          <CalendarDays size={20} className="group-hover:rotate-12 transition-transform" />
          <span>Schedule on Google Calendar</span>
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </section>
  </main>
</div>

);
}
