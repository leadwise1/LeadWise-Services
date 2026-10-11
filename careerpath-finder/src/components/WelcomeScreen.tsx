import React from 'react';
import { LearnerLevel } from '../types';

interface WelcomeScreenProps {
  learnerLevel: LearnerLevel;
  setLearnerLevel: (level: LearnerLevel) => void;
  onStartQuiz: () => void;
}

const LEARNER_LEVEL_OPTIONS: { id: LearnerLevel; label: string; desc: string }[] = [
  {
    id: 'high_school_student',
    label: 'High School Student',
    desc: 'Exploring future majors & tech, business, or design pathways',
  },
  {
    id: 'college_student',
    label: 'College / University Student',
    desc: 'Targeting entry-level job titles, internships, and skill roadmaps',
  },
  {
    id: 'career_changer',
    label: 'Career Changer',
    desc: 'Pivoting from a non-tech/legacy field into a high-growth profession',
  },
  {
    id: 'early_career',
    label: 'Early Career Professional',
    desc: 'Levelling up towards mid-level titles or technical specializations',
  },
  {
    id: 'reskilling_adult',
    label: 'Adult Reskiller',
    desc: 'Building flexible modern skills for hybrid, remote, or freelance work',
  },
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  learnerLevel,
  setLearnerLevel,
  onStartQuiz,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 min-h-full font-mono text-[var(--ink)] animate-fade-in">
      
      {/* Left Column: Technical Industrial Hero (7 cols on desktop) */}
      <div className="lg:col-span-7 p-6 sm:p-10 lg:p-16 overflow-y-auto lg:border-r border-[rgba(224,224,230,0.1)] flex flex-col justify-center">
        <span className="text-[var(--accent)] text-[0.7rem] uppercase tracking-widest block mb-4">
          Initiating_protocol // PATHFINDER_V2
        </span>

        <h1 className="font-syne font-extrabold text-4xl sm:text-6xl lg:text-7xl uppercase leading-[0.88] tracking-tight mb-8 text-[var(--ink)]">
          Discover the career path that fits you.
        </h1>

        <div className="max-w-[620px] text-xs sm:text-sm leading-[1.8] opacity-70 mb-12">
          <p>Understand what you can do. Explore what you want to become.</p>
          <p className="mt-3 text-[var(--accent)] font-semibold opacity-100">
            Experience the reality of careers through people who live them every day.
          </p>
        </div>

        {/* Industrial Grid UI Modules */}
        <div className="grid grid-cols-1 sm:grid-cols-2 border border-[rgba(224,224,230,0.1)]">
          <div className="p-6 sm:p-8 border border-[rgba(224,224,230,0.1)] bg-[rgba(255,255,255,0.01)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
            <span className="font-syne text-3xl font-extrabold text-[var(--accent)] block mb-3">
              01
            </span>
            <h3 className="font-syne text-base font-bold uppercase tracking-wider mb-2 text-[var(--ink)]">
              Who Do I Want To Be?
            </h3>
            <p className="text-[0.7rem] opacity-50 leading-relaxed font-mono">
              Identify internal parameters: Strengths, Skills, Potential.
            </p>
          </div>

          <div className="p-6 sm:p-8 border border-[rgba(224,224,230,0.1)] bg-[rgba(255,255,255,0.01)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
            <span className="font-syne text-3xl font-extrabold text-[var(--accent)] block mb-3">
              02
            </span>
            <h3 className="font-syne text-base font-bold uppercase tracking-wider mb-2 text-[var(--ink)]">
              Who Can I Be?
            </h3>
            <p className="text-[0.7rem] opacity-50 leading-relaxed font-mono">
              Cross-reference external data: Mentors, Real-world stories.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Industrial Sidebar Selector (5 cols on desktop, ~450px) */}
      <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 bg-[rgba(255,255,255,0.01)] flex flex-col justify-between border-t lg:border-t-0 border-[rgba(224,224,230,0.1)]">
        <div>
          {/* Header with extending line */}
          <div className="text-[0.65rem] uppercase tracking-[0.2em] opacity-40 mb-6 flex items-center gap-3">
            <span>SELECT_USER_PROFILE</span>
            <span className="h-[1px] flex-grow bg-[rgba(224,224,230,0.1)]" />
          </div>

          {/* List Options with 1px hairline dividers */}
          <div className="flex flex-col gap-[1px] bg-[rgba(224,224,230,0.1)] border border-[rgba(224,224,230,0.1)]">
            {LEARNER_LEVEL_OPTIONS.map((opt) => {
              const isSelected = learnerLevel === opt.id;

              return (
                <div
                  key={opt.id}
                  onClick={() => setLearnerLevel(opt.id)}
                  className={`p-5 sm:p-6 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[var(--accent)] text-black'
                      : 'bg-[var(--bg)] text-[var(--ink)] hover:bg-[rgba(255,255,255,0.04)]'
                  }`}
                >
                  <span
                    className={`block font-bold text-xs uppercase tracking-wider mb-1 ${
                      isSelected ? 'text-black' : 'text-[var(--ink)]'
                    }`}
                  >
                    {opt.label}
                  </span>
                  <p
                    className={`text-[0.65rem] leading-relaxed ${
                      isSelected ? 'text-black opacity-90' : 'opacity-60'
                    }`}
                  >
                    {opt.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Footer CTA */}
        <div className="mt-8 pt-4">
          <button
            onClick={onStartQuiz}
            className="w-full p-5 bg-transparent border-2 border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-black font-mono font-bold text-xs uppercase tracking-[0.2em] transition-all cursor-pointer shadow-[0_0_20px_color-mix(in_srgb,var(--accent)_20%,transparent)]"
          >
            Initiate Assessment_
          </button>
        </div>
      </div>

    </div>
  );
};
