import { Link } from "react-router-dom";
import { ModernBlueTemplate, ElegantClassicTemplate, CreativeVibrantTemplate, MinimalCleanTemplate, ExecutiveBoldTemplate, AcademicProfessionalTemplate } from "@/components/ResumeTemplates";

const templatePreviews = [
  { id: "modern-blue", name: "Modern Blue", component: ModernBlueTemplate },
  { id: "elegant-classic", name: "Elegant Classic", component: ElegantClassicTemplate },
  { id: "creative-vibrant", name: "Creative Vibrant", component: CreativeVibrantTemplate },
  { id: "minimal-clean", name: "Minimal Clean", component: MinimalCleanTemplate },
  { id: "executive-bold", name: "Executive Bold", component: ExecutiveBoldTemplate },
  { id: "academic-professional", name: "Academic Professional", component: AcademicProfessionalTemplate },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">ResumeCraft</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="/" className="text-blue-600 font-semibold">Home</a>
            <Link to="/templates" className="text-gray-700 hover:text-gray-900 transition">Templates</Link>
            <Link to="/courses" className="text-gray-700 hover:text-gray-900 transition">Courses</Link>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200">
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Professional Resume Templates<br />
              <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                That Get You Hired
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Create a stunning resume and matching cover letter in minutes. Choose from 6 professionally designed templates, each with comprehensive HTML and CSS customization options.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link 
                to="/templates"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
              >
                Explore Templates
              </Link>
              <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-3 px-8 rounded-lg transition-colors duration-200 text-lg">
                Learn More
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-8 py-12 border-y border-gray-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">6</div>
              <p className="text-gray-600">Professional Templates</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
              <p className="text-gray-600">Resume + Cover Letter Pairs</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
              <p className="text-gray-600">Customizable & ATS-Optimized</p>
            </div>
          </div>
        </div>
      </section>

      {/* Template Grid Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Perfect Template
            </h2>
            <p className="text-xl text-gray-600">
              Each template is thoughtfully designed for different industries and career levels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                name: "Modern Blue",
                description: "Clean and professional with bold accents. Perfect for tech and creative fields.",
                icon: "🎨"
              },
              {
                name: "Elegant Classic",
                description: "Timeless design with serif typography. Ideal for executives and traditional industries.",
                icon: "👔"
              },
              {
                name: "Creative Vibrant",
                description: "Bold and colorful design. Great for designers and marketing professionals.",
                icon: "✨"
              },
              {
                name: "Minimal Clean",
                description: "Ultra-minimal design with maximum focus. Perfect for engineers and analysts.",
                icon: "📊"
              },
              {
                name: "Executive Bold",
                description: "Strong visual hierarchy with sidebar. Ideal for sales and business roles.",
                icon: "💼"
              },
              {
                name: "Academic Professional",
                description: "Structured layout for credentials. Perfect for scholars and researchers.",
                icon: "🎓"
              },
            ].map((template, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-200 hover:border-blue-400"
              >
                <div className="text-4xl mb-4">{template.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {template.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {template.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link 
              to="/templates"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 inline-block"
            >
              Browse All Templates
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Everything You Need to Succeed
              </h2>
              <ul className="space-y-4">
                {[
                  "Professional designs crafted by industry experts",
                  "Complete HTML and CSS customization",
                  "Matching cover letter templates included",
                  "ATS-optimized layouts that get past scanners",
                  "Print-ready formats for professional printing",
                  "Download as PDF or HTML for easy sharing",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mt-1">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <span className="text-gray-700 text-lg">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-100 rounded-xl p-8 text-center">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-gray-600">
                Full HTML and CSS source code included with every template for complete customization
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Full Template Previews */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
            Live Template Previews
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            See exactly how each template looks with sample content
          </p>

          <div className="space-y-12">
            {templatePreviews.map((template) => {
              const Component = template.component;
              return (
                <div key={template.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                  <div className="bg-gray-100 p-4 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900">{template.name}</h3>
                  </div>
                  <div className="bg-white overflow-x-auto" style={{ maxHeight: "600px", overflow: "auto" }}>
                    <div className="scale-50 origin-top-left" style={{ transformOrigin: "top left", minWidth: "200%" }}>
                      <Component data={undefined} />
                    </div>
                  </div>
                  <div className="bg-gray-50 border-t border-gray-200 p-4 flex gap-3">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                      Use Template
                    </button>
                    <button className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-900 font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                      Download
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Create Your Perfect Resume?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Start with one of our templates and customize it to match your unique experience and style.
          </p>
          <Link 
            to="/templates"
            className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-colors duration-200 inline-block text-lg"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "Can I customize the templates?",
                a: "Yes! All templates include full HTML and CSS source code. You can customize colors, fonts, spacing, and layout to match your preferences."
              },
              {
                q: "Are these ATS-optimized?",
                a: "Absolutely. All templates are formatted to pass through Applicant Tracking Systems while maintaining professional appearance."
              },
              {
                q: "Do I get both resume and cover letter?",
                a: "Yes, each template includes both a resume design and a matching cover letter template for a cohesive application package."
              },
              {
                q: "Can I download the templates as PDF?",
                a: "Yes, you can download your completed resume and cover letter as PDF files for easy sharing and printing."
              },
            ].map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.q}</h3>
                <p className="text-gray-700">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">R</span>
                </div>
                <span className="font-bold text-white">ResumeCraft</span>
              </div>
              <p className="text-sm">Professional resume templates to help you land your dream job.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Templates</a></li>
                <li><a href="#" className="hover:text-white transition">Editor</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Resume Guide</a></li>
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
          <div className="border-t border-gray-800 pt-8">
            <p className="text-center text-sm">&copy; 2024 ResumeCraft. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
