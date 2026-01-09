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

// Note: Switched from 'Link' to standard <a> tags to prevent "Router Context" errors 


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
            <a href="/templates" className="text-gray-400 hover:text-white transition">Templates</a>
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
        
        {/* Background Glows */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#FF9E80] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

        <div className="max-w-5xl mx-auto z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-[#FFBEA0]/30 text-[#FFBEA0] text-sm font-semibold mb-8 animate-fade-in">
            <ShieldCheck size={16} /> Proud Google Cloud & Workspace Partner
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight tracking-tight">
           Turn Ambition into Action with <br/>
           <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#FFBEA0]">
             Industry-Verified Technology.
           </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 text-gray-300 font-light tracking-wide max-w-3xl mx-auto leading-relaxed">
           We don’t just teach skills; we build <span className="text-[#FFBEA0] font-normal">measurable economic pathways</span>. 
           Bridging the gap between "learning code" and "landing a job."
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="/courses"
              className="bg-[#FF9E80] text-[#1B2735] font-bold px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(255,190,160,0.3)] transition transform hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(255,190,160,0.5)] text-lg flex items-center justify-center gap-3"
            >
              <Cloud size={24} /> Start Free Certification
            </a>
            <a
              href="/templates"
              className="bg-white/5 hover:bg-white/10 text-white font-bold px-8 py-4 rounded-xl border border-white/10 hover:border-[#FFBEA0]/50 transition transform hover:-translate-y-1 text-lg flex items-center justify-center gap-3 backdrop-blur-md"
            >
              <FileText size={24} /> Build ATS-Ready Resume
            </a>
          </div>
        </div>
      </section>

      {/* --- SERVICE 1: Technical Upskilling --- */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
           {/* Text Content */}
           <div className="order-2 lg:order-1">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-300 text-sm font-bold mb-8 border border-blue-500/20">
               <Cloud size={18} /> Service 1: Technical Upskilling
             </div>
             <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
               Master the Cloud. <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Prove Your Expertise.</span>
             </h2>
             <p className="text-lg text-gray-400 mb-10 leading-relaxed">
               In today’s digital economy, validation matters. We provide access to Free Google Certification Courses that carry weight with top employers globally. Our curriculum is designed to make you job-ready from day one.
             </p>
             <div className="space-y-6">
               {[
                 { title: "Become a Google Cloud Pro", desc: "Gain hands-on experience with the infrastructure powering the modern web." },
                 { title: "Google Workspace Mastery", desc: "Validate your proficiency in the essential collaboration tools used by Fortune 500 companies." },
                 { title: "Industry-Recognized Credentials", desc: "Earn verifiable digital badges that signal competence to hiring managers." }
               ].map((item, i) => (
                 <div key={i} className="flex gap-5 p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                   <div className="mt-1 bg-blue-500/20 rounded-full p-2 h-fit text-blue-300">
                     <CheckCircle size={20} />
                   </div>
                   <div>
                     <h3 className="font-bold text-white text-xl mb-2">{item.title}</h3>
                     <p className="text-gray-400 leading-relaxed text-sm">{item.desc}</p>
                   </div>
                 </div>
               ))}
             </div>
             <div className="mt-12">
               <a href="/courses" className="inline-flex items-center gap-2 text-[#FFBEA0] font-bold text-lg hover:text-white transition-all pb-1 border-b border-[#FFBEA0] hover:border-white">
                 Explore Free Courses <ArrowRight size={20} />
               </a>
             </div>
           </div>
           
           {/* Visual/Image Side */}
           <div className="order-1 lg:order-2">
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 h-full min-h-[500px] flex flex-col items-center justify-center overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] -ml-16 -mb-16"></div>
                
                <div className="z-10 flex flex-col items-center gap-12 text-center">
                   {/* Fallback layout if images aren't present */}
                   <div className="p-8 bg-white/10 rounded-2xl border border-white/10 w-full max-w-xs">
                      <Cloud size={64} className="mx-auto text-blue-300 mb-4" />
                      <h3 className="text-2xl font-bold">Google Cloud</h3>
                      <p className="text-sm text-gray-400">Build Partner</p>
                   </div>
                   <div className="p-8 bg-white/10 rounded-2xl border border-white/10 w-full max-w-xs">
                      <Zap size={64} className="mx-auto text-yellow-300 mb-4" />
                      <h3 className="text-2xl font-bold">Workspace</h3>
                      <p className="text-sm text-gray-400">Authorized Partner</p>
                   </div>
                </div>
              </div>
           </div>
        </div>
      </section>

      {/* --- SERVICE 2: Career Acceleration Tools --- */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative bg-black/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
           
           {/* Visual Side */}
           <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 h-full min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden shadow-2xl lg:order-1">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#FF9E80]/10 to-transparent"></div>
              
              {/* Abstract Resume Preview */}
              <div className="relative w-full max-w-sm bg-[#1B2735] shadow-2xl border border-white/10 rounded-xl overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-500 group">
                 <div className="h-2 bg-[#FF9E80] w-full"></div>
                 <div className="p-6 space-y-4 opacity-80 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-4 items-center border-b border-white/10 pb-4">
                       <div className="w-12 h-12 bg-white/10 rounded-full"></div>
                       <div className="space-y-2 flex-1">
                          <div className="h-3 bg-white/20 w-3/4 rounded"></div>
                          <div className="h-2 bg-white/10 w-1/2 rounded"></div>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <div className="h-2 bg-white/10 w-full rounded"></div>
                       <div className="h-2 bg-white/10 w-full rounded"></div>
                       <div className="h-2 bg-white/10 w-5/6 rounded"></div>
                    </div>
                    <div className="pt-4">
                       <div className="inline-block px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30">ATS Score: 98%</div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Text Content */}
           <div className="lg:order-2">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-300 text-sm font-bold mb-8 border border-purple-500/20">
               <Cpu size={18} /> Service 2: Career Acceleration Tools
             </div>
             <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
               Beat the Bots. <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#FF9E80]">Get the Interview.</span>
             </h2>
             <p className="text-lg text-gray-400 mb-10 leading-relaxed">
               Up to 75% of resumes are rejected by an ATS before a human ever reads them. We arm you with the technology to bypass these digital gatekeepers using our Google-Verified, optimized builder.
             </p>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               {[
                 { title: "Pass the Screen", desc: "Built-in formatting logic ensures your resume parses correctly by recruitment software." },
                 { title: "6 Professional Templates", desc: "Choose from six distinct designs that balance aesthetic appeal with keyword optimization." },
                 { title: "Total Personalization", desc: "Customize every section to highlight your specific certifications and project experience." },
                 { title: "Instant Cover Letters", desc: "Generate persuasive, tailored cover letters that complement your resume." }
               ].map((item, i) => (
                 <div key={i} className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-[#FFBEA0]/30 hover:bg-white/10 transition-colors">
                   <h3 className="font-bold text-white mb-2 text-lg">{item.title}</h3>
                   <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                 </div>
               ))}
             </div>

             <div className="mt-12">
               <a href="/templates" className="inline-flex items-center gap-2 text-[#FFBEA0] font-bold text-lg hover:text-white transition-all pb-1 border-b border-[#FFBEA0] hover:border-white">
                 Build Your Resume <ArrowRight size={20} />
               </a>
             </div>
           </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-32 px-4 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl sm:text-6xl font-extrabold text-white mb-8">Your Pathway Starts Here.</h2>
          <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            Don't let a lack of resources stand between you and your future. Join a community dedicated to economic mobility and workforce transformation.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="/courses"
              className="bg-[#FF9E80] text-[#1B2735] font-bold px-10 py-5 rounded-xl shadow-[0_0_20px_rgba(255,190,160,0.4)] transition transform hover:-translate-y-1 text-lg flex items-center justify-center gap-3"
            >
              <Cloud size={24} /> Get Certified
            </a>
            <a
              href="/donate"
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-10 py-5 rounded-xl border border-white/20 hover:border-[#FFBEA0] transition transform hover:-translate-y-1 text-lg flex items-center justify-center gap-3 backdrop-blur-md"
            >
              <CheckCircle size={24} /> Support the Mission
            </a>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#090A0F] text-gray-500 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center font-bold text-gray-300">L</div>
              <span className="font-semibold text-gray-300">LeadWise Foundation</span>
           </div>
           <p className="text-sm">&copy; {new Date().getFullYear()} LeadWise Foundation. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}