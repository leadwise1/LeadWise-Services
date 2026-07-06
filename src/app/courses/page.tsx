'use client';
import React, { useState, useEffect } from "react";
import { 
  Code, Database, CheckCircle, Briefcase, ArrowRight, Terminal, BarChart3,
  ShieldCheck, ShieldAlert, Activity, X, Loader2, Lock, ExternalLink,
  ChevronDown, ChevronUp, Globe, Users, Trophy, Compass, Layers,
  AlertTriangle, BrainCircuit, MessageSquare, BarChart, Target, GraduationCap, Cpu
} from "lucide-react";

// --- DATA CONFIGURATION ---
const COURSERA_ORG = {
  name: "LeadWise Foundation",
  slug: "gwg-ent-leadwise-foundation",
  id: "PHXqt_bBMgu9thbuJnsLvQ"
};

const COURSES = [
  {
    id: "google-cybersecurity-cert",
    title: "Google Cybersecurity Professional Certificate",
    externalUrl: "https://coursera.org/programs/google-cybersecurity-professional-certificate-76vpc",
    subtitle: "Prepare for a high-growth career in cybersecurity.",
    description: "Learn Python, Linux, SQL, SIEM tools, and security frameworks to identify and mitigate risks. Earn an industry-recognized credential and prepare for the CompTIA Security+ exam.",
    duration: "19 Courses",
    level: "Beginner — No experience required",
    target: "Career changers, job seekers, aspiring cybersecurity analysts",
    tags: ["Security", "CompTIA Security+", "Cybersecurity"],
    color: "emerald",
    salaryHook: "$75k - $105k avg. starting salary",
    modules: [
      {
        id: "cyber-foundations",
        title: "Foundations & Security Frameworks",
        duration: "4 Courses",
        lessons: [
          {
            id: "cyber-intro",
            title: "Introduction to Cybersecurity",
            resources: [
              { title: "Foundations of Cybersecurity", type: "course", platform: "Coursera", url: "https://coursera.org/programs/google-cybersecurity-professional-certificate-76vpc" }
            ]
          }
        ]
      },
      {
        id: "cyber-tools",
        title: "Linux, SQL, and Python Tools",
        duration: "4 Courses",
        lessons: [
          {
            id: "cyber-tech-skills",
            title: "Technical Skills for Security Analysts",
            resources: [
              { title: "Connect and Protect: Networks and Network Security", type: "course", platform: "Coursera", url: "https://coursera.org/programs/google-cybersecurity-professional-certificate-76vpc" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "data-analytics",
    title: "Google Data Analytics Professional Certificate",
    externalUrl: "https://coursera.org/programs/google-data-analytics-professional-certificate-puv0b",
    subtitle: "Decode the data. Drive business decisions.",
    description: "Master the essentials of data analysis: spreadsheets, SQL, Tableau, and R programming. Learn how to clean, visualize, and analyze complex datasets.",
    duration: "9 Courses",
    level: "Beginner — No experience required",
    target: "Career changers, business professionals, data enthusiasts",
    tags: ["SQL", "Tableau", "R Programming"],
    color: "purple",
    salaryHook: "$70k - $110k avg. starting salary",
    modules: [
      {
        id: "data-foundations",
        title: "Data Foundations & Analysis Process",
        duration: "3 Courses",
        lessons: [
          {
            id: "data-intro",
            title: "Introduction to Data Analytics",
            resources: [
              { title: "Foundations: Data, Data, Everywhere", type: "course", platform: "Coursera", url: "https://coursera.org/programs/google-data-analytics-professional-certificate-puv0b" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "google-ai-cert",
    title: "Google AI Professional Certificate",
    externalUrl: "https://coursera.org/programs/ai-fundamental-lfgho",
    subtitle: "Shape the future with Generative AI and Machine Learning.",
    description: "Learn how to leverage AI tools to automate workflows, build smart applications, and analyze complex systems. Gain skills in prompting, model tuning, and AI ethics.",
    duration: "7 Courses",
    level: "Beginner to Intermediate",
    target: "Developers, professionals looking to leverage AI",
    tags: ["Generative AI", "Machine Learning", "Workflow Automation"],
    color: "blue",
    salaryHook: "$85k - $130k avg. starting salary",
    modules: [
      {
        id: "ai-foundations",
        title: "AI Fundamentals & Generative AI Basics",
        duration: "3 Courses",
        lessons: [
          {
            id: "ai-intro",
            title: "Introduction to Artificial Intelligence",
            resources: [
              { title: "Generative AI Foundations", type: "course", platform: "Coursera", url: "https://coursera.org/programs/ai-fundamental-lfgho" }
            ]
          }
        ]
      }
    ]
  }
];

// --- COMPONENTS ---

function IntakeModal({ isOpen, onClose, onComplete, targetCourse }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", zipCode: "", householdIncome: "", employmentStatus: "", consent: false
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulating API/Firebase call
    setTimeout(() => {
      const intakeRecord = { ...formData, enrolledAt: new Date().toISOString(), targetCourse: targetCourse?.title || "General", status: "Enrolled" };
      localStorage.setItem("leadwise_intake", JSON.stringify(intakeRecord));
      setLoading(false);
      onComplete();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1B2735] border border-white/10 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition">
          <X size={20} />
        </button>
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">Student Enrollment</h2>
            <div className="flex gap-2 mt-2">
              <span className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-[#FF9E80]' : 'bg-white/10'}`}></span>
              <span className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-[#FF9E80]' : 'bg-white/10'}`}></span>
              <span className={`h-1 flex-1 rounded-full ${step >= 3 ? 'bg-[#FF9E80]' : 'bg-white/10'}`}></span>
            </div>
            <p className="text-sm text-gray-400 mt-2">Step {step} of 3: {step === 1 ? 'Contact Info' : step === 2 ? 'Grant Data' : 'Consent'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <div className="space-y-4 animate-in slide-in-from-right duration-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">First Name</label>
                    <input required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFBEA0]" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Last Name</label>
                    <input required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFBEA0]" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Email</label>
                  <input type="email" required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFBEA0]" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Zip Code</label>
                  <input required maxLength={5} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFBEA0]" placeholder="e.g. 75001" value={formData.zipCode} onChange={(e) => setFormData({...formData, zipCode: e.target.value})} />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-in slide-in-from-right duration-200">
                <div className="bg-[#FF9E80]/10 border border-[#FF9E80]/20 p-3 rounded-xl text-sm text-[#FFBEA0] mb-4">
                  This information is required for our grant funding and allows us to keep this course 100% free.
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Household Income</label>
                  <select required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFBEA0]" value={formData.householdIncome} onChange={(e) => setFormData({...formData, householdIncome: e.target.value})}>
                    <option value="">Select Range...</option>
                    <option value="0-25k">$0 - $25,000</option>
                    <option value="25-50k">$25,001 - $50,000</option>
                    <option value="50-75k">$50,001 - $75,000</option>
                    <option value="75k+">$75,001+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Employment Status</label>
                  <select required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFBEA0]" value={formData.employmentStatus} onChange={(e) => setFormData({...formData, employmentStatus: e.target.value})}>
                    <option value="">Select Status...</option>
                    <option value="unemployed">Unemployed</option>
                    <option value="part-time">Part-Time</option>
                    <option value="full-time">Full-Time</option>
                    <option value="student">Student</option>
                  </select>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-in slide-in-from-right duration-200">
                 <div className="border border-white/10 p-4 rounded-xl bg-white/5 text-sm text-gray-300 space-y-2">
                   <h3 className="font-bold text-white">Program Participation Agreement</h3>
                   <p>By clicking "Submit", I certify that the information provided is true. I understand that LeadWise Foundation is a non-profit and will use this data in aggregate form for grant reporting purposes.</p>
                 </div>
                 <label className="flex items-start gap-3 p-3 cursor-pointer hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10 transition">
                   <input type="checkbox" required className="mt-1 w-4 h-4 accent-[#FF9E80]" checked={formData.consent} onChange={(e) => setFormData({...formData, consent: e.target.checked})} />
                   <span className="text-sm font-medium text-gray-300">I Agree and wish to enroll.</span>
                 </label>
              </div>
            )}

            <div className="flex justify-between pt-4 mt-4">
              {step > 1 ? (
                <button type="button" onClick={() => setStep(step - 1)} className="px-4 py-2 text-gray-400 hover:text-white font-medium">Back</button>
              ) : (
                <button type="button" onClick={onClose} className="px-4 py-2 text-gray-500 hover:text-gray-300">Cancel</button>
              )}
              {step < 3 ? (
                <button type="button" onClick={() => {
                    if (step === 1 && (!formData.firstName || !formData.email || !formData.zipCode)) return alert("Please fill in all fields");
                    if (step === 2 && (!formData.householdIncome || !formData.employmentStatus)) return alert("Please verify eligibility");
                    setStep(step + 1);
                  }} className="bg-white text-[#090A0F] px-6 py-3 rounded-xl font-bold hover:bg-[#FFBEA0] transition">Next Step</button>
              ) : (
                <button type="submit" disabled={loading} className="bg-[#FF9E80] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#FFBEA0] transition flex items-center gap-2">
                  {loading ? <><Loader2 className="animate-spin" size={18}/> Enrolling...</> : "Submit & Start Learning"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function CourseCard({ course, isEnrolled, onTriggerIntake }) {
  const Icon = course.color === 'blue' ? Code : course.color === 'emerald' ? ShieldCheck : BarChart3;

  return (
    <div className="group relative bg-white/5 border border-white/10 hover:border-[#FFBEA0]/30 rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(255,190,160,0.1)] flex flex-col h-full">
      <div className="p-8 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-6">
          <div className={`p-3 rounded-2xl ${course.color === 'blue' ? 'bg-blue-500/20 text-blue-300' : course.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-purple-500/20 text-purple-300'}`}>
            <Icon size={32} />
          </div>
          <div className="flex gap-2">
            {course.tags.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full bg-white/5 text-xs text-gray-400 border border-white/5">{tag}</span>
            ))}
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-2 text-white leading-snug">{course.title}</h3>
        <p className="text-[#FFBEA0] font-medium mb-4 text-sm">{course.subtitle}</p>
        
        {course.salaryHook && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FF9E80]/10 border border-[#FF9E80]/20 text-[#FFBEA0] text-sm font-bold mb-4 w-fit">
             <Briefcase size={14} /> {course.salaryHook}
          </div>
        )}

        <p className="text-gray-300 leading-relaxed mb-6 text-sm flex-1">{course.description}</p>
        <div className="flex items-center gap-4 text-xs text-gray-400 mb-6 pb-6 border-b border-white/10">
          <span>{course.duration}</span> • <span>{course.level}</span>
        </div>

        <div className="space-y-3 mt-auto">
          {!isEnrolled ? (
             <button onClick={onTriggerIntake} className="w-full py-3.5 rounded-xl bg-white text-[#090A0F] font-bold hover:bg-[#FFBEA0] transition-colors flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(255,190,160,0.4)] text-sm">
              Start Learning Free <ArrowRight size={16} />
            </button>
          ) : (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 flex flex-col gap-2 mb-2">
               <div className="flex items-center gap-2 text-green-400 text-sm justify-center py-2">
                  <CheckCircle size={16} /> <span className="font-semibold">Successfully Enrolled</span>
               </div>
               <a href={course.externalUrl} target="_blank" rel="noreferrer" className="w-full py-2.5 rounded-xl bg-blue-500/10 text-blue-300 border border-blue-500/20 font-bold hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-2 text-xs">
                 <Globe size={14} /> Go To Coursera
               </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- VIEW COMPONENTS ---

function SystemOverviewView({ onNavigateToCourses }) {
  return (
    <div className="animate-in fade-in duration-500">
      {/* HERO SECTION */}
      <header className="relative pt-24 pb-16 px-4 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-[#FFBEA0]/30 text-[#FFBEA0] text-sm font-semibold mb-6">
          <Compass size={16} /> The Career Transition System
        </div>
        
        {/* Updated Copy Here */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#FFBEA0]">
          Your Fast-Track to <br />
          <span className="text-[#FFBEA0]">Employment.</span>
        </h1>
        
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-10">
          LeadWise offers Google Career Certificate programs hosted on Coursera. We combine structured learning pathways, live mentoring, and workforce readiness support to accelerate your journey from student to hired professional.
        </p>

        <button 
          onClick={onNavigateToCourses}
          className="bg-[#FF9E80] text-[#1B2735] px-8 py-4 rounded-full font-bold hover:bg-white transition-colors shadow-[0_0_20px_rgba(255,158,128,0.4)] flex items-center gap-2 mx-auto text-lg"
        >
          Browse Open Courses <ArrowRight size={20} />
        </button>
      </header>

      {/* SECTION 1: WHAT YOU ARE ENTERING */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-300 text-sm font-bold mb-6 border border-blue-500/20">
            <Layers size={18} /> Section 1: The Structure
          </div>
          {/* Updated Intro Copy */}
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">When you join LeadWise, you are not just enrolling in a course.</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">You are stepping onto a structured career runway built on three integrated layers designed to get you hired:</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:border-green-400/50 transition-colors">
            <div className="w-14 h-14 bg-green-500/20 text-green-400 rounded-2xl flex items-center justify-center mb-6"><GraduationCap size={28} /></div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-400"></span> Learning Layer</h3>
            <p className="text-gray-400 mb-6 text-sm uppercase tracking-wider font-semibold">(Coursera)</p>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-center gap-3"><CheckCircle size={18} className="text-green-400" /> Google Cybersecurity Certificate</li>
              <li className="flex items-center gap-3"><CheckCircle size={18} className="text-green-400" /> Data Analytics Certificate</li>
              <li className="flex items-center gap-3"><CheckCircle size={18} className="text-green-400" /> AI Certificate</li>
            </ul>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:border-blue-400/50 transition-colors">
            <div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6"><Activity size={28} /></div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-400"></span> Program Layer</h3>
            <p className="text-gray-400 mb-6 text-sm uppercase tracking-wider font-semibold">(LeadWise Control)</p>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-center gap-3"><CheckCircle size={18} className="text-blue-400" /> Enrollment management</li>
              <li className="flex items-center gap-3"><CheckCircle size={18} className="text-blue-400" /> Structured learning pathways</li>
              <li className="flex items-center gap-3"><CheckCircle size={18} className="text-blue-400" /> Cohort tracking</li>
            </ul>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:border-purple-400/50 transition-colors">
            <div className="w-14 h-14 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center mb-6"><Target size={28} /></div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-purple-400"></span> Readiness Layer</h3>
            <p className="text-gray-400 mb-6 text-sm uppercase tracking-wider font-semibold">(Mentoring + Simulation)</p>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-center gap-3"><CheckCircle size={18} className="text-purple-400" /> Live AI mentoring sessions</li>
              <li className="flex items-center gap-3"><CheckCircle size={18} className="text-purple-400" /> Confidence Lab simulations</li>
              <li className="flex items-center gap-3"><CheckCircle size={18} className="text-purple-400" /> Behavioral training feedback</li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 2: WHY MOST LEARNERS FALL OFF */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative bg-black/30 border-y border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
           <div>
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-400 text-sm font-bold mb-6 border border-red-500/20">
               <AlertTriangle size={18} /> Section 2: The Gap
             </div>
             <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Why Most Learners Fall Off</h2>
             <p className="text-xl text-gray-400 mb-8">Most platforms stop at learning. Learners struggle because:</p>
             
             <div className="space-y-4">
               {[
                 "They complete courses but don’t know what comes next",
                 "They don’t practice interview readiness",
                 "They don’t receive real feedback on performance",
                 "They lack accountability systems"
               ].map((text, i) => (
                 <div key={i} className="flex gap-4 items-start p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                   <div className="mt-0.5 text-red-400"><X size={20} /></div>
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
                  We don't just hand you a certificate and wish you luck. We provide the infrastructure, the practice, and the professional network to turn your knowledge into a career.
                </p>
             </div>
           </div>
        </div>
      </section>

      {/* SECTION 3: LIVE MENTORING SYSTEM */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-300 text-sm font-bold mb-6 border border-purple-500/20">
            <BrainCircuit size={18} /> Section 3: Your Live Mentoring System
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Confidence Lab + AI Simulation Engine</h2>
        </div>

        <div className="max-w-5xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 md:p-16 shadow-2xl relative">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
             <div>
               <p className="text-xl text-gray-300 mb-8">Before applying for jobs, learners step into the simulated environment to:</p>
               <ul className="space-y-6">
                 {[
                   { icon: <MessageSquare size={24} />, text: "Practice real interview scenarios" },
                   { icon: <Cpu size={24} />, text: "Receive AI feedback on responses" },
                   { icon: <BarChart size={24} />, text: "Improve communication and structure" },
                   { icon: <ShieldCheck size={24} />, text: "Build job readiness confidence" }
                 ].map((item, i) => (
                   <li key={i} className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center shrink-0">{item.icon}</div>
                     <span className="text-lg text-white font-medium">{item.text}</span>
                   </li>
                 ))}
               </ul>
             </div>
             
             <div className="bg-[#090A0F]/80 border border-purple-500/30 rounded-3xl p-8 relative">
                <div className="space-y-4 mt-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 shrink-0 flex items-center justify-center text-xs font-bold text-gray-400">User</div>
                    <div className="bg-white/10 rounded-2xl rounded-tl-none p-4 text-sm text-gray-300 w-full">
                      <p className="italic">"I handled server configurations by automating..."</p>
                    </div>
                  </div>
                  <div className="flex gap-4 flex-row-reverse">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                      <BrainCircuit size={20} className="text-purple-400" />
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl rounded-tr-none p-4 text-sm text-gray-300 w-full">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Confidence Engine</span>
                      </div>
                      <p className="text-xs text-purple-300">Communication Structure: +18% improvement. Good inclusion of active verbs.</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 text-center text-lg font-bold text-[#FFBEA0] border-t border-white/10 pt-6">
                  👉 This transforms learning into performance ability.
                </div>
             </div>
           </div>
        </div>
      </section>

      {/* SECTION 4: HOW THE SYSTEM WORKS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative bg-black/20 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF9E80]/10 text-[#FFBEA0] text-sm font-bold mb-6 border border-[#FF9E80]/20">
              <Compass size={18} /> Section 4: How The System Works
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Your Guided 5-Step Process</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { step: 1, title: "1. Enroll", desc: "You are placed into a Google Career Certificate program." },
              { step: 2, title: "2. Learn", desc: "Coursera delivers structured curriculum + certification." },
              { step: 3, title: "3. Practice", desc: "LeadWise AI Mentoring activates coaching and feedback." },
              { step: 4, title: "4. Prepare", desc: "Resume & LinkedIn optimization, and job readiness." },
              { step: 5, title: "5. Transition", desc: "Learner becomes job-ready and enters employment pipeline." }
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl h-full hover:bg-white/10 hover:border-[#FFBEA0]/50 transition-all z-10 relative">
                  <div className="text-[#FFBEA0] font-black text-4xl mb-4 opacity-30 group-hover:opacity-100 transition-opacity">0{item.step}</div>
                  <h3 className="text-lg font-bold mb-2 text-white">{item.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
                {i < 4 && <div className="hidden md:block absolute top-1/2 right-0 w-6 h-px bg-white/20 translate-x-full z-0"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: WHAT HAPPENS AFTER YOU COMPLETE */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">After You Complete Your Certificate</h2>
            <p className="text-xl text-[#FFBEA0] max-w-3xl mb-4 font-semibold">You don’t stop here — your career activation begins now.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl flex flex-col hover:border-[#FFBEA0]/50 transition-colors">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><span className="text-[#FFBEA0]">1.</span> Employer Network Access</h4>
              <p className="text-gray-300 mb-6 flex-1 text-sm leading-relaxed">
                Get access to a network of 150+ hiring employers actively considering Google Career Certificate graduates like Verizon, Deloitte, and Siemens.
              </p>
              <div className="bg-[#FF9E80]/10 border border-[#FF9E80]/20 p-3 rounded-xl text-xs font-bold text-[#FFBEA0] mt-auto">👉 Step into the job market ecosystem.</div>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl flex flex-col hover:border-[#FFBEA0]/50 transition-colors">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><span className="text-[#FFBEA0]">2.</span> 360° Career Profile</h4>
              <p className="text-gray-300 mb-6 flex-1 text-sm leading-relaxed">
                Build a professional profile that goes beyond a resume. Includes skills gained, learning progress data, and project highlights.
              </p>
              <div className="bg-[#FF9E80]/10 border border-[#FF9E80]/20 p-3 rounded-xl text-xs font-bold text-[#FFBEA0] mt-auto">👉 Help employers see you as a whole candidate.</div>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl flex flex-col hover:border-[#FFBEA0]/50 transition-colors">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><span className="text-[#FFBEA0]">3.</span> Readiness Support</h4>
              <p className="text-gray-300 mb-6 flex-1 text-sm leading-relaxed mt-2">
                Gain access to resume building tools, interview preparation guides, job search strategy support, and virtual hiring events.
              </p>
              <div className="bg-[#FF9E80]/10 border border-[#FF9E80]/20 p-3 rounded-xl text-xs font-bold text-[#FFBEA0] mt-auto">👉 Where learning turns into job strategy.</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: OUTCOME STATEMENT */}
      <section className="py-24 px-6 border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-[#1B2735] to-black border border-white/10 rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
          <div className="flex-1 relative z-10 text-left">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">Ready to start your journey?</h2>
            <p className="text-xl text-[#FFBEA0] mb-8 font-light leading-relaxed">Join a career transformation system that actively works to get you hired.</p>
            <button onClick={onNavigateToCourses} className="bg-white text-[#1B2735] px-8 py-4 rounded-2xl font-black hover:bg-[#FFBEA0] transition-all transform hover:scale-105 flex items-center gap-3 shadow-xl">
              Browse Certificates <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function CourseCatalogView({ isEnrolled, setIsEnrolled }) {
  const [intakeOpen, setIntakeOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const openEnrollment = (course) => {
    setSelectedCourse(course);
    setIntakeOpen(true);
  };

  const handleEnrollmentComplete = () => {
    setIsEnrolled(true);
    setIntakeOpen(false);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF9E80]/10 border border-[#FF9E80]/30 text-[#FFBEA0] text-sm font-semibold mb-6">
            <Code size={16} /> Course Catalog
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">
            Select Your <span className="text-[#FFBEA0]">Career Certificate Path</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Choose one of the verified Google Career Certificate tracks below to begin your journey. 100% free of tuition.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {COURSES.map(course => (
            <CourseCard 
              key={course.id}
              course={course}
              isEnrolled={isEnrolled}
              onTriggerIntake={() => openEnrollment(course)}
            />
          ))}
        </div>
      </section>

      <IntakeModal 
        isOpen={intakeOpen} 
        onClose={() => setIntakeOpen(false)} 
        onComplete={handleEnrollmentComplete} 
        targetCourse={selectedCourse} 
      />
    </div>
  );
}


// --- MAIN APP COMPONENT ---
export default function App() {
  const [activeTab, setActiveTab] = useState('system'); // 'system' | 'courses'
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("leadwise_intake")) {
      setIsEnrolled(true);
    }
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#090A0F] bg-[radial-gradient(ellipse_at_top,_#1B2735_0%,_#090A0F_100%)] text-white font-sans selection:bg-[#FFBEA0] selection:text-[#1B2735]">
      
      {/* NAVBAR */}
      <nav className="border-b border-white/10 bg-[#090A0F]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('system')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF9E80] to-[#FFBEA0] flex items-center justify-center font-bold text-[#1B2735]">LW</div>
            <span className="font-bold text-white text-lg tracking-tight">LeadWise Foundation</span>
          </div>
          
          <div className="hidden md:flex items-center gap-4 bg-white/5 p-1 rounded-full border border-white/10">
            <button 
              onClick={() => setActiveTab('system')} 
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'system' ? 'bg-white text-[#1B2735]' : 'text-gray-400 hover:text-white'}`}
            >
              The System
            </button>
            <button 
              onClick={() => setActiveTab('courses')} 
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'courses' ? 'bg-white text-[#1B2735]' : 'text-gray-400 hover:text-white'}`}
            >
              Course Catalog
            </button>
          </div>
        </div>
      </nav>

      {/* DYNAMIC CONTENT */}
      <main>
        {activeTab === 'system' && <SystemOverviewView onNavigateToCourses={() => setActiveTab('courses')} />}
        {activeTab === 'courses' && <CourseCatalogView isEnrolled={isEnrolled} setIsEnrolled={setIsEnrolled} />}
      </main>

      {/* FOOTER */}
      <footer className="bg-[#090A0F] text-gray-500 border-t border-white/10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400">LW</div>
              <span className="font-semibold text-gray-300">LeadWise Foundation</span>
           </div>
           <p className="text-sm">&copy; {new Date().getFullYear()} LeadWise Foundation. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
