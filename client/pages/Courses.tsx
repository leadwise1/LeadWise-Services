import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Lock, CheckCircle, ExternalLink, RefreshCw } from "lucide-react";

// --- Configuration ---
// FIREBASE REMOVED TEMPORARILY TO FIX BUILD
// This version runs in "Local Mode" using browser storage.

// --- Types ---
interface Module {
  id: string;
  title: string;
  duration: string;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  resources: Resource[];
}

interface Resource {
  title: string;
  type: "video" | "article" | "interactive" | "documentation";
  url: string;
  platform: string;
  requiresIntake?: boolean; 
}

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  target: string;
  modules: Module[];
}

// --- DATA: Frontend Course (NOW USING GOOGLE RESOURCES) ---
const frontendCourse: Course = {
  id: "frontend-web-dev",
  title: "Frontend Web Development",
  description: "Learn HTML, CSS, and JavaScript with Google's official web.dev curriculum. Master the modern web standards.",
  duration: "8-10 weeks",
  level: "Beginner to Intermediate",
  target: "Aspiring web developers, career changers, freelancers",
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
            {
              title: "Learn HTML by Google",
              type: "documentation",
              platform: "Google web.dev",
              url: "https://web.dev/learn/html",
              requiresIntake: true
            },
            {
              title: "Semantic HTML Elements",
              type: "article",
              platform: "Google Developers",
              url: "https://developers.google.com/style/semantic-tagging",
              requiresIntake: true
            }
          ]
        },
        {
          id: "semantic-html",
          title: "Web Structure & Accessibility",
          resources: [
            {
              title: "Accessibility Fundamentals",
              type: "documentation",
              platform: "Google web.dev",
              url: "https://web.dev/learn/accessibility",
              requiresIntake: true
            },
            {
              title: "Building Accessible Forms",
              type: "article",
              platform: "Google web.dev",
              url: "https://web.dev/learn/forms",
              requiresIntake: true
            }
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
            {
              title: "Learn CSS by Google",
              type: "documentation",
              platform: "Google web.dev",
              url: "https://web.dev/learn/css",
              requiresIntake: true
            },
            {
              title: "The CSS Box Model",
              type: "article",
              platform: "Google web.dev",
              url: "https://web.dev/learn/css/box-model",
              requiresIntake: true
            }
          ]
        },
        {
          id: "responsive-design",
          title: "Responsive Design & Flexbox",
          resources: [
            {
              title: "Responsive Web Design",
              type: "documentation",
              platform: "Google web.dev",
              url: "https://web.dev/learn/design",
              requiresIntake: true
            },
            {
              title: "Flexbox Layouts",
              type: "interactive",
              platform: "Google web.dev",
              url: "https://web.dev/learn/css/flexbox",
              requiresIntake: true
            }
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
            {
              title: "Introduction to JavaScript",
              type: "interactive",
              platform: "MDN Web Docs (Google Recommended)",
              url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Introduction",
              requiresIntake: true
            }
          ]
        },
        {
          id: "js-dom",
          title: "DOM Manipulation",
          resources: [
            {
              title: "Introduction to the DOM",
              type: "article",
              platform: "MDN Web Docs",
              url: "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction",
              requiresIntake: true
            }
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
            {
              title: "Deploying to Vercel",
              type: "documentation",
              platform: "Vercel Docs",
              url: "https://vercel.com/docs/concepts/deployments/overview",
              requiresIntake: true
            }
          ]
        },
        {
          id: "mentor-review",
          title: "Grant Requirement: Mentor Code Review",
          resources: [
            {
              title: "Request Texas Instruments Mentor Review",
              type: "interactive",
              platform: "LeadWise Mentor Network",
              url: "mailto:mentor@letsleadwise.org?subject=TI%20Volunteer%20Grant%20Review%20Request&body=I%20have%20completed%20my%20frontend%20capstone%20and%20am%20requesting%20review.",
              requiresIntake: true
            }
          ]
        }
      ]
    }
  ]
};

// --- DATA: Analytics Course (REMAINS GOOGLE CLOUD) ---
const dataAnalyticsCourse: Course = {
  id: "data-analytics",
  title: "Data Analytics Fundamentals",
  description: "Master the essentials of data analysis: Excel, SQL, and data visualization with Google Cloud.",
  duration: "8-10 weeks",
  level: "Beginner to Intermediate",
  target: "Career changers, business professionals",
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
            {
              title: "Google Data Analytics Foundations",
              type: "documentation",
              platform: "Google Cloud Skills Boost",
              url: "https://www.cloudskillsboost.google/paths/18",
              requiresIntake: true
            },
            {
              title: "Analytics Types Guide",
              type: "article",
              platform: "Towards Data Science",
              url: "https://towardsdatascience.com/",
              requiresIntake: true
            }
          ]
        }
      ]
    },
    {
      id: "excel-mastery",
      title: "Module 2: Excel for Data Analysis",
      duration: "2-3 weeks",
      lessons: [
        {
          id: "excel-basics",
          title: "Excel Basics",
          resources: [
            {
              title: "Excel Tutorial for Beginners",
              type: "interactive",
              platform: "Microsoft Excel Help",
              url: "https://support.microsoft.com/en-us/excel",
              requiresIntake: true
            },
            {
              title: "Data Cleaning in Excel",
              type: "article",
              platform: "Datacamp Blog",
              url: "https://www.datacamp.com/blog",
              requiresIntake: true
            }
          ]
        }
      ]
    },
    {
      id: "sql-databases",
      title: "Module 3: SQL & Databases",
      duration: "2-3 weeks",
      lessons: [
        {
          id: "sql-basics",
          title: "SQL Fundamentals",
          resources: [
            {
              title: "SQL Tutorial",
              type: "interactive",
              platform: "W3Schools",
              url: "https://www.w3schools.com/sql/",
              requiresIntake: true
            },
            {
              title: "SQL for Data Analysis",
              type: "article",
              platform: "Mode Analytics SQL Tutorial",
              url: "https://mode.com/sql-tutorial/",
              requiresIntake: true
            }
          ]
        }
      ]
    },
    {
      id: "data-visualization",
      title: "Module 4: Data Visualization",
      duration: "1-2 weeks",
      lessons: [
        {
          id: "visualization-tools",
          title: "Visualization Tools",
          resources: [
            {
              title: "Google Looker Studio (Cloud Native)",
              type: "interactive",
              platform: "Google Cloud",
              url: "https://lookerstudio.google.com/overview",
              requiresIntake: true
            },
            {
              title: "Data Visualization Guide",
              type: "article",
              platform: "Tableau Blog",
              url: "https://www.tableau.com/about/blog",
              requiresIntake: true
            }
          ]
        }
      ]
    },
    {
      id: "capstone-analytics",
      title: "Module 5: Capstone Project",
      duration: "1-2 weeks",
      lessons: [
        {
          id: "mentor-review-analytics",
          title: "Grant Requirement: Mentor Code Review",
          resources: [
            {
              title: "Request Texas Instruments Mentor Review",
              type: "interactive",
              platform: "LeadWise Mentor Network",
              url: "mailto:mentor@letsleadwise.org?subject=TI%20Volunteer%20Grant%20Review%20Request&body=I%20have%20completed%20my%20data%20analytics%20capstone%20and%20am%20requesting%20review.",
              requiresIntake: true
            },
            {
              title: "Kaggle Datasets",
              type: "interactive",
              platform: "Kaggle",
              url: "https://www.kaggle.com/",
              requiresIntake: true
            }
          ]
        }
      ]
    }
  ]
};

// --- COMPONENTS ---

function IntakeModal({ 
  isOpen, 
  onClose, 
  onComplete, 
  targetResource 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onComplete: () => void;
  targetResource: string;
}) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    zipCode: "",
    householdIncome: "",
    householdSize: "",
    employmentStatus: "",
    consent: false
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create a fake ID for Demo Mode
      const uid = `student-${Math.floor(Math.random() * 10000)}`;

      const intakeRecord = {
        ...formData,
        participantId: uid,
        enrolledAt: new Date().toISOString(),
        targetCourse: targetResource,
        status: "Enrolled",
        lmiVerified: true, 
      };

      // Save to LocalStorage (Browser Memory)
      console.log("Saved to LocalStorage (Emergency Mode)");
      localStorage.setItem("leadwise_intake", JSON.stringify(intakeRecord));

      onComplete();
    } catch (error) {
      console.error("Intake failed:", error);
      alert("Error saving intake. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-primary p-6 text-white">
          <h2 className="text-xl font-bold">New Student Enrollment</h2>
          <p className="text-sm opacity-90">Step {step} of 3: {step === 1 ? 'Contact Info' : step === 2 ? 'Eligibility' : 'Consent'}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input required className="w-full p-2 border border-gray-300 rounded-md" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input required className="w-full p-2 border border-gray-300 rounded-md" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" required className="w-full p-2 border border-gray-300 rounded-md" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                <input required maxLength={5} className="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g. 75001" value={formData.zipCode} onChange={(e) => setFormData({...formData, zipCode: e.target.value})} />
                <p className="text-xs text-gray-500 mt-1">Used for LMI census tract verification.</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 mb-4">
                This information is required for our grant funding and allows us to keep this course <strong>100% free</strong>.
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Annual Household Income</label>
                <select required className="w-full p-2 border border-gray-300 rounded-md" value={formData.householdIncome} onChange={(e) => setFormData({...formData, householdIncome: e.target.value})}>
                  <option value="">Select Range...</option>
                  <option value="0-25k">$0 - $25,000</option>
                  <option value="25-50k">$25,001 - $50,000</option>
                  <option value="50-75k">$50,001 - $75,000</option>
                  <option value="75k+">$75,001+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employment Status</label>
                <select required className="w-full p-2 border border-gray-300 rounded-md" value={formData.employmentStatus} onChange={(e) => setFormData({...formData, employmentStatus: e.target.value})}>
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
               <div className="border p-4 rounded-lg bg-gray-50 text-sm space-y-2">
                 <h3 className="font-bold text-gray-900">Program Participation Agreement</h3>
                 <p>By clicking "Submit", I certify that the information provided is true. I understand that LeadWise Foundation is a non-profit and will use this data in aggregate form for grant reporting purposes.</p>
               </div>
               <label className="flex items-start gap-3 p-2 cursor-pointer hover:bg-gray-100 rounded-md">
                 <input type="checkbox" required className="mt-1" checked={formData.consent} onChange={(e) => setFormData({...formData, consent: e.target.checked})} />
                 <span className="text-sm font-medium text-gray-700">I Agree and wish to enroll.</span>
               </label>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t mt-4">
            {step > 1 ? (
              <button type="button" onClick={() => setStep(step - 1)} className="px-4 py-2 text-gray-600 font-medium">Back</button>
            ) : (
              <button type="button" onClick={onClose} className="px-4 py-2 text-gray-500">Cancel</button>
            )}
            {step < 3 ? (
              <button type="button" onClick={() => {
                  if (step === 1 && (!formData.firstName || !formData.email || !formData.zipCode)) return alert("Please fill in all fields");
                  if (step === 2 && (!formData.householdIncome || !formData.employmentStatus)) return alert("Please verify eligibility");
                  setStep(step + 1);
                }} className="bg-primary text-white px-6 py-2 rounded-lg font-bold">Next Step</button>
            ) : (
              <button type="submit" disabled={loading} className="bg-accent text-primary px-8 py-2 rounded-lg font-bold hover:bg-yellow-400">
                {loading ? "Enrolling..." : "Submit & Start Learning"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function ProtectedResource({ resource, isEnrolled, onTriggerIntake }: { resource: Resource, isEnrolled: boolean, onTriggerIntake: () => void }) {
  const handleClick = (e: React.MouseEvent) => {
    // LOCK LOGIC: If not enrolled, BLOCK the click and show modal
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
      className={`flex items-start gap-3 p-3 rounded-lg transition-colors duration-200 group relative ${
        isEnrolled ? "bg-primary/10 hover:bg-primary/20 cursor-pointer" : "bg-gray-100 hover:bg-gray-200 cursor-not-allowed"
      }`}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-primary group-hover:text-opacity-90">
            {resource.title}
          </p>
          {!isEnrolled && (
            <Lock className="w-3 h-3 text-gray-500" />
          )}
          {isEnrolled && (
            <CheckCircle className="w-3 h-3 text-green-600" />
          )}
        </div>
        <p className="text-xs text-gray-600 mt-1">
          {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)} • {resource.platform}
        </p>
        
        {isEnrolled && resource.platform.includes("Google") && (
          <p className="text-[10px] text-orange-600 font-bold mt-1 bg-orange-100 inline-block px-1 rounded">
             Tip: Enter "LeadWise Student" for Company Name
          </p>
        )}
      </div>
      <span className="text-primary group-hover:text-opacity-90 mt-1">
        {isEnrolled ? <ExternalLink className="w-4 h-4"/> : <Lock className="w-4 h-4"/>}
      </span>
    </a>
  );
}

function ExpandableModule({ module, isEnrolled, onTriggerIntake }: { module: Module; isEnrolled: boolean; onTriggerIntake: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors duration-200">
        <div className="text-left flex-1">
          <h3 className="text-lg font-bold text-primary mb-1">{module.title}</h3>
          <p className="text-sm text-gray-600">Duration: {module.duration}</p>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
      </button>

      {expanded && (
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="space-y-4 p-6">
            {module.lessons.map((lesson) => (
              <div key={lesson.id} className="bg-white rounded-lg p-4 border border-gray-100">
                <h4 className="text-base font-semibold text-primary mb-4">{lesson.title}</h4>
                <div className="space-y-3">
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

function CourseCard({ course, isEnrolled, onTriggerIntake }: { course: Course, isEnrolled: boolean, onTriggerIntake: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-8">
        <h2 className="text-3xl font-bold mb-3">{course.title}</h2>
        <p className="text-gray-100 mb-6">{course.description}</p>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-200 font-semibold">Duration</p>
            <p className="font-bold">{course.duration}</p>
          </div>
          <div>
            <p className="text-gray-200 font-semibold">Level</p>
            <p className="font-bold">{course.level}</p>
          </div>
          <div>
            <p className="text-gray-200 font-semibold">Best For</p>
            <p className="font-bold text-xs">{course.target}</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="mb-8">
          <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between bg-primary/10 hover:bg-primary/20 p-4 rounded-lg transition-colors duration-200 mb-6">
            <span className="font-semibold text-primary">{expanded ? "Hide" : "Show"} Course Modules</span>
            {expanded ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
          </button>

          {expanded && (
            <div className="space-y-4">
              {course.modules.map((module) => (
                <ExpandableModule key={module.id} module={module} isEnrolled={isEnrolled} onTriggerIntake={onTriggerIntake} />
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-6">
          {!isEnrolled ? (
            <button onClick={onTriggerIntake} className="w-full bg-accent text-primary hover:bg-yellow-400 font-bold py-3 px-6 rounded-lg transition-colors duration-200">
              Enroll & Start Tracking
            </button>
          ) : (
             <button onClick={() => setExpanded(true)} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Continue Learning
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Courses() {
  const [intakeOpen, setIntakeOpen] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    // Basic Auth Simulation (Browser Memory Only)
    if (localStorage.getItem("leadwise_intake")) {
      setIsEnrolled(true);
    }
  }, []);

  useEffect(() => {
    document.title = "Courses | LeadWise Foundation";
    const updateFavicon = () => {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.type = 'image/svg+xml';
      link.href = '/leadwise-logo.svg?v=2';
    };
    updateFavicon();
  }, []);

  const handleEnrollmentComplete = () => {
    setIsEnrolled(true);
    setIntakeOpen(false);
  };

  const resetEnrollment = () => {
    if (confirm("Reset enrollment? This will clear your test data.")) {
      localStorage.removeItem("leadwise_intake");
      setIsEnrolled(false);
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-primary sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/leadwise-logo.svg" alt="LeadWise Foundation" className="h-10 w-auto object-contain bg-white/10 rounded p-1" />
            <span className="font-bold text-white text-lg hidden sm:block">LeadWise Foundation</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="/" className="text-gray-100 hover:text-white transition">Home</a>
            <a href="/templates" className="text-gray-100 hover:text-white transition">Templates</a>
            <a href="/courses" className="text-white font-semibold">Courses</a>
            <button className="bg-accent hover:bg-yellow-200 text-primary font-semibold py-2 px-6 rounded-lg transition-colors duration-200">
              {isEnrolled ? "My Dashboard" : "Sign In"}
            </button>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-primary/5 to-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 leading-tight">Level Up Your Skills</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">Accelerate your career with curated, self-paced learning paths. All courses are 100% free.</p>
          <div className="inline-block bg-accent text-primary px-4 py-2 rounded-full text-sm font-semibold">✓ 100% Free • Self-Paced • Industry-Relevant</div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Featured Learning Paths</h2>
            <p className="text-xl text-gray-700">{isEnrolled ? "Your courses are unlocked. Click any module to start." : "Complete the intake process to unlock full access to industry certifications."}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <CourseCard course={frontendCourse} isEnrolled={isEnrolled} onTriggerIntake={() => setIntakeOpen(true)} />
            <CourseCard course={dataAnalyticsCourse} isEnrolled={isEnrolled} onTriggerIntake={() => setIntakeOpen(true)} />
          </div>
        </div>
      </section>

      <IntakeModal isOpen={intakeOpen} onClose={() => setIntakeOpen(false)} onComplete={handleEnrollmentComplete} targetResource="General Enrollment" />

      <footer className="bg-primary text-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center border-t border-primary/20 pt-8">
            <p className="text-center text-sm">&copy; 2024 LeadWise Foundation. Free learning for everyone.</p>
            {/* RESET BUTTON FOR TESTING */}
            <button onClick={resetEnrollment} className="mt-4 flex items-center gap-2 text-xs text-gray-400 hover:text-white bg-primary/50 px-2 py-1 rounded">
              <RefreshCw className="w-3 h-3" /> Reset Enrollment (Test Mode)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
