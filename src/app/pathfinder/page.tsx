"use client";

import React, { useState } from "react";
import { Compass, ExternalLink, Sparkles, MapPin, Zap, ArrowRight } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Resume Builder", href: "/resume" },
  { label: "Cover Letter", href: "/cover-letter" },
  { label: "Courses", href: "/courses" },
  { label: "Pathfinder", href: "/pathfinder", active: true },
  { label: "Blog", href: "https://blog.letsleadwise.org" },
  { label: "Forum", href: "/forum" },
];

export default function PathfinderPage() {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#0c0c0e] bg-[radial-gradient(ellipse_at_top,_#1a102b_0%,_#0c0c0e_100%)] text-white font-sans selection:bg-[#A855F7] selection:text-black">

      {/* ── NAVBAR ── */}
      <nav className="border-b border-white/10 bg-[#0c0c0e]/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 shrink-0">
            <img
              src="/logolw.jpg"
              alt="LeadWise Logo"
              className="w-8 h-8 rounded-lg object-cover"
            />
            <span className="font-bold text-white text-lg tracking-tight">
              LeadWise Foundation
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {NAV_LINKS.map((link) =>
              link.active ? (
                <span key={link.href} className="text-[#C084FC]">
                  {link.label}
                </span>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition"
                >
                  {link.label}
                </a>
              )
            )}
            <a
              href="https://donation.letsleadwise.org"
              className="bg-[#A855F7] text-black px-5 py-2 rounded-full font-bold hover:bg-white transition-colors shadow-[0_0_15px_rgba(168,85,247,0.4)]"
            >
              Donate Now
            </a>
          </div>
        </div>
      </nav>

      <main id="main-content">

        {/* ── HERO INTRO ── */}
        <section className="relative px-4 py-16 text-center overflow-hidden border-b border-white/5 bg-[#0c0c0e]">
          {/* Ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#A855F7] rounded-full blur-[180px] opacity-[0.12] pointer-events-none" />

          <div className="max-w-4xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#A855F7]/10 border border-[#A855F7]/30 text-[#C084FC] text-sm font-semibold mb-6">
              <Compass size={16} />
              Career Discovery Tool
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
              Find the Career Path{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#C084FC] to-[#A855F7]">
                That Fits You.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 font-light max-w-2xl mx-auto mb-8 leading-relaxed">
              Answer a few questions about your strengths, interests, and goals.
              Our AI Pathfinder matches you to real job titles, skill roadmaps,
              salary ranges, and your next steps inside LeadWise.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {[
                { icon: <Sparkles size={14} />, label: "AI-Powered Matching" },
                { icon: <MapPin size={14} />, label: "Salary Ranges" },
                { icon: <Zap size={14} />, label: "Skill Roadmaps" },
                { icon: <ArrowRight size={14} />, label: "Free to Use" },
              ].map((pill) => (
                <div
                  key={pill.label}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm"
                >
                  <span className="text-[#C084FC]">{pill.icon}</span>
                  {pill.label}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PATHFINDER EMBED ── */}
        <section className="relative w-full bg-[#0c0c0e]" style={{ minHeight: "calc(100vh - 80px)" }}>
          {/* Loading skeleton */}
          {!iframeLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-[#0c0c0e] z-10">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-[#A855F7]/20 border border-[#A855F7]/30 flex items-center justify-center animate-pulse">
                  <Compass size={32} className="text-[#C084FC]" />
                </div>
                {/* Spinning ring */}
                <div className="absolute -inset-1 rounded-[18px] border-2 border-transparent border-t-[#A855F7] animate-spin" />
              </div>
              <p className="text-[#C084FC] text-sm font-semibold tracking-wider animate-pulse">
                LOADING PATHFINDER...
              </p>
            </div>
          )}

          <iframe
            src="https://lw-pathfinder.web.app/"
            title="LeadWise Career Pathfinder"
            className="w-full border-0"
            style={{
              minHeight: "calc(100vh - 80px)",
              height: "900px",
              opacity: iframeLoaded ? 1 : 0,
              transition: "opacity 0.4s ease",
            }}
            onLoad={() => setIframeLoaded(true)}
            allow="fullscreen"
          />
        </section>

        {/* ── POST-TOOL CTA ── */}
        <section className="py-20 px-4 text-center border-t border-white/5 bg-[#0c0c0e] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-[#A855F7]/10 to-transparent pointer-events-none" />
          <div className="max-w-3xl mx-auto relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">
              Ready to Start Your Journey?
            </h2>
            <p className="text-gray-400 mb-8 text-lg">
              Once you know your path, LeadWise has everything you need to get
              there — free certifications, AI mentoring, resume tools, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/courses"
                className="bg-[#A855F7] text-black font-bold px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.4)] transition transform hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] text-base flex items-center justify-center gap-2"
              >
                Get Certified Free <ArrowRight size={18} />
              </a>
              <a
                href="https://lw-pathfinder.web.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl border border-white/20 hover:border-[#A855F7] transition transform hover:-translate-y-1 text-base flex items-center justify-center gap-2 backdrop-blur-md"
              >
                Open in Full Tab <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0c0c0e] text-gray-500 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            <img
              src="/logolw.jpg"
              alt="LeadWise Logo"
              className="w-8 h-8 rounded-lg object-cover"
            />
            <span className="font-semibold text-gray-300">
              LeadWise Foundation
            </span>
          </div>
          <div className="border-t border-white/10 pt-6 text-center text-sm w-full">
            <p>
              &copy; {new Date().getFullYear()} LeadWise Foundation. All rights
              reserved.
            </p>
            <p className="max-w-xl mx-auto text-xs text-gray-400 pt-2 italic">
              LeadWise Foundation | A 501(c)(3) nonprofit organization, EIN:
              39-3296280.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
