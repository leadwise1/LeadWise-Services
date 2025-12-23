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
<nav className="bg-primary sticky top-0 z-40 shadow-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <img
        src="https://cdn.builder.io/api/v1/image/assets%2Ff72e554e0fa6467ca673bcaff4e3bb43%2F879d9ef74e9f42bf8cebbfd985bb75c9?format=webp&width=200"
        alt="LeadWise Foundation"
        className="h-10 w-auto"
      />
      <span className="font-bold text-white text-lg">LeadWise Foundation</span>
    </div>
    <div className="flex items-center gap-8">
      <a href="/" className="text-white font-semibold">Home</a>
      <Link to="/templates" className="text-gray-100 hover:text-white transition">Templates</Link>
      <Link to="/courses" className="text-gray-100 hover:text-white transition">Courses</Link>
      <button className="bg-accent hover:bg-yellow-200 text-primary font-semibold py-2 px-6 rounded-lg transition-colors duration-200">
        Sign In
      </button>
    </div>
  </div>
</nav>
    
    {/* Hero Section */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
                Land Your Dream Job With The Right Resume
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Choose from professionally designed resume templates crafted by industry experts. Create a stunning, ATS-optimized resume in minutes with complete HTML and CSS customization.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link
                  to="/editor"
                  className="bg-primary hover:bg-opacity-90 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
                >
                  Start Editing
                </Link>
                <Link
                  to="/templates"
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
                >
                  Browse Templates
                </Link>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-12 text-white flex flex-col justify-center items-center">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-center text-lg font-semibold">Professional Templates Ready to Use</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center text-white">
              <div className="text-4xl font-bold mb-2">6</div>
              <p className="text-sm text-gray-100">Professional Templates</p>
            </div>
            <div className="text-center text-white">
              <div className="text-4xl font-bold mb-2">12</div>
              <p className="text-sm text-gray-100">Resume + Cover Letter Pairs</p>
            </div>
            <div className="text-center text-white">
              <div className="text-4xl font-bold mb-2">100%</div>
              <p className="text-sm text-gray-100">Customizable & ATS-Optimized</p>
            </div>
            <div className="text-center text-white">
              <div className="text-4xl font-bold mb-2">0%</div>
              <p className="text-sm text-gray-100">Cost • Free Forever</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">
                Why LeadWise?
            </h2>
            <p className="text-xl text-gray-700">
              How We Ignite Leadership & Drive Systemic Change
            </p>
          </div>
          

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 border-l-4 border-accent hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-bold text-primary mb-3">Professional Design</h3>
              <p className="text-gray-700">Crafted by industry experts with modern, clean aesthetics that impress recruiters.</p>
            </div>
            <div className="bg-white rounded-xl p-8 border-l-4 border-accent hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-bold text-primary mb-3">Fully Customizable</h3>
              <p className="text-gray-700">Complete HTML and CSS source code included. Customize colors, fonts, and layouts to match your style.</p>
            </div>
            <div className="bg-white rounded-xl p-8 border-l-4 border-accent hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-bold text-primary mb-3">ATS-Optimized</h3>
              <p className="text-gray-700">Pass through Applicant Tracking Systems while maintaining a professional, eye-catching design.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-primary mb-12 text-center">
            Everything Included
          </h2>
          <div className="space-y-4">
            {[
              "6 professionally designed resume templates",
              "Matching cover letter designs for each template",
              "Complete HTML and CSS source code",
              "Print-ready formats for professional printing",
              "ATS-optimized layouts that get past scanners",
              "Download as PDF or HTML for easy sharing",
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-accent/10 transition-colors duration-200">
                <div className="flex-shrink-0 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-primary text-sm font-bold">✓</span>
                </div>
                <span className="text-gray-900 text-lg">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Template Grid Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">
              Choose Your Perfect Template
            </h2>
            <p className="text-xl text-gray-700">
              Each template is thoughtfully designed for different industries and career levels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                name: "Modern Blue",
                description: "Clean and professional with bold accents. Perfect for tech and creative fields.",
              },
              {
                name: "Elegant Classic",
                description: "Timeless design with serif typography. Ideal for executives and traditional industries.",
              },
              {
                name: "Creative Vibrant",
                description: "Bold and colorful design. Great for designers and marketing professionals.",
              },
              {
                name: "Minimal Clean",
                description: "Ultra-minimal design with maximum focus. Perfect for engineers and analysts.",
               },
              {
                name: "Executive Bold",
                description: "Strong visual hierarchy with sidebar. Ideal for sales and business roles.",
              },
              {
                name: "Academic Professional",
                description: "Structured layout for credentials. Perfect for scholars and researchers.",
              },
            ].map((template, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-accent"
              >
                <div className="text-4xl mb-4">{template.icon}</div>
                <h3 className="text-xl font-bold text-primary mb-2">
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
              className="bg-primary hover:bg-opacity-90 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 inline-block text-lg"
            >
              Browse All Templates
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Accelerate Your Job Search
          </h2>
          <p className="text-xl opacity-95 mb-8">
            Stunning resume template + free skill-building courses. Everything you need to land your dream job.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link 
              to="/templates"
              className="bg-accent text-primary hover:bg-yellow-200 font-bold py-3 px-8 rounded-lg transition-colors duration-200 inline-block text-lg"
            >
              Get Started Now
            </Link>
            <Link 
              to="/courses"
              className="border-2 border-accent text-accent hover:bg-accent/10 font-bold py-3 px-8 rounded-lg transition-colors duration-200 inline-block text-lg"
            >
              View Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Live Template Previews */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-primary mb-4 text-center">
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
                  <div className="bg-primary text-white p-4 border-b border-primary/20">
                    <h3 className="text-xl font-bold">{template.name}</h3>
                  </div>
                  <div className="bg-white overflow-x-auto" style={{ maxHeight: "600px", overflow: "auto" }}>
                    <div className="scale-50 origin-top-left" style={{ transformOrigin: "top left", minWidth: "200%" }}>
                      <Component data={undefined} />
                    </div>
                  </div>
                  <div className="bg-gray-50 border-t border-gray-200 p-4 flex gap-3">
                    <button className="flex-1 bg-primary hover:bg-opacity-90 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                      Use Template
                    </button>
                    <button className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                      Download
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-primary mb-12 text-center">
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
                <h3 className="text-lg font-bold text-primary mb-3">{faq.q}</h3>
                <p className="text-gray-700">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white" id="impact">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-primary mb-6">Our Impact</h2>
          <p className="text-xl text-gray-700 mb-8">
            Education Gives You A Voice. Knowledge Gives You Power.
          </p>
          <p className="text-gray-600">
            We're building a movement of leaders who understand that systemic
            change starts with individual empowerment. By investing in people,
            we're transforming industries and creating pathways to success for
            those historically left behind.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Ff72e554e0fa6467ca673bcaff4e3bb43%2F879d9ef74e9f42bf8cebbfd985bb75c9?format=webp&width=100"
                  alt="LeadWise Foundation"
                  className="h-8 w-auto"
                />
                <span className="font-bold text-white">LeadWise</span>
              </div>
              <p className="text-sm">
                Education Gives You A Voice. Knowledge Gives You Power.
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
<p className="text-center text-sm">&copy; 2025 LeadWise Foundation. We don't just talk about change; we create it.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
