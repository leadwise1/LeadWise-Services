import { Link } from "react-router-dom";

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
            <a href="#programs" className="text-gray-100 hover:text-white transition">Programs</a>
            <a href="#impact" className="text-gray-100 hover:text-white transition">Impact</a>
            <button className="bg-accent hover:bg-yellow-200 text-primary font-semibold py-2 px-6 rounded-lg transition-colors duration-200">
              Get Involved
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
                Unlock Limitless Possibilities Through Education
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                We equip individuals with the skills and confidence to confront inequities. Our evidence-driven programs bridge the gap in STEM leadership and break glass ceilings.
              </p>
              <div className="flex gap-4 flex-wrap">
                <button className="bg-primary hover:bg-opacity-90 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 text-lg">
                  Explore Programs
                </button>
                <button className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 text-lg">
                  Partner With Us
                </button>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-12 text-white flex flex-col justify-center items-center">
              <div className="text-6xl mb-4">🌟</div>
              <p className="text-center text-lg font-semibold">Building Tomorrow's Leaders Today</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center text-white">
              <div className="text-4xl font-bold mb-2">50+</div>
              <p className="text-sm text-gray-100">Leaders Trained</p>
            </div>
            <div className="text-center text-white">
              <div className="text-4xl font-bold mb-2">372</div>
              <p className="text-sm text-gray-100">Lives Directly Impacted</p>
            </div>
            <div className="text-center text-white">
              <div className="text-4xl font-bold mb-2">80%</div>
              <p className="text-sm text-gray-100">Policy Success Rate</p>
            </div>
            <div className="text-center text-white">
              <div className="text-4xl font-bold mb-2">15+</div>
              <p className="text-sm text-gray-100">Partner Organizations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why LeadWise Section */}
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
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold text-primary mb-3">Evidence-Driven Training</h3>
              <p className="text-gray-700">Comprehensive leadership development strategies designed to help you overcome challenges and enhance effectiveness.</p>
            </div>
            <div className="bg-white rounded-xl p-8 border-l-4 border-accent hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-primary mb-3">Systemic Advocacy</h3>
              <p className="text-gray-700">Real change requires structural improvements. We remove barriers that marginalized people face in corporate settings.</p>
            </div>
            <div className="bg-white rounded-xl p-8 border-l-4 border-accent hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="text-xl font-bold text-primary mb-3">Practical Application</h3>
              <p className="text-gray-700">We focus on real-world skills to ensure leaders are not just prepared for opportunities but equipped to create them.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-primary mb-12 text-center">
            Our Core Pillars
          </h2>
          <div className="space-y-4">
            {[
              "Leadership Development: Transform your potential with comprehensive training",
              "STEM Equity: Addressing the \"leaky pipeline\" in tech leadership",
              "Policy Advocacy: Structural improvements to remove barriers to access",
              "Career Coaching: Personalized resources to control your trajectory",
              "Mentorship: Connecting emerging talent with established leaders",
              "Community: A network of changemakers transforming industries",
            ].map((pillar, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-accent/10 transition-colors duration-200">
                <div className="flex-shrink-0 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-primary text-sm font-bold">✓</span>
                </div>
                <span className="text-gray-900 text-lg">{pillar}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">
              Our Comprehensive Services
            </h2>
            <p className="text-xl text-gray-700">
              Resources designed to empower individuals to take control of their careers and redefine success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                name: "Leadership Program",
                description: "Transform your potential with comprehensive training. Perfect for professionals navigating corporate landscapes.",
                icon: "🎨"
              },
              {
                name: "Advocacy & Policy",
                description: "Strategic work centered on increasing access. Ideal for changemakers fighting systemic barriers.",
                icon: "👔"
              },
              {
                name: "Career Coaching",
                description: "Personalized guidance to advance your trajectory. Great for professionals seeking new opportunities.",
                icon: "✨"
              },
              {
                name: "STEM Mentorship",
                description: "Addressing the \"leaky pipeline\" in tech. Perfect for emerging talent seeking industry connection.",
                icon: "📊"
              },
              {
                name: "Corporate Consulting",
                description: "Helping organizations identify glass ceilings. Ideal for companies committed to real equity.",
                icon: "💼"
              },
              {
                name: "Community Workshops",
                description: "Accessible education sessions. Perfect for those seeking the courage to confront inequities.",
                icon: "🎓"
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-accent"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-primary mb-2">
                  {service.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {service.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button className="bg-primary hover:bg-opacity-90 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 inline-block text-lg">
              View Full Curriculum
            </button>
          </div>
        </div>
      </section>

      {/* Mid-Page CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Redefine Success?
          </h2>
          <p className="text-xl opacity-95 mb-8">
            Join a community where every potential is realized and every leader possesses the ability to propel change.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="bg-accent text-primary hover:bg-yellow-200 font-bold py-3 px-8 rounded-lg transition-colors duration-200 inline-block text-lg">
              Apply for a Program
            </button>
            <button className="border-2 border-accent text-accent hover:bg-accent/10 font-bold py-3 px-8 rounded-lg transition-colors duration-200 inline-block text-lg">
              Contact Our Team
            </button>
          </div>
        </div>
      </section>

      {/* Program Pathways Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white" id="programs">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-primary mb-4 text-center">
            Pathways to Empowerment
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            See how our services apply to different stages of your journey
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Emerging Leaders", icon: "🌱" },
              { name: "STEM Professionals", icon: "👨‍💻" },
              { name: "Corporate Executives", icon: "👔" },
              { name: "Policy Makers", icon: "📋" },
              { name: "Career Pivoters", icon: "🚀" },
              { name: "Student Advocates", icon: "🎓" },
            ].map((pathway, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 hover:border-accent"
              >
                <div className="text-5xl mb-4">{pathway.icon}</div>
                <h3 className="text-xl font-bold text-primary mb-4">
                  {pathway.name}
                </h3>
                <div className="flex gap-3">
                  <button className="flex-1 bg-primary hover:bg-opacity-90 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm">
                    View Curriculum
                  </button>
                  <button className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm">
                    Download Guide
                  </button>
                </div>
              </div>
            ))}
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
                a: "Yes! We welcome partners and mentors. You can join our community to connect with change-makers or subscribe to our newsletter for leadership insights."
              },
              {
                q: "Who are the programs designed for?",
                a: "Our programs target a broad range of professionals, specifically focusing on women and marginalized voices seeking to advance their trajectories in STEM and corporate leadership."
              },
              {
                q: "What is the \"Leaky Pipeline\"?",
                a: "We address systemic barriers that cause talented individuals from marginalized backgrounds to drop out of STEM and leadership paths before reaching their full potential."
              },
              {
                q: "Do you offer customized training for organizations?",
                a: "Yes. We partner with organizations to address glass ceilings through tailored workshops and consultancy."
              },
            ].map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-shadow duration-200">
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
          <h2 className="text-4xl font-bold text-primary mb-6">
            Our Impact
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Education Gives You A Voice. Knowledge Gives You Power.
          </p>
          <p className="text-gray-600">
            We're building a movement of leaders who understand that systemic change starts with individual empowerment. By investing in people, we're transforming industries and creating pathways to success for those historically left behind.
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
              <p className="text-sm">Education Gives You A Voice. Knowledge Gives You Power.</p>
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
            <p className="text-center text-sm">&copy; 2025 LeadWise Foundation. We don't just talk about change; we create it.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
