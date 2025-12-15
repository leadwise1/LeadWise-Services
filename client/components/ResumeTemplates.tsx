import React from 'react';

// Template 1: Modern Blue
export const ModernBlueTemplate: React.FC<{ data?: any }> = ({ data }) => (
  <div className="bg-white min-h-screen p-12 font-sans">
    <div className="max-w-4xl mx-auto">
      <div className="border-b-4 border-blue-600 pb-6 mb-8">
        <h1 className="text-4xl font-bold text-gray-900">John Anderson</h1>
        <p className="text-lg text-blue-600 font-semibold mt-2">Senior Product Designer</p>
        <div className="flex gap-6 mt-4 text-sm text-gray-600">
          <span>📧 john.anderson@email.com</span>
          <span>📱 (555) 123-4567</span>
          <span>📍 San Francisco, CA</span>
          <span>🔗 linkedin.com/in/johnanderson</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">PROFESSIONAL SUMMARY</h2>
            <p className="text-gray-700 leading-relaxed">Innovative product designer with 8+ years of experience creating user-centered digital solutions. Proven track record of leading design teams and delivering products that increase user engagement by 40%.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">EXPERIENCE</h2>
            <div className="mb-6">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-lg font-bold text-gray-900">Senior Product Designer</h3>
                <span className="text-sm text-gray-600">2020 - Present</span>
              </div>
              <p className="text-blue-600 font-semibold mb-2">Tech Innovation Corp</p>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Led design of flagship mobile app used by 2M+ users</li>
                <li>• Established design system increasing team productivity by 35%</li>
                <li>• Mentored team of 5 junior designers</li>
              </ul>
            </div>
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-lg font-bold text-gray-900">Product Designer</h3>
                <span className="text-sm text-gray-600">2018 - 2020</span>
              </div>
              <p className="text-blue-600 font-semibold mb-2">Digital Solutions Inc</p>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Designed and prototyped user interfaces for 15+ products</li>
                <li>• Conducted user research sessions and usability testing</li>
              </ul>
            </div>
          </section>
        </div>

        <div>
          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3 pb-2 border-b-2 border-blue-600">SKILLS</h2>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-gray-900 text-sm mb-1">Design Tools</p>
                <p className="text-gray-700 text-sm">Figma, Adobe XD, Sketch</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm mb-1">Technical</p>
                <p className="text-gray-700 text-sm">HTML, CSS, React basics</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm mb-1">Methods</p>
                <p className="text-gray-700 text-sm">UX Research, Wireframing, Prototyping</p>
              </div>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3 pb-2 border-b-2 border-blue-600">EDUCATION</h2>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Bachelor of Fine Arts</p>
              <p className="text-gray-700 text-sm">University of Design</p>
              <p className="text-gray-600 text-sm">Graduated 2015</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3 pb-2 border-b-2 border-blue-600">AWARDS</h2>
            <ul className="text-gray-700 text-sm space-y-1">
              <li>• Design Excellence Award 2023</li>
              <li>• Innovation Recognition 2022</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  </div>
);

// Template 2: Elegant Classic
export const ElegantClassicTemplate: React.FC<{ data?: any }> = ({ data }) => (
  <div className="bg-white min-h-screen p-12 font-serif">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8 pb-6 border-b-2 border-gray-800">
        <h1 className="text-5xl font-bold text-gray-900">Margaret Elizabeth Chen</h1>
        <p className="text-xl text-gray-700 mt-3 tracking-wide">EXECUTIVE CONSULTANT</p>
        <div className="flex justify-center gap-8 mt-4 text-sm text-gray-600">
          <span>margaret@email.com</span>
          <span>•</span>
          <span>(555) 987-6543</span>
          <span>•</span>
          <span>New York, NY</span>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3 tracking-widest">PROFESSIONAL PROFILE</h2>
        <p className="text-gray-700 leading-relaxed">Strategic executive with 15 years of experience in organizational transformation and business development. Demonstrated expertise in driving revenue growth, building high-performing teams, and implementing operational excellence initiatives across Fortune 500 companies.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4 tracking-widest">CAREER HISTORY</h2>
        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <h3 className="text-gray-900 font-bold">Chief Operating Officer</h3>
            <span className="text-gray-600">2021 – Present</span>
          </div>
          <p className="text-gray-700 italic mb-2">Global Ventures Partners</p>
          <ul className="text-gray-700 space-y-1 text-sm">
            <li>Oversaw operations resulting in 45% revenue growth</li>
            <li>Led organizational restructuring improving efficiency by 30%</li>
            <li>Established strategic partnerships with industry leaders</li>
          </ul>
        </div>

        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <h3 className="text-gray-900 font-bold">Vice President, Business Development</h3>
            <span className="text-gray-600">2016 – 2021</span>
          </div>
          <p className="text-gray-700 italic mb-2">Enterprise Solutions Group</p>
          <ul className="text-gray-700 space-y-1 text-sm">
            <li>Developed and executed market expansion strategy</li>
            <li>Managed portfolio of $50M+ in client relationships</li>
          </ul>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-8">
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3 tracking-widest">EDUCATION</h2>
          <div className="mb-4">
            <p className="font-bold text-gray-900">Master of Business Administration</p>
            <p className="text-gray-700">Harvard Business School, 2008</p>
          </div>
          <div>
            <p className="font-bold text-gray-900">Bachelor of Arts, Economics</p>
            <p className="text-gray-700">Stanford University, 2006</p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3 tracking-widest">CORE COMPETENCIES</h2>
          <ul className="text-gray-700 text-sm space-y-1">
            <li>Strategic Planning & Execution</li>
            <li>Change Management</li>
            <li>Financial Analysis & Management</li>
            <li>Team Leadership & Development</li>
            <li>Market Analysis & Positioning</li>
          </ul>
        </section>
      </div>
    </div>
  </div>
);

// Template 3: Creative Vibrant
export const CreativeVibrantTemplate: React.FC<{ data?: any }> = ({ data }) => (
  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen p-8 font-sans">
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-12 text-white">
          <h1 className="text-5xl font-bold mb-2">Alex Rivera</h1>
          <p className="text-2xl opacity-90">Creative Director & Brand Strategist</p>
          <div className="flex gap-4 mt-6 text-sm opacity-90">
            <span>📧 alex.rivera@email.com</span>
            <span>📱 (555) 246-8135</span>
            <span>📍 Austin, TX</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8 p-12">
          <div className="col-span-2">
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-indigo-600 mb-4">ABOUT ME</h2>
              <p className="text-gray-700 leading-relaxed">Visionary creative director with 10+ years of experience transforming brands through innovative design and strategic storytelling. Passionate about creating memorable experiences that resonate with audiences and drive business impact.</p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-indigo-600 mb-6">FEATURED PROJECTS</h2>
              <div className="space-y-6">
                <div className="border-l-4 border-indigo-600 pl-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Global Brand Relaunch</h3>
                  <p className="text-indigo-600 font-semibold text-sm mb-2">TechCorp International | 2023</p>
                  <p className="text-gray-700 text-sm">Led complete brand overhaul including logo redesign, visual identity, and marketing collateral. Resulted in 50% increase in brand recognition.</p>
                </div>
                <div className="border-l-4 border-purple-600 pl-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Digital Experience Design</h3>
                  <p className="text-purple-600 font-semibold text-sm mb-2">Creative Studios | 2022</p>
                  <p className="text-gray-700 text-sm">Designed immersive digital experiences for 5 major campaigns, increasing user engagement by 65%.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-indigo-600 mb-4">EXPERIENCE</h2>
              <div className="mb-6">
                <div className="flex justify-between mb-1">
                  <h3 className="font-bold text-gray-900">Creative Director</h3>
                  <span className="text-gray-600">2020 - Present</span>
                </div>
                <p className="text-indigo-600 font-semibold text-sm mb-2">Creative Studios</p>
                <p className="text-gray-700 text-sm">Lead creative strategy and execution for diverse client portfolio</p>
              </div>
            </section>
          </div>

          <div>
            <section className="mb-8">
              <h2 className="text-xl font-bold text-indigo-600 mb-4">EXPERTISE</h2>
              <div className="space-y-3">
                <div className="bg-indigo-100 rounded-lg p-3">
                  <p className="font-semibold text-gray-900 text-sm">Brand Strategy</p>
                  <p className="text-xs text-gray-700 mt-1">Logo design, identity systems, brand guidelines</p>
                </div>
                <div className="bg-purple-100 rounded-lg p-3">
                  <p className="font-semibold text-gray-900 text-sm">Digital Design</p>
                  <p className="text-xs text-gray-700 mt-1">UI/UX, web design, interactive experiences</p>
                </div>
                <div className="bg-indigo-100 rounded-lg p-3">
                  <p className="font-semibold text-gray-900 text-sm">Creative Direction</p>
                  <p className="text-xs text-gray-700 mt-1">Art direction, visual storytelling, campaigns</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-indigo-600 mb-4">AWARDS</h2>
              <ul className="text-gray-700 text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-1">★</span>
                  <span>Creative Excellence Award 2023</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-1">★</span>
                  <span>Best Brand Campaign 2022</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-indigo-600 mb-4">EDUCATION</h2>
              <p className="font-semibold text-gray-900 text-sm">BFA in Graphic Design</p>
              <p className="text-gray-700 text-sm">Rhode Island School of Design</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Template 4: Minimal Clean
export const MinimalCleanTemplate: React.FC<{ data?: any }> = ({ data }) => (
  <div className="bg-white min-h-screen p-16 font-sans">
    <div className="max-w-3xl mx-auto">
      <div className="mb-12">
        <h1 className="text-3xl font-light text-gray-900 tracking-tight">Sarah Mitchell</h1>
        <p className="text-gray-600 mt-1">Software Engineer</p>
        <div className="flex gap-4 mt-3 text-xs text-gray-600">
          <a href="mailto:" className="hover:text-gray-900">sarah.mitchell@email.com</a>
          <span>•</span>
          <a href="tel:" className="hover:text-gray-900">(555) 789-1234</a>
          <span>•</span>
          <span>Seattle, WA</span>
        </div>
      </div>

      <section className="mb-10">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-4">Experience</h2>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="font-semibold text-gray-900">Senior Software Engineer</h3>
              <span className="text-xs text-gray-600">2021 – Present</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">CloudTech Solutions</p>
            <p className="text-sm text-gray-700">Led development of microservices architecture serving 1M+ users. Improved system performance by 40%. Mentored team of 4 engineers.</p>
          </div>
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="font-semibold text-gray-900">Software Engineer</h3>
              <span className="text-xs text-gray-600">2018 – 2021</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Digital Systems Inc</p>
            <p className="text-sm text-gray-700">Developed full-stack applications using React and Node.js. Reduced API response time by 50%.</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-4">Skills</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-2">Languages</p>
            <p className="text-sm text-gray-700">JavaScript, TypeScript, Python, Go</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-2">Technologies</p>
            <p className="text-sm text-gray-700">React, Node.js, PostgreSQL, AWS</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-2">Tools</p>
            <p className="text-sm text-gray-700">Git, Docker, Kubernetes, CI/CD</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-2">Methodologies</p>
            <p className="text-sm text-gray-700">Agile, TDD, Code Review, System Design</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-4">Education</h2>
        <div>
          <p className="font-semibold text-gray-900 text-sm">BS Computer Science</p>
          <p className="text-sm text-gray-700">University of Washington, 2018</p>
        </div>
      </section>

      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-4">Certifications</h2>
        <p className="text-sm text-gray-700">AWS Certified Solutions Architect Associate</p>
      </section>
    </div>
  </div>
);

// Template 5: Executive Bold
export const ExecutiveBoldTemplate: React.FC<{ data?: any }> = ({ data }) => (
  <div className="bg-gray-900 min-h-screen p-12 font-sans">
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-4 gap-8">
        <div className="col-span-1 bg-blue-600 text-white p-8 rounded-lg">
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-1">David</h1>
            <p className="text-lg font-semibold opacity-90">Thompson</p>
            <p className="text-sm opacity-75 mt-4">VP Sales &<br/>Business Dev</p>
          </div>

          <section className="mb-10">
            <h3 className="text-sm font-bold uppercase mb-3 opacity-75">Contact</h3>
            <div className="text-xs space-y-2">
              <p>david.thompson@email.com</p>
              <p>(555) 321-9876</p>
              <p>Los Angeles, CA</p>
              <p>linkedin.com/in/davidthompson</p>
            </div>
          </section>

          <section className="mb-10">
            <h3 className="text-sm font-bold uppercase mb-3 opacity-75">Core Skills</h3>
            <ul className="text-xs space-y-2">
              <li>• Sales Leadership</li>
              <li>• Revenue Generation</li>
              <li>• Strategic Partnerships</li>
              <li>• Team Management</li>
              <li>• Market Expansion</li>
              <li>• Account Management</li>
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-bold uppercase mb-3 opacity-75">Languages</h3>
            <p className="text-xs">English, Spanish</p>
          </section>
        </div>

        <div className="col-span-3 bg-white text-gray-900 p-8 rounded-lg">
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 pb-3 border-b-2 border-blue-600">PROFESSIONAL SUMMARY</h2>
            <p className="text-gray-700 leading-relaxed">Dynamic sales executive with 12+ years driving revenue growth and market expansion. Proven ability to build and lead high-performing sales teams, establish strategic partnerships, and exceed sales targets consistently. Track record of increasing company revenue by 60%+ in competitive markets.</p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 pb-3 border-b-2 border-blue-600">CAREER ACHIEVEMENTS</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Vice President, Sales & Business Development</h3>
                <p className="text-blue-600 font-semibold text-sm">Global Enterprise Solutions | 2019 – Present</p>
                <ul className="text-sm text-gray-700 mt-3 space-y-1">
                  <li>✓ Drove $75M revenue growth year-over-year</li>
                  <li>✓ Established partnerships with 10 Fortune 500 companies</li>
                  <li>✓ Built and led sales team of 25 professionals</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Regional Sales Director</h3>
                <p className="text-blue-600 font-semibold text-sm">Premium Goods Corp | 2015 – 2019</p>
                <ul className="text-sm text-gray-700 mt-3 space-y-1">
                  <li>✓ Exceeded quarterly targets by average 125%</li>
                  <li>✓ Grew regional revenue by 80% over 4 years</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 pb-3 border-b-2 border-blue-600">EDUCATION</h2>
            <div className="flex justify-between items-baseline mb-3">
              <div>
                <p className="font-bold">Master of Business Administration</p>
                <p className="text-gray-700">Yale School of Management</p>
              </div>
              <span className="text-sm text-gray-600">2010</span>
            </div>
            <div className="flex justify-between items-baseline">
              <div>
                <p className="font-bold">Bachelor of Commerce</p>
                <p className="text-gray-700">University of Michigan</p>
              </div>
              <span className="text-sm text-gray-600">2008</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
);

// Template 6: Academic Professional
export const AcademicProfessionalTemplate: React.FC<{ data?: any }> = ({ data }) => (
  <div className="bg-white min-h-screen p-10 font-serif">
    <div className="max-w-4xl mx-auto border border-gray-400">
      <div className="bg-gray-800 text-white p-8 text-center">
        <h1 className="text-4xl font-bold">Dr. Emily Watson</h1>
        <p className="text-lg mt-2 opacity-90">PhD in Environmental Science</p>
        <p className="text-sm opacity-75 mt-1">Research Scientist & Academic</p>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-3 gap-8 mb-8">
          <div>
            <p className="font-bold text-sm">Email:</p>
            <p className="text-sm text-gray-700">e.watson@university.edu</p>
          </div>
          <div>
            <p className="font-bold text-sm">Phone:</p>
            <p className="text-sm text-gray-700">(555) 654-3210</p>
          </div>
          <div>
            <p className="font-bold text-sm">Location:</p>
            <p className="text-sm text-gray-700">Cambridge, MA</p>
          </div>
        </div>

        <hr className="my-6 border-gray-400" />

        <section className="mb-8">
          <h2 className="text-lg font-bold uppercase text-gray-900 mb-4 border-b-2 border-gray-400 pb-2">ACADEMIC POSITION</h2>
          <div className="mb-5">
            <div className="flex justify-between mb-1">
              <h3 className="font-bold text-gray-900">Assistant Professor of Environmental Science</h3>
              <span className="text-sm text-gray-600">2020 – Present</span>
            </div>
            <p className="text-gray-700 text-sm mb-2">Harvard University, Department of Environmental Science</p>
            <p className="text-sm text-gray-700">Teaching courses in climate science and sustainability. Research focuses on carbon sequestration and climate adaptation strategies.</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold uppercase text-gray-900 mb-4 border-b-2 border-gray-400 pb-2">RESEARCH & PUBLICATIONS</h2>
          <div className="space-y-4">
            <div>
              <p className="font-bold text-gray-900">Lead Researcher: Climate Adaptation Initiative</p>
              <p className="text-sm text-gray-700 italic">2021 – Present</p>
              <p className="text-sm text-gray-700 mt-1">Directed research team of 8 scientists investigating climate resilience strategies. Published 12+ peer-reviewed articles in high-impact journals.</p>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Selected Publications</p>
              <ul className="text-xs text-gray-700 space-y-1 mt-2">
                <li>Watson, E. et al. (2023). "Carbon Sequestration in Managed Forests." Nature Climate Change, 13(4), 287-293.</li>
                <li>Watson, E. (2022). "Sustainable Adaptation Strategies." Journal of Environmental Science, 45(2), 156-168.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold uppercase text-gray-900 mb-4 border-b-2 border-gray-400 pb-2">EDUCATION</h2>
          <div className="space-y-3">
            <div>
              <p className="font-bold text-gray-900">PhD, Environmental Science</p>
              <p className="text-gray-700 text-sm">Stanford University, 2018</p>
            </div>
            <div>
              <p className="font-bold text-gray-900">MS, Environmental Science</p>
              <p className="text-gray-700 text-sm">University of California, Berkeley, 2015</p>
            </div>
            <div>
              <p className="font-bold text-gray-900">BS, Biology</p>
              <p className="text-gray-700 text-sm">University of Chicago, 2013</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold uppercase text-gray-900 mb-4 border-b-2 border-gray-400 pb-2">GRANTS & AWARDS</h2>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• National Science Foundation Research Grant, $450,000 (2023)</li>
            <li>• Young Scientists Award for Innovation (2022)</li>
            <li>• Teaching Excellence Award, Harvard University (2021)</li>
          </ul>
        </section>
      </div>
    </div>
  </div>
);
