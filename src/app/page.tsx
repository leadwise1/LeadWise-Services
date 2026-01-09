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

// Note: Using standard <a> tags to avoid Router context issues

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
            <span className="font-bold text-white text-lg tracking-tight">LeadWise Foundation</span>
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="/" className="text-[#FFBEA0]">Home</a>
            <a
              href="https://services.letsleadwise.org/resume"
              className="text-gray-400 hover:text-white transition"
            >
              Resume Builder
            </a>
            <a href="/courses" className="text-gray-400 hover:text-white transition">Courses</a>
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
            Turn Ambition into Action with <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#FFBEA0]">
              Industry-Verified Technology.
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-3xl mx-auto">
            We don’t just teach skills; we build <span className="text-[#FFBEA0]">measurable economic pathways</span>.
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

      {/* --- SERVICE 2 CTA --- */}
      <section className="py-24 px-4 text-center">
        <a
          href="https://services.letsleadwise.org/resume"
          className="inline-flex items-center gap-2 text-[#FFBEA0] font-bold text-lg hover:text-white border-b border-[#FFBEA0]"
        >
          Build Your Resume <ArrowRight size={20} />
        </a>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#090A0F] text-gray-500 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="font-semibold text-gray-300">LeadWise Foundation</span>
          <p className="text-sm">&copy; {new Date().getFullYear()} LeadWise Foundation</p>
        </div>
      </footer>
    </div>
  );
}
