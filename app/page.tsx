'use client';
import React, { useState } from "react";
import { Layout, FileText, PenTool } from "lucide-react";
import Link from "next/link";
import { templates, Template } from "./components/Editor";

// =======================
// PAGE COMPONENT
// =======================

export default function IndexPage() {
  const [previewModalTemplate, setPreviewModalTemplate] = useState<Template | null>(null);

  const ModalComponent = previewModalTemplate?.resumeComponent;

  return (
    <>
      {/* Site-wide Navigation */}
      <nav className="bg-[#232136] sticky top-0 z-40 shadow-sm text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/leadwise-logo.svg" alt="LeadWise" className="w-10 h-10 rounded-lg" />
            <span className="font-bold text-xl">LeadWise Foundation</span>
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="text-white font-semibold transition">Home</Link>
            <Link href="#templates" className="text-gray-300 hover:text-white transition">Templates</Link>
            <a href="https://services.letsleadwise.org/courses" className="text-gray-300 hover:text-white transition">Courses</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center bg-[#232136] text-white text-center px-4 py-32">
        <div className="max-w-3xl mx-auto z-10">
          <img src="/leadwise-logo.svg" alt="LeadWise Logo" className="mx-auto mb-6 h-16 w-16 bg-white/10 rounded-full p-2" />
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
           Bridging the Gap <span className="text-[#fac0ab]">Between</span><br />
            Potential & <span className="text-[#fac0ab]">Opportunity</span>.
          </h1>
          <p className="text-lg sm:text-2xl mb-10 text-indigo-100 font-light">
           As a proud Google Cloud & Workspace Partner, LeadWise is dedicated to equipping individuals with the technical skills and career confidence needed to overcome challenges and confront inequities <br />
            Our programs focus on providing the essential skills needed in today’s job market, fostering both personal and professional growth.  
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/resume"
              className="bg-[#fac0ab] hover:bg-opacity-90 text-[#232136] font-bold px-8 py-3 rounded shadow-lg transition text-lg flex items-center justify-center gap-2"
            >
              <PenTool size={20} /> Build Resume
            </Link>
            <Link
              href="/cover-letter"
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3 rounded shadow-lg transition text-lg flex items-center justify-center gap-2"
            >
              <FileText size={20} /> Cover Letter
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-900 opacity-80 pointer-events-none"></div>
      </section>

      {/* Template Selection */}
      <section id="templates" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-[#232136] mb-8 text-center">Take advantage of our free ATS resume and cover letter builders to equip yourself with the tools necessary for career success.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template) => (
              <div
                key={template.id}
                className="rounded-xl border-2 border-gray-200 bg-gray-50 p-6 flex flex-col items-center text-center transition hover:border-[#fac0ab] hover:shadow-lg"
              >
                <div className={`w-12 h-12 rounded-full mb-4 flex items-center justify-center ${template.color}`}>
                  <Layout size={28} className="text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">{template.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                
                <div className="flex gap-3 w-full mt-auto">
                  <button onClick={() => setPreviewModalTemplate(template)} className="flex-1 border border-gray-300 hover:border-[#4b486c] hover:text-[#232136] text-gray-600 font-semibold py-2 px-4 rounded-lg transition-colors text-sm">Preview</button>
                  <Link href={`/resume?template=${template.id}`} className="flex-1 bg-[#232136] hover:bg-[#3a3758] text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center">Use</Link>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 w-full">
                   <Link href={`/resume?template=${template.id}`} className="text-xs text-center text-gray-500 hover:text-[#232136] hover:underline">Resume</Link>
                   <Link href={`/cover-letter?template=${template.id}`} className="text-xs text-center text-gray-500 hover:text-[#232136] hover:underline">Cover Letter</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
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
              <h3 className="font-bold text-lg mb-3">{faq.q}</h3>
                <p className="text-gray-700">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
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

      {/* Footer */}
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
                <li><a href="#" className="hover:text-white transition">Programs</a></li>
                <li><a href="#" className="hover:text-white transition">Leadership</a></li>
                <li><a href="#" className="hover:text-white transition">Advocacy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Impact</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Events</a></li>
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
            <p className="text-center text-sm">&copy; 2026 LeadWise Foundation.</p>
          </div>
        </div>
      </footer>

      {previewModalTemplate && ModalComponent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                 <div>
                    <h2 className="text-xl font-bold">{previewModalTemplate.name}</h2>
                    <p className="text-sm text-gray-500">{previewModalTemplate.description}</p>
                 </div>
                 <button onClick={() => setPreviewModalTemplate(null)} className="p-2 hover:bg-gray-100 rounded-full">✕</button>
              </div>
              <div className="flex-1 overflow-auto bg-gray-100 p-8">
                 <div className="mx-auto shadow-lg bg-white max-w-[210mm] min-h-[297mm]">
                    <ModalComponent data={{
                      personalInfo: { fullName: "Alex Morgan", email: "alex@example.com", phone: "(555) 123-4567", location: "New York, NY", linkedIn: "linkedin.com/in/alex" },
                      professionalSummary: "Experienced professional with a demonstrated history of working in the industry.",
                      experience: [{ id: "1", company: "Tech Solutions Inc.", position: "Senior Manager", startDate: "2020", endDate: "Present", currentlyWorking: true, description: "Leading a team of 15 developers." }],
                      education: [{ id: "1", school: "State University", degree: "Bachelor of Science", field: "Computer Science", graduationDate: "2018" }],
                      skills: [{id:"1", name:"Leadership"}, {id:"2", name:"Project Management"}],
                      template: previewModalTemplate.id,
                      settings: { themeColor: 'blue', font: 'sans' }
                    }} />
                 </div>
              </div>
              <div className="p-4 border-t flex justify-end gap-3 bg-white">
                 <button onClick={() => setPreviewModalTemplate(null)} className="px-6 py-2 border rounded-lg hover:bg-gray-50">Close</button>
                 <Link href={`/resume?template=${previewModalTemplate.id}`} className="px-6 py-2 bg-[#232136] text-white rounded-lg hover:bg-[#3a3758] flex items-center">Use This Template</Link>
              </div>
           </div>
        </div>
      )}
    </>
  );
}
