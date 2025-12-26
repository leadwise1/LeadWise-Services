import { useState } from "react";
import Head from "next/head"; // Import Head to manage the browser tab
import { ChevronDown, ChevronUp } from "lucide-react";

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

// 1. FRONTEND COURSE DATA (Includes Vercel & Grant Hook)
const frontendCourse: Course = {
  id: "frontend-web-dev",
  title: "Frontend Web Development",
  description: "Learn HTML, CSS, and JavaScript to build interactive websites. Master the fundamentals of modern web development and create responsive, user-friendly web applications.",
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
          title: "Introduction to HTML & Web Structure",
          resources: [
            {
              title: "HTML Introduction",
              type: "interactive",
              platform: "freeCodeCamp",
              url: "https://www.freecodecamp.org/learn/responsive-web-design/"
            },
            {
              title: "HTML Elements and Attributes",
              type: "article",
              platform: "MDN Web Docs",
              url: "https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML"
            }
          ]
        },
        {
          id: "semantic-html",
          title: "Semantic HTML & Forms",
          resources: [
            {
              title: "Semantic HTML5 Elements",
              type: "video",
              platform: "YouTube - Traversy Media",
              url: "https://www.youtube.com/results?search_query=semantic+html5"
            },
            {
              title: "HTML Forms Guide",
              type: "article",
              platform: "MDN Web Docs",
              url: "https://developer.mozilla.org/en-US/docs/Learn/Forms"
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
          title: "CSS Selectors, Properties & Box Model",
          resources: [
            {
              title: "CSS Basics Course",
              type: "interactive",
              platform: "freeCodeCamp",
              url: "https://www.freecodecamp.org/learn/responsive-web-design/"
            },
            {
              title: "CSS Box Model",
              type: "article",
              platform: "MDN Web Docs",
              url: "https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model"
            }
          ]
        },
        {
          id: "responsive-design",
          title: "Responsive Design & Flexbox",
          resources: [
            {
              title: "Flexbox Complete Guide",
              type: "article",
              platform: "CSS-Tricks",
              url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/"
            },
            {
              title: "CSS Grid & Flexbox",
              type: "interactive",
              platform: "freeCodeCamp",
              url: "https://www.freecodecamp.org/learn/responsive-web-design/"
            }
          ]
        },
        {
          id: "css-advanced",
          title: "CSS Grid, Animations & Transitions",
          resources: [
            {
              title: "CSS Grid Layout",
              type: "article",
              platform: "MDN Web Docs",
              url: "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Grids"
            },
            {
              title: "CSS Animations & Transitions",
              type: "video",
              platform: "YouTube - Traversy Media",
              url: "https://www.youtube.com/results?search_query=css+animations"
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
          title: "Variables, Data Types & Operators",
          resources: [
            {
              title: "JavaScript Basics",
              type: "interactive",
              platform: "freeCodeCamp",
              url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/"
            },
            {
              title: "JavaScript Fundamentals",
              type: "article",
              platform: "MDN Web Docs",
              url: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript"
            }
          ]
        },
        {
          id: "js-functions",
          title: "Functions, Scope & Closures",
          resources: [
            {
              title: "JavaScript Functions",
              type: "article",
              platform: "MDN Web Docs",
              url: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Functions"
            },
            {
              title: "Understanding Scope & Closures",
              type: "video",
              platform: "YouTube - Traversy Media",
              url: "https://www.youtube.com/results?search_query=javascript+scope+closures"
            }
          ]
        },
        {
          id: "js-dom",
          title: "DOM Manipulation & Events",
          resources: [
            {
              title: "DOM Introduction",
              type: "article",
              platform: "MDN Web Docs",
              url: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Manipulating_documents"
            },
            {
              title: "Event Handling in JavaScript",
              type: "interactive",
              platform: "freeCodeCamp",
              url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/"
            }
          ]
        },
        {
          id: "js-async",
          title: "Async Programming, APIs & Fetch",
          resources: [
            {
              title: "Asynchronous JavaScript",
              type: "article",
              platform: "MDN Web Docs",
              url: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous"
            },
            {
              title: "Fetch API & AJAX",
              type: "video",
              platform: "YouTube - Traversy Media",
              url: "https://www.youtube.com/results?search_query=fetch+api+javascript"
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
          id: "portfolio-project",
          title: "Build a Portfolio Website",
          resources: [
            {
              title: "Portfolio Project Ideas",
              type: "article",
              platform: "freeCodeCamp Blog",
              url: "https://www.freecodecamp.org/news/"
            }
          ]
        },
        // Deployment to Vercel (Workforce Readiness)
        {
          id: "deployment",
          title: "Professional Deployment",
          resources: [
            {
              title: "Deploying to Vercel",
              type: "documentation",
              platform: "Vercel Docs",
              url: "https://vercel.com/docs/concepts/deployments/overview"
            },
            {
              title: "Git & GitHub Crash Course",
              type: "video",
              platform: "YouTube - FreeCodeCamp",
              url: "https://www.youtube.com/watch?v=RGOj5yH7evk"
            }
          ]
        },
        // Mentor Review (Funding Trigger)
        {
          id: "mentor-review",
          title: "Grant Requirement: Mentor Code Review",
          resources: [
            {
              title: "Request Texas Instruments Mentor Review",
              type: "interactive",
              platform: "LeadWise Mentor Network",
              url: "mailto:mentors@leadwise.org?subject=TI%20Volunteer%20Grant%20Review%20Request&body=I%20have%20completed%20my%20frontend%20capstone%20and%20am%20requesting%20review."
            }
          ]
        }
      ]
    }
  ]
};

// 2. DATA ANALYTICS COURSE DATA (Includes Google Cloud & Looker Studio)
const dataAnalyticsCourse: Course = {
  id: "data-analytics",
  title: "Data Analytics Fundamentals",
  description: "Master the essentials of data analysis: Excel, SQL, and data visualization. Learn how to collect, clean, analyze, and visualize data to drive business decisions.",
  duration: "8-10 weeks",
  level: "Beginner to Intermediate",
  target: "Career changers, business professionals, aspiring data analysts",
  modules: [
    {
      id: "data-analytics-intro",
      title: "Module 1: Data Analytics Basics",
      duration: "1 week",
      lessons: [
        {
          id: "what-is-analytics",
          title: "What is Data Analytics & Its Impact",
          resources: [
            {
              title: "Data Analytics Overview",
              type: "video",
              platform: "Google Analytics Academy",
              url: "https://analytics.google.com/analytics/academy/"
            },
            // Replaced Medium with Google Cloud Skills Boost (No Paywall)
            {
              title: "Google Data Analytics Foundations",
              type: "documentation",
              platform: "Google Cloud Skills Boost",
              url: "https://www.cloudskillsboost.google/paths/18"
            }
          ]
        },
        {
          id: "analytics-types",
          title: "Types of Analytics (Descriptive, Predictive, Prescriptive)",
          resources: [
            {
              title: "Analytics Types Guide",
              type: "article",
              platform: "Towards Data Science",
              url: "https://towardsdatascience.com/"
            },
            {
              title: "Data Analytics Framework",
              type: "video",
              platform: "YouTube - Alex The Analyst",
              url: "https://www.youtube.com/results?search_query=data+analytics+types"
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
          title: "Excel Basics & Formulas",
          resources: [
            {
              title: "Excel Tutorial for Beginners",
              type: "interactive",
              platform: "Microsoft Excel Help",
              url: "https://support.microsoft.com/en-us/excel"
            },
            {
              title: "Excel Formulas & Functions",
              type: "video",
              platform: "YouTube - Excel Easy",
              url: "https://www.youtube.com/results?search_query=excel+formulas+tutorial"
            }
          ]
        },
        {
          id: "data-cleaning",
          title: "Data Cleaning & Manipulation",
          resources: [
            {
              title: "Data Cleaning in Excel",
              type: "article",
              platform: "Datacamp Blog",
              url: "https://www.datacamp.com/blog"
            },
            {
              title: "Advanced Excel Functions",
              type: "video",
              platform: "YouTube - Alex The Analyst",
              url: "https://www.youtube.com/results?search_query=data+cleaning+excel"
            }
          ]
        },
        {
          id: "excel-analysis",
          title: "Pivot Tables & Data Analysis",
          resources: [
            {
              title: "Pivot Tables Guide",
              type: "article",
              platform: "Excel Easy",
              url: "https://www.excel-easy.com/"
            },
            {
              title: "Pivot Tables Tutorial",
              type: "video",
              platform: "YouTube - Traversy Media",
              url: "https://www.youtube.com/results?search_query=pivot+tables+excel"
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
          title: "SQL Fundamentals & SELECT Queries",
          resources: [
            {
              title: "SQL Tutorial",
              type: "interactive",
              platform: "W3Schools",
              url: "https://www.w3schools.com/sql/"
            },
            {
              title: "SQL for Data Analysis",
              type: "article",
              platform: "Mode Analytics SQL Tutorial",
              url: "https://mode.com/sql-tutorial/"
            }
          ]
        },
        {
          id: "sql-intermediate",
          title: "JOINs, Aggregation & Subqueries",
          resources: [
            {
              title: "SQL JOINs Explained",
              type: "video",
              platform: "YouTube - Alex The Analyst",
              url: "https://www.youtube.com/results?search_query=sql+joins"
            },
            {
              title: "Advanced SQL Queries",
              type: "article",
              platform: "Mode Analytics SQL Tutorial",
              url: "https://mode.com/sql-tutorial/"
            }
          ]
        },
        {
          id: "database-design",
          title: "Database Concepts & Design",
          resources: [
            {
              title: "Database Design Basics",
              type: "article",
              platform: "Medium",
              url: "https://medium.com/"
            },
            {
              title: "Relational Databases",
              type: "video",
              platform: "YouTube - Fireship",
              url: "https://www.youtube.com/results?search_query=database+design"
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
          id: "viz-principles",
          title: "Data Visualization Principles & Best Practices",
          resources: [
            {
              title: "Data Visualization Guide",
              type: "article",
              platform: "Tableau Blog",
              url: "https://www.tableau.com/about/blog"
            },
            {
              title: "Effective Data Visualization",
              type: "video",
              platform: "YouTube - Alex The Analyst",
              url: "https://www.youtube.com/results?search_query=data+visualization+best+practices"
            }
          ]
        },
        {
          id: "visualization-tools",
          title: "Visualization Tools",
          resources: [
            {
              title: "Google Sheets Visualization",
              type: "article",
              platform: "Google Support",
              url: "https://support.google.com/docs"
            },
            {
              title: "Power BI for Beginners",
              type: "video",
              platform: "YouTube - Alex The Analyst",
              url: "https://www.youtube.com/results?search_query=power+bi+tutorial"
            },
            // Added Looker Studio (Innovation)
            {
              title: "Google Looker Studio (Cloud Native)",
              type: "interactive",
              platform: "Google Cloud",
              url: "https://lookerstudio.google.com/overview"
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
          id: "analytics-project",
          title: "Real-World Data Analysis Project",
          resources: [
            {
              title: "Kaggle Datasets",
              type: "interactive",
              platform: "Kaggle",
              url: "https://www.kaggle.com/"
            },
            {
              title: "Portfolio Project Ideas",
              type: "article",
              platform: "Alex The Analyst Blog",
              url: "https://www.youtube.com/c/AlexTheAnalyst"
            }
          ]
        },
        // Mentor Review (Funding Trigger)
        {
          id: "mentor-review-analytics",
          title: "Grant Requirement: Mentor Code Review",
          resources: [
            {
              title: "Request Texas Instruments Mentor Review",
              type: "interactive",
              platform: "LeadWise Mentor Network",
              url: "mailto:mentors@leadwise.org?subject=TI%20Volunteer%20Grant%20Review%20Request&body=I%20have%20completed%20my%20data%20analytics%20capstone%20and%20am%20requesting%20review."
            }
          ]
        }
      ]
    }
  ]
};

function ExpandableModule({ module, courseId }: { module: Module; courseId: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors duration-200"
      >
        <div className="text-left flex-1">
          <h3 className="text-lg font-bold text-primary mb-1">{module.title}</h3>
          <p className="text-sm text-gray-600">Duration: {module.duration}</p>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-primary" />
        ) : (
          <ChevronDown className="w-5 h-5 text-primary" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="space-y-4 p-6">
            {module.lessons.map((lesson) => (
              <div key={lesson.id} className="bg-white rounded-lg p-4 border border-gray-100">
                <h4 className="text-base font-semibold text-primary mb-4">{lesson.title}</h4>
                <div className="space-y-3">
                  {lesson.resources.map((resource, idx) => (
                    <a
                      key={idx}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 p-3 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors duration-200 group"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-primary group-hover:text-opacity-90">
                          {resource.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)} • {resource.platform}
                        </p>
                      </div>
                      <span className="text-primary group-hover:text-opacity-90 mt-1">→</span>
                    </a>
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

function CourseCard({ course }: { course: Course }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      {/* Course Header */}
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

      {/* Course Content */}
      <div className="p-8">
        <div className="mb-8">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between bg-primary/10 hover:bg-primary/20 p-4 rounded-lg transition-colors duration-200 mb-6"
          >
            <span className="font-semibold text-primary">
              {expanded ? "Hide" : "Show"} Course Modules
            </span>
            {expanded ? (
              <ChevronUp className="w-5 h-5 text-primary" />
            ) : (
              <ChevronDown className="w-5 h-5 text-primary" />
            )}
          </button>

          {expanded && (
            <div className="space-y-4">
              {course.modules.map((module) => (
                <ExpandableModule key={module.id} module={module} courseId={course.id} />
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="border-t border-gray-200 pt-6">
          <button className="w-full bg-primary hover:bg-opacity-90 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200">
            Start Learning Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Courses() {
  return (
    <div className="min-h-screen bg-white">
      {/* Browser Tab Settings - OVERRIDE FIX */}
      <Head>
        <title>Courses | LeadWise Foundation</title>
        <meta name="description" content="Free professional courses in Frontend Development and Data Analytics." />
        {/* The ?v=2 forces the browser to re-download the icon instead of using the cached one */}
        <link rel="icon" href="/leadwise-logo.svg?v=2" type="image/svg+xml" />
        <link rel="shortcut icon" href="/leadwise-logo.svg?v=2" />
      </Head>

      {/* Navigation */}
      <nav className="bg-primary sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* The Logo Image on the Page */}
            <img 
              src="/leadwise-logo.svg" 
              alt="LeadWise Foundation" 
              className="h-10 w-auto object-contain bg-white/10 rounded p-1" 
            />
            <span className="font-bold text-white text-lg hidden sm:block">LeadWise Foundation</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="/" className="text-gray-100 hover:text-white transition">Home</a>
            <a href="/templates" className="text-gray-100 hover:text-white transition">Templates</a>
            <a href="/courses" className="text-white font-semibold">Courses</a>
            <button className="bg-accent hover:bg-yellow-200 text-primary font-semibold py-2 px-6 rounded-lg transition-colors duration-200">
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 leading-tight">
            Level Up Your Skills
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Accelerate your career with curated, self-paced learning paths. Master in-demand skills and land your dream job. All courses are 100% free.
          </p>
          <div className="inline-block bg-accent text-primary px-4 py-2 rounded-full text-sm font-semibold">
            ✓ 100% Free • Self-Paced • Industry-Relevant
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">
              Featured Learning Paths
            </h2>
            <p className="text-xl text-gray-700">
              Choose your path and start learning with curated resources from industry leaders
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <CourseCard course={frontendCourse} />
            <CourseCard course={dataAnalyticsCourse} />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-primary mb-12 text-center">
            Why These Courses?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary">
                  <span className="text-white text-xl">🚀</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary mb-2">High Demand Skills</h3>
                <p className="text-gray-700">
                  Learn skills that employers actively seek right now. Frontend development and data analytics are among the most in-demand fields.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary">
                  <span className="text-white text-xl">📚</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary mb-2">Curated Resources</h3>
                <p className="text-gray-700">
                  We've curated the best free resources from platforms like freeCodeCamp, MDN, Kaggle, and industry experts.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary">
                  <span className="text-white text-xl">⏰</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary mb-2">Self-Paced Learning</h3>
                <p className="text-gray-700">
                  Learn at your own speed. No fixed schedules or deadlines. Progress through modules as quickly or slowly as you need.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary">
                  <span className="text-white text-xl">💼</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary mb-2">Career-Focused</h3>
                <p className="text-gray-700">
                  Each course includes practical projects and capstone assignments to build portfolio-ready work samples.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Combine Skills with Professional Resumes
          </h2>
          <p className="text-xl opacity-95 mb-8">
            Once you've learned new skills, showcase them with our professional resume templates. Create a compelling application package.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/templates"
              className="bg-accent text-primary hover:bg-yellow-200 font-bold py-3 px-8 rounded-lg transition-colors duration-200 inline-block text-lg"
            >
              View Resume Templates
            </a>
            <button className="border-2 border-accent text-accent hover:bg-accent hover:text-primary font-bold py-3 px-8 rounded-lg transition-colors duration-200 text-lg">
              Get Started Learning
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src="/leadwise-logo.svg" 
                  alt="LeadWise Foundation" 
                  className="w-8 h-8 object-contain bg-white/10 rounded p-1" 
                />
                <span className="font-bold text-white">LeadWise Foundation</span>
              </div>
              <p className="text-sm">Free tools to help you land your dream job through better resumes and continuous learning.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/templates" className="hover:text-white transition">Templates</a></li>
                <li><a href="/courses" className="hover:text-white transition">Courses</a></li>
                <li><a href="#" className="hover:text-white transition">Tracker</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Guide</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary/20 pt-8">
            <p className="text-center text-sm">&copy; 2024 LeadWise Foundation. Free learning for everyone.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
