<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>LeadWise Tech Collective // Community Bulletin & Opportunity Board</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  
  <style>
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background-color: #07090e;
      background-image: 
        radial-gradient(ellipse 80% 50% at 50% -10%, rgba(216, 180, 254, 0.18), transparent 70%),
        radial-gradient(ellipse 60% 40% at 90% 100%, rgba(192, 132, 252, 0.12), transparent 60%),
        linear-gradient(rgba(216, 180, 254, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(216, 180, 254, 0.03) 1px, transparent 1px);
      background-size: 100% 100%, 100% 100%, 36px 36px, 36px 36px;
    }

    .font-mono-code {
      font-family: 'Fira Code', monospace;
    }

    /* Holographic glass surface styling */
    .leadwise-card {
      background: linear-gradient(135deg, rgba(25, 28, 42, 0.65) 0%, rgba(14, 16, 26, 0.8) 100%);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(216, 180, 254, 0.18);
      box-shadow: 
        0 8px 32px 0 rgba(0, 0, 0, 0.6), 
        inset 0 1px 1px 0 rgba(255, 255, 255, 0.12),
        0 0 15px -3px rgba(216, 180, 254, 0.05);
      position: relative;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* Hologram card corner reticles & glass highlight */
    .leadwise-card::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      padding: 1px;
      background: linear-gradient(135deg, rgba(245, 208, 254, 0.4), transparent 50%, rgba(192, 132, 252, 0.2));
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
    }

    .leadwise-card:hover {
      transform: translateY(-4px) scale(1.008);
      border-color: rgba(232, 121, 249, 0.55);
      box-shadow: 
        0 20px 40px -8px rgba(0, 0, 0, 0.8), 
        0 0 30px 2px rgba(216, 180, 254, 0.22),
        inset 0 1px 2px 0 rgba(255, 255, 255, 0.25);
    }

    /* Sci-fi corner brackets */
    .corner-bracket {
      position: absolute;
      width: 10px;
      height: 10px;
      border-color: rgba(216, 180, 254, 0.45);
      pointer-events: none;
      transition: all 0.25s ease;
    }
    .corner-tl { top: 6px; left: 6px; border-top: 2px solid; border-left: 2px solid; border-top-left-radius: 4px; }
    .corner-tr { top: 6px; right: 6px; border-top: 2px solid; border-right: 2px solid; border-top-right-radius: 4px; }
    .corner-bl { bottom: 6px; left: 6px; border-bottom: 2px solid; border-left: 2px solid; border-bottom-left-radius: 4px; }
    .corner-br { bottom: 6px; right: 6px; border-bottom: 2px solid; border-right: 2px solid; border-bottom-right-radius: 4px; }

    .leadwise-card:hover .corner-bracket {
      border-color: #f5d0fe;
      box-shadow: 0 0 8px rgba(245, 208, 254, 0.8);
    }

    /* Holographic prismatic text gradient */
    .text-lilac-gradient {
      background: linear-gradient(135deg, #ffffff 0%, #f5d0fe 35%, #d8b4fe 65%, #c084fc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 30px rgba(216, 180, 254, 0.35);
    }

    /* Hologram glow capsule */
    .holo-badge {
      background: rgba(192, 132, 252, 0.1);
      backdrop-filter: blur(8px);
      box-shadow: 0 0 12px rgba(216, 180, 254, 0.15), inset 0 0 8px rgba(216, 180, 254, 0.1);
    }

    /* Custom smooth scrollbar */
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background: #0c0e14;
    }
    ::-webkit-scrollbar-thumb {
      background: #272a38;
      border-radius: 9999px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #c084fc;
    }
  </style>
</head>
<body class="text-slate-100 min-h-screen flex flex-col selection:bg-fuchsia-500 selection:text-white">

  <header class="border-b border-purple-500/20 bg-[#07090e]/75 backdrop-blur-xl sticky top-0 z-40 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
      
      <!-- Brand & Community Identity -->
      <div class="flex items-center space-x-3.5">
        <div class="relative w-10 h-10 rounded-xl bg-purple-950/40 backdrop-blur-md border border-purple-400/50 flex items-center justify-center text-purple-300 font-bold shadow-[0_0_15px_rgba(216,180,254,0.25)]">
          <span class="absolute inset-0 rounded-xl bg-purple-400/20 animate-pulse pointer-events-none"></span>
          <svg class="w-5 h-5 text-fuchsia-300 relative z-10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L1 21h22L12 2zm0 3.84L19.5 19h-15L12 5.84zM11 11h2v4h-2zm0 5h2v2h-2z"/>
          </svg>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-base sm:text-lg font-extrabold tracking-tight text-white drop-shadow-[0_0_12px_rgba(216,180,254,0.3)]">
              LeadWise <span class="text-lilac-gradient font-black">Tech Collective</span>
            </h1>
            <span class="text-[10px] font-mono-code px-2 py-0.5 rounded-full holo-badge text-purple-300 border border-purple-400/30">
              ⬡ HoloGrid
            </span>
          </div>
          <p class="text-xs text-purple-200/60 font-mono-code">Where learners, mentors, and career changers connect</p>
        </div>
      </div>

      <!-- Live Community Presence Indicators -->
      <div class="hidden lg:flex items-center gap-4 text-xs font-medium text-slate-300 border-x border-purple-400/20 px-5 py-1.5 rounded-2xl bg-purple-950/20 backdrop-blur-md shadow-inner">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"></span>
          <span>Live Labs: <strong class="text-emerald-300 font-semibold" id="telemetry-labs">4 Active</strong></span>
        </div>
        <span class="text-purple-400/30">|</span>
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-fuchsia-400 shadow-[0_0_8px_#e879f9] animate-pulse"></span>
          <span>Study Room: <strong class="text-fuchsia-300 font-semibold" id="telemetry-learners">38 Online</strong></span>
        </div>
        <span class="text-purple-400/30">|</span>
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]"></span>
          <span>Mentors: <strong class="text-amber-300 font-semibold">2 Slots Open</strong></span>
        </div>
      </div>

      <!-- Action & Sound Controls -->
      <div class="flex items-center gap-2.5">
        <button onclick="toggleAudioFx()" id="audio-toggle-btn" class="p-2 rounded-xl bg-purple-950/30 backdrop-blur-md border border-purple-400/25 hover:border-purple-300 text-purple-300 text-xs font-mono-code transition hover:shadow-[0_0_15px_rgba(216,180,254,0.2)]" title="Toggle Sound Feedback">
          🔊 SFX: ON
        </button>

        <button onclick="openModal()" class="inline-flex items-center gap-2 bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 hover:from-purple-300 hover:to-pink-300 text-slate-950 font-extrabold px-4 py-2 rounded-xl text-xs tracking-wide shadow-[0_0_25px_rgba(216,180,254,0.4)] hover:shadow-[0_0_35px_rgba(216,180,254,0.6)] transition transform hover:scale-[1.02]">
          <svg class="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke_linecap="round" stroke_linejoin="round" d="M12 4v16m8-8H4"/></svg>
          Share Opportunity
        </button>
      </div>

    </div>
  </header>

  <section class="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-6 pb-2">
    <div class="leadwise-card rounded-3xl p-6 sm:p-9 text-center relative overflow-hidden">
      <!-- Cyber corner accents -->
      <div class="corner-bracket corner-tl"></div>
      <div class="corner-bracket corner-tr"></div>
      <div class="corner-bracket corner-bl"></div>
      <div class="corner-bracket corner-br"></div>

      <!-- Holographic ambient orb backdrop -->
      <div class="absolute -top-32 left-1/2 -translate-x-1/2 w-[32rem] h-56 bg-gradient-to-b from-purple-500/25 via-fuchsia-500/15 to-transparent blur-3xl pointer-events-none rounded-full"></div>
      
      <div class="relative z-10">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          Belonging before brilliance.
        </h2>
        <p class="text-base sm:text-lg font-bold text-lilac-gradient max-w-xl mx-auto mb-3">
          Because brilliance is everywhere. Belonging is rare.
        </p>
        <p class="text-xs sm:text-sm text-slate-300/80 max-w-2xl mx-auto leading-relaxed font-light">
          You don't have to learn alone. This is a support system where we share workshops, ask questions, announce study groups, and help each other move forward into tech careers.
        </p>

        <!-- Action Row -->
        <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button onclick="joinStudyRoomAlert()" class="text-xs font-semibold px-4 py-2.5 rounded-xl bg-purple-950/50 hover:bg-purple-900/60 text-purple-200 border border-purple-400/35 hover:border-purple-300 transition flex items-center gap-2 shadow-[0_0_15px_rgba(216,180,254,0.15)] hover:shadow-[0_0_20px_rgba(216,180,254,0.3)] backdrop-blur-md">
            <span class="animate-pulse">🎧</span> Enter Live Study Voice Room
          </button>
          <button onclick="bookMentorAlert()" class="text-xs font-semibold px-4 py-2.5 rounded-xl bg-fuchsia-950/40 hover:bg-fuchsia-900/50 text-fuchsia-200 border border-fuchsia-400/35 hover:border-fuchsia-300 transition flex items-center gap-2 shadow-[0_0_15px_rgba(232,121,249,0.15)] hover:shadow-[0_0_20px_rgba(232,121,249,0.3)] backdrop-blur-md">
            <span>🎯</span> Book 1-on-1 Mentorship
          </button>
        </div>
      </div>
    </div>

    <!-- Filter Bar with glass aesthetic -->
    <div class="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-purple-500/20 pb-4">
      <div class="inline-flex rounded-xl bg-purple-950/30 backdrop-blur-md p-1 border border-purple-400/25 text-xs shadow-inner">
        <button id="filter-all" onclick="setCategoryFilter('all')" class="px-4 py-2 rounded-lg font-bold transition bg-gradient-to-r from-purple-400 to-fuchsia-400 text-slate-950 shadow-[0_0_15px_rgba(216,180,254,0.3)]">
          All Opportunities
        </button>
        <button id="filter-networking" onclick="setCategoryFilter('Networking')" class="px-4 py-2 rounded-lg font-medium text-purple-200/70 hover:text-purple-200 transition">
          Networking & Workshops
        </button>
        <button id="filter-discussion" onclick="setCategoryFilter('General Discussion')" class="px-4 py-2 rounded-lg font-medium text-purple-200/70 hover:text-purple-200 transition">
          General Discussion & Wins
        </button>
      </div>

      <!-- Sorter Button -->
      <div class="flex items-center gap-2 text-xs text-slate-400">
        <span class="text-amber-300 font-mono-code flex items-center gap-1">⚡ SORT:</span>
        <button onclick="toggleSortMode()" id="sort-toggle-btn" class="px-3.5 py-1.5 rounded-xl bg-purple-950/40 backdrop-blur-md border border-purple-400/25 text-purple-200 hover:text-white hover:border-purple-300 hover:shadow-[0_0_15px_rgba(216,180,254,0.2)] transition font-mono-code">
          Top Boosted First
        </button>
      </div>
    </div>
  </section>

  <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
    <!-- Posts Grid -->
    <div id="posts-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
      <!-- Injected dynamically -->
    </div>

    <!-- Empty State -->
    <div id="empty-state" class="hidden text-center py-20">
      <div class="inline-block leadwise-card p-8 rounded-3xl max-w-md border-dashed border-purple-400/30">
        <div class="text-3xl mb-3 text-purple-300 font-mono-code">⚡ NO_POSTS_FOUND</div>
        <p class="text-sm text-slate-200 font-semibold">No discussions or opportunities matching this filter.</p>
        <p class="text-xs text-slate-400 mt-2">Be the first learner to post an event, workshop voucher, or encouragement.</p>
        <button onclick="openModal()" class="mt-4 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-400/40 rounded-xl text-xs font-bold transition">
          + Share First Opportunity
        </button>
      </div>
    </div>
  </main>

  <div id="post-modal" class="fixed inset-0 bg-[#0c0e14]/85 backdrop-blur-md z-50 hidden flex items-center justify-center p-4">
    <div class="leadwise-card rounded-3xl w-full max-w-lg border border-purple-400/30 shadow-[0_0_50px_rgba(216,180,254,0.15)] overflow-hidden">
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-white/[0.08] flex justify-between items-center bg-[#13151f]">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-fuchsia-400 animate-ping"></span>
          <h3 class="font-bold text-sm text-white tracking-wide">
            Share Opportunity with the Collective
          </h3>
        </div>
        <button onclick="closeModal()" class="text-slate-400 hover:text-white text-2xl leading-none">&times;</button>
      </div>

      <!-- Post Form conforming strictly to tested API constraints -->
      <form id="new-post-form" onsubmit="handleCreatePost(event)" class="p-6 space-y-4 text-xs">
        <div>
          <label class="block text-slate-300 font-medium mb-1 flex items-center justify-between">
            <span>Your Handle / Name</span>
            <span class="text-[10px] text-fuchsia-300 font-mono-code">Identity: Verified Learner</span>
          </label>
          <input type="text" id="post-author" required placeholder="e.g. Alex" class="w-full px-3.5 py-2.5 bg-[#0e1017] border border-white/[0.1] rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" />
        </div>

        <div>
          <label class="block text-slate-300 font-medium mb-1">Category (LeadWise Channel)</label>
          <select id="post-category" required class="w-full px-3.5 py-2.5 bg-[#0e1017] border border-white/[0.1] rounded-xl text-slate-100 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400">
            <option value="Networking">Networking (Workshops, Meetups, Referrals)</option>
            <option value="General Discussion">General Discussion (Wins, Questions, Roadmap)</option>
          </select>
          <p class="text-[10px] text-slate-500 mt-1">Conforms to backend API schema (/api/forum/posts).</p>
        </div>

        <div>
          <label class="block text-slate-300 font-medium mb-1">Opportunity / Post Title</label>
          <input type="text" id="post-title" required placeholder="e.g. Free AWS Cloud Practitioner Voucher Study Group" class="w-full px-3.5 py-2.5 bg-[#0e1017] border border-white/[0.1] rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" />
        </div>

        <div>
          <label class="block text-slate-300 font-medium mb-1">Description & Details</label>
          <textarea id="post-content" required rows="4" placeholder="Share context, dates, links, or when to meet in the live study room..." class="w-full px-3.5 py-2.5 bg-[#0e1017] border border-white/[0.1] rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"></textarea>
        </div>

        <!-- Tech Track Tag Selection -->
        <div>
          <label class="block text-slate-400 mb-1 text-[11px]">IT Career Track Badge</label>
          <div class="flex flex-wrap gap-1.5" id="tag-selector">
            <button type="button" onclick="selectTechTag('Cloud/DevOps')" class="tag-opt px-2.5 py-1 rounded-lg bg-[#0e1017] border border-purple-400/30 text-purple-300 hover:bg-purple-950/40">#Cloud/DevOps</button>
            <button type="button" onclick="selectTechTag('Cybersecurity')" class="tag-opt px-2.5 py-1 rounded-lg bg-[#0e1017] border border-pink-400/30 text-pink-300 hover:bg-pink-950/40">#Cybersecurity</button>
            <button type="button" onclick="selectTechTag('FullStack')" class="tag-opt px-2.5 py-1 rounded-lg bg-[#0e1017] border border-blue-400/30 text-blue-300 hover:bg-blue-950/40">#FullStack</button>
            <button type="button" onclick="selectTechTag('Data & AI')" class="tag-opt px-2.5 py-1 rounded-lg bg-[#0e1017] border border-amber-400/30 text-amber-300 hover:bg-amber-950/40">#Data & AI</button>
          </div>
          <input type="hidden" id="selected-tech-tag" value="Cloud/DevOps" />
        </div>

        <div class="flex justify-end gap-3 pt-3 border-t border-white/[0.08]">
          <button type="button" onclick="closeModal()" class="px-4 py-2 text-slate-400 hover:text-slate-200 transition">Cancel</button>
          <button type="submit" class="px-5 py-2.5 font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 hover:from-purple-300 hover:to-fuchsia-300 text-slate-950 rounded-xl shadow-lg transition">
            Post to Collective
          </button>
        </div>
      </form>
    </div>
  </div>

  <div id="detail-modal" class="fixed inset-0 bg-[#0c0e14]/85 backdrop-blur-md z-50 hidden flex items-center justify-center p-4">
    <div class="leadwise-card rounded-3xl w-full max-w-xl border border-purple-400/30 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-white/[0.08] flex justify-between items-start bg-[#13151f]">
        <div>
          <div class="flex items-center gap-2 mb-1.5">
            <span id="detail-category-tag" class="text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">Category</span>
            <span id="detail-tech-badge" class="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30">#Tech</span>
          </div>
          <h3 id="detail-title" class="font-bold text-lg text-white tracking-tight leading-snug">Note Title</h3>
        </div>
        <button onclick="closeDetailModal()" class="text-slate-400 hover:text-white text-2xl leading-none">&times;</button>
      </div>

      <!-- Main Note Body -->
      <div class="p-6 border-b border-white/[0.08] bg-[#0f1118] overflow-y-auto">
        <p id="detail-content" class="text-slate-200 text-sm leading-relaxed whitespace-pre-line"></p>
        
        <div class="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-purple-400"></span>
            <span id="detail-author" class="text-purple-300 font-semibold">Author</span>
          </div>
          <span id="detail-time" class="text-slate-500 font-mono-code">10m ago</span>
        </div>
      </div>

      <!-- Comments Stream -->
      <div class="px-6 py-3 bg-[#13151f] border-b border-white/[0.08] text-xs font-semibold text-slate-400 flex items-center justify-between">
        <span class="flex items-center gap-1.5">
          <span>💬</span> Peer Responses & Collaboration
        </span>
        <span id="detail-reply-count" class="text-purple-300 font-mono-code">0 Responses</span>
      </div>
      <div class="flex-1 overflow-y-auto p-6 space-y-3 bg-[#0c0e14]" id="comments-list">
        <!-- Rendered comments -->
      </div>

      <!-- Add Reply Input -->
      <form onsubmit="handleSendReply(event)" class="p-4 border-t border-white/[0.08] bg-[#13151f] flex flex-col gap-2">
        <div class="flex gap-2">
          <input type="text" id="reply-author" placeholder="Your Handle" required class="w-1/3 px-3 py-2 bg-[#0c0e14] border border-white/[0.1] rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-400" />
          <input type="text" id="reply-content" placeholder="Share your thoughts or join this group..." required class="flex-1 px-3 py-2 bg-[#0c0e14] border border-white/[0.1] rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-400" />
          <button type="submit" class="px-4 py-2 bg-gradient-to-r from-purple-400 to-fuchsia-400 hover:from-purple-300 hover:to-fuchsia-300 text-slate-950 rounded-xl text-xs font-bold transition shadow-sm">
            Reply
          </button>
        </div>
      </form>
    </div>
  </div>

  <div id="toast-box" class="fixed bottom-6 right-6 z-50 hidden transition-all duration-300 transform translate-y-2">
    <div class="leadwise-card px-4 py-3 rounded-2xl border border-purple-400/40 flex items-center gap-3 bg-[#161822]/95 shadow-2xl">
      <span class="text-purple-300 text-lg" id="toast-icon">✨</span>
      <div class="text-xs">
        <p class="font-bold text-white" id="toast-title">Notification</p>
        <p class="text-slate-400 text-[11px]" id="toast-msg">Detail description here</p>
      </div>
      <button onclick="dismissToast()" class="text-slate-400 hover:text-white text-base ml-2 leading-none">&times;</button>
    </div>
  </div>

  <script>
    // State matching LeadWise backend schema and unit tests
    let currentCategoryFilter = 'all';
    let activePostId = null;
    let sortByUpvotes = true;
    let sfxEnabled = true;

    // Web Audio Synthesizer (Warm acoustic tones)
    let audioCtx = null;
    function playBeep(freq = 520, type = 'sine', duration = 0.1) {
      if (!sfxEnabled) return;
      try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } catch (e) {
        // Fallback for browsers with restricted autoplay
      }
    }

    function toggleAudioFx() {
      sfxEnabled = !sfxEnabled;
      const btn = document.getElementById('audio-toggle-btn');
      btn.innerText = sfxEnabled ? '🔊 SFX: ON' : '🔇 SFX: OFF';
      btn.classList.toggle('text-purple-300', sfxEnabled);
      btn.classList.toggle('text-slate-500', !sfxEnabled);
      showToast(sfxEnabled ? 'Audio Chimes Active' : 'Audio Muted', 'Feedback sound settings updated.');
    }

    let records = [
      {
        id: 'post-1',
        title: 'Free Linux Foundation & Kubernetes Workshop this Saturday!',
        content: 'Found an open registration for container security and CKAD prep. Let us group up in the Live Study Room 2 hours prior to work on hands-on exercises together.',
        category: 'Networking',
        techTag: 'Cloud/DevOps',
        author: 'Sam',
        authorId: 'verified-learner',
        upvotes: 18,
        replies: 3,
        timeAgo: '15m ago',
        comments: [
          { author: 'Jordan', authorId: 'verified-learner', content: 'Huge find! RSVPing right now.' },
          { author: 'Elena', authorId: 'verified-learner', content: 'Count me in for the Live Study Room prep session.' },
          { author: 'Marcus', authorId: 'verified-learner', content: 'Does this cover ingress controllers? Looking forward!' }
        ]
      },
      {
        id: 'post-2',
        title: 'A small win: Deployed my first CI/CD pipeline on Docker',
        content: 'I finished my first lesson and automated testing passed! If anyone is stuck on asynchronous Node streams or Auth tokens, happy to hop into the voice room and share notes.',
        category: 'General Discussion',
        techTag: 'FullStack',
        author: 'Taylor',
        authorId: 'verified-learner',
        upvotes: 24,
        replies: 2,
        timeAgo: '1h ago',
        comments: [
          { author: 'Sam', authorId: 'verified-learner', content: 'Awesome job! Automating testing early prevents so many headaches.' },
          { author: 'Priya', authorId: 'verified-learner', content: 'Congratulations Taylor! Would love to peek at your YAML workflow.' }
        ]
      },
      {
        id: 'post-3',
        title: 'Mock Technical Interview Pair Wanted (Networking & SOC Basics)',
        content: 'Preparing for junior SOC analyst / IT support interviews. Looking for a study partner to run 45-minute timed sessions on subnetting and HTTP protocols on Tuesday evenings.',
        category: 'Networking',
        techTag: 'Cybersecurity',
        author: 'Alex',
        authorId: 'verified-learner',
        upvotes: 12,
        replies: 1,
        timeAgo: '3h ago',
        comments: [
          { author: 'Priya', authorId: 'verified-learner', content: 'I am on the same track! Sent you a ping in the study room.' }
        ]
      }
    ];

    function renderBoard() {
      const container = document.getElementById('posts-container');
      const emptyState = document.getElementById('empty-state');

      let filtered = records.filter(post => {
        if (currentCategoryFilter === 'all') return true;
        return post.category === currentCategoryFilter;
      });

      if (sortByUpvotes) {
        filtered.sort((a, b) => b.upvotes - a.upvotes);
      } else {
        filtered.sort((a, b) => b.id.localeCompare(a.id));
      }

      if (filtered.length === 0) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
      }

      emptyState.classList.add('hidden');
      container.innerHTML = filtered.map(post => {
        const isNetworking = post.category === 'Networking';
        const badgeColor = isNetworking 
          ? 'bg-purple-500/20 text-purple-200 border-purple-400/40 shadow-[0_0_10px_rgba(216,180,254,0.15)]' 
          : 'bg-fuchsia-500/20 text-fuchsia-200 border-fuchsia-400/40 shadow-[0_0_10px_rgba(232,121,249,0.15)]';

        const techBadgeColor = getTechBadgeStyle(post.techTag);

        return `
          <div class="leadwise-card rounded-2xl p-5 flex flex-col justify-between min-h-[250px] group cursor-pointer relative" onclick="openDetailModal('${post.id}')">
            <!-- Holographic corner brackets on individual cards -->
            <div class="corner-bracket corner-tl"></div>
            <div class="corner-bracket corner-tr"></div>
            <div class="corner-bracket corner-bl"></div>
            <div class="corner-bracket corner-br"></div>

            <!-- Glowing holographic LeadWise watermark badge -->
            <div class="absolute top-4 right-4 text-purple-300/10 pointer-events-none group-hover:text-purple-300/25 group-hover:scale-110 transition-all duration-300">
              <svg class="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a5 5 0 0 1 5 5c0 2.21-1.43 4.09-3.43 4.73L17 22l-5-2.5L7 22l3.43-10.27A5.002 5.002 0 0 1 12 2zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
              </svg>
            </div>

            <div class="relative z-10">
              <!-- Top Category & Tech Badges -->
              <div class="flex items-center justify-between gap-2 mb-3">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full border backdrop-blur-md ${badgeColor}">
                    ${escapeHtml(post.category)}
                  </span>
                  ${post.techTag ? `
                    <span class="text-[10px] font-mono-code px-2 py-0.5 rounded-full border backdrop-blur-md ${techBadgeColor}">
                      #${escapeHtml(post.techTag)}
                    </span>
                  ` : ''}
                </div>
                <span class="text-[10px] font-mono-code text-purple-300/60">${post.timeAgo || 'Just now'}</span>
              </div>

              <!-- Title -->
              <h3 class="text-base font-bold text-white group-hover:text-purple-200 transition-colors leading-snug mb-2 drop-shadow-sm">
                ${escapeHtml(post.title)}
              </h3>

              <!-- Content Preview -->
              <p class="text-xs text-slate-300/90 leading-relaxed line-clamp-4 font-normal">
                ${escapeHtml(post.content)}
              </p>
            </div>

            <!-- Footer: Author & Boost Signals -->
            <div class="pt-4 mt-4 border-t border-purple-500/15 flex items-center justify-between text-xs relative z-10" onclick="event.stopPropagation()">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-purple-950/80 border border-purple-400/40 flex items-center justify-center text-[10px] text-purple-200 font-bold shadow-[0_0_8px_rgba(216,180,254,0.2)]">
                  ${post.author.charAt(0).toUpperCase()}
                </div>
                <span class="text-slate-300 font-medium">${escapeHtml(post.author)}</span>
              </div>

              <div class="flex items-center gap-2">
                <button onclick="handleUpvote('${post.id}')" title="Boost this opportunity" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-950/50 backdrop-blur-md border border-purple-400/35 hover:border-purple-300 text-purple-200 font-bold transition hover:shadow-[0_0_15px_rgba(216,180,254,0.3)]">
                  <span class="text-xs">▲</span>
                  <span class="font-mono-code">${post.upvotes}</span>
                </button>
                <button onclick="openDetailModal('${post.id}')" title="View thread" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-950/30 backdrop-blur-md border border-purple-400/20 hover:border-purple-400/40 text-purple-300/80 hover:text-purple-200 transition">
                  <span>💬</span>
                  <span class="font-mono-code">${post.replies}</span>
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    function getTechBadgeStyle(tag) {
      switch(tag) {
        case 'Cybersecurity': return 'bg-pink-500/20 text-pink-300 border-pink-400/40 shadow-[0_0_10px_rgba(244,114,182,0.15)]';
        case 'FullStack': return 'bg-blue-500/20 text-blue-300 border-blue-400/40 shadow-[0_0_10px_rgba(96,165,250,0.15)]';
        case 'Data & AI': return 'bg-amber-500/20 text-amber-300 border-amber-400/40 shadow-[0_0_10px_rgba(251,191,36,0.15)]';
        case 'Cloud/DevOps':
        default: return 'bg-purple-500/20 text-purple-300 border-purple-400/40 shadow-[0_0_10px_rgba(216,180,254,0.15)]';
      }
    }

    function selectTechTag(tag) {
      document.getElementById('selected-tech-tag').value = tag;
      document.querySelectorAll('.tag-opt').forEach(btn => {
        if (btn.innerText.includes(tag)) {
          btn.classList.add('ring-2', 'ring-purple-400');
        } else {
          btn.classList.remove('ring-2', 'ring-purple-400');
        }
      });
      playBeep(620, 'sine', 0.05);
    }

    function setCategoryFilter(cat) {
      currentCategoryFilter = cat;
      const allBtn = document.getElementById('filter-all');
      const discBtn = document.getElementById('filter-discussion');
      const netBtn = document.getElementById('filter-networking');

      [allBtn, discBtn, netBtn].forEach(btn => {
        btn.className = "px-4 py-2 rounded-lg font-medium text-slate-400 hover:text-purple-300 transition";
      });

      const activeClass = "px-4 py-2 rounded-lg font-bold transition bg-gradient-to-r from-purple-400 to-fuchsia-400 text-slate-950 shadow-sm";
      if (cat === 'all') allBtn.className = activeClass;
      if (cat === 'General Discussion') discBtn.className = activeClass;
      if (cat === 'Networking') netBtn.className = activeClass;

      playBeep(480, 'sine', 0.05);
      renderBoard();
    }

    function toggleSortMode() {
      sortByUpvotes = !sortByUpvotes;
      document.getElementById('sort-toggle-btn').innerText = sortByUpvotes 
        ? 'Top Boosted First' 
        : 'Recent First';
      playBeep(520, 'sine', 0.05);
      renderBoard();
    }

    function handleCreatePost(e) {
      e.preventDefault();
      const rawTitle = document.getElementById('post-title').value;
      const rawContent = document.getElementById('post-content').value;
      const rawAuthor = document.getElementById('post-author').value;
      const category = document.getElementById('post-category').value;
      const techTag = document.getElementById('selected-tech-tag').value || 'Cloud/DevOps';

      // Trim whitespace matching unit tests requirement
      const title = rawTitle.trim();
      const content = rawContent.trim();
      const author = rawAuthor.trim();

      const allowedCategories = ['General Discussion', 'Networking'];
      if (!allowedCategories.includes(category)) {
        showToast('Invalid Category', 'Only approved LeadWise categories are accepted.');
        return;
      }
      if (!title || !content || !author) {
        showToast('Missing Fields', 'Please complete all required fields.');
        return;
      }

      const newPost = {
        id: 'post-' + Date.now(),
        title,
        content,
        category,
        techTag,
        author,
        authorId: 'verified-learner', // strictly assigned identity matching test suite
        upvotes: 0,
        replies: 0,
        timeAgo: 'Just now',
        comments: []
      };

      records.unshift(newPost);
      closeModal();
      document.getElementById('new-post-form').reset();
      
      playBeep(740, 'triangle', 0.12);
      showToast('Opportunity Shared! ✨', `Posted to ${category}`);
      renderBoard();
    }

    function handleUpvote(id) {
      const post = records.find(p => p.id === id);
      if (post) {
        post.upvotes += 1;
        playBeep(660, 'sine', 0.08);
        renderBoard();
        if (activePostId === id) {
          updateDetailView(post);
        }
        showToast('Boosted ⚡', `Added signal boost to "${post.title.slice(0, 24)}..."`);
      }
    }

    function handleSendReply(e) {
      e.preventDefault();
      const authorInput = document.getElementById('reply-author');
      const contentInput = document.getElementById('reply-content');
      const author = authorInput.value.trim();
      const content = contentInput.value.trim();

      if (!author || !content || !activePostId) return;

      const post = records.find(p => p.id === activePostId);
      if (post) {
        post.comments.push({
          author,
          authorId: 'verified-learner',
          content,
          timestamp: 'Just now'
        });
        post.replies = post.comments.length;
        contentInput.value = '';
        
        playBeep(680, 'sine', 0.08);
        renderBoard();
        updateDetailView(post);
        showToast('Response Shared', `Added comment by ${author}`);
      }
    }

    function openModal() {
      playBeep(520, 'sine', 0.05);
      document.getElementById('post-modal').classList.remove('hidden');
    }

    function closeModal() {
      document.getElementById('post-modal').classList.add('hidden');
    }

    function openDetailModal(id) {
      activePostId = id;
      const post = records.find(p => p.id === id);
      if (!post) return;

      playBeep(560, 'sine', 0.06);
      updateDetailView(post);
      document.getElementById('detail-modal').classList.remove('hidden');
    }

    function updateDetailView(post) {
      document.getElementById('detail-title').innerText = post.title;
      document.getElementById('detail-content').innerText = post.content;
      document.getElementById('detail-category-tag').innerText = post.category;
      document.getElementById('detail-tech-badge').innerText = `#${post.techTag || 'Tech'}`;
      document.getElementById('detail-author').innerText = `Posted by ${post.author}`;
      document.getElementById('detail-time').innerText = post.timeAgo || 'Just now';
      document.getElementById('detail-reply-count').innerText = `${post.comments.length} Responses`;

      const commentsContainer = document.getElementById('comments-list');
      if (post.comments.length === 0) {
        commentsContainer.innerHTML = '<p class="text-xs text-slate-500 italic">No replies yet. Start the conversation below!</p>';
      } else {
        commentsContainer.innerHTML = post.comments.map(c => `
          <div class="leadwise-card rounded-xl p-3.5 text-xs border-white/[0.06] bg-[#12141c]">
            <div class="flex items-center justify-between mb-1.5">
              <span class="font-bold text-purple-300">${escapeHtml(c.author)}</span>
              <span class="text-[9px] uppercase px-2 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-500/20">Verified Learner</span>
            </div>
            <p class="text-slate-300 leading-normal">${escapeHtml(c.content)}</p>
          </div>
        `).join('');
      }
    }

    function closeDetailModal() {
      document.getElementById('detail-modal').classList.add('hidden');
      activePostId = null;
    }

    // Community engagement action triggers
    function joinStudyRoomAlert() {
      playBeep(580, 'sine', 0.1);
      showToast('Live Study Room', 'Connecting you to the live study voice lounge...');
    }

    function bookMentorAlert() {
      playBeep(640, 'sine', 0.1);
      showToast('1-on-1 Mentorship', 'Opening mentor calendar booking portal with 2 upcoming slots.');
    }

    // Non-blocking toast notification (Strictly zero alert() or confirm())
    let toastTimeout = null;
    function showToast(title, message) {
      const toast = document.getElementById('toast-box');
      document.getElementById('toast-title').innerText = title;
      document.getElementById('toast-msg').innerText = message;

      toast.classList.remove('hidden', 'translate-y-2');
      if (toastTimeout) clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        dismissToast();
      }, 3500);
    }

    function dismissToast() {
      const toast = document.getElementById('toast-box');
      toast.classList.add('translate-y-2');
      setTimeout(() => toast.classList.add('hidden'), 200);
    }
