import React from "react";
import { 
  FileText, 
  Cloud, 
  CheckCircle, 
  ArrowRight, 
  Cpu, 
  ShieldCheck,
  Zap
} from "lucide-react";

// Using standard <a> tags to avoid Router context issues

export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-[radial-gradient(ellipse_at_top,_#1B2735_0%,_#090A0F_100%)] text-white font-sans selection:bg-[#FFBEA0] selection:text-[#1B2735]">
      
      {/* --- NAVBAR --- */}
      <nav className="border-b border-white/10 bg-[#090A0F]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-[#FF9E80] to-purple-500 rounded-lg flex items-center justify-center font-bold text-[#1B2735]">
              L
            </div>
            <span className="font-bold text-white text-lg tracking-tight">
              LeadWise Foundation
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="/" className="text-[#FFBEA0]">Home</a>

            <a
              href="https://services.letsleadwise.org/resume"
              className="text-gray-400 hover:text-white transition"
            >
              Resume Builder
            </a>

            <a href="/courses" className="text-gray-400 hover:text-white transition">
              Courses
            </a>

            <a 
              href="/donate" 
              className="bg-[#FF9E80] text-[#1B2735] px-5 py-2 rounded-full font-bold hover:bg-white transition-colors shadow-[0_0_15px_rgba(255,190,160,0.4)]"
            >
              Donate Now
            </a>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#FF9E80] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

        <div className="max-w-5xl mx-auto z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-[#FFBEA0]/30 text-[#FFBEA0] text-sm font-semibold mb-8">
            <ShieldCheck size={16} /> Proud Google Cloud & Workspace Partner
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight tracking-tight">
            Turn Ambition into Action with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#FFBEA0]">
              Industry-Verified Technology.
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-3xl mx-auto">
            We don’t just teach skills; we build{" "}
            <span className="text-[#FFBEA0]">measurable economic pathways</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="/courses"
              className="bg-[#FF9E80] text-[#1B2735] font-bold px-8 py-4 rounded-xl text-lg flex items-center gap-3"
            >
              <Cloud size={24} /> Start Free Certification
            </a>

            <a
              href="https://services.letsleadwise.org/resume"
              className="bg-white/5 hover:bg-white/10 text-white font-bold px-8 py-4 rounded-xl border border-white/10 text-lg flex items-center gap-3"
            >
              <FileText size={24} /> Build ATS-Ready Resume
            </a>
          </div>
        </div>
      </section>

      {/* --- SERVICE 1: TECHNICAL UPSKILLING --- */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">
              Master the Cloud. <span className="text-[#FFBEA0]">Prove Your Expertise.</span>
            </h2>

            <div className="space-y-6">
              {[
                "Google Cloud Certification Pathways",
                "Workspace Productivity Mastery",
                "Industry-Recognized Credentials",
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-4">
                  <CheckCircle className="text-[#FFBEA0]" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 rounded-3xl p-10 flex flex-col items-center gap-6">
            <Cloud size={64} className="text-blue-300" />
            <Zap size={64} className="text-yellow-300" />
          </div>
        </div>
      </section>

      {/* --- SERVICE 2: CAREER TOOLS --- */}
      <section className="py-24 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="bg-white/5 rounded-3xl p-10">
            <div className="inline-block px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-bold">
              ATS Score: 98%
            </div>
          </div>

          <div>
            <h2 className="text-4xl font-bold mb-6">
              Beat the Bots. <span className="text-[#FFBEA0]">Get the Interview.</span>
            </h2>

            <p className="text-gray-400 mb-10">
              Our Google-verified resume builder is optimized to pass ATS systems.
            </p>

            <a
              href="https://services.letsleadwise.org/resume"
              className="inline-flex items-center gap-2 text-[#FFBEA0] font-bold text-lg border-b border-[#FFBEA0]"
            >
              Build Your Resume <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#090A0F] border-t border-white/10 py-12 text-center text-gray-500">
        &copy; {new Date().getFullYear()} LeadWise Foundation. All rights reserved.
      </footer>
    </div>
  );
}
