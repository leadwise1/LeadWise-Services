'use client';
import React, { useState, Suspense } from "react";
import Link from "next/link";
import {
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
  GraduationCap,
  Users,
  Star,
  Trophy,
} from "lucide-react";

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface Resource { title: string; type: string; platform: string; url: string; }
interface Lesson   { id: string; title: string; resources: Resource[]; }
interface Module   { id: string; title: string; duration: string; lessons: Lesson[]; }
interface Course   {
  id: string; title: string; subtitle: string; description: string;
  duration: string; level: string; tags: string[]; accentColor: string; bgColor: string; textColor: string;
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
    accentColor: "#059669",
    bgColor: "#ECFDF5",
    textColor: "#065F46",
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
    accentColor: "#7C3AED",
    bgColor: "#F5F3FF",
    textColor: "#4C1D95",
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
    accentColor: "#2563EB",
    bgColor: "#EFF6FF",
    textColor: "#1E3A8A",
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
      // Send full profile including name and email so admin can sign learners up on Coursera.
      // The API saves full data to users/{id}/intake AND anonymous data to learner_intakes for LMI reports.
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          zipCode: formData.zipCode,
          householdIncome: formData.householdIncome,
          employmentStatus: formData.employmentStatus,
          consent: formData.consent,
          courseId: targetCourse?.id ?? "unknown",
          courseTitle: targetCourse?.title ?? "unknown",
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setLoading(false);
      onComplete();
    } catch (err) {
      console.error("Intake save error:", err);
      setError("There was a problem saving your enrollment. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white border border-gray-200 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-8 pt-8 pb-6">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition">
            <X size={20} />
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <GraduationCap size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Student Enrollment</h2>
              <p className="text-white/60 text-xs">LeadWise Foundation — Free Access</p>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="flex gap-2">
            <span className={`h-1 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-orange-400' : 'bg-white/20'}`} />
            <span className={`h-1 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-orange-400' : 'bg-white/20'}`} />
            <span className={`h-1 flex-1 rounded-full transition-colors ${step >= 3 ? 'bg-orange-400' : 'bg-white/20'}`} />
          </div>
          <p className="text-white/50 text-xs mt-2">
            Step {step} of 3: {step === 1 ? 'Contact Info' : step === 2 ? 'Grant Eligibility' : 'Consent'}
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">First Name</label>
                    <input required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 bg-gray-50 focus:outline-none focus:border-slate-400 focus:bg-white transition text-sm" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Last Name</label>
                    <input required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 bg-gray-50 focus:outline-none focus:border-slate-400 focus:bg-white transition text-sm" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Email Address</label>
                  <input type="email" required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 bg-gray-50 focus:outline-none focus:border-slate-400 focus:bg-white transition text-sm" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Zip Code</label>
                  <input required maxLength={5} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 bg-gray-50 focus:outline-none focus:border-slate-400 focus:bg-white transition text-sm" placeholder="e.g. 75001" value={formData.zipCode} onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })} />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-sm text-amber-800">
                  This information is required for our grant funding and allows us to keep this course 100% free.
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Household Income</label>
                  <select required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 bg-gray-50 focus:outline-none focus:border-slate-400 focus:bg-white transition text-sm" value={formData.householdIncome} onChange={(e) => setFormData({ ...formData, householdIncome: e.target.value })}>
                    <option value="">Select Range...</option>
                    <option value="0-25k">$0 – $25,000</option>
                    <option value="25-50k">$25,001 – $50,000</option>
                    <option value="50-75k">$50,001 – $75,000</option>
                    <option value="75k+">$75,001+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Employment Status</label>
                  <select required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 bg-gray-50 focus:outline-none focus:border-slate-400 focus:bg-white transition text-sm" value={formData.employmentStatus} onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value })}>
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
              <div className="space-y-4">
                <div className="border border-gray-200 p-4 rounded-xl bg-gray-50 text-sm text-gray-600 space-y-2">
                  <h3 className="font-bold text-gray-900">Program Participation Agreement</h3>
                  <p>By clicking &quot;Submit&quot;, I certify that the information provided is true. I understand that LeadWise Foundation is a non-profit and will use demographic data in aggregate form for grant reporting purposes.</p>
                </div>
                <label className="flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-50 rounded-xl border border-transparent hover:border-gray-200 transition">
                  <input type="checkbox" required className="mt-1 w-4 h-4 accent-orange-500" checked={formData.consent} onChange={(e) => setFormData({ ...formData, consent: e.target.checked })} />
                  <span className="text-sm font-medium text-gray-700">I agree and wish to enroll.</span>
                </label>
                {error && <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-lg p-2">{error}</p>}
              </div>
            )}

            <div className="flex justify-between pt-2">
              {step > 1 ? (
                <button type="button" onClick={() => setStep(step - 1)} className="px-4 py-2 text-gray-500 hover:text-gray-900 font-medium text-sm transition">Back</button>
              ) : (
                <button type="button" onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-gray-600 text-sm transition">Cancel</button>
              )}
              {step < 3 ? (
                <button type="button" onClick={() => {
                  if (step === 1 && (!formData.firstName || !formData.lastName || !formData.email || !formData.zipCode)) return alert("Please fill in all fields");
                  if (step === 2 && (!formData.householdIncome || !formData.employmentStatus)) return alert("Please complete the grant eligibility fields");
                  setStep(step + 1);
                }} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-700 transition text-sm">
                  Next Step →
                </button>
              ) : (
                <button type="submit" disabled={loading} className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition flex items-center gap-2 text-sm">
                  {loading ? <><Loader2 className="animate-spin" size={16} /> Enrolling...</> : "Submit & Start"}
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
      className={`flex items-start gap-3 p-3 rounded-lg transition-all duration-200 group relative ${isEnrolled ? "bg-white hover:bg-gray-50 border border-gray-200 cursor-pointer" : "bg-gray-100 border border-gray-200 cursor-not-allowed opacity-50"}`}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className={`text-sm font-semibold ${isEnrolled ? 'text-gray-800 group-hover:text-slate-900' : 'text-gray-500'}`}>{resource.title}</p>
          {!isEnrolled ? <Lock className="w-3 h-3 text-gray-400" /> : <CheckCircle className="w-3 h-3 text-green-500" />}
        </div>
        <p className="text-xs text-gray-400 mt-0.5">{resource.type} • {resource.platform}</p>
      </div>
      <span className="text-gray-400 group-hover:text-slate-700 mt-1">
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
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200">
        <div className="text-left flex-1">
          <h3 className="text-sm font-bold text-gray-900 mb-0.5">{module.title}</h3>
          <p className="text-xs text-gray-400 uppercase tracking-wider">Duration: {module.duration}</p>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50 p-4 space-y-3">
          {module.lessons.map((lesson) => (
            <div key={lesson.id} className="bg-white rounded-xl p-3 border border-gray-200">
              <h4 className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">{lesson.title}</h4>
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
  const Icon = course.id === 'google-ai-cert' ? BrainCircuit : course.id === 'google-cybersecurity-cert' ? ShieldCheck : BarChart3;

  return (
    <div className="group relative bg-white border border-gray-200 hover:border-gray-300 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col h-full">
      {/* Top accent bar */}
      <div className="h-1.5 w-full" style={{ backgroundColor: course.accentColor }} />

      <div className="p-7 flex-1 flex flex-col">
        {/* Icon + Tags */}
        <div className="flex items-start justify-between mb-5">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: course.bgColor }}>
            <Icon size={24} style={{ color: course.accentColor }} />
          </div>
          <div className="flex flex-wrap gap-1.5 justify-end">
            {course.tags.map(tag => (
              <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-semibold border" style={{ backgroundColor: course.bgColor, color: course.textColor, borderColor: course.bgColor }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <h3 className="text-lg font-bold mb-1.5 text-gray-900 leading-snug">{course.title}</h3>
        <p className="text-sm font-semibold mb-4" style={{ color: course.accentColor }}>{course.subtitle}</p>

        {course.salaryHook && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold mb-4 w-fit border" style={{ backgroundColor: course.bgColor, color: course.textColor, borderColor: course.bgColor }}>
            <Briefcase size={13} /> {course.salaryHook}
          </div>
        )}

        <p className="text-gray-500 leading-relaxed mb-5 text-sm flex-1">{course.description}</p>

        <div className="flex items-center gap-2 text-xs text-gray-400 mb-5 pb-5 border-b border-gray-100">
          <span className="font-semibold text-gray-600">{course.duration}</span>
          <span className="text-gray-300">•</span>
          <span>{course.level}</span>
        </div>

        <div className="space-y-2.5 mt-auto">
          {!isEnrolled ? (
            <button
              onClick={onTriggerIntake}
              className="w-full py-3.5 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 text-sm hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: course.accentColor }}
            >
              Start Learning Free <ArrowRight size={16} />
            </button>
          ) : (
            <>
              <a
                href={course.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-green-50 border border-green-200 text-green-700 font-bold hover:bg-green-100 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <CheckCircle size={16} /> Open on Coursera <ExternalLink size={13} />
              </a>
              <button onClick={() => setShowModules(!showModules)} className="w-full py-2.5 rounded-xl bg-gray-50 text-gray-600 border border-gray-200 font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 text-xs">
                {showModules ? "Hide Curriculum" : "View Curriculum & Modules"}
                {showModules ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </>
          )}
        </div>

        {showModules && (
          <div className="mt-5 space-y-2">
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
function CoursesPage() {
  const [intakeOpen, setIntakeOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(new Set());

  const openEnrollment = (course: Course) => {
    setSelectedCourse(course);
    setIntakeOpen(true);
  };
 const handleEnrollmentComplete = (url: string) => {
  if (selectedCourse) {
    setEnrolledCourseIds(prev => new Set(prev).add(selectedCourse.id));
    
    // 🚀 Automatically open their specific Coursera enterprise link in a new tab!
    window.open(url, '_blank', 'noopener,noreferrer');
  }
  setIntakeOpen(false);
};   
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* ── NAVBAR ── */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <img src="/logolw.jpg" alt="LeadWise Logo" className="w-8 h-8 rounded-lg object-cover" />
            <span className="font-bold text-gray-900 text-lg tracking-tight">LeadWise Foundation</span>
          </a>
          <div className="hidden md:flex items-center gap-7 text-sm font-medium">
            <a href="/" className="text-gray-500 hover:text-gray-900 transition">Home</a>
            <a href="https://services.letsleadwise.org/resume" className="text-gray-500 hover:text-gray-900 transition">Resume Builder</a>
            <a href="https://services.letsleadwise.org/cover-letter" className="text-gray-500 hover:text-gray-900 transition">Cover Letter</a>
            <a href="/courses" className="text-slate-900 font-bold border-b-2 border-orange-400 pb-0.5">Courses</a>
            <a href="https://blog.letsleadwise.org" className="text-gray-500 hover:text-gray-900 transition">Blog</a>
            <a href="https://services.letsleadwise.org/forum" className="text-gray-500 hover:text-gray-900 transition">Forum</a>
            <a
              href="https://donation.letsleadwise.org"
              className="bg-orange-500 text-white px-5 py-2 rounded-full font-bold hover:bg-orange-600 transition-colors shadow-sm"
            >
              Donate Now
            </a>
          </div>
        </div>
      </nav>

      {/* ── PAGE HEADER ── */}
      <header className="bg-white border-b border-gray-100 py-14 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-sm font-semibold mb-5">
            🎓 Google Career Certificates — 100% Free
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-gray-900">
            Select Your <span className="text-orange-500">Career Path</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Choose one of the three verified Google Career Certificate tracks below. Completely free — backed by LeadWise Foundation grants.
          </p>
          {/* Stats row */}
          <div className="flex items-center justify-center gap-8 mt-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-orange-400" />
              <span><strong className="text-gray-800">500+</strong> learners enrolled</span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={16} className="text-orange-400" />
              <span><strong className="text-gray-800">100%</strong> tuition-free</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap size={16} className="text-orange-400" />
              <span><strong className="text-gray-800">Google</strong> certified</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── COURSE CARDS ── */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-3 gap-7 items-stretch">
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

      {/* --- COMMUNITY CALL TO ACTION --- */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="bg-gradient-to-br from-[#1B2735] to-black border border-white/10 rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -mr-48 -mt-48 transition-all group-hover:bg-blue-500/20" />

          <div className="flex-1 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold mb-6 uppercase tracking-widest">
              <Users size={16} /> Digital Guardians Community
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white text-left">
              Don&apos;t Learn in <span className="text-[#FFBEA0]">Isolation.</span>
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-xl leading-relaxed text-left">
              Join the Hub to connect with other learners, attend weekly sync sessions, and track your progress on the global leaderboard.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://services.letsleadwise.org/forum"
                className="bg-white text-[#1B2735] px-8 py-4 rounded-2xl font-black hover:bg-[#FFBEA0] transition-all transform hover:scale-105 flex items-center gap-3 shadow-xl"
              >
                Enter Community Hub <ArrowRight size={20} />
              </a>
              <a
                href="https://services.letsleadwise.org/forum/leaderboard"
                className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center gap-3"
              >
                <Trophy size={20} className="text-yellow-400" /> View Leaderboard
              </a>
            </div>
          </div>

          <div className="flex-1 w-full max-w-sm relative z-10 hidden lg:block">
            <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 transform rotate-2 group-hover:rotate-0 transition-transform duration-500 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">SJ</div>
                <div className="flex-1 text-left">
                  <div className="h-3 bg-white/20 w-3/4 rounded mb-2"></div>
                  <div className="h-2 bg-white/10 w-1/2 rounded"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-2 bg-white/10 w-full rounded"></div>
                <div className="h-2 bg-white/10 w-5/6 rounded"></div>
                <div className="h-2 bg-white/10 w-4/6 rounded"></div>
              </div>
              <div className="mt-8 flex justify-between items-center">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-[#1B2735] bg-neutral-800" />)}
                  <div className="w-8 h-8 rounded-full border-2 border-[#1B2735] bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">+12</div>
                </div>
                <div className="text-blue-400 text-xs font-bold uppercase tracking-widest">Live Syncing...</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <IntakeModal
        isOpen={intakeOpen}
        onClose={() => setIntakeOpen(false)}
        onComplete={handleEnrollmentComplete}
        targetCourse={selectedCourse}
      />

      {/* --- FOOTER --- */}
      <footer className="bg-[#090A0F] text-gray-500 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img src="/logolw.jpg" alt="LeadWise Logo" className="w-8 h-8 rounded-lg object-cover" />
            <span className="font-semibold text-gray-300">LeadWise Foundation</span>
          </div>
          <p className="text-sm">&copy; {new Date().getFullYear()} LeadWise Foundation. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default function CoursesPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="animate-spin text-gray-400" /></div>}>
      <CoursesPage />
    </Suspense>
  );
}
