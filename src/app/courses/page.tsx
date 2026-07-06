'use client';
import React, { useState } from "react";
import Link from "next/link";
import {
  Code,
  Database,
  CheckCircle,
  Briefcase,
  ArrowRight,
  BarChart3,
  ShieldCheck,
  X,
  Loader2,
  Lock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface Resource { title: string; type: string; platform: string; url: string; }
interface Lesson   { id: string; title: string; resources: Resource[]; }
interface Module   { id: string; title: string; duration: string; lessons: Lesson[]; }
interface Course   {
  id: string; title: string; subtitle: string; description: string;
  duration: string; level: string; tags: string[]; color: string;
  salaryHook?: string; modules: Module[]; externalUrl: string;
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const COURSES: Course[] = [
  {
    id: "google-cybersecurity-cert",
    title: "Google Cybersecurity Professional Certificate",
    subtitle: "Prepare for a high-growth career in cybersecurity.",
    description: "Learn Python, Linux, SQL, SIEM tools, and security frameworks to identify and mitigate risks. Earn an industry-recognized credential and prepare for the CompTIA Security+ exam.",
    duration: "19 Courses",
    level: "Beginner — No experience required",
    tags: ["Security", "CompTIA Security+", "Cybersecurity"],
    color: "emerald",
    salaryHook: "$75k – $105k avg. starting salary",
    externalUrl: "https://coursera.org/programs/google-cybersecurity-professional-certificate-76vpc",
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
              { title: "Foundations of Cybersecurity", type: "Course", platform: "Coursera", url: "https://coursera.org/programs/google-cybersecurity-professional-certificate-76vpc" },
            ],
          },
        ],
      },
    ],
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
    salaryHook: "$70k – $110k avg. starting salary",
    externalUrl: "https://coursera.org/programs/google-data-analytics-professional-certificate-puv0b",
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
              { title: "Foundations: Data, Data, Everywhere", type: "Course", platform: "Coursera", url: "https://coursera.org/programs/google-data-analytics-professional-certificate-puv0b" },
            ],
          },
        ],
      },
    ],
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
    salaryHook: "$85k – $130k avg. starting salary",
    externalUrl: "https://coursera.org/programs/ai-fundamental-lfgho",
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
              { title: "Generative AI Foundations", type: "Course", platform: "Coursera", url: "https://coursera.org/programs/ai-fundamental-lfgho" },
            ],
          },
        ],
      },
    ],
  },
];

// ─── INTAKE MODAL ─────────────────────────────────────────────────────────────
function IntakeModal({
  isOpen, onClose, onComplete, targetCourse,
}: {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  targetCourse: Course | null;
}) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", zipCode: "",
    householdIncome: "", employmentStatus: "", consent: false,
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Save anonymous learner intake to Firestore
      await addDoc(collection(db, "learner_intakes"), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        zipCode: formData.zipCode,
        householdIncome: formData.householdIncome,
        employmentStatus: formData.employmentStatus,
        courseId: targetCourse?.id ?? "unknown",
        courseTitle: targetCourse?.title ?? "unknown",
        enrolledAt: serverTimestamp(),
      });
      setLoading(false);
      onComplete();
    } catch (err) {
      console.error("Intake save error:", err);
      setError("There was a problem saving your enrollment. Please try again.");
      setLoading(false);
    }
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
              <span className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-[#FF9E80]' : 'bg-white/10'}`} />
              <span className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-[#FF9E80]' : 'bg-white/10'}`} />
              <span className={`h-1 flex-1 rounded-full ${step >= 3 ? 'bg-[#FF9E80]' : 'bg-white/10'}`} />
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Step {step} of 3: {step === 1 ? 'Contact Info' : step === 2 ? 'Grant Data' : 'Consent'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <div className="space-y-4 animate-in slide-in-from-right duration-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">First Name</label>
                    <input required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFBEA0]" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Last Name</label>
                    <input required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFBEA0]" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Email</label>
                  <input type="email" required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFBEA0]" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Zip Code</label>
                  <input required maxLength={5} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFBEA0]" placeholder="e.g. 75001" value={formData.zipCode} onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })} />
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
                  <select required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFBEA0]" value={formData.householdIncome} onChange={(e) => setFormData({ ...formData, householdIncome: e.target.value })}>
                    <option value="">Select Range...</option>
                    <option value="0-25k">$0 – $25,000</option>
                    <option value="25-50k">$25,001 – $50,000</option>
                    <option value="50-75k">$50,001 – $75,000</option>
                    <option value="75k+">$75,001+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Employment Status</label>
                  <select required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFBEA0]" value={formData.employmentStatus} onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value })}>
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
                  <p>By clicking &quot;Submit&quot;, I certify that the information provided is true. I understand that LeadWise Foundation is a non-profit and will use this data in aggregate form for grant reporting purposes.</p>
                </div>
                <label className="flex items-start gap-3 p-3 cursor-pointer hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10 transition">
                  <input type="checkbox" required className="mt-1 w-4 h-4 accent-[#FF9E80]" checked={formData.consent} onChange={(e) => setFormData({ ...formData, consent: e.target.checked })} />
                  <span className="text-sm font-medium text-gray-300">I agree and wish to enroll.</span>
                </label>
                {error && <p className="text-red-400 text-xs">{error}</p>}
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
                  if (step === 2 && (!formData.householdIncome || !formData.employmentStatus)) return alert("Please complete the grant eligibility fields");
                  setStep(step + 1);
                }} className="bg-white text-[#090A0F] px-6 py-3 rounded-xl font-bold hover:bg-[#FFBEA0] transition">
                  Next Step
                </button>
              ) : (
                <button type="submit" disabled={loading} className="bg-[#FF9E80] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#FFBEA0] transition flex items-center gap-2">
                  {loading ? <><Loader2 className="animate-spin" size={18} /> Enrolling...</> : "Submit & Start"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── PROTECTED RESOURCE ───────────────────────────────────────────────────────
function ProtectedResource({ resource, isEnrolled, onTriggerIntake }: {
  resource: Resource; isEnrolled: boolean; onTriggerIntake: () => void;
}) {
  return (
    <div
      onClick={!isEnrolled ? onTriggerIntake : undefined}
      className={`flex items-start gap-3 p-4 rounded-xl transition-all duration-200 group relative ${isEnrolled ? "bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer" : "bg-black/20 border border-white/5 cursor-not-allowed opacity-60"}`}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className={`text-sm font-semibold group-hover:text-[#FFBEA0] transition-colors ${isEnrolled ? 'text-white' : 'text-gray-400'}`}>{resource.title}</p>
          {!isEnrolled ? <Lock className="w-3 h-3 text-gray-500" /> : <CheckCircle className="w-3 h-3 text-green-400" />}
        </div>
        <p className="text-xs text-gray-500 mt-1">{resource.type} • {resource.platform}</p>
      </div>
      <span className="text-gray-400 group-hover:text-[#FFBEA0] mt-1">
        {isEnrolled ? <ExternalLink className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
      </span>
    </div>
  );
}

// ─── EXPANDABLE MODULE ────────────────────────────────────────────────────────
function ExpandableModule({ module, isEnrolled, onTriggerIntake }: {
  module: Module; isEnrolled: boolean; onTriggerIntake: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden bg-white/5">
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

// ─── COURSE CARD ──────────────────────────────────────────────────────────────
function CourseCard({ course, isEnrolled, onTriggerIntake }: {
  course: Course; isEnrolled: boolean; onTriggerIntake: () => void;
}) {
  const [showModules, setShowModules] = useState(false);
  const Icon = course.color === 'blue' ? BrainCircuit : course.color === 'emerald' ? ShieldCheck : BarChart3;

  return (
    <div className="group relative bg-white/5 border border-white/10 hover:border-[#FFBEA0]/30 rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(255,190,160,0.1)] flex flex-col h-full">
      <div className="p-8 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-6">
          <div className={`p-3 rounded-2xl ${course.color === 'blue' ? 'bg-blue-500/20 text-blue-300' : course.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-purple-500/20 text-purple-300'}`}>
            <Icon size={32} />
          </div>
          <div className="flex flex-wrap gap-2 justify-end">
            {course.tags.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full bg-white/5 text-xs text-gray-400 border border-white/5">{tag}</span>
            ))}
          </div>
        </div>

        <h3 className="text-xl font-bold mb-2 text-white leading-snug">{course.title}</h3>
        <p className="text-[#FFBEA0] font-medium mb-4 text-sm">{course.subtitle}</p>

        {course.salaryHook && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FF9E80]/10 border border-[#FF9E80]/20 text-[#FFBEA0] text-sm font-bold mb-4 w-fit">
            <Briefcase size={14} /> {course.salaryHook}
          </div>
        )}

        <p className="text-gray-300 leading-relaxed mb-6 text-sm flex-1">{course.description}</p>
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6 pb-6 border-b border-white/10">
          <span>{course.duration}</span><span className="text-gray-600">•</span><span>{course.level}</span>
        </div>

        <div className="space-y-3 mt-auto">
          {!isEnrolled ? (
            <button onClick={onTriggerIntake} className="w-full py-3.5 rounded-xl bg-white text-[#090A0F] font-bold hover:bg-[#FFBEA0] transition-colors flex items-center justify-center gap-2 text-sm">
              Start Learning Free <ArrowRight size={16} />
            </button>
          ) : (
            <>
              <a
                href={course.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 font-bold hover:bg-green-500/20 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <CheckCircle size={16} /> Open on Coursera <ExternalLink size={14} />
              </a>
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

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function CoursesPage() {
  const [intakeOpen, setIntakeOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(new Set());

  const openEnrollment = (course: Course) => {
    setSelectedCourse(course);
    setIntakeOpen(true);
  };

  const handleEnrollmentComplete = () => {
    if (selectedCourse) {
      setEnrolledCourseIds(prev => new Set(prev).add(selectedCourse.id));
    }
    setIntakeOpen(false);
  };

  return (
    <div className="min-h-screen animate-in fade-in duration-500">
      {/* PAGE HEADER */}
      <header className="pt-20 pb-14 px-4 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-[#FFBEA0]/30 text-[#FFBEA0] text-sm font-semibold mb-6">
          🎓 Google Career Certificates — 100% Free
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#FFBEA0]">
          Select Your <span className="text-[#FFBEA0]">Career Path</span>
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Choose one of the three verified Google Career Certificate tracks below. Completely free of tuition — backed by LeadWise Foundation grants.
        </p>
      </header>

      {/* COURSE CARDS */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {COURSES.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              isEnrolled={enrolledCourseIds.has(course.id)}
              onTriggerIntake={() => openEnrollment(course)}
            />
          ))}
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="bg-gradient-to-r from-[#1B2735] to-[#0D1B2A] border border-white/10 rounded-3xl p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Not sure which track is right for you?</h2>
          <p className="text-gray-400 mb-6">Learn how LeadWise's guided career system helps you go from learning to employment.</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-[#FF9E80] text-[#1B2735] px-8 py-4 rounded-full font-black hover:bg-white transition-colors">
            Explore the System <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* INTAKE MODAL */}
      <IntakeModal
        isOpen={intakeOpen}
        onClose={() => setIntakeOpen(false)}
        onComplete={handleEnrollmentComplete}
        targetCourse={selectedCourse}
      />
    </div>
  );
}
