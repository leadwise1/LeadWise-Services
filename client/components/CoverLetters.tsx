import React from 'react';

// Modern Blue Cover Letter
export const ModernBlueCoverLetter: React.FC<{ data?: any }> = ({ data }) => (
  <div className="bg-white min-h-screen p-12 font-sans">
    <div className="max-w-3xl mx-auto">
      <div className="border-b-4 border-blue-600 pb-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">John Anderson</h1>
        <div className="flex gap-4 mt-2 text-sm text-gray-600">
          <span>(555) 123-4567</span>
          <span>john.anderson@email.com</span>
          <span>linkedin.com/in/johnanderson</span>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-sm text-gray-600 mb-6">January 15, 2024</p>
        <div className="space-y-1 text-sm text-gray-700 mb-6">
          <p>Hiring Manager</p>
          <p>Tech Innovation Corp</p>
          <p>San Francisco, CA 94102</p>
        </div>
      </div>

      <p className="mb-4 text-gray-700">Dear Hiring Manager,</p>

      <div className="space-y-4 text-gray-700 leading-relaxed mb-6">
        <p>
          I am writing to express my strong interest in the Senior Product Designer position at Tech Innovation Corp. With 8+ years of experience creating user-centered digital solutions and a proven track record of leading design teams to deliver products that increase engagement by 40%, I am confident in my ability to make significant contributions to your organization.
        </p>

        <p>
          In my current role at Tech Innovation Corp, I have had the privilege of leading the design of our flagship mobile app, which now serves over 2 million users. Beyond this achievement, I spearheaded the creation of our comprehensive design system, which has increased team productivity by 35% and established consistency across all digital touchpoints. My experience mentoring five junior designers has further developed my leadership capabilities and commitment to fostering talent within teams.
        </p>

        <p>
          What particularly excites me about this opportunity is the chance to contribute to your organization's continued innovation and growth. Your company's commitment to pushing the boundaries of product design aligns perfectly with my professional philosophy and career aspirations. I am eager to bring my expertise in UX research, wireframing, and prototyping to help drive your next generation of products.
        </p>

        <p>
          I would welcome the opportunity to discuss how my background, skills, and passion for design innovation can contribute to your team's success. Thank you for considering my application. I look forward to speaking with you soon.
        </p>
      </div>

      <p className="mb-8 text-gray-700">Sincerely,</p>

      <div className="border-t pt-4 text-gray-700">
        <p className="font-semibold">John Anderson</p>
      </div>
    </div>
  </div>
);

// Elegant Classic Cover Letter
export const ElegantClassicCoverLetter: React.FC<{ data?: any }> = ({ data }) => (
  <div className="bg-white min-h-screen p-12 font-serif">
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8 pb-6 border-b-2 border-gray-800">
        <h1 className="text-3xl font-bold text-gray-900">Margaret Elizabeth Chen</h1>
        <div className="text-sm text-gray-600 mt-2">
          margaret@email.com • (555) 987-6543 • New York, NY
        </div>
      </div>

      <div className="mb-8">
        <p className="text-gray-700 mb-6">January 15, 2024</p>
        <div className="space-y-1 text-gray-700 mb-6">
          <p>Hiring Committee</p>
          <p>Global Ventures Partners</p>
          <p>New York, NY 10001</p>
        </div>
      </div>

      <p className="mb-4 text-gray-700">Dear Members of the Hiring Committee,</p>

      <div className="space-y-4 text-gray-700 leading-relaxed mb-6">
        <p>
          I am pleased to submit my application for the Chief Operating Officer position at Global Ventures Partners. With fifteen years of strategic experience in organizational transformation and business development, I am confident that my proven track record of driving revenue growth, building high-performing teams, and implementing operational excellence initiatives will make me a valuable asset to your organization.
        </p>

        <p>
          Throughout my career, I have successfully led organizational restructuring that improved operational efficiency by 30%, while simultaneously overseeing operations that achieved 45% revenue growth. My experience managing portfolios exceeding $50M in client relationships has equipped me with a sophisticated understanding of complex business dynamics and stakeholder management at the highest levels.
        </p>

        <p>
          I am particularly drawn to this opportunity because of Global Ventures Partners' distinguished reputation for strategic excellence and transformative impact. I am excited about the prospect of bringing my strategic vision, operational expertise, and collaborative leadership style to your distinguished team.
        </p>

        <p>
          I would greatly appreciate the opportunity to discuss how my experience and vision align with your organization's strategic objectives. Thank you for your consideration.
        </p>
      </div>

      <p className="mb-8 text-gray-700">Respectfully yours,</p>

      <div className="border-t border-gray-300 pt-4 text-gray-700">
        <p>Margaret Elizabeth Chen</p>
      </div>
    </div>
  </div>
);

// Creative Vibrant Cover Letter
export const CreativeVibrantCoverLetter: React.FC<{ data?: any }> = ({ data }) => (
  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen p-8 font-sans">
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-12">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-lg mb-8 -mx-12 -mt-12 mb-8">
        <h1 className="text-3xl font-bold mb-2">Alex Rivera</h1>
        <div className="flex gap-4 text-sm opacity-90">
          <span>alex.rivera@email.com</span>
          <span>•</span>
          <span>(555) 246-8135</span>
          <span>•</span>
          <span>Austin, TX</span>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-gray-600 mb-6">January 15, 2024</p>
        <div className="space-y-1 text-gray-700 mb-6">
          <p>Hiring Team</p>
          <p>Creative Studios</p>
          <p>Austin, TX 78701</p>
        </div>
      </div>

      <p className="mb-4 text-gray-700">Hello,</p>

      <div className="space-y-4 text-gray-700 leading-relaxed mb-6">
        <p>
          I'm excited to apply for the Creative Director position at Creative Studios. With over 10 years of transforming brands through innovative design and strategic storytelling, I'm passionate about creating memorable experiences that resonate with audiences and drive measurable business impact.
        </p>

        <p>
          In my current role, I led a complete brand overhaul for TechCorp International that resulted in a 50% increase in brand recognition. My work spans brand strategy, digital experience design, and creative direction—from logo redesign to immersive digital campaigns. One standout project increased user engagement by 65%, demonstrating my ability to translate creative vision into tangible results.
        </p>

        <p>
          What draws me to Creative Studios is your reputation for pushing creative boundaries and your commitment to delivering work that matters. I'm eager to bring my strategic thinking, design expertise, and collaborative approach to your talented team.
        </p>

        <p>
          I'd love to discuss how I can contribute to your next chapter of creative excellence. Thank you for considering my application!
        </p>
      </div>

      <p className="mb-8 text-gray-700">Best regards,</p>

      <div className="border-t-2 border-indigo-600 pt-4 text-gray-700">
        <p className="font-semibold">Alex Rivera</p>
      </div>
    </div>
  </div>
);

// Minimal Clean Cover Letter
export const MinimalCleanCoverLetter: React.FC<{ data?: any }> = ({ data }) => (
  <div className="bg-white min-h-screen p-16 font-sans">
    <div className="max-w-3xl mx-auto">
      <div className="mb-12">
        <h1 className="text-2xl font-light text-gray-900">Sarah Mitchell</h1>
        <div className="text-xs text-gray-600 mt-2 space-x-2">
          <a href="mailto:" className="hover:text-gray-900">sarah.mitchell@email.com</a>
          <span>•</span>
          <a href="tel:" className="hover:text-gray-900">(555) 789-1234</a>
          <span>•</span>
          <span>Seattle, WA</span>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-sm text-gray-600 mb-6">January 15, 2024</p>
        <div className="space-y-1 text-sm text-gray-700 mb-6">
          <p>Hiring Manager</p>
          <p>CloudTech Solutions</p>
          <p>Seattle, WA 98101</p>
        </div>
      </div>

      <p className="text-sm text-gray-700 mb-4">Dear Hiring Manager,</p>

      <div className="space-y-4 text-sm text-gray-700 leading-relaxed mb-6">
        <p>
          I am applying for the Senior Software Engineer position at CloudTech Solutions. My 6+ years of full-stack software engineering experience, combined with a proven ability to design and implement scalable microservices architectures, positions me to make immediate contributions to your team.
        </p>

        <p>
          At my current role, I led the development of a microservices architecture that now serves 1M+ users while improving system performance by 40%. Beyond technical execution, I've mentored four junior engineers and consistently delivered projects ahead of schedule. My expertise spans JavaScript, TypeScript, Python, and Go, with deep experience in React, Node.js, PostgreSQL, and AWS.
        </p>

        <p>
          I'm drawn to CloudTech Solutions' engineering culture and your commitment to technical excellence. I'm excited about the opportunity to contribute to your platform and grow alongside your team.
        </p>

        <p>Thank you for your consideration. I look forward to discussing this opportunity.</p>
      </div>

      <p className="text-sm text-gray-700 mb-8">Best regards,</p>

      <div className="border-t text-gray-700 pt-4 text-sm">
        <p>Sarah Mitchell</p>
      </div>
    </div>
  </div>
);

// Executive Bold Cover Letter
export const ExecutiveBoldCoverLetter: React.FC<{ data?: any }> = ({ data }) => (
  <div className="bg-gray-900 text-gray-100 min-h-screen p-12 font-sans">
    <div className="max-w-3xl mx-auto">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-white">David Thompson</h1>
        <div className="text-sm text-gray-400 mt-2">
          david.thompson@email.com • (555) 321-9876 • Los Angeles, CA
        </div>
      </div>

      <div className="mb-8">
        <p className="text-gray-400 mb-6">January 15, 2024</p>
        <div className="space-y-1 text-gray-300 mb-6">
          <p>Chief Executive Officer</p>
          <p>Global Enterprise Solutions</p>
          <p>Los Angeles, CA 90001</p>
        </div>
      </div>

      <p className="mb-4 text-gray-300">Dear Sir or Madam,</p>

      <div className="space-y-4 text-gray-300 leading-relaxed mb-6">
        <p>
          I am writing to express my strong interest in the Vice President, Sales & Business Development position at Global Enterprise Solutions. With 12+ years of driving transformational revenue growth and establishing strategic partnerships with Fortune 500 companies, I am confident in my ability to accelerate your organization's market expansion and revenue objectives.
        </p>

        <p>
          In my current capacity, I have driven $75M in year-over-year revenue growth, established partnerships with 10 Fortune 500 companies, and built and led a high-performing sales organization of 25 professionals. My track record demonstrates a consistent ability to exceed quarterly targets by an average of 125% while implementing scalable processes that enable sustainable growth.
        </p>

        <p>
          I am particularly impressed by Global Enterprise Solutions' market leadership and strategic vision. I am eager to bring my proven sales acumen, partnership development expertise, and transformational leadership to drive your next phase of growth.
        </p>

        <p>
          I would appreciate the opportunity to discuss how my experience and strategic vision align with your organization's objectives. Thank you for your consideration.
        </p>
      </div>

      <p className="mb-8 text-gray-300">Sincerely,</p>

      <div className="border-t border-gray-700 pt-4 text-gray-300">
        <p className="font-semibold">David Thompson</p>
      </div>
    </div>
  </div>
);

// Academic Professional Cover Letter
export const AcademicProfessionalCoverLetter: React.FC<{ data?: any }> = ({ data }) => (
  <div className="bg-white min-h-screen p-10 font-serif">
    <div className="max-w-3xl mx-auto border border-gray-400 p-8">
      <div className="text-center mb-8 pb-6 border-b-2 border-gray-800">
        <h1 className="text-2xl font-bold">Dr. Emily Watson</h1>
        <div className="text-xs text-gray-600 mt-2">
          e.watson@university.edu • (555) 654-3210 • Cambridge, MA
        </div>
      </div>

      <div className="mb-8">
        <p className="text-sm text-gray-600 mb-6">January 15, 2024</p>
        <div className="space-y-1 text-sm text-gray-700 mb-6">
          <p>Search Committee</p>
          <p>Department of Environmental Science</p>
          <p>Stanford University</p>
          <p>Stanford, CA 94305</p>
        </div>
      </div>

      <p className="text-sm text-gray-700 mb-4">Dear Members of the Search Committee,</p>

      <div className="space-y-4 text-sm text-gray-700 leading-relaxed mb-6">
        <p>
          I am pleased to submit my application for the Associate Professor position in the Department of Environmental Science at Stanford University. With a PhD in Environmental Science, extensive research experience in climate adaptation strategies, and a strong publication record in high-impact journals, I am confident in my ability to contribute meaningfully to your department's research and teaching mission.
        </p>

        <p>
          As the lead researcher on the Climate Adaptation Initiative, I have directed a team of eight scientists investigating climate resilience strategies and have published twelve peer-reviewed articles in leading journals including Nature Climate Change and the Journal of Environmental Science. My teaching encompasses both undergraduate and graduate courses, and I am committed to mentoring the next generation of environmental scientists.
        </p>

        <p>
          I am particularly drawn to Stanford's strong commitment to interdisciplinary research and environmental sustainability. I believe my research agenda and teaching philosophy align well with your department's goals, and I am excited about the prospect of contributing to your intellectual community.
        </p>

        <p>
          Thank you for considering my application. I welcome the opportunity to discuss my qualifications and research vision in detail.
        </p>
      </div>

      <p className="text-sm text-gray-700 mb-8">Sincerely,</p>

      <div className="border-t border-gray-400 pt-4 text-gray-700 text-sm">
        <p>Dr. Emily Watson</p>
      </div>
    </div>
  </div>
);
