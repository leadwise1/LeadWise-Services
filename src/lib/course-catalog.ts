// ─── TYPES ────────────────────────────────────────────────────────────────────
export interface Resource { title: string; type: string; platform: string; url: string; }
interface Lesson   { id: string; title: string; resources: Resource[]; }
export interface Module   { id: string; title: string; duration: string; lessons: Lesson[]; }
export interface Course   {
  id: string; title: string; subtitle: string; description: string;
  duration: string; level: string; tags: string[]; accentColor: string; bgColor: string; textColor: string;
  salaryHook?: string; modules: Module[]; externalUrl: string;
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
export const COURSES: Course[] = [
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
  {
    id: "google-prompting-essentials",
    title: "Google Prompting Essentials Specialization",
    subtitle: "Unlock AI’s potential with effective prompts.",
    description: "Learn from Google experts to write clear, specific prompts using a five-step framework. Practice everyday work tasks, data analysis, presentations, and responsible AI use. Build a reusable prompt library and earn a shareable Google certificate.",
    duration: "4 courses · Under 10 hours",
    level: "Beginner — No experience required",
    tags: ["Prompting", "Generative AI", "AI Literacy"],
    accentColor: "#A855F7",
    bgColor: "#F5F3FF",
    textColor: "#4C1D95",
    externalUrl: "https://www.coursera.org/specializations/prompting-essentials-google",
    modules: [],
  },
];

