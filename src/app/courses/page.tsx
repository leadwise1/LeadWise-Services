'use client';
import React, { useState, useEffect } from "react";
import { 
  Code, 
  Database, 
  CheckCircle, 
  Briefcase, 
  ArrowRight, 
  BarChart3,
  ShieldCheck,
  Activity,
  X,
  Loader2,
  Lock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Globe,
  Compass,
  Layers,
  AlertTriangle,
  BrainCircuit,
  MessageSquare,
  BarChart,
  Target,
  GraduationCap,
  Cpu
} from "lucide-react";
import * as Progress from "@radix-ui/react-progress";

// --- DATA ---
const COURSERA_ORG = {
  name: "LeadWise Foundation",
  slug: "gwg-ent-leadwise-foundation",
};

const COURSES = [
  {
    id: "google-cybersecurity-cert",
    title: "Google Cybersecurity Professional Certificate",
    subtitle: "Prepare for a high-growth career in cybersecurity.",
    description: "Learn Python, Linux, SQL, SIEM tools, and security frameworks to identify and mitigate risks. Earn an industry-recognized credential and prepare for the CompTIA Security+ exam.",
    duration: "19 Courses",
    level: "Beginner — No experience required",
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
              { title: "Foundations of Cybersecurity", type: "course", platform: "Coursera", url: "#" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "data-analytics",
    title: "Google Data Analytics Professional Certificate",
    subtitle: "Decode the data. Drive business decisions.",
    description: "Master the essentials of data analysis: spreadsheets, SQL, Tableau, and R programming. Learn how to clean, visualize, and analyze complex datasets.",
    duration: "9 Courses",
    level: "Beginner — No experience required",
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
              { title: "Foundations: Data, Data, Everywhere", type: "course", platform: "Coursera", url: "#" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "google-ai-cert",
    title: "Google AI Professional Certificate",
    subtitle: "Shape the future with Generative AI and Machine Learning.",
    description: "Learn how to leverage AI tools to automate workflows, build smart applications, and analyze complex systems. Gain skills in prompting, model tuning, and AI ethics.",
    duration: "7 Courses",
    level: "Beginner to Intermediate",
    tags: ["Generative AI", "Machine Learning"],
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
              { title: "Generative AI Foundations", type: "course", platform: "Coursera", url: "#" }
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
    // Simulating API/Firebase call for the preview
    setTimeout(() => {
      setLoading(false);
      onComplete();
    }, 1500);
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
                  {loading ? <><Loader2 className="animate-spin" size={18}/> Enrolling...</> : "Submit & Start"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function ProtectedResource({ resource, isEnrolled, onTriggerIntake }) {
  return (
    <div onClick={!isEnrolled ? onTriggerIntake : undefined} className={`flex items-start gap-3 p-4 rounded-xl transition-all duration-200 group relative ${isEnrolled ? "bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer" : "bg-black/20 border border-white/5 cursor-not-allowed opacity-60"}`}>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className={`text-sm font-semibold group-hover:text-[#FFBEA0] transition-colors ${isEnrolled ? 'text-white' : 'text-gray-400'}`}>{resource.title}</p>
          {!isEnrolled ? <Lock className="w-3 h-3 text-gray-500" /> : <CheckCircle className="w-3 h-3 text-green-400" />}
        </div>
        <p className="text-xs text-gray-500 mt-1">{resource.type} • {resource.platform}</p>
      </div>
      <span className="text-gray-400 group-hover:text-[#FFBEA0] mt-1">
        {isEnrolled ? <ExternalLink className="w-4 h-4"/> : <Lock className="w-4 h-4"/>}
      </span>
    </div>
  );
}

function ExpandableModule({ module, isEnrolled, onTriggerIntake }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden bg-white/5 transition-all duration-200">
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors duration-200">
        <div className="text-left flex-1">
          <h3 className="text-base font-bold text-white mb-1">{module.title}</h3>
          <p className="text-xs text-gray-400 uppercase tracking-wider">Duration: {module.duration}</p>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5 text-[#FFBEA0]" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>
      {expanded && (
        <div className="border-t border-white/10 bg-black/20 p-5 space-y-3">
          {module.lessons.map((lesson) => (
            <div key={lesson.id} className="bg-[#1B2735] rounded-xl p-4 border border-white/5">
              <h4 className="text-sm font-semibold text-[#FFBEA0] mb-3">{lesson.title}</h4>
              <div className="space-y-2">
                {lesson.resources.map((resource, idx) => (
                  <ProtectedResource key={idx} resource={resource} isEnrolled={isEnrolled} onTriggerIntake={onTriggerIntake} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CourseCard({ course, isEnrolled, onTriggerIntake }) {
  const [showModules, setShowModules] = useState(false);
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
             <button onClick={onTriggerIntake} className="w-full py-3.5 rounded-xl bg-white text-[#090A0F] font-bold hover:bg-[#FFBEA0] transition-colors flex items-center justify-center gap-2 text-sm">
              Start Learning Free <ArrowRight size={16} />
            </button>
          ) : (
            <>
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 flex items-center gap-2 text-green-400 text-xs mb-2">
                 <CheckCircle size={16} /> <span className="font-semibold">Enrolled Successfully</span>
              </div>
              <button onClick={() => setShowModules(!showModules)} className="w-full py-2.5 rounded-xl bg-[#FF9E80]/10 text-[#FFBEA0] border border-[#FF9E80]/20 font-bold hover:bg-[#FF9E80]/20 transition-colors flex items-center justify-center gap-2 text-xs">
                {showModules ? "Hide Curriculum" : "View Curriculum & Modules"}
                {showModules ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </>
          )}
        </div>

        {showModules && (
          <div className="mt-6 space-y-3 animate-in slide-in-from-top-4 duration-300">
             {course.modules.map(module => (
               <ExpandableModule key={module.id} module={module} isEnrolled={isEnrolled} onTriggerIntake={onTriggerIntake} />
             ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- PAGE VIEWS ---

function SystemServicesView({ navigateTo }) {
  return (
    <div className="animate-in fade-in duration-500">
      {/* HERO SECTION */}
      <header className="relative pt-24 pb-16 px-4 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-[#FFBEA0]/30 text-[#FFBEA0] text-sm font-semibold mb-6">
          <Compass size={16} /> The Career Transition System
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#FFBEA0]">
          Your Fast-Track <br />
          <span className="text-[#FFBEA0]">to Employment.</span>
        </h1>
        
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-10">
          LeadWise offers Google Career Certificate programs hosted on Coursera. We combine structured learning pathways, live mentoring, and workforce readiness support to <b>accelerate your journey from student to hired professional.</b>
        </p>

        <button onClick={() => navigateTo('courses')} className="bg-[#FF9E80] text-[#1B2735] px-8 py-4 rounded-full font-black text-lg hover:bg-white transition-colors shadow-[0_0_20px_rgba(255,190,160,0.4)] flex items-center gap-3 mx-auto">
          Browse Free Courses <ArrowRight size={20} />
        </button>
      </header>

      {/* SECTION 1 */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-300 text-sm font-bold mb-6 border border-blue-500/20">
            <Layers size={18} /> Section 1: The Blueprint
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">When you join LeadWise, you are not just enrolling in a course.</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">You are stepping onto a structured career runway built on three integrated layers designed to get you hired.</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:border-green-400/50 transition-colors group">
            <div className="w-14 h-14 bg-green-500/20 text-green-400 rounded-2xl flex items-center justify-center mb-6"><GraduationCap size={28} /></div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-400"></span> Learning Layer</h3>
            <p className="text-gray-400 mb-6 text-sm uppercase tracking-wider font-semibold">(Coursera)</p>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-center gap-3"><CheckCircle size={18} className="text-green-400" /> Google Cybersecurity Certificate</li>
              <li className="flex items-center gap-3"><CheckCircle size={18} className="text-green-400" /> Data Analytics Certificate</li>
              <li className="flex items-center gap-3"><CheckCircle size={18} className="text-green-400" /> AI Certificate</li>
            </ul>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:border-blue-400/50 transition-colors group">
            <div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6"><Activity size={28} /></div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-400"></span> Program Layer</h3>
            <p className="text-gray-400 mb-6 text-sm uppercase tracking-wider font-semibold">(LeadWise Control)</p>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-center gap-3"><CheckCircle size={18} className="text-blue-400" /> Enrollment management</li>
              <li className="flex items-center gap-3"><CheckCircle size={18} className="text-blue-400" /> Structured learning pathways</li>
              <li className="flex items-center gap-3"><CheckCircle size={18} className="text-blue-400" /> Cohort tracking</li>
            </ul>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:border-purple-400/50 transition-colors group">
            <div className="w-14 h-14 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center mb-6"><Target size={28} /></div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-purple-400"></span> Readiness Layer</h3>
            <p className="text-gray-400 mb-6 text-sm uppercase tracking-wider font-semibold">(Mentoring + Simulation)</p>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-center gap-3"><CheckCircle size={18} className="text-purple-400" /> Live AI mentoring sessions</li>
              <li className="flex items-center gap-3"><CheckCircle size={18} className="text-purple-400" /> Interview simulation (Confidence Lab)</li>
              <li className="flex items-center gap-3"><CheckCircle size={18} className="text-purple-400" /> Career coaching</li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 2 & 3 & 4 (Abbreviated for demo, kept core structure) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative bg-black/30 border-y border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
           <div>
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-400 text-sm font-bold mb-6 border border-red-500/20">
               <AlertTriangle size={18} /> Section 2: The Gap
             </div>
             <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Why Most Learners Fall Off</h2>
             <p className="text-xl text-gray-400 mb-8">Most platforms stop at learning. Learners struggle because they lack practice, feedback, and accountability.</p>
           </div>
           <div className="relative">
             <div className="bg-gradient-to-br from-[#FF9E80]/20 to-transparent border border-[#FF9E80]/30 rounded-3xl p-10 relative backdrop-blur-xl">
                <h3 className="text-3xl font-bold text-white mb-6">👉 LeadWise exists to close THIS gap.</h3>
                <p className="text-xl text-[#FFBEA0] leading-relaxed">
                  We don't just hand you a certificate. We provide the infrastructure, the practice, and the professional network to turn your knowledge into a career.
                </p>
             </div>
           </div>
        </div>
      </section>
      
      {/* SECTION 6 */}
      <section className="py-24 px-6 border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-[#1B2735] to-black border border-white/10 rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl">
          <div className="flex-1 text-left">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">LeadWise is not a course platform.</h2>
            <p className="text-xl text-[#FFBEA0] mb-8 font-light leading-relaxed">
              It is a career transformation system combining Coursera learning, AI simulation mentoring, and structured workforce readiness support.
            </p>
            <button onClick={() => navigateTo('courses')} className="bg-white text-[#1B2735] px-8 py-4 rounded-2xl font-black hover:bg-[#FFBEA0] transition-all flex items-center gap-3">
              Explore The Courses <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function CoursesView() {
  const [intakeOpen, setIntakeOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const openEnrollment = (course) => {
    setSelectedCourse(course);
    setIntakeOpen(true);
  };

  const handleEnrollmentComplete = () => {
    setIsEnrolled(true);
    setIntakeOpen(false);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="pt-20 pb-12 px-4 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-white">
          Select Your <span className="text-[#FFBEA0]">Career Path</span>
        </h1>
        <p className="text-lg text-gray-300">
          Kickstart your journey by choosing one of the verified Google Career Certificate tracks below. 100% free of tuition.
        </p>
      </header>

      <section className="max-w-7xl mx-auto px-6 pb-24">
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

export default function App() {
  // Simple state router: 'system' | 'courses'
  const [currentPage, setCurrentPage] = useState('system');

  return (
    <div className="min-h-screen w-full bg-[#090A0F] bg-[radial-gradient(ellipse_at_top,_#1B2735_0%,_#090A0F_100%)] text-white font-sans selection:bg-[#FFBEA0] selection:text-[#1B2735]">
      
      {/* NAVBAR */}
      <nav className="border-b border-white/10 bg-[#090A0F]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('system')}>
            <div className="w-8 h-8 rounded-lg bg-[#FF9E80] flex items-center justify-center text-[#1B2735] font-black">LW</div>
            <span className="font-bold text-white text-lg tracking-tight">LeadWise Foundation</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <button 
              onClick={() => setCurrentPage('system')} 
              className={`transition ${currentPage === 'system' ? 'text-[#FFBEA0]' : 'text-gray-400 hover:text-white'}`}
            >
              The System
            </button>
            <button 
              onClick={() => setCurrentPage('courses')} 
              className={`transition ${currentPage === 'courses' ? 'text-[#FFBEA0]' : 'text-gray-400 hover:text-white'}`}
            >
              Courses
            </button>
            <button className="bg-[#FF9E80] text-[#1B2735] px-5 py-2 rounded-full font-bold hover:bg-white transition-colors">
              Donate Now
            </button>
          </div>
        </div>
      </nav>

      {/* DYNAMIC PAGE RENDERING */}
      {currentPage === 'system' ? (
        <SystemServicesView navigateTo={setCurrentPage} />
      ) : (
        <CoursesView />
      )}

      {/* FOOTER */}
      <footer className="bg-[#090A0F] text-gray-500 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500">LW</div>
              <span className="font-semibold text-gray-300">LeadWise Foundation</span>
           </div>
           <p className="text-sm">&copy; {new Date().getFullYear()} LeadWise Foundation. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
