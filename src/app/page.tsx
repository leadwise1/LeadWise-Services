import React from 'react';
import Image from 'next/image';
import type { Metadata } from "next";
import {
  FileText,
  Cloud,
  CheckCircle,
  ArrowRight,
  Cpu,
  ShieldCheck,
  Zap,
  Compass,
  Layers,
  Activity,
  AlertTriangle,
  BrainCircuit,
  MessageSquare,
  BarChart,
  Users,
  Briefcase,
  Target,
  GraduationCap
} from "lucide-react";

export const metadata: Metadata = {
  title: "LeadWise Foundation | The Career Transition System",
  description: "Google Career Certificate programs hosted on Coursera. We combine structured learning pathways, live mentoring, and workforce readiness support to help learners transition from learning to employment.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-[#090A0F] bg-[radial-gradient(ellipse_at_top,_#1B2735_0%,_#090A0F_100%)] text-white font-sans selection:bg-[#FFBEA0] selection:text-[#1B2735]">
      
      {/* --- NAVBAR --- */}
      <nav className="border-b border-white/10 bg-[#090A0F]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img src="/logolw.jpg" alt="LeadWise Logo" className="w-8 h-8 rounded-lg object-cover" />
            <span className="font-bold text-white text-lg tracking-tight">LeadWise Foundation</span>
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="/" className="text-[#FFBEA0]">
              Home
            </a>
            <a href="https://services.letsleadwise.org/resume" className="text-gray-400 hover:text-white transition">
              Resume Builder
            </a>
            <a href="https://services.letsleadwise.org/cover-letter" className="text-gray-400 hover:text-white transition">
              Cover Letter
            </a>
            <a href="/courses" className="text-gray-400 hover:text-white transition">
              Courses
            </a>
            <a href="https://blog.letsleadwise.org" className="text-gray-400 hover:text-white transition">
              Blog
            </a>
            <a 
              href="https://donation.letsleadwise.org" 
              className="bg-[#FF9E80] text-[#1B2735] px-5 py-2 rounded-full font-bold hover:bg-white transition-colors shadow-[0_0_15px_rgba(255,190,160,0.4)]"
            >
              Donate Now
            </a>
          </div>
        </div>
      </nav>

      <main id="main-content">

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#FF9E80] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

        <div className="max-w-5xl mx-auto z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-[#FFBEA0]/30 text-[#FFBEA0] text-sm font-semibold mb-8 animate-fade-in">
            <Compass size={16} /> The Career Transition System
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight tracking-tight">
            From Learning to Employment — <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#FFBEA0]">
              LeadWise Offers Google Career Certificate Programs Hosted On Coursera.  </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 text-gray-300 font-light tracking-wide max-w-3xl mx-auto leading-relaxed">
             We combine structured learning pathways, live mentoring, and workforce readiness support to help learners move from education to employment.          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="/courses"
              className="bg-[#FF9E80] text-[#1B2735] font-bold px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(255,190,160,0.3)] transition transform hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(255,190,160,0.5)] text-lg flex items-center justify-center gap-3"
            >
              <Cloud size={24} /> Start Free Certification
            </a>
          </div>
        </div>
      </section>

{/* --- SECTION 1: WHAT YOU ARE ENTERING --- */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-300 text-sm font-bold mb-6 border border-blue-500/20">
            <Layers size={18} /> Section 1: What You Are Entering
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">When you join LeadWise, you are not just enrolling in courses.</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">You are entering a structured career pathway built on three integrated layers:</p>
          <p className="text-xl md:text-2xl mt-8 text-gray-300 font-light tracking-wide max-w-3xl mx-auto leading-relaxed">
            Certification → Readiness → Employment
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Layer 1 */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:border-green-400/50 transition-colors group">
            <div className="w-14 h-14 bg-green-500/20 text-green-400 rounded-2xl flex items-center justify-center mb-6">
              <GraduationCap size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-400"></span>
              Learning Layer
            </h3>
            <p className="text-gray-400 mb-6 text-sm uppercase tracking-wider font-semibold">(Coursera)</p>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-center gap-3"><CheckCircle size={18} className="text-green-400" /> Google Cybersecurity Certificate</li>
              <li className="flex items-center gap-3"><CheckCircle size={18} className="text-green-400" /> Data Analytics Certificate</li>
              <li className="flex items-center gap-3"><CheckCircle size={18} className="text-green-400" /> AI Certificate</li>
            </ul>
          </div>

          {/* Layer 2 */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:border-blue-400/50 transition-colors group">
            <div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6">
              <Activity size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-400"></span>
              Program Layer
            </h3>
            <p className="text-gray-400 mb-6 text-sm uppercase tracking-wider font-semibold">(LeadWise Control)</p>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-center gap-3"><CheckCircle size={18} className="text-blue-400" /> Enrollment management</li>
              <li className="flex items-center gap-3"><CheckCircle size={18} className="text-blue-400" /> Structured learning pathways</li>
              <li className="flex items-center gap-3"><CheckCircle size={18} className="text-blue-400" /> Cohort tracking</li>
            </ul>
          </div>

          {/* Layer 3 */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:border-purple-400/50 transition-colors group">
            <div className="w-14 h-14 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center mb-6">
              <Target size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-400"></span>
              Readiness Layer
            </h3>
            <p className="text-gray-400 mb-6 text-sm uppercase tracking-wider font-semibold">(Mentoring + Simulation)</p>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-center gap-3"><CheckCircle size={18} className="text-purple-400" /> Live AI mentoring sessions</li>
              <li className="flex items-center gap-3"><CheckCircle size={18} className="text-purple-400" /> Interview simulation (Confidence Lab)</li>
              <li className="flex items-center gap-3"><CheckCircle size={18} className="text-purple-400" /> Behavioral training feedback</li>
              <li className="flex items-center gap-3"><CheckCircle size={18} className="text-purple-400" /> Career coaching</li>
            </ul>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: WHY MOST LEARNERS FALL OFF --- */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative bg-black/30 border-y border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
           <div>
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-400 text-sm font-bold mb-6 border border-red-500/20">
               <AlertTriangle size={18} /> Section 2: The Gap
             </div>
             <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Most Learners Fall Off</h2>
             <p className="text-xl text-gray-400 mb-8">Most platforms stop at learning. Learners struggle because:</p>
             
             <div className="space-y-4">
               {[
                 "They complete courses but don’t know what comes next",
                 "They don’t practice interview readiness",
                 "They don’t receive real feedback on performance",
                 "They lack accountability systems"
               ].map((text, i) => (
                 <div key={i} className="flex gap-4 items-start p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                   <div className="mt-0.5 text-red-400"><Zap size={20} /></div>
                   <p className="text-gray-300 text-lg">{text}</p>
                 </div>
               ))}
             </div>
           </div>

           <div className="relative">
             <div className="absolute inset-0 bg-[#FF9E80]/10 blur-[100px] rounded-full pointer-events-none"></div>
             <div className="bg-gradient-to-br from-[#FF9E80]/20 to-transparent border border-[#FF9E80]/30 rounded-3xl p-10 relative backdrop-blur-xl">
                <h3 className="text-3xl font-bold text-white mb-6">👉 LeadWise exists to close THIS gap.</h3>
                <p className="text-xl text-[#FFBEA0] leading-relaxed">
                   We don’t stop at certification — we convert learning into job readiness through structured practice, mentoring, and employer alignment. </p>
             </div>
           </div>
        </div>
      </section>

      {/* --- SECTION 3: LIVE MENTORING SYSTEM --- */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Abstract Tech Background */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-300 text-sm font-bold mb-6 border border-purple-500/20">
            <BrainCircuit size={18} /> Section 3: The Engine
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Your Live Mentoring System</h2>
          <p className="text-2xl text-[#FFBEA0] font-light max-w-3xl mx-auto">
            Confidence Lab + AI Simulation Engine
          </p>
        </div>

        <div className="max-w-5xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 md:p-16 shadow-2xl relative">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
             <div>
               <p className="text-xl text-gray-300 mb-8">
                 Before applying for jobs, learners step into the <strong className="text-white">Confidence Lab</strong> to:
               </p>
               <ul className="space-y-6">
                 {[
                   { icon: <MessageSquare size={24} />, text: "Practice real interview scenarios" },
                   { icon: <Cpu size={24} />, text: "Receive AI feedback on responses" },
                   { icon: <BarChart size={24} />, text: "Improve communication and structure" },
                   { icon: <ShieldCheck size={24} />, text: "Build job readiness confidence" }
                 ].map((item, i) => (
                   <li key={i} className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center shrink-0">
                       {item.icon}
                     </div>
                     <span className="text-lg text-white font-medium">{item.text}</span>
                   </li>
                 ))}
               </ul>
             </div>
             
             <div className="bg-[#090A0F]/80 border border-purple-500/30 rounded-3xl p-8 relative">
                <div className="absolute top-4 right-4 flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                </div>
                <div className="space-y-4 mt-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 shrink-0"></div>
                    <div className="bg-white/10 rounded-2xl rounded-tl-none p-4 text-sm text-gray-300 w-full">
                      <div className="h-2 w-1/3 bg-white/20 rounded mb-2"></div>
                      <div className="h-2 w-full bg-white/10 rounded mb-2"></div>
                      <div className="h-2 w-5/6 bg-white/10 rounded"></div>
                    </div>
                  </div>
                  <div className="flex gap-4 flex-row-reverse">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                      <BrainCircuit size={20} className="text-purple-400" />
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl rounded-tr-none p-4 text-sm text-gray-300 w-full">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">AI Feedback</span>
                      </div>
                      <div className="h-2 w-full bg-purple-400/20 rounded mb-2"></div>
                      <div className="h-2 w-4/5 bg-purple-400/20 rounded"></div>
                    </div>
                  </div>
                </div>
                <div className="mt-8 text-center text-xl font-bold text-[#FFBEA0] border-t border-white/10 pt-6">
                  👉 This transforms learning into performance ability.
                </div>
             </div>
           </div>
        </div>
      </section>

      {/* --- SECTION 4: HOW IT WORKS --- */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative bg-black/20 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF9E80]/10 text-[#FFBEA0] text-sm font-bold mb-6 border border-[#FF9E80]/20">
              <Compass size={18} /> Section 4: The Process
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">How The System Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { step: 1, title: "Enroll", desc: "LeadWise + Google + Coursera." },
              { step: 2, title: "Learn", desc: "Structured Curriculum + Certification." },
              { step: 3, title: "Practice", desc: "1:1 mentorship from industry professionals (CSR partners and engineers from companies such as Google, Dell, and TI) combined with AI-powered interview simulation and STAR-based feedback in the Confidence Lab." },
              { step: 4, title: "Prepare", desc: "ATS Optimized Resume With Cover Letter, Job Readiness Checklist, And Career Coaching." },
              { step: 5, title: "Transition", desc: "Learner Becomes Job-Ready and Enters Employment Pipeline." }
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl h-full hover:bg-white/10 hover:border-[#FFBEA0]/50 transition-all z-10 relative">
                  <div className="text-[#FFBEA0] font-black text-5xl mb-4 opacity-30 group-hover:opacity-100 transition-opacity">0{item.step}</div>
                  <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
                {/* Connecting Line for md+ screens */}
                {i < 4 && (
                  <div className="hidden md:block absolute top-1/2 right-0 w-6 h-px bg-white/20 translate-x-full z-0"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION 5: WHAT HAPPENS AFTER --- */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">What Happens After You Complete Your Certificate</h2>
            <p className="text-xl text-gray-400 max-w-3xl mb-4">
              You don’t stop here — your career activation begins now.
            </p>
            <p className="text-lg text-gray-300 max-w-3xl border-l-4 border-[#FFBEA0] pl-4 italic">
              After completing your Google Career Certificate through LeadWise + Coursera, you unlock a career transition system designed to help you move from learning → employment.
            </p>
          </div>

          <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <Briefcase className="text-[#FFBEA0]" /> Your Career Activation Tools
          </h3>
          <p className="text-gray-400 mb-10 font-medium">These are not optional extras — they are part of your job readiness pathway.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Tool 1 */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl flex flex-col hover:border-[#FFBEA0]/50 transition-colors">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-[#FFBEA0]">1.</span> Employer Network Access
              </h4>
              <p className="text-sm text-gray-400 mb-6 font-semibold">(CareerCircle Integration)</p>
              <p className="text-gray-300 mb-6 flex-1 text-sm leading-relaxed">
                Get access to a network of 150+ hiring employers actively considering Google Career Certificate graduates. Explore job openings, connect with hiring partners, apply to entry-level roles, and get visibility with employers like Verizon, Deloitte, and Siemens.
              </p>
              <div className="bg-[#FF9E80]/10 border border-[#FF9E80]/20 p-3 rounded-xl text-xs font-bold text-[#FFBEA0] mt-auto">
                👉 Your first step into the job market ecosystem.
              </div>
            </div>

            {/* Tool 2 */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl flex flex-col hover:border-[#FFBEA0]/50 transition-colors">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-[#FFBEA0]">2.</span> 360° Career Profile
              </h4>
              <p className="text-sm text-gray-400 mb-6 font-semibold">(Stand-Out System)</p>
              <p className="text-gray-300 mb-6 flex-1 text-sm leading-relaxed">
                Build a professional profile that goes beyond a resume. Includes skills gained from your certificate, learning progress data, projects and coursework highlights, and strengths from assessments and experience.
              </p>
              <div className="bg-[#FF9E80]/10 border border-[#FF9E80]/20 p-3 rounded-xl text-xs font-bold text-[#FFBEA0] mt-auto">
                👉 Helps employers see you as a whole candidate.
              </div>
            </div>

            {/* Tool 3 */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl flex flex-col hover:border-[#FFBEA0]/50 transition-colors">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-[#FFBEA0]">3.</span> Career Readiness Support
              </h4>
              <p className="text-gray-300 mb-6 flex-1 text-sm leading-relaxed mt-2">
                Once you complete your certificate, you gain access to resume building tools, interview preparation guides, career path recommendations, job search strategy support, and virtual hiring events & webinars.
              </p>
              <div className="bg-[#FF9E80]/10 border border-[#FF9E80]/20 p-3 rounded-xl text-xs font-bold text-[#FFBEA0] mt-auto">
                👉 This is where learning turns into job strategy.
              </div>
            </div>

            {/* Tool 4 */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl flex flex-col hover:border-[#FFBEA0]/50 transition-colors">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-[#FFBEA0]">4.</span> 1:1 Career Coaching
              </h4>
              <p className="text-gray-300 mb-6 flex-1 text-sm leading-relaxed mt-2">
                Get personalized support from career advisors who help you refine your resume, prepare for interviews, understand job requirements, and position yourself for entry-level roles.
              </p>
              <div className="bg-[#FF9E80]/10 border border-[#FF9E80]/20 p-3 rounded-xl text-xs font-bold text-[#FFBEA0] mt-auto">
                👉 This is your human support layer after certification.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 6: OUTCOME STATEMENT (CTA) --- */}
      <section className="py-32 px-4 text-center relative overflow-hidden bg-black/40 border-t border-white/10">
        <div className="absolute inset-0 bg-gradient-to-t from-[#FF9E80]/10 to-transparent pointer-events-none"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          
          <div className="mb-12">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">LeadWise is not a course platform.</h2>
            <p className="text-xl sm:text-2xl text-[#FFBEA0] mb-8 font-light leading-relaxed">
              It is a career transformation system combining Coursera learning, AI simulation mentoring, and structured workforce readiness support.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="/courses"
              className="bg-[#FF9E80] text-[#1B2735] font-bold px-10 py-5 rounded-xl shadow-[0_0_20px_rgba(255,190,160,0.4)] transition transform hover:-translate-y-1 text-lg flex items-center justify-center gap-3"
            >
              <Cloud size={24} /> Get Certified
            </a>
            <a
              href="https://donation.letsleadwise.org"
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-10 py-5 rounded-xl border border-white/20 hover:border-[#FFBEA0] transition transform hover:-translate-y-1 text-lg flex items-center justify-center gap-3 backdrop-blur-md"
            >
              <Users size={24} /> Support the Mission
            </a>
          </div>
        </div>
      </section>

      </main>

     {/* --- FOOTER --- */}
      <footer className="bg-[#090A0F] text-gray-500 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center gap-8">
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
          <div className="text-center">
            <Image
              src="/logolw.jpg"
              alt="LeadWise Foundation Logo"
              width={180}
              height={45}
              className="mx-auto"
            />
          </div>
          <div className="border-t border-white/10 pt-6 text-center text-sm w-full">
            <p>&copy; {new Date().getFullYear()} LeadWise Foundation. All rights reserved.</p>
            <p className="max-w-xl mx-auto text-xs text-gray-400 pt-2 italic">
              LeadWise Foundation | A 501(c)(3) nonprofit organization, EIN: 39-3296280.
            </p>
            <p className="text-xs text-gray-500 pt-1">
              Not affiliated with organizations using similar names in legal or consulting sectors.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
