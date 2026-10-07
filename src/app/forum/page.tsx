"use client";
import React from 'react';
import { Shield, Scroll, CheckCircle2, Heart, Zap, Award, Users, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-[#17191d] text-white selection:bg-[#f0abfc] selection:text-[#25282e]">
      <main className="p-6 md:p-10 max-w-4xl mx-auto pb-24">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 text-xs font-bold mb-6 uppercase tracking-widest">
            <Shield size={14} /> Community Charter
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-white via-[#f0abfc] to-white bg-clip-text text-transparent">
            Welcome to the LeadWise Tech Collective
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            A shared space for learners, alumni, instructors, and career changers exploring technology together.
          </p>
        </motion.div>

        {/* Intro Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#25282e] to-black border border-white/10 rounded-3xl p-8 md:p-12 mb-16 text-center relative overflow-hidden"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-snug">
            Belonging before brilliance.
          </h2>
          <p className="text-lg md:text-xl font-medium text-[#f0abfc] leading-relaxed">
            Because brilliance is everywhere. Belonging is rare.
          </p>
          <p className="text-neutral-300 leading-relaxed mt-6 max-w-2xl mx-auto">
            You don't have to learn alone. This is a support system where we ask questions, share what we're discovering, and help each other move forward.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          {/* Mission Section */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <Zap className="text-yellow-400" /> Our Mission
            </h2>
            <div className="space-y-6">
              <p className="text-neutral-400 leading-relaxed">
                LeadWise connects technology education with human support. Across IT courses and career paths, we make room for questions, practice, mentorship, and the confidence to take the next step.
              </p>
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 space-y-4">
                <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-2">We are building:</p>
                <ul className="space-y-3">
                  {[
                    "Curious, thoughtful problem-solvers",
                    "Confident technology learners",
                    "Career-ready professionals",
                    "A community that lifts each other"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-white font-medium">
                      <CheckCircle2 className="text-fuchsia-500 w-5 h-5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.section>

          {/* Note Section */}
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col justify-center"
          >
            <div className="bg-[#f0abfc]/5 border border-[#f0abfc]/20 rounded-3xl p-8 relative">
              <Award className="absolute -top-6 -right-6 w-16 h-16 text-[#f0abfc]/20" />
              <h3 className="text-xl font-bold text-[#f0abfc] mb-4">You Belong Here</h3>
              <p className="text-neutral-300 leading-relaxed mb-6">
                Whether you're starting your first IT course, changing careers, sharing your experience, or returning as an alum, you have a place here. Bring your questions, your ideas, and your everyday wins.
              </p>
              <div className="pt-6 border-t border-[#f0abfc]/10">
                <p className="font-bold text-white">— LeadWise Foundation Team</p>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Guidelines Section */}
        <section>
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-2xl font-bold mb-10 flex items-center gap-3"
          >
            <Scroll className="text-fuchsia-400" /> Community Guidelines
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 1, title: "Respect First", desc: "Meet each other with kindness, curiosity, and respect." },
              { id: 2, title: "No Question is Too Basic", desc: "Ask freely. Your question may help someone else understand, too." },
              { id: 3, title: "Protect Privacy & Security", desc: "Never share passwords, API keys, or sensitive data." },
              { id: 4, title: "Make Room for Each Other", desc: "Share your thoughts and experiences. Listen, encourage, and keep conversations supportive." },
              { id: 5, title: "Celebrate Wins", desc: "Share certifications, breakthroughs, and progress." },
              { id: 6, title: "Give Back", desc: "Share what helped you, offer an explanation, or welcome someone new." },
              { id: 7, title: "Zero Tolerance for Harmful Activity", desc: "This is an ethical learning space only." }
            ].map((rule, i) => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-neutral-900/30 border border-neutral-800 hover:border-fuchsia-500/30 p-6 rounded-2xl transition-all hover:bg-neutral-900/50"
              >
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-500 border border-neutral-700 group-hover:border-fuchsia-500/50 group-hover:text-fuchsia-400 transition-colors">
                    {rule.id}
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">{rule.title}</h4>
                    <p className="text-sm text-neutral-400 leading-relaxed">{rule.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
