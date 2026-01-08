'use client';
import React from "react";
import { FileText, Cloud, CheckCircle, ArrowRight, Cpu } from "lucide-react";
import Link from "next/link";

// =======================
// PAGE COMPONENT
// =======================

export default function IndexPage() {
  return (
    <>
      {/* Site-wide Navigation */}
      <nav className="bg-[#232136] sticky top-0 z-40 shadow-sm text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/leadwise-logo.svg" alt="LeadWise" className="w-10 h-10 rounded-lg" />
            <span className="font-bold text-xl">LeadWise Foundation</span>
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium">
            <a href="https://letsleadwise.org" className="text-gray-300 hover:text-white transition">Home</a>
            <Link href="/resume" className="text-gray-300 hover:text-white transition">Templates</Link>
            <Link href="/courses" className="text-gray-300 hover:text-white transition">Courses</Link>
            <a href="https://donation.letsleadwise.org" className="bg-[#fac0ab] hover:bg-[#ffbca0] text-[#232136] px-4 py-2 rounded-lg font-bold transition">Donate Now</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[75vh] flex flex-col items-center justify-center bg-[#232136] text-white text-center px-4 py-20">
        <div className="max-w-5xl mx-auto z-10">
          <img src="/leadwise-logo.svg" alt="LeadWise Logo" className="mx-auto mb-8 h-20 w-20 bg-white/10 rounded-2xl p-3 shadow-2xl" />
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold mb-8 leading-tight drop-shadow-lg">
           Turn Ambition into Action with <br/>
           <span className="text-[#fac0ab]">Industry-Verified Technology</span>.
          </h1>
          
          <p className="text-xl sm:text-2xl mb-10 text-indigo-100 font-light tracking-wide">
           We don’t just teach skills; we build measurable economic pathways.
          </p>
          
          <div className="max-w-3xl mx-auto text-gray-300 text-lg leading-relaxed space-y-6 font-light">
             <p>
               At LeadWise Foundation, we believe talent is universal, but opportunity is not. As a proud Google Cloud and Workspace Partner, we exist to bridge that gap. We transform program participants into skilled catalysts for workforce transformation.
             </p>
             <p>
               We move beyond the theory of "learning to code" and focus on the reality of "landing the job." By combining high-growth certifications with data-driven career tools, we provide the infrastructure you need to future-proof your career—completely free of charge.
             </p>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#232136]/50 to-[#232136] pointer-events-none"></div>
      </section>

      {/* Service 1: Technical Upskilling */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
           <div className="order-2 lg:order-1">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-bold mb-8 border border-blue-100">
               <Cloud size={18} /> Service 1: Technical Upskilling
             </div>
             <h2 className="text-4xl sm:text-5xl font-bold text-[#232136] mb-6 leading-tight">
               Master the Cloud. <br/>Prove Your Expertise.
             </h2>
             <p className="text-lg text-gray-600 mb-10 leading-relaxed">
               In today’s digital economy, validation matters. We provide access to Free Google Certification Courses that carry weight with top employers globally. Whether you are starting from scratch or leveling up, our curriculum is designed to make you job-ready from day one.
             </p>
             <div className="space-y-8">
               {[
                 { title: "Become a Google Cloud Pro", desc: "Gain hands-on experience with the infrastructure powering the modern web." },
                 { title: "Google Workspace Mastery", desc: "Validate your proficiency in the essential collaboration tools used by Fortune 500 companies." },
                 { title: "Industry-Recognized Credentials", desc: "Earn badges and certificates that act as a verifiable signal of your competence to hiring managers." }
               ].map((item, i) => (
                 <div key={i} className="flex gap-5">
                   <div className="mt-1 bg-[#fac0ab]/20 rounded-full p-2 h-fit text-[#e08e6d]">
                     <CheckCircle size={20} />
                   </div>
                   <div>
                     <h3 className="font-bold text-[#232136] text-xl mb-2">{item.title}</h3>
                     <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                   </div>
                 </div>
               ))}
             </div>
             <div className="mt-12">
               <Link href="/courses" className="inline-flex items-center gap-2 text-[#232136] font-bold text-lg border-b-2 border-[#fac0ab] hover:text-blue-600 hover:border-blue-600 transition-all pb-1">
                 Explore Free Courses <ArrowRight size={20} />
               </Link>
             </div>
           </div>
           
           <div className="order-1 lg:order-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-10 h-full min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden border border-blue-100 shadow-sm">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl -ml-16 -mb-16"></div>
              
              <div className="z-10 flex flex-col items-center gap-12">
                 <img src="/google-cloud.png" alt="Google Cloud Partner" className="w-64 object-contain" />
                 <img src="/google-workspace.png" alt="Google Workspace Partner" className="w-64 object-contain" />
              </div>
           </div>
        </div>
      </section>

      {/* Service 2: Career Acceleration Tools */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
           <div className="bg-white rounded-3xl p-10 h-full min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden border border-gray-200 shadow-lg lg:order-1">
              <div className="relative w-full max-w-sm bg-white shadow-2xl border border-gray-100 rounded-lg overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-500">
                 <div className="h-4 bg-[#232136] w-full"></div>
                 <div className="p-6 space-y-4">
                    <div className="flex gap-4 items-center border-b border-gray-100 pb-4">
                       <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                       <div className="space-y-2 flex-1">
                          <div className="h-3 bg-gray-800 w-3/4 rounded"></div>
                          <div className="h-2 bg-gray-400 w-1/2 rounded"></div>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <div className="h-2 bg-gray-200 w-full rounded"></div>
                       <div className="h-2 bg-gray-200 w-full rounded"></div>
                       <div className="h-2 bg-gray-200 w-5/6 rounded"></div>
                    </div>
                    <div className="pt-4">
                       <div className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">ATS Score: 98%</div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="lg:order-2">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-700 text-sm font-bold mb-8 border border-purple-100">
               <Cpu size={18} /> Service 2: Career Acceleration Tools
             </div>
             <h2 className="text-4xl sm:text-5xl font-bold text-[#232136] mb-6 leading-tight">
               Beat the Bots. <br/>Get the Interview.
             </h2>
             <p className="text-lg text-gray-600 mb-10 leading-relaxed">
               You have the skills; now ensure your application gets seen. In the modern hiring landscape, up to 75% of resumes are rejected by an Applicant Tracking System (ATS) before a human ever reads them. We arm you with the technology to bypass these digital gatekeepers.
             </p>
             <p className="text-gray-700 font-medium mb-8 text-lg">
               Our Free ATS-Optimized Resume Builder is engineered to navigate hiring algorithms while showcasing your unique story.
             </p>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               {[
                 { title: "Pass the Screen", desc: "Built-in formatting logic ensures your resume parses correctly by recruitment software." },
                 { title: "6 Professional Templates", desc: "Choose from six distinct, polished designs that balance aesthetic appeal with keyword optimization." },
                 { title: "Total Personalization", desc: "Customize every section to highlight your specific certifications and project experience." },
                 { title: "Instant Cover Letters", desc: "Stop staring at a blank page. Generate persuasive, tailored cover letters that grab recruiter attention." }
               ].map((item, i) => (
                 <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-purple-200 transition-colors">
                   <h3 className="font-bold text-[#232136] mb-2 text-lg">{item.title}</h3>
                   <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                 </div>
               ))}
             </div>

             <div className="mt-12">
               <Link href="/resume" className="inline-flex items-center gap-2 text-[#232136] font-bold text-lg border-b-2 border-[#fac0ab] hover:text-purple-600 hover:border-purple-600 transition-all pb-1">
                 Build Your Resume <ArrowRight size={20} />
               </Link>
             </div>
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 bg-[#232136] text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
           <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[100px]"></div>
           <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8">Your Pathway Starts Here.</h2>
          <p className="text-xl sm:text-2xl text-indigo-100 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            Don't let a lack of resources stand between you and your future. Join a community dedicated to economic mobility and workforce transformation.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/courses"
              className="bg-[#fac0ab] hover:bg-[#ffbca0] text-[#232136] font-bold px-10 py-5 rounded-xl shadow-xl transition transform hover:-translate-y-1 text-lg flex items-center justify-center gap-3"
            >
              <Cloud size={24} /> Start Your Free Google Certification
            </Link>
            <Link
              href="/resume"
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-10 py-5 rounded-xl shadow-xl transition transform hover:-translate-y-1 text-lg flex items-center justify-center gap-3 backdrop-blur-md border border-white/20"
            >
              <FileText size={24} /> Build Your ATS-Ready Resume
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1829] text-gray-400 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-2">
              <img src="/leadwise-logo.svg" alt="LeadWise" className="w-8 h-8 rounded opacity-80" />
              <span className="font-semibold text-gray-200">LeadWise Foundation</span>
           </div>
           <p className="text-sm">&copy; {new Date().getFullYear()} LeadWise Foundation. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
