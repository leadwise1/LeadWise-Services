import { ArrowRight, Heart, Shield, Users, Zap } from 'lucide-react';

export default function ForumHomePage() {
  return (
    <div className="min-h-screen bg-[#17191d] text-white selection:bg-[#47b3ff] selection:text-[#25282e]">
      <main className="p-6 md:p-10 max-w-5xl mx-auto pb-24">
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-6 uppercase tracking-widest">
            <Shield size={14} /> Welcome to the community
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-6 text-white">
            Welcome to the LeadWise Tech Collective
          </h1>

          <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            A shared space for learners, alumni, instructors, and career changers exploring technology together.
          </p>
        </div>

        <section className="bg-neutral-900 border border-white/10 rounded-3xl p-8 md:p-12 mb-16 text-center relative overflow-hidden">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-snug">
            Belonging before brilliance.
          </h2>
          <p className="text-lg md:text-xl font-medium text-[#47b3ff] leading-relaxed">
            Because brilliance is everywhere. Belonging is rare.
          </p>
          <p className="text-neutral-300 leading-relaxed mt-6 max-w-2xl mx-auto">
            You don&apos;t have to learn alone. This is a support system where we ask questions, share what we&apos;re discovering, and help each other move forward.
          </p>

          <div className="mt-8 flex justify-center">
            <a
              href="/forum/discussions"
              className="inline-flex items-center gap-2 rounded-full bg-blue-700 hover:bg-blue-800 px-6 py-3 font-semibold text-white hover:opacity-95 transition"
            >
              Open the forum <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <section>
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <Zap className="text-neutral-400" /> Our Mission
            </h2>
            <div className="space-y-6 text-neutral-400 leading-relaxed">
              <p>
                LeadWise connects technology education with human support. Across IT courses and career paths, we make room for questions, practice, mentorship, and the confidence to take the next step.
              </p>
              <p>
                We believe learning is stronger when it is supported by community, encouragement, and real connection.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <Heart className="text-neutral-400" /> What we are building
            </h2>
            <ul className="space-y-4 text-neutral-300">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-400" />
                <span>Curious, thoughtful problem-solvers</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-400" />
                <span>Confident technology learners</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-400" />
                <span>Career-ready professionals</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-400" />
                <span>A community that lifts each other</span>
              </li>
            </ul>
          </section>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#1b1d25] p-8 md:p-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Users className="text-blue-400" /> Community values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-neutral-300">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <h3 className="font-bold text-white mb-2">Kindness</h3>
              <p className="text-neutral-400">We meet each other with patience, respect, and room to grow.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <h3 className="font-bold text-white mb-2">Curiosity</h3>
              <p className="text-neutral-400">Questions are welcome, and exploration is part of the process.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <h3 className="font-bold text-white mb-2">Momentum</h3>
              <p className="text-neutral-400">We keep moving forward together, one win and one lesson at a time.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
