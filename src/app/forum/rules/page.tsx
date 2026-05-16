"use client";
import React from 'react';
import { Shield, Scroll, CheckCircle2, Heart, Zap, Award, Users, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-[#090A0F] text-white selection:bg-[#FFBEA0] selection:text-[#1B2735]">
      <main className="p-6 md:p-10 max-w-4xl mx-auto pb-24">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-6 uppercase tracking-widest">
            <Shield size={14} /> Community Charter
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-white via-[#FFBEA0] to-white bg-clip-text text-transparent">
            Welcome to the Digital Guardians Hub
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            A space built for learners, career changers, and future defenders of the digital world.
          </p>
        </motion.div>

        {/* Intro Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#1B2735] to-black border border-white/10 rounded-3xl p-8 md:p-12 mb-16 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -mr-32 -mt-32" />
          <p className="text-lg md:text-xl font-medium text-white relative z-10 leading-relaxed">
            "This is more than a discussion board. It’s a support system where we learn, grow, and rise together."
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
                LeadWise Foundation exists to create access, opportunity, and real career pathways through technology education and community support.
              </p>
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 space-y-4">
                <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-2">We are building:</p>
                <ul className="space-y-3">
                  {[
                    "Ethical tech learners",
                    "Cybersecurity defenders",
                    "Career-ready professionals",
                    "A community that lifts each other"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-white font-medium">
                      <CheckCircle2 className="text-emerald-500 w-5 h-5 shrink-0" />
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
            <div className="bg-[#FFBEA0]/5 border border-[#FFBEA0]/20 rounded-3xl p-8 relative">
              <Award className="absolute -top-6 -right-6 w-16 h-16 text-[#FFBEA0]/20" />
              <h3 className="text-xl font-bold text-[#FFBEA0] mb-4">Final Note</h3>
              <p className="text-neutral-300 leading-relaxed mb-6">
                You’re not just joining a forum — you’re joining a mission. Welcome to the Digital Guardians.
              </p>
              <div className="pt-6 border-t border-[#FFBEA0]/10">
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
            <Scroll className="text-blue-400" /> Community Guidelines
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 1, title: "Respect First", desc: "Treat every member with professionalism and kindness." },
              { id: 2, title: "No Question is Too Basic", desc: "Ask freely — that’s how we grow." },
              { id: 3, title: "Protect Privacy & Security", desc: "Never share passwords, API keys, or sensitive data." },
              { id: 4, title: "Stay Productive", desc: "Keep discussions helpful and on-topic." },
              { id: 5, title: "Celebrate Wins", desc: "Share certifications, breakthroughs, and progress." },
              { id: 6, title: "Give Back", desc: "Help others as you grow." },
              { id: 7, title: "Zero Tolerance for Harmful Activity", desc: "This is an ethical learning space only." }
            ].map((rule, i) => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-neutral-900/30 border border-neutral-800 hover:border-blue-500/30 p-6 rounded-2xl transition-all hover:bg-neutral-900/50"
              >
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-500 border border-neutral-700 group-hover:border-blue-500/50 group-hover:text-blue-400 transition-colors">
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
