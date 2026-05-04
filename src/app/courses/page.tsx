'use client';
import React, { useState, useEffect } from "react";
import { 
  Code, 
  Database, 
  CheckCircle, 
  Briefcase, 
  ArrowRight, 
  Terminal, 
  BarChart3,
  ShieldCheck,
  ShieldAlert,
  Activity,
  X,
  Loader2,
  Lock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Globe
} from "lucide-react";
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged, Auth, User } from "firebase/auth";
import { getFirestore, doc, setDoc, Firestore } from "firebase/firestore";
import * as Progress from "@radix-ui/react-progress";

// --- TYPESCRIPT INTERFACES ---
// These definitions tell Next.js exactly what your data looks like.
interface Resource {
  title: string;
  type: string;
  platform: string;
  url: string;
}

interface Lesson {
  id: string;
  title: string;
  resources: Resource[];
}

interface Module {
  id: string;
  title: string;
  duration: string;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  level: string;
  target: string;
  tags: string[];
  color: string;
  modules: Module[];
  salaryHook?: string;
  externalProgramId?: string; // ID of the program on Coursera
}

// --- CONFIGURATION START ---
const firebaseConfig = {
  apiKey: "AIzaSyChVyvbgj61JDzB9Pk1O0zrE-HoP07uHWs",
  authDomain: "leadwise-platform.firebaseapp.com",
  projectId: "leadwise-platform",
  storageBucket: "leadwise-platform.firebasestorage.app",
  messagingSenderId: "423460758070",
  appId: "1:423460758070:web:6ff12a230fc1e65b44ee97",
  measurementId: "G-W5SVR52646"
};

const appId = 'leadwise-default';
// --- CONFIGURATION END ---

// Initialize Firebase (Safely Typed)
// We explicitly say: "These variables might be the Auth service, or undefined"
let auth: Auth | undefined;
let db: Firestore | undefined;

try {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  console.log("Firebase initialized: Data will be saved to Cloud.");
} catch (e) {
  console.error("Firebase initialization failed:", e);
}

// --- DATA: Frontend Course ---
const frontendCourse: Course = {
  id: "frontend-web-dev",
  title: "Frontend Web Development",
  subtitle: "Build the visual internet. From landing pages to complex apps.",
  description: "Learn HTML, CSS, and JavaScript with Google's official web.dev curriculum. Build a portfolio that proves you can do the work.",
  duration: "8-10 weeks",
  level: "Beginner to Intermediate",
  target: "Aspiring web developers, career changers",
  tags: ["Web Dev", "Freelancing", "Creative"],
  color: "blue",
  modules: [
    {
      id: "html-basics",
      title: "Module 1: HTML Fundamentals",
      duration: "1-2 weeks",
      lessons: [
        {
          id: "html-intro",
          title: "Introduction to HTML",
          resources: [
            { title: "Learn HTML by Google", type: "documentation", platform: "Google web.dev", url: "https://web.dev/learn/html" },
            { title: "Semantic HTML Elements", type: "article", platform: "Google Developers", url: "https://developers.google.com/style/semantic-tagging" }
          ]
        },
        {
          id: "semantic-html",
          title: "Web Structure & Accessibility",
          resources: [
            { title: "Accessibility Fundamentals", type: "documentation", platform: "Google web.dev", url: "https://web.dev/learn/accessibility" }
          ]
        }
      ]
    },
    {
      id: "css-styling",
      title: "Module 2: CSS & Styling",
      duration: "2-3 weeks",
      lessons: [
        {
          id: "css-fundamentals",
          title: "CSS Basics & Box Model",
          resources: [
            { title: "Learn CSS by Google", type: "documentation", platform: "Google web.dev", url: "https://web.dev/learn/css" }
          ]
        }
      ]
    },
    {
      id: "javascript-basics",
      title: "Module 3: JavaScript Fundamentals",
      duration: "3-4 weeks",
      lessons: [
        {
          id: "js-intro",
          title: "JavaScript Basics",
          resources: [
            { title: "Introduction to JavaScript", type: "interactive", platform: "MDN Web Docs", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Introduction" }
          ]
        }
      ]
    },
    {
      id: "capstone-project",
      title: "Module 4: Capstone Project",
      duration: "1-2 weeks",
      lessons: [
        {
          id: "deployment",
          title: "Professional Deployment",
          resources: [
            { title: "Deploying to Vercel", type: "documentation", platform: "Vercel Docs", url: "https://vercel.com/docs/concepts/deployments/overview" }
          ]
        }
      ]
    }
  ]
};

// --- DATA: Analytics Course ---
const dataAnalyticsCourse: Course = {
  id: "data-analytics",
  title: "Data Analytics Fundamentals",
  subtitle: "Decode the data. Drive business decisions.",
  description: "Master the essentials of data analysis: Excel, SQL, and data visualization. Perfect for professionals looking to upskill.",
  duration: "8-10 weeks",
  level: "Beginner to Intermediate",
  target: "Career changers, business professionals",
  tags: ["SQL", "Business Intelligence", "Growth"],
  color: "purple",
  modules: [
    {
      id: "data-analytics-intro",
      title: "Module 1: Data Analytics Basics",
      duration: "1 week",
      lessons: [
        {
          id: "what-is-analytics",
          title: "What is Data Analytics",
          resources: [
            { title: "Google Data Analytics Foundations", type: "documentation", platform: "Google Cloud Skills Boost", url: "https://www.cloudskillsboost.google/paths/18" }
          ]
        }
      ]
    },
    {
      id: "sql-databases",
      title: "Module 2: SQL & Databases",
      duration: "2-3 weeks",
      lessons: [
        {
          id: "sql-basics",
          title: "SQL Fundamentals",
          resources: [
            { title: "SQL Tutorial", type: "interactive", platform: "W3Schools", url: "https://www.w3schools.com/sql/" }
          ]
        }
      ]
    }
  ]
};

// --- DATA: Google Cybersecurity Professional Certificate (Coursera / Grow with Google) ---
const cybersecurityCourse: Course = {
  id: "google-cybersecurity-cert",
  title: "Google Cybersecurity Professional Certificate",
  externalProgramId: "google-cybersecurity",
  subtitle: "Get on the fast track to a career in cybersecurity — powered by Coursera.",
  description: "A 9-course series by Google. Learn Python, Linux, SQL, SIEM tools & more. Earn an industry-recognized credential and prepare for the CompTIA Security+ exam. 100% free through LeadWise Foundation's Grow with Google partnership.",
  duration: "~6 months (10 hrs/week)",
  level: "Beginner — No experience required",
  target: "Career changers, job seekers, aspiring cybersecurity analysts",
  tags: ["Google Career Certificate", "CompTIA Security+", "Cybersecurity"],
  color: "emerald",
  modules: [
    {
      id: "cyber-1-foundations",
      title: "Course 1: Foundations of Cybersecurity",
      duration: "~14 hours",
      lessons: [
        {
          id: "cyber-1-overview",
          title: "Welcome to the Exciting World of Cybersecurity",
          resources: [
            { title: "Foundations of Cybersecurity — Full Course", type: "course", platform: "Coursera (Free via LeadWise)", url: "https://www.coursera.org/learn/foundations-of-cybersecurity?specialization=google-cybersecurity" }
          ]
        },
        {
          id: "cyber-1-skills",
          title: "Core Skills & Knowledge",
          resources: [
            { title: "Recognize core skills needed to become a cybersecurity analyst", type: "lesson", platform: "Coursera", url: "https://www.coursera.org/learn/foundations-of-cybersecurity?specialization=google-cybersecurity" },
            { title: "Identify how security attacks impact business operations", type: "lesson", platform: "Coursera", url: "https://www.coursera.org/learn/foundations-of-cybersecurity?specialization=google-cybersecurity" }
          ]
        }
      ]
    },
    {
      id: "cyber-2-security-risks",
      title: "Course 2: Play It Safe — Manage Security Risks",
      duration: "~11 hours",
      lessons: [
        {
          id: "cyber-2-overview",
          title: "Threats, Risks & Vulnerabilities",
          resources: [
            { title: "Manage Security Risks — Full Course", type: "course", platform: "Coursera (Free via LeadWise)", url: "https://www.coursera.org/learn/manage-security-risks?specialization=google-cybersecurity" }
          ]
        },
        {
          id: "cyber-2-siem",
          title: "Security Frameworks & SIEM Tools",
          resources: [
            { title: "Define commonly used SIEM tools", type: "lesson", platform: "Coursera", url: "https://www.coursera.org/learn/manage-security-risks?specialization=google-cybersecurity" },
            { title: "Use a playbook to respond to threats", type: "lesson", platform: "Coursera", url: "https://www.coursera.org/learn/manage-security-risks?specialization=google-cybersecurity" }
          ]
        }
      ]
    },
    {
      id: "cyber-3-networks",
      title: "Course 3: Connect and Protect — Networks & Network Security",
      duration: "~14 hours",
      lessons: [
        {
          id: "cyber-3-overview",
          title: "Network Architecture & Security",
          resources: [
            { title: "Networks and Network Security — Full Course", type: "course", platform: "Coursera (Free via LeadWise)", url: "https://www.coursera.org/learn/networks-and-network-security?specialization=google-cybersecurity" }
          ]
        },
        {
          id: "cyber-3-hardening",
          title: "System Hardening & Intrusion Prevention",
          resources: [
            { title: "Secure networks against intrusion tactics", type: "lesson", platform: "Coursera", url: "https://www.coursera.org/learn/networks-and-network-security?specialization=google-cybersecurity" },
            { title: "Describe system hardening techniques", type: "lesson", platform: "Coursera", url: "https://www.coursera.org/learn/networks-and-network-security?specialization=google-cybersecurity" }
          ]
        }
      ]
    },
    {
      id: "cyber-4-linux-sql",
      title: "Course 4: Tools of the Trade — Linux and SQL",
      duration: "~21 hours",
      lessons: [
        {
          id: "cyber-4-overview",
          title: "Operating Systems, Linux & SQL",
          resources: [
            { title: "Linux and SQL — Full Course", type: "course", platform: "Coursera (Free via LeadWise)", url: "https://www.coursera.org/learn/linux-and-sql?specialization=google-cybersecurity" }
          ]
        },
        {
          id: "cyber-4-cli",
          title: "Command Line & Database Queries",
          resources: [
            { title: "Navigate the file system using Linux commands via Bash", type: "lesson", platform: "Coursera", url: "https://www.coursera.org/learn/linux-and-sql?specialization=google-cybersecurity" },
            { title: "Use SQL to retrieve information from a database", type: "lesson", platform: "Coursera", url: "https://www.coursera.org/learn/linux-and-sql?specialization=google-cybersecurity" }
          ]
        }
      ]
    },
    {
      id: "cyber-5-assets",
      title: "Course 5: Assets, Threats, and Vulnerabilities",
      duration: "~20 hours",
      lessons: [
        {
          id: "cyber-5-overview",
          title: "Asset Classification & Threat Modeling",
          resources: [
            { title: "Assets, Threats, and Vulnerabilities — Full Course", type: "course", platform: "Coursera (Free via LeadWise)", url: "https://www.coursera.org/learn/assets-threats-and-vulnerabilities?specialization=google-cybersecurity" }
          ]
        },
        {
          id: "cyber-5-threats",
          title: "Social Engineering, Malware & Web Exploits",
          resources: [
            { title: "Analyze an attack surface to find risks", type: "lesson", platform: "Coursera", url: "https://www.coursera.org/learn/assets-threats-and-vulnerabilities?specialization=google-cybersecurity" },
            { title: "Summarize the threat modeling process", type: "lesson", platform: "Coursera", url: "https://www.coursera.org/learn/assets-threats-and-vulnerabilities?specialization=google-cybersecurity" }
          ]
        }
      ]
    },
    {
      id: "cyber-6-detection",
      title: "Course 6: Sound the Alarm — Detection and Response",
      duration: "~18 hours",
      lessons: [
        {
          id: "cyber-6-overview",
          title: "Incident Response & SIEM Analysis",
          resources: [
            { title: "Detection and Response — Full Course", type: "course", platform: "Coursera (Free via LeadWise)", url: "https://www.coursera.org/learn/detection-and-response?specialization=google-cybersecurity" }
          ]
        },
        {
          id: "cyber-6-ids",
          title: "IDS Tools & Packet Analysis",
          resources: [
            { title: "Analyze packets to interpret network communications", type: "lesson", platform: "Coursera", url: "https://www.coursera.org/learn/detection-and-response?specialization=google-cybersecurity" },
            { title: "Perform queries in SIEM tools to investigate events", type: "lesson", platform: "Coursera", url: "https://www.coursera.org/learn/detection-and-response?specialization=google-cybersecurity" }
          ]
        }
      ]
    },
    {
      id: "cyber-7-python",
      title: "Course 7: Automate Cybersecurity Tasks with Python",
      duration: "~25 hours",
      lessons: [
        {
          id: "cyber-7-overview",
          title: "Python for Cybersecurity",
          resources: [
            { title: "Automate Cybersecurity Tasks with Python — Full Course", type: "course", platform: "Coursera (Free via LeadWise)", url: "https://www.coursera.org/learn/automate-cybersecurity-tasks-with-python?specialization=google-cybersecurity" }
          ]
        },
        {
          id: "cyber-7-scripting",
          title: "Functions, Regex & Debugging",
          resources: [
            { title: "Create user-defined Python functions", type: "lesson", platform: "Coursera", url: "https://www.coursera.org/learn/automate-cybersecurity-tasks-with-python?specialization=google-cybersecurity" },
            { title: "Use regular expressions to extract information", type: "lesson", platform: "Coursera", url: "https://www.coursera.org/learn/automate-cybersecurity-tasks-with-python?specialization=google-cybersecurity" }
          ]
        }
      ]
    },
    {
      id: "cyber-8-jobs",
      title: "Course 8: Put It to Work — Prepare for Cybersecurity Jobs",
      duration: "~13 hours",
      lessons: [
        {
          id: "cyber-8-overview",
          title: "Incident Escalation & Career Prep",
          resources: [
            { title: "Prepare for Cybersecurity Jobs — Full Course", type: "course", platform: "Coursera (Free via LeadWise)", url: "https://www.coursera.org/learn/prepare-for-cybersecurity-jobs?specialization=google-cybersecurity" }
          ]
        },
        {
          id: "cyber-8-ai",
          title: "AI Skills for Cybersecurity",
          resources: [
            { title: "Use AI to identify bugs and refine code", type: "lesson", platform: "Coursera", url: "https://www.coursera.org/learn/prepare-for-cybersecurity-jobs?specialization=google-cybersecurity" },
            { title: "Prioritize security alerts with AI", type: "lesson", platform: "Coursera", url: "https://www.coursera.org/learn/prepare-for-cybersecurity-jobs?specialization=google-cybersecurity" }
          ]
        }
      ]
    },
    {
      id: "cyber-9-job-search-ai",
      title: "Course 9: Accelerate Your Job Search with AI",
      duration: "~10 hours",
      lessons: [
        {
          id: "cyber-9-overview",
          title: "AI-Powered Job Search",
          resources: [
            { title: "Accelerate Your Job Search with AI — Full Course", type: "course", platform: "Coursera (Free via LeadWise)", url: "https://www.coursera.org/learn/accelerate-your-job-search-with-ai?specialization=google-cybersecurity" }
          ]
        },
        {
          id: "cyber-9-tools",
          title: "Resume, Interview Prep & Career Dreamer",
          resources: [
            { title: "Build a stand-out resume with help from Gemini", type: "lesson", platform: "Coursera", url: "https://www.coursera.org/learn/accelerate-your-job-search-with-ai?specialization=google-cybersecurity" },
            { title: "Practice interview responses using NotebookLM", type: "lesson", platform: "Coursera", url: "https://www.coursera.org/learn/accelerate-your-job-search-with-ai?specialization=google-cybersecurity" }
          ]
        }
      ]
    }
  ]
};

const COURSES = [frontendCourse, dataAnalyticsCourse];

// --- COMPONENTS ---

// 1. INTAKE MODAL
interface IntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  targetCourse: Course | null;
}

function IntakeModal({ isOpen, onClose, onComplete, targetCourse }: IntakeModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    zipCode: "",
    householdIncome: "",
    employmentStatus: "",
    consent: false
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let uid = `demo-${Date.now()}`;
      
      // Use Firebase Auth if available
      if (auth) {
        if (!auth.currentUser) {
           await signInAnonymously(auth);
        }
        if (auth.currentUser) {
          uid = auth.currentUser.uid;
        }
      }

      const intakeRecord = {
        ...formData,
        participantId: uid,
        enrolledAt: new Date().toISOString(),
        targetCourse: targetCourse?.title || "General",
        status: "Enrolled",
        lmiVerified: true, 
      };

      // 1. SAVE TO CLOUD (If connected)
      if (db && auth?.currentUser) {
        await setDoc(doc(db, "artifacts", appId, "users", uid, "profile", "intake"), intakeRecord);
        console.log("SUCCESS: Data saved to Firebase Cloud.");
      } else {
        console.warn("WARNING: Firebase not connected. Saving locally only.");
      }
      
      // 2. MOCK EMAIL TRIGGER
      console.log(`📧 EMAILING MENTOR: Sending automated intro email for student ${formData.email}...`);
      
      // Always save local backup
      localStorage.setItem("leadwise_intake", JSON.stringify(intakeRecord));

      // Simulate delay for effect
      setTimeout(() => {
        onComplete();
      }, 1500);

    } catch (error) {
      console.error("Intake failed:", error);
      alert("Error saving intake. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1B2735] border border-white/10 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition"
        >
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
                  This information is required for our grant funding and allows us to keep this course <strong>100% free</strong>.
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

// 2. RESOURCE LINK COMPONENT
interface ProtectedResourceProps {
  resource: Resource;
  isEnrolled: boolean;
  onTriggerIntake: () => void;
}

function ProtectedResource({ resource, isEnrolled, onTriggerIntake }: ProtectedResourceProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (!isEnrolled) {
      e.preventDefault();
      onTriggerIntake();
    }
  };

  return (
    <a
      href={isEnrolled ? resource.url : "#"}
      onClick={handleClick}
      target={isEnrolled ? "_blank" : "_self"}
      rel="noopener noreferrer"
      className={`flex items-start gap-3 p-4 rounded-xl transition-all duration-200 group relative ${
        isEnrolled ? "bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer" : "bg-black/20 border border-white/5 cursor-not-allowed opacity-60"
      }`}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className={`text-sm font-semibold group-hover:text-[#FFBEA0] transition-colors ${isEnrolled ? 'text-white' : 'text-gray-400'}`}>
            {resource.title}
          </p>
          {!isEnrolled && <Lock className="w-3 h-3 text-gray-500" />}
          {isEnrolled && <CheckCircle className="w-3 h-3 text-green-400" />}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)} • {resource.platform}
        </p>
      </div>
      <span className="text-gray-400 group-hover:text-[#FFBEA0] mt-1">
        {isEnrolled ? <ExternalLink className="w-4 h-4"/> : <Lock className="w-4 h-4"/>}
      </span>
    </a>
  );
}

// 3. EXPANDABLE MODULE COMPONENT
interface ExpandableModuleProps {
  module: Module;
  isEnrolled: boolean;
  onTriggerIntake: () => void;
}

function ExpandableModule({ module, isEnrolled, onTriggerIntake }: ExpandableModuleProps) {
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
        <div className="border-t border-white/10 bg-black/20">
          <div className="space-y-3 p-5">
            {module.lessons.map((lesson) => (
              <div key={lesson.id} className="bg-[#1B2735] rounded-xl p-4 border border-white/5">
                <h4 className="text-sm font-semibold text-[#FFBEA0] mb-3">{lesson.title}</h4>
                <div className="space-y-2">
                  {lesson.resources.map((resource, idx) => (
                    <ProtectedResource 
                      key={idx} 
                      resource={resource} 
                      isEnrolled={isEnrolled}
                      onTriggerIntake={onTriggerIntake}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// 4. MAIN COURSE CARD COMPONENT
interface CourseCardProps {
  course: Course;
  isEnrolled: boolean;
  onTriggerIntake: () => void;
  progressPercentage?: number;
  progressText?: string;
  certificateUrl?: string;
  isVerified?: boolean;
}

function CourseCard({ 
  course, 
  isEnrolled, 
  onTriggerIntake, 
  progressPercentage, 
  progressText, 
  certificateUrl,
  isVerified
}: CourseCardProps) {
  const [showModules, setShowModules] = useState(false);
  const Icon = course.color === 'blue' ? Terminal : course.color === 'emerald' ? ShieldCheck : BarChart3;

  return (
    <div className="group relative bg-white/5 border border-white/10 hover:border-[#FFBEA0]/30 rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(255,190,160,0.1)]">
      <div className="p-8">
        <div className="flex items-start justify-between mb-6">
          <div className={`p-3 rounded-2xl ${course.color === 'blue' ? 'bg-blue-500/20 text-blue-300' : course.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-purple-500/20 text-purple-300'}`}>
            <Icon size={32} />
          </div>
          <div className="flex gap-2">
            {course.tags.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full bg-white/5 text-xs text-gray-400 border border-white/5">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <h3 className="text-3xl font-bold mb-2 text-white">{course.title}</h3>
        <p className="text-[#FFBEA0] font-medium mb-4">{course.subtitle}</p>
        
        {course.salaryHook && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FF9E80]/10 border border-[#FF9E80]/20 text-[#FFBEA0] text-sm font-bold mb-4">
             <Briefcase size={14} /> {course.salaryHook}
          </div>
        )}

        <p className="text-gray-300 leading-relaxed mb-8">
          {course.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-400 mb-6 pb-6 border-b border-white/10">
          <span>{course.duration}</span> • <span>{course.level}</span>
        </div>

        {/* Progress Display */}
        {isEnrolled && progressPercentage !== undefined && (
          <div className="mb-8 p-6 bg-white/5 rounded-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex justify-between items-end mb-3">
               <div>
                 <p className="text-xs uppercase tracking-widest text-[#FFBEA0] font-bold mb-1">Your Progress</p>
                 <p className="text-white font-bold">{progressText || `${progressPercentage}% Complete`}</p>
               </div>
               <div className="flex flex-col items-end">
                 {isVerified && (
                   <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-bold text-emerald-300 uppercase tracking-wider mb-2 animate-pulse">
                     <ShieldCheck size={10} /> Verified
                   </div>
                 )}
                 <p className="text-2xl font-black text-white">{progressPercentage}%</p>
               </div>
            </div>
            <Progress.Root className="relative h-3 w-full overflow-hidden rounded-full bg-white/5 border border-white/10">
              <Progress.Indicator
                className="h-full w-full flex-1 bg-gradient-to-r from-[#FF9E80] to-[#FFBEA0] transition-all duration-1000 ease-out"
                style={{ transform: `translateX(-${100 - progressPercentage}%)` }}
              />
            </Progress.Root>
          </div>
        )}

        {/* Action Area */}
        <div className="space-y-4">
          {!isEnrolled ? (
             <button 
              onClick={onTriggerIntake}
              className="w-full py-4 rounded-xl bg-white text-[#090A0F] font-bold hover:bg-[#FFBEA0] transition-colors flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(255,190,160,0.4)]"
            >
              Start Learning Free <ArrowRight size={18} />
            </button>
          ) : (
            <>
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex flex-col gap-3 mb-4">
                 <div className="flex items-center gap-3 text-green-400">
                    <CheckCircle size={20} />
                    <span className="font-semibold text-sm">Enrolled & Syncing with Coursera</span>
                 </div>
                 {progressPercentage === 100 && (
                   <a 
                    href={certificateUrl || "https://www.coursera.org/accomplishments"} 
                    target="_blank" 
                    className="w-full py-3 bg-green-500 text-white rounded-lg font-bold text-center hover:bg-green-400 transition-colors shadow-[0_0_20px_rgba(34,197,94,0.4)] flex items-center justify-center gap-2"
                   >
                     <Globe size={18} /> Download Verified Certificate
                   </a>
                 )}
              </div>
              <button 
                onClick={() => setShowModules(!showModules)}
                className="w-full py-3 rounded-xl bg-[#FF9E80]/10 text-[#FFBEA0] border border-[#FF9E80]/20 font-bold hover:bg-[#FF9E80]/20 transition-colors flex items-center justify-center gap-2"
              >
                {showModules ? "Hide Curriculum" : "View Curriculum & Modules"}
                {showModules ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {!progressPercentage && (
                <a 
                  href="/api/auth/login"
                  className="w-full py-3 rounded-xl bg-blue-500/10 text-blue-300 border border-blue-500/20 font-bold hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Globe size={16} /> Sync Coursera Progress
                </a>
              )}
            </>
          )}
        </div>

        {/* Expanded Curriculum (Only if Enrolled) */}
        {showModules && (
          <div className="mt-8 space-y-4 animate-in slide-in-from-top-4 duration-300">
             {course.modules.map(module => (
               <ExpandableModule 
                 key={module.id} 
                 module={module} 
                 isEnrolled={isEnrolled} 
                 onTriggerIntake={onTriggerIntake} 
                />
             ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---
const CoursesPage = () => {
  const [intakeOpen, setIntakeOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [courseraProgress, setCourseraProgress] = useState<{ percentage: number; text: string; isVerified: boolean } | null>(null);
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);

  // Fetch progress from our new API route
  const fetchProgress = async () => {
    setIsLoadingProgress(true);
    try {
      const res = await fetch('/api/coursera/progress');
      if (res.ok) {
        const data = await res.json();
        setCourseraProgress({
          percentage: data.percentage,
          text: `${data.completed} of ${data.total} courses completed`,
          isVerified: !!data.isVerified
        });
      }
    } catch (err) {
      console.error("Failed to fetch Coursera progress:", err);
    } finally {
      setIsLoadingProgress(false);
    }
  };

  // Check enrollment on load
  useEffect(() => {
    // Check local storage first for instant UI update
    if (localStorage.getItem("leadwise_intake")) {
      setIsEnrolled(true);
    }
    // Auth Listener
    if (auth) {
      onAuthStateChanged(auth, (u) => {
        if (localStorage.getItem("leadwise_intake")) {
          setIsEnrolled(true);
          fetchProgress(); // Try fetching progress when user is detected
        }
      });
    }

    // Check for auth success in URL
    const params = new URLSearchParams(window.location.search);
    if (params.get('auth_success') === 'true') {
      fetchProgress();
    }
  }, []);

  const openEnrollment = (course: Course) => {
    setSelectedCourse(course);
    setIntakeOpen(true);
  };

  const handleEnrollmentComplete = () => {
    setIsEnrolled(true);
    setIntakeOpen(false);
  };

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(ellipse_at_top,_#1B2735_0%,_#090A0F_100%)] text-white font-sans selection:bg-[#FFBEA0] selection:text-[#1B2735]">
      
      {/* --- NAVBAR --- */}
      <nav className="border-b border-white/10 bg-[#090A0F]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img src="/logolw.jpg" alt="LeadWise Logo" className="w-8 h-8 rounded-lg object-cover" />
            <span className="font-bold text-white text-lg tracking-tight">LeadWise Foundation</span>
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="/" className="text-gray-400 hover:text-white transition">Home</a>
            <a
              href="https://services.letsleadwise.org/resume"
              className="text-gray-400 hover:text-white transition"
            >
              Resume Builder
            </a>
            <a
              href="https://services.letsleadwise.org/resume"
              className="text-gray-400 hover:text-white transition"
            >
              Cover Letter
            </a>
            <span className="text-[#FFBEA0]">Courses</span>
            <a href="https://blogletsleadwise.org/cover-letter" className="text-gray-400 hover:text-white transition">Blog</a>
            <a 
              href="https://donation.letsleadwise.org" 
              className="bg-[#FF9E80] text-[#1B2735] px-5 py-2 rounded-full font-bold hover:bg-white transition-colors shadow-[0_0_15px_rgba(255,190,160,0.4)]"
            >
              Donate Now
            </a>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative pt-20 pb-16 px-4 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-[#FFBEA0]/30 text-[#FFBEA0] text-sm font-semibold mb-6 animate-fade-in">
          <CheckCircle size={16} /> 100% Free • Self-Paced • Industry-Relevant
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#FFBEA0]">
          Don't Just Learn to Code. <br />
          <span className="text-[#FFBEA0]">Learn to Get Hired.</span>
        </h1>
        
        <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10">
          Access free, industry-verified training from a <span className="text-white font-semibold">Google Cloud Partner</span>. 
          We turn ambition into employable skills—no tuition required.
        </p>
      </header>

      {/* --- PARTNERS BAR --- */}
      <div className="w-full border-y border-white/5 bg-white/5 backdrop-blur-sm py-8 mb-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-80">
          <div className="flex items-center gap-3">
            <div className="font-bold text-2xl tracking-tighter">Google Cloud</div>
            <div className="h-6 w-px bg-gray-500/50 mx-2"></div>
            <div className="text-sm uppercase tracking-widest text-gray-400">Build Partner</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="font-bold text-2xl tracking-tighter">Workspace</div>
            <div className="h-6 w-px bg-gray-500/50 mx-2"></div>
            <div className="text-sm uppercase tracking-widest text-gray-400">Authorized Partner</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="font-bold text-2xl tracking-tighter">Coursera</div>
            <div className="h-6 w-px bg-gray-500/50 mx-2"></div>
            <div className="text-sm uppercase tracking-widest text-gray-400">Grow with Google</div>
          </div>
        </div>
      </div>

      {/* --- THE BRIDGE SECTION --- */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <div className="grid md:grid-cols-2 gap-12 items-center bg-gradient-to-br from-white/5 to-transparent border border-[#FFBEA0]/20 rounded-[2.5rem] p-8 md:p-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              The Bridge to Your <span className="text-[#FFBEA0]">Next Job</span>
            </h2>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Most free courses leave you stranded at 'Hello World.' We connect the dots. 
              Our ecosystem is engineered for workforce transformation.
            </p>
            
            <ul className="space-y-4 mb-8">
              {[
                { title: "Step 1: Learn", desc: "Master the skills in our self-paced paths." },
                { title: "Step 2: Build", desc: "Use our Free ATS-Optimized Resume Builder." },
                { title: "Step 3: Launch", desc: "Apply with confidence using verified credentials." }
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#FF9E80]/20 text-[#FFBEA0] flex items-center justify-center font-bold text-sm mt-1">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{step.title}</h4>
                    <p className="text-sm text-gray-400">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-0 bg-[#FF9E80] rounded-2xl blur-[60px] opacity-20 group-hover:opacity-30 transition duration-500"></div>
            <div className="relative bg-[#090A0F]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 transform rotate-2 hover:rotate-0 transition duration-500">
              <div className="flex items-center gap-3 mb-6">
                <Briefcase className="text-[#FFBEA0]" size={28} />
                <span className="font-semibold text-lg">Career Tools Unlocked</span>
              </div>
              <div className="space-y-3">
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-[#FF9E80]"></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Skills Acquired</span>
                  <span>75% Match for "Junior Dev"</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURED: CYBERSECURITY CERTIFICATE --- */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-bold mb-6">
            <ShieldCheck size={16} /> Featured: Google Career Certificate • 500 Free Seats via Coursera
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="text-emerald-300">Cybersecurity</span> Professional Certificate
          </h2>
          <p className="text-gray-400 mt-3 max-w-2xl mx-auto">Powered by Google × Coursera — 100% free through our Grow with Google partnership. No degree or experience required.</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <CourseCard 
            course={cybersecurityCourse}
            isEnrolled={isEnrolled}
            onTriggerIntake={() => openEnrollment(cybersecurityCourse)}
            progressPercentage={courseraProgress?.percentage}
            progressText={courseraProgress?.text}
            isVerified={courseraProgress?.isVerified}
          />
        </div>

        {/* Direct Coursera Enrollment CTA */}
        {isEnrolled && (
          <div className="max-w-4xl mx-auto mt-8 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Globe className="text-emerald-300" size={28} />
              <div>
                <p className="text-white font-bold">Ready to start? Enroll directly on Coursera — FREE.</p>
                <p className="text-sm text-gray-400">Access all 9 courses through LeadWise Foundation's Grow with Google program.</p>
              </div>
            </div>
            <a 
              href="https://www.coursera.org/programs/leadwise-foundation-google-learning-program-6tugh" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-6 py-3 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              <ExternalLink size={18} /> Open Coursera Program
            </a>
          </div>
        )}
      </section>

      {/* --- MORE LEARNING PATHS --- */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          More <span className="text-[#FFBEA0]">Economic Pathways</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
};

export default CoursesPage;
