import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Layout, FileText, PenTool } from "lucide-react";
import { templates, ResumeEditorView, CoverLetterEditorView } from "./Editor";

// =======================
// PAGE COMPONENT
// =======================

export default function IndexPage() {
  // State for navigation
  const [currentView, setCurrentView] = useState<"templates" | "resume" | "cover-letter">("templates");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0].id);

  // Helmet for meta description
  // Place at the top of the returned JSX
  return (
    <>
      <Helmet>
        <title>LeadWise Resume Builder | Free ATS-Friendly Resume Maker</title>
        <meta name="description" content="Create professional, ATS-friendly resumes and cover letters for free. LeadWise empowers women and marginalized voices in STEM with tools to build leadership careers." />
        <meta name="keywords" content="resume builder, free resume maker, cover letter builder, ATS friendly resume, women in STEM, leadership resume, diversity in tech" />
        <link rel="canonical" href="https://services.letsleadwise.org/" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://services.letsleadwise.org/" />
        <meta property="og:title" content="LeadWise Resume Builder | Free ATS-Friendly Resume Maker" />
        <meta property="og:description" content="Free resume and cover letter builder designed to empower marginalized voices in STEM. Build your future today." />
        <meta property="og:image" content="https://services.letsleadwise.org/leadwise-logo.svg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://services.letsleadwise.org/" />
        <meta property="twitter:title" content="LeadWise Resume Builder | Free ATS-Friendly Resume Maker" />
        <meta property="twitter:description" content="Create professional, ATS-friendly resumes and cover letters for free. Join the movement for equity and impact." />
        <meta property="twitter:image" content="https://services.letsleadwise.org/leadwise-logo.svg" />

        {/* Structured Data (JSON-LD) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "LeadWise Resume Builder",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Any",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "description": "LeadWise's free resume and cover letter builder empowers women and marginalized voices in STEM and leadership."
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      {currentView === "templates" && (
        <section className="relative min-h-[60vh] flex flex-col items-center justify-center bg-[#232136] text-white text-center px-4 py-32">
          <div className="max-w-3xl mx-auto z-10">
            <img src="/leadwise-logo.svg" alt="LeadWise Logo" className="mx-auto mb-6 h-16 w-16 bg-white/10 rounded-full p-2" />
            <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
             Bridging the Gap <span className="text-[#fac0ab]">Between</span>.<br />
              Potential & <span className="text-[#fac0ab]">Opportunity</span>.
            </h1>
            <p className="text-lg sm:text-2xl mb-10 text-indigo-100 font-light">
             As a proud Google Cloud & Workspace Partner, LeadWise is dedicated to equipping individuals with the technical skills and career confidence needed to overcome challenges and confront inequities <br />
              Our programs focus on providing the essential skills needed in today’s job market, fostering both personal and professional growth.  
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="bg-[#fac0ab] hover:bg-opacity-90 text-[#232136] font-bold px-8 py-3 rounded shadow-lg transition text-lg flex items-center justify-center gap-2"
                onClick={() => setCurrentView("resume")}
              >
                <PenTool size={20} /> Build Resume
              </button>
              <button
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3 rounded shadow-lg transition text-lg flex items-center justify-center gap-2"
                onClick={() => setCurrentView("cover-letter")}
              >
                <FileText size={20} /> Cover Letter
              </button>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-900 opacity-80 pointer-events-none"></div>
        </section>
      )}

      {/* Template Selection */}
      {currentView === "templates" && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-[#232136] mb-8 text-center">Take advantage of our free ATS resume and cover letter builders to equip yourself with the tools necessary for career success.</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`rounded-xl border-2 ${selectedTemplateId === template.id ? "border-[#232136] shadow-xl" : "border-gray-200"} bg-gray-50 p-6 flex flex-col items-center text-center transition`}
                  onClick={() => setSelectedTemplateId(template.id)}
                  style={{ cursor: "pointer" }}
                >
                  <div className={`w-12 h-12 rounded-full mb-4 flex items-center justify-center ${template.color}`}>
                    <Layout size={28} className="text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{template.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                  <button
                    className={`mt-auto px-6 py-2 rounded font-bold ${
                      selectedTemplateId === template.id ?
                        "bg-[#232136] text-white" :
                        "bg-white text-[#232136] border border-[#232136]"
                    }`}
                    onClick={() => setCurrentView("resume")}
                  >
                    Use Template
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Resume Editor */}
      {currentView === "resume" && (
        <ResumeEditorView
          templateId={selectedTemplateId}
          onBack={() => setCurrentView("templates")}
        />
      )}

      {/* Cover Letter Editor */}
      {currentView === "cover-letter" && (
        <CoverLetterEditorView
          templateId={selectedTemplateId}
          onBack={() => setCurrentView("templates")}
        />
      )}

      {/* FAQ Section */}
      {currentView === "templates" && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-[#232136] mb-12 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: "Can I get involved other than donating?",
                  a: "Yes! We welcome partners and mentors. You can join our community to connect with change-makers or subscribe to our newsletter for leadership insights.",
                },
                {
                  q: "Who are the programs designed for?",
                  a: "Our programs target a broad range of professionals, specifically focusing on women and marginalized voices seeking to advance their trajectories in STEM and corporate leadership.",
                },
                {
                  q: 'What is the "Leaky Pipeline"?',
                  a: "We address systemic barriers that cause talented individuals from marginalized backgrounds to drop out of STEM and leadership paths before reaching their full potential.",
                },
                {
                  q: "Do you offer customized training for organizations?",
                  a: "Yes. We partner with organizations to address glass ceilings through tailored workshops and consultancy.",
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-shadow duration-200"
                >
                <h3 className="text-lg font-bold text-[#232136] mb-3">{faq.q}</h3>
                  <p className="text-gray-700">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Impact Section */}
      {currentView === "templates" && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white" id="impact">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-[#232136] mb-6">Empower Your Career Journey</h2>
            <p className="text-xl text-gray-700 mb-8">
              Free ATS Resume Builder: Create a professional resume that is optimized for Applicant Tracking Systems (ATS). This tool ensures your resume is formatted correctly and highlights your skills and experiences effectively, increasing your chances of catching the attention of employers.
            </p>
            <p className="text-gray-600">
              Free Cover Letter Builder: Complement your resume with a powerful cover letter. Our builder guides you in crafting a personalized cover letter that showcases your qualifications and enthusiasm for the position you are applying for.
            </p>
          </div>
        </section>
      )}

      {/* Footer */}
      {currentView === "templates" && (
        <footer className="bg-[#232136] text-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <img
                    src="/leadwise-logo.svg"
                    alt="LeadWise Foundation"
                    className="h-8 w-auto object-contain bg-white/10 rounded p-1"
                  />
                  <span className="font-bold text-white">LeadWise</span>
                </div>
                <p className="text-sm">
                  Fostering Both Personal and Professional Growth.
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="hover:text-white transition">
                      Programs
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition">
                      Leadership
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition">
                      Advocacy
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Resources</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="hover:text-white transition">
                      Impact
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition">
                      Events
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition">
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="hover:text-white transition">
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition">
                      Terms
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-primary/20 pt-8">
              <p className="text-center text-sm">&copy; 2026 LeadWise Foundation.</p>
            </div>
          </div>
        </footer>
      )}
    </>
  );
}
