import React, { useState } from "react";
import { 
  Code, 
  Database, 
  CheckCircle, 
  Briefcase, 
  ArrowRight, 
  Terminal, 
  BarChart3 
} from "lucide-react";

const CoursesPage = () => {
  // State to toggle course modules (mock functionality for design)
  const [expandedCourse, setExpandedCourse] = useState(null);

  const toggleCourse = (id) => {
    setExpandedCourse(expandedCourse === id ? null : id);
  };

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(ellipse_at_top,_#1B2735_0%,_#090A0F_100%)] text-white font-sans selection:bg-[#FFBEA0] selection:text-[#1B2735]">
      
      {/* --- HERO SECTION --- */}
      <header className="relative pt-20 pb-16 px-4 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-[#FFBEA0]/30 text-[#FFBEA0] text-sm font-semibold mb-6 animate-fade-in">
          <CheckCircle size={16} /> 100% Free • Self-Paced • Industry-Relevant
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#FFBEA0]">
          Don't Just Learn to Code. <br />
          <span className="text-[#FFBEA0]">Learn to Get Hired.</span>
        </h1>
        
        <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10">
          Access free, industry-verified training from a <span className="text-white font-semibold">Google Cloud Partner</span>. 
          We turn ambition into employable skills—no tuition required.
        </p>
      </header>

      {/* --- PARTNERS BAR --- */}
      <div className="w-full border-y border-white/5 bg-white/5 backdrop-blur-sm py-8 mb-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-80">
          <div className="flex items-center gap-3">
            <div className="font-bold text-2xl tracking-tighter">Google Cloud</div>
            <div className="h-6 w-px bg-gray-500/50 mx-2"></div>
            <div className="text-sm uppercase tracking-widest text-gray-400">Build Partner</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="font-bold text-2xl tracking-tighter">Workspace</div>
            <div className="h-6 w-px bg-gray-500/50 mx-2"></div>
            <div className="text-sm uppercase tracking-widest text-gray-400">Authorized Partner</div>
          </div>
        </div>
      </div>

      {/* --- THE BRIDGE SECTION (New Marketing Content) --- */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <div className="grid md:grid-cols-2 gap-12 items-center bg-gradient-to-br from-white/5 to-transparent border border-[#FFBEA0]/20 rounded-[2.5rem] p-8 md:p-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              The Bridge to Your <span className="text-[#FFBEA0]">Next Job</span>
            </h2>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Most free courses leave you stranded at 'Hello World.' We connect the dots. 
              Our ecosystem is engineered for workforce transformation.
            </p>
            
            <ul className="space-y-4 mb-8">
              {[
                { title: "Step 1: Learn", desc: "Master the skills in our self-paced paths." },
                { title: "Step 2: Build", desc: "Use our Free ATS-Optimized Resume Builder." },
                { title: "Step 3: Launch", desc: "Apply with confidence using verified credentials." }
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#FF9E80]/20 text-[#FFBEA0] flex items-center justify-center font-bold text-sm mt-1">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{step.title}</h4>
                    <p className="text-sm text-gray-400">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-0 bg-[#FF9E80] rounded-2xl blur-[60px] opacity-20 group-hover:opacity-30 transition duration-500"></div>
            <div className="relative bg-[#090A0F]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 transform rotate-2 hover:rotate-0 transition duration-500">
              <div className="flex items-center gap-3 mb-6">
                <Briefcase className="text-[#FFBEA0]" size={28} />
                <span className="font-semibold text-lg">Career Tools Unlocked</span>
              </div>
              <div className="space-y-3">
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-[#FF9E80]"></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Skills Acquired</span>
                  <span>75% Match for "Junior Dev"</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- LEARNING PATHS --- */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          Choose Your <span className="text-[#FFBEA0]">Economic Pathway</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Course 1 */}
          <CourseCard 
            icon={<Terminal size={32} />}
            title="Frontend Web Development"
            subtitle="Build the visual internet. From landing pages to complex apps."
            meta={["8-10 weeks", "Beginner to Intermediate"]}
            description="Learn HTML, CSS, and JavaScript with Google's official web.dev curriculum. Build a portfolio that proves you can do the work."
            tags={["Web Dev", "Freelancing", "Creative"]}
            color="blue"
          />

          {/* Course 2 */}
          <CourseCard 
            icon={<BarChart3 size={32} />}
            title="Data Analytics Fundamentals"
            subtitle="Decode the data. Drive business decisions."
            meta={["8-10 weeks", "Beginner to Intermediate"]}
            description="Master the essentials of data analysis: Excel, SQL, and data visualization. Perfect for professionals looking to upskill."
            tags={["SQL", "Business Intelligence", "Growth"]}
            color="purple"
          />

        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/10 py-12 text-center text-gray-500 text-sm">
        <p>© 2024 LeadWise Foundation. Free learning for everyone.</p>
      </footer>
    </div>
  );
};

// Reusable Course Card Component
const CourseCard = ({ icon, title, subtitle, meta, description, tags, color }) => (
  <div className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#FFBEA0]/50 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 flex flex-col h-full">
    <div className="flex items-start justify-between mb-6">
      <div className={`p-3 rounded-2xl ${color === 'blue' ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'}`}>
        {icon}
      </div>
      <div className="flex gap-2">
        {tags.map(tag => (
          <span key={tag} className="px-3 py-1 rounded-full bg-white/5 text-xs text-gray-400 border border-white/5">
            {tag}
          </span>
        ))}
      </div>
    </div>

    <h3 className="text-2xl font-bold mb-2 text-white">{title}</h3>
    <p className="text-[#FFBEA0] font-medium mb-4">{subtitle}</p>
    
    <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
      {meta.map((m, i) => (
        <span key={i} className="flex items-center gap-1">
          • {m}
        </span>
      ))}
    </div>

    <p className="text-gray-300 leading-relaxed mb-8 flex-grow">
      {description}
    </p>

    <button className="w-full py-4 rounded-xl bg-white text-[#090A0F] font-bold hover:bg-[#FFBEA0] transition-colors flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(255,190,160,0.4)]">
      Start Learning <ArrowRight size={18} />
    </button>
  </div>
);

export default CoursesPage;
