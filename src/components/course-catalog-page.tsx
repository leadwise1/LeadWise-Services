'use client';
import React, { useState, Suspense, useEffect } from "react";
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
  Compass,
} from "lucide-react";


import { COURSES, type Course, type Resource, type Module } from '@/lib/course-catalog';
import { auth } from '@/lib/firebase';
import { signInLearner, unifiedOnboarding, learnerRequest } from '@/lib/learner-auth';
import Link from 'next/link';

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
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", zipCode: "",
    householdIncome: "", employmentStatus: "", consent: false,
  });

  useEffect(() => {
    if (!isOpen || !unifiedOnboarding) return;
    const user = auth.currentUser;
    if (user && !user.isAnonymous) setFormData(previous => ({ ...previous, email: user.email || '' }));
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await auth.authStateReady();
      if (unifiedOnboarding && (!auth.currentUser || auth.currentUser.isAnonymous)) {
        throw new Error("Please sign in before completing intake.");
      }
      const token = unifiedOnboarding ? await auth.currentUser!.getIdToken() : null;
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: "Bearer " + token } : {}) },
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
      if (!res.ok) { const data = await res.json(); throw new Error(data.error || "Unable to save intake. Please retry."); }
      setLoading(false);
      setSubmitted(true);
      onComplete();
    } catch (err) {
      console.error("Intake save error:", err);
      setError(err instanceof Error ? err.message : "There was a problem saving your enrollment. Please try again.");
      setLoading(false);
    }
  };

  // ── THANK YOU SCREEN ───────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
        <div className="bg-[#121217] border border-white/10 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative text-white">
          <div className="bg-gradient-to-b from-[#1a102b] to-[#121217] px-8 pt-8 pb-6 text-center border-b border-white/5">
            <div className="w-16 h-16 rounded-2xl bg-[#A855F7]/20 flex items-center justify-center mx-auto mb-4 border border-[#A855F7]/30">
              <CheckCircle size={32} className="text-[#C084FC]" />
            </div>
            <h2 className="text-2xl font-extrabold text-white mb-2">You&apos;re on the list! 🎉</h2>
            <p className="text-gray-400 text-sm">We received your registration</p>
          </div>
          <div className="p-8 text-center space-y-5">
            <p className="text-gray-300 text-base leading-relaxed">
              Thank you for your interest in the{" "}
              <strong className="text-white">{targetCourse?.title}</strong>!
            </p>
            <div className="bg-[#A855F7]/10 border border-[#A855F7]/30 rounded-2xl px-6 py-5">
              <p className="text-[#C084FC] font-semibold text-sm leading-relaxed">
                ✉️ Our team will review your information and send you a Coursera enrollment link{" "}
                <span className="font-extrabold text-white">within 24 hours</span>.
              </p>
            </div>
            <p className="text-gray-400 text-xs">
              Questions? Email us at{" "}
              <a href="mailto:mentor@letsleadwise.org" className="text-[#A855F7] font-semibold hover:underline">
                mentor@letsleadwise.org
              </a>
            </p>
            <button
              onClick={() => unifiedOnboarding ? window.location.assign("/forum") : onClose()}
              className="w-full bg-[#A855F7] text-black py-3 rounded-xl font-bold hover:bg-white transition text-sm shadow-[0_0_15px_rgba(168,85,247,0.4)]"
            >
              {unifiedOnboarding ? "Return to my community" : "Close"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#121217] border border-white/10 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative text-white">
        <div className="bg-gradient-to-b from-[#1a102b] to-[#121217] px-8 pt-8 pb-6 border-b border-white/5">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition">
            <X size={20} />
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#A855F7]/20 border border-[#A855F7]/30 flex items-center justify-center">
              <GraduationCap size={20} className="text-[#C084FC]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Student Enrollment</h2>
              <p className="text-gray-400 text-xs">LeadWise Foundation — Free Access</p>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="flex gap-2">
            <span className={`h-1 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-[#A855F7]' : 'bg-white/10'}`} />
            <span className={`h-1 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-[#A855F7]' : 'bg-white/10'}`} />
            <span className={`h-1 flex-1 rounded-full transition-colors ${step >= 3 ? 'bg-[#A855F7]' : 'bg-white/10'}`} />
          </div>
          <p className="text-gray-400 text-xs mt-2">
            Step {step} of 3: {step === 1 ? 'Contact Info' : step === 2 ? 'Grant Eligibility' : 'Consent'}
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">First Name</label>
                    <input required className="w-full border border-white/10 rounded-xl px-4 py-3 text-white bg-[#0c0c0e] focus:outline-none focus:border-[#A855F7] transition text-sm" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Last Name</label>
                    <input required className="w-full border border-white/10 rounded-xl px-4 py-3 text-white bg-[#0c0c0e] focus:outline-none focus:border-[#A855F7] transition text-sm" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Email Address</label>
                  <input type="email" required readOnly={unifiedOnboarding} className="w-full border border-white/10 rounded-xl px-4 py-3 text-white bg-[#0c0c0e] focus:outline-none focus:border-[#A855F7] transition text-sm" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Zip Code</label>
                  <input required maxLength={5} className="w-full border border-white/10 rounded-xl px-4 py-3 text-white bg-[#0c0c0e] focus:outline-none focus:border-[#A855F7] transition text-sm" placeholder="e.g. 75001" value={formData.zipCode} onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })} />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="bg-[#A855F7]/10 border border-[#A855F7]/30 p-3 rounded-xl text-sm text-[#C084FC]">
                  This information is required for our grant funding and allows us to keep this course 100% free.
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Household Income</label>
                  <select required className="w-full border border-white/10 rounded-xl px-4 py-3 text-white bg-[#0c0c0e] focus:outline-none focus:border-[#A855F7] transition text-sm" value={formData.householdIncome} onChange={(e) => setFormData({ ...formData, householdIncome: e.target.value })}>
                    <option value="" className="bg-[#0c0c0e]">Select Range...</option>
                    <option value="0-25k" className="bg-[#0c0c0e]">$0 – $25,000</option>
                    <option value="25-50k" className="bg-[#0c0c0e]">$25,001 – $50,000</option>
                    <option value="50-75k" className="bg-[#0c0c0e]">$50,001 – $75,000</option>
                    <option value="75k+" className="bg-[#0c0c0e]">$75,001+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Employment Status</label>
                  <select required className="w-full border border-white/10 rounded-xl px-4 py-3 text-white bg-[#0c0c0e] focus:outline-none focus:border-[#A855F7] transition text-sm" value={formData.employmentStatus} onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value })}>
                    <option value="" className="bg-[#0c0c0e]">Select Status...</option>
                    <option value="unemployed" className="bg-[#0c0c0e]">Unemployed</option>
                    <option value="part-time" className="bg-[#0c0c0e]">Part-Time</option>
                    <option value="full-time" className="bg-[#0c0c0e]">Full-Time</option>
                    <option value="student" className="bg-[#0c0c0e]">Student</option>
                  </select>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="border border-white/10 p-4 rounded-xl bg-white/5 text-sm text-gray-300 space-y-2">
                  <h3 className="font-bold text-white">Program Participation Agreement</h3>
                  <p className="text-gray-400">By clicking &quot;Submit&quot;, I certify that the information provided is true. I understand that LeadWise Foundation is a non-profit and will use demographic data in aggregate form for grant reporting purposes.</p>
                </div>
                <label className="flex items-start gap-3 p-3 cursor-pointer hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10 transition">
                  <input type="checkbox" required className="mt-1 w-4 h-4 accent-[#A855F7]" checked={formData.consent} onChange={(e) => setFormData({ ...formData, consent: e.target.checked })} />
                  <span className="text-sm font-medium text-gray-300">I agree and wish to enroll.</span>
                </label>
                {error && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg p-2">{error}</p>}
              </div>
            )}

            <div className="flex justify-between pt-2">
              {step > 1 ? (
                <button type="button" onClick={() => setStep(step - 1)} className="px-4 py-2 text-gray-400 hover:text-white font-medium text-sm transition">Back</button>
              ) : (
                <button type="button" onClick={onClose} className="px-4 py-2 text-gray-500 hover:text-gray-300 text-sm transition">Cancel</button>
              )}
              {step < 3 ? (
                <button type="button" onClick={() => {
                  if (step === 1 && (!formData.firstName || !formData.lastName || !formData.email || !formData.zipCode)) return alert("Please fill in all fields");
                  if (step === 2 && (!formData.householdIncome || !formData.employmentStatus)) return alert("Please complete the grant eligibility fields");
                  setStep(step + 1);
                }} className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition text-sm">
                  Next Step →
                </button>
              ) : (
                <button type="submit" disabled={loading} className="bg-[#A855F7] text-black px-8 py-3 rounded-xl font-bold hover:bg-white transition flex items-center gap-2 text-sm shadow-[0_0_15px_rgba(168,85,247,0.4)]">
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
      className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-200 group relative ${isEnrolled ? "bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer" : "bg-black/40 border border-white/5 cursor-not-allowed opacity-50"}`}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className={`text-sm font-semibold ${isEnrolled ? 'text-white group-hover:text-[#C084FC]' : 'text-gray-400'}`}>{resource.title}</p>
          {!isEnrolled ? <Lock className="w-3 h-3 text-gray-500" /> : <CheckCircle className="w-3 h-3 text-[#A855F7]" />}
        </div>
        <p className="text-xs text-gray-400 mt-0.5">{resource.type} • {resource.platform}</p>
      </div>
      <span className="text-gray-400 group-hover:text-white mt-1">
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
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between p-4 hover:bg-white/10 transition-colors duration-200 text-white">
        <div className="text-left flex-1">
          <h3 className="text-sm font-bold text-white mb-0.5">{module.title}</h3>
          <p className="text-xs text-gray-400 uppercase tracking-wider">Duration: {module.duration}</p>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {expanded && (
        <div className="border-t border-white/10 bg-black/40 p-4 space-y-3">
          {module.lessons.map((lesson) => (
            <div key={lesson.id} className="bg-white/5 rounded-xl p-3 border border-white/10">
              <h4 className="text-xs font-bold text-gray-300 mb-2 uppercase tracking-wide">{lesson.title}</h4>
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
    <div className="group relative bg-[#121217] border border-white/10 hover:border-[#A855F7]/50 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] flex flex-col h-full text-white">
      {/* Top accent bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#A855F7] to-[#C084FC]" />

      <div className="p-7 flex-1 flex flex-col">
        {/* Icon + Tags */}
        <div className="flex items-start justify-between mb-5">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#A855F7]/15 text-[#C084FC]">
            <Icon size={24} />
          </div>
          <div className="flex flex-wrap gap-1.5 justify-end">
            {course.tags.map(tag => (
              <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-gray-300">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <h3 className="text-lg font-bold mb-1.5 text-white leading-snug">{course.title}</h3>
        <p className="text-sm font-semibold mb-4 text-[#C084FC]">{course.subtitle}</p>

        {course.salaryHook && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold mb-4 w-fit bg-[#A855F7]/10 border border-[#A855F7]/30 text-[#C084FC]">
            <Briefcase size={13} /> {course.salaryHook}
          </div>
        )}

        <p className="text-gray-400 leading-relaxed mb-5 text-sm flex-1">{course.description}</p>

        <div className="flex items-center gap-2 text-xs text-gray-400 mb-5 pb-5 border-b border-white/10">
          <span className="font-semibold text-gray-300">{course.duration}</span>
          <span className="text-gray-600">•</span>
          <span>{course.level}</span>
        </div>

        <div className="space-y-2.5 mt-auto">
          {!isEnrolled ? (
            <button
              onClick={onTriggerIntake}
              className="w-full py-3.5 rounded-xl font-bold bg-[#A855F7] text-black hover:bg-white transition-all flex items-center justify-center gap-2 text-sm shadow-[0_0_20px_rgba(168,85,247,0.3)] active:scale-[0.98]"
            >
              Start Learning Free <ArrowRight size={16} />
            </button>
          ) : (
            <>
              <a
                href={course.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-[#A855F7]/15 border border-[#A855F7]/30 text-[#C084FC] font-bold hover:bg-[#A855F7]/25 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <CheckCircle size={16} /> Open on Coursera <ExternalLink size={13} />
              </a>
              <button onClick={() => setShowModules(!showModules)} className="w-full py-2.5 rounded-xl bg-white/5 text-gray-300 border border-white/10 font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-xs">
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
export function CoursesPage({ embedded = false }: { embedded?: boolean }) {
  const [intakeOpen, setIntakeOpen] = useState(false);
  const [accountError, setAccountError] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  // pendingCourseIds: submitted but awaiting admin provisioning on Coursera
  const [pendingCourseIds, setPendingCourseIds] = useState<string[]>([]);

  const openEnrollment = async (course: Course) => {
    // If already submitted this session, don't re-open the form
    if (pendingCourseIds.includes(course.id)) return;
    if (connecting) return;
    setAccountError("");
    setConnecting(true);
    try {
      if (unifiedOnboarding) {
        await signInLearner();
        const account = await learnerRequest();
        if (!account.member || (account.canLinkExisting && !account.intakeComplete)) {
          window.location.assign('/forum');
          return;
        }
      }
      setSelectedCourse(course);
      setIntakeOpen(true);
    } catch {
      setAccountError("Please finish sign-in to enroll. Existing account access remains available. Contact mentor@letsleadwise.org if you need help.");
    } finally { setConnecting(false); }
  };

  const handleEnrollmentComplete = () => {
    // Mark all courses as pending — one submission covers all tracks
    setPendingCourseIds(previous => unifiedOnboarding && selectedCourse ? [...new Set([...previous, selectedCourse.id])] : ['google-cybersecurity-cert', 'data-analytics', 'google-ai-cert']);
    // Keep modal open so the thank-you screen is visible; user closes it manually
  };

  return (
    <div className="min-h-screen w-full bg-[#0c0c0e] bg-[radial-gradient(ellipse_at_top,_#1a102b_0%,_#0c0c0e_100%)] text-white font-sans selection:bg-[#A855F7] selection:text-black">
      {!embedded && unifiedOnboarding && <div className="max-w-7xl mx-auto px-5 py-4 border-b border-white/10">
        <Link href="/forum" className="text-purple-300 underline">My community — courses and enrollment</Link>
        <p className="text-sm text-neutral-300 mt-2">Sign in once before intake. Your intake details stay private; your first name is used in the community.</p>
        {connecting && <p role="status">Connecting your account…</p>}
        {accountError && <p role="alert" className="text-amber-300 mt-2">{accountError}</p>}
      </div>}
      {/* ── NAVBAR ── */}
      {!embedded && <nav className="border-b border-white/10 bg-[#0c0c0e]/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <img src="/logolw.jpg" alt="LeadWise Logo" className="w-8 h-8 rounded-lg object-cover" />
            <span className="font-bold text-white text-lg tracking-tight">LeadWise Foundation</span>
          </a>
          <div className="hidden md:flex items-center gap-7 text-sm font-medium">
            <a href="/" className="text-gray-400 hover:text-white transition">Home</a>
            <a href="/resume" className="text-gray-400 hover:text-white transition">Resume Builder</a>
            <a href="/cover-letter" className="text-gray-400 hover:text-white transition">Cover Letter</a>
            <a href="/courses" className="text-[#C084FC] font-bold border-b-2 border-[#A855F7] pb-0.5">Courses</a>
            <a href="/pathfinder" className="text-gray-400 hover:text-white transition flex items-center gap-1">
              <Compass size={14} className="text-[#A855F7]" /> Pathfinder
            </a>
            <a href="https://blog.letsleadwise.org" className="text-gray-400 hover:text-white transition">Blog</a>
            <a href="/forum" className="text-gray-400 hover:text-white transition">Forum</a>
            <a
              href="https://donation.letsleadwise.org"
              className="bg-[#A855F7] text-black px-5 py-2 rounded-full font-bold hover:bg-white transition-colors shadow-[0_0_15px_rgba(168,85,247,0.4)]"
            >
              Donate Now
            </a>
          </div>
        </div>
      </nav>}

      {/* ── PAGE HEADER ── */}
      <header className="border-b border-white/5 py-16 px-4 text-center relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#A855F7] rounded-full blur-[180px] opacity-15 pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#A855F7]/10 border border-[#A855F7]/30 text-[#C084FC] text-sm font-semibold mb-6">
            🎓 Google Career Certificates — 100% Free
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
            Select Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#C084FC] to-[#A855F7]">Career Path</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Choose one of the three verified Google Career Certificate tracks below. Completely free — backed by LeadWise Foundation grants.
          </p>
          {/* Stats row */}
          <div className="flex items-center justify-center gap-8 mt-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-[#C084FC]" />
              <span><strong className="text-white">500+</strong> learners enrolled</span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={16} className="text-[#C084FC]" />
              <span><strong className="text-white">100%</strong> tuition-free</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap size={16} className="text-[#C084FC]" />
              <span><strong className="text-white">Google</strong> certified</span>
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
              isEnrolled={pendingCourseIds.includes(course.id)}
              onTriggerIntake={() => openEnrollment(course)}
            />
          ))}
        </div>
      </section>

      {/* --- COMMUNITY CALL TO ACTION --- */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="bg-[#121217] border border-white/10 rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#A855F7]/10 rounded-full blur-[100px] -mr-48 -mt-48 transition-all group-hover:bg-[#A855F7]/20" />

          <div className="flex-1 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#A855F7]/10 border border-[#A855F7]/30 text-[#C084FC] text-sm font-bold mb-6 uppercase tracking-widest">
              <Users size={16} /> Digital Guardians Community
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white text-left">
              Don&apos;t Learn in <span className="text-[#C084FC]">Isolation.</span>
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-xl leading-relaxed text-left">
              Join the Hub to connect with other learners, attend weekly sync sessions, and track your progress on the global leaderboard.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={unifiedOnboarding ? "/forum" : "/forum"}
                className="bg-[#A855F7] text-black px-8 py-4 rounded-2xl font-black hover:bg-white transition-all transform hover:scale-105 flex items-center gap-3 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
              >
                Enter Community Hub <ArrowRight size={20} />
              </a>
              <a
                href="/forum/leaderboard"
                className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center gap-3"
              >
                <Trophy size={20} className="text-[#C084FC]" /> View Leaderboard
              </a>
            </div>
          </div>

          <div className="flex-1 w-full max-w-sm relative z-10 hidden lg:block">
            <div className="bg-[#0c0c0e]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 transform rotate-2 group-hover:rotate-0 transition-transform duration-500 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#A855F7]/20 border border-[#A855F7]/40 flex items-center justify-center font-bold text-[#C084FC]">SJ</div>
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
                  {[1,2,3,4].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-[#121217] bg-neutral-800" />)}
                  <div className="w-8 h-8 rounded-full border-2 border-[#121217] bg-[#A855F7] flex items-center justify-center text-[10px] font-bold text-black">+12</div>
                </div>
                <div className="text-[#C084FC] text-xs font-bold uppercase tracking-widest">Live Syncing...</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <IntakeModal
        isOpen={intakeOpen}
        onClose={() => { setIntakeOpen(false); }}
        onComplete={handleEnrollmentComplete}
        targetCourse={selectedCourse}
      />

      {/* --- FOOTER --- */}
      {!embedded && <footer className="bg-[#0c0c0e] text-gray-500 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img src="/logolw.jpg" alt="LeadWise Logo" className="w-8 h-8 rounded-lg object-cover" />
            <span className="font-semibold text-gray-300">LeadWise Foundation</span>
          </div>
          <p className="text-sm">&copy; {new Date().getFullYear()} LeadWise Foundation. All rights reserved.</p>
        </div>
      </footer>}
    </div>
  );
}

export default function CoursesPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0c0c0e] flex items-center justify-center"><Loader2 className="animate-spin text-[#A855F7]" /></div>}>
      <CoursesPage />
    </Suspense>
  );
}
