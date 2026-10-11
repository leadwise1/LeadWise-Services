import React from 'react';
import { ProfessionMatch } from '../types';
import { X, Building2, Briefcase } from 'lucide-react';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  professions: ProfessionMatch[];
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  professions,
}) => {
  if (!isOpen || professions.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto font-mono text-[var(--ink)]">
      <div className="bg-[#0c0c0e] border border-[rgba(224,224,230,0.2)] max-w-5xl w-full p-6 sm:p-8 space-y-6 my-8 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[rgba(224,224,230,0.1)]">
          <div>
            <h3 className="font-syne font-bold text-2xl uppercase text-[var(--ink)] flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[var(--accent)]" />
              Profession Comparison
            </h3>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] opacity-40 mt-1">
              Cross-analyzing top matched career vectors
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 opacity-50 hover:opacity-100 hover:text-[var(--accent)] transition-colors cursor-pointer border border-transparent hover:border-[rgba(224,224,230,0.1)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {professions.map((prof) => (
            <div
              key={prof.id}
              className="p-6 border border-[rgba(224,224,230,0.1)] bg-[rgba(255,255,255,0.01)] space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.6rem] font-bold px-2 py-0.5 bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30 uppercase tracking-[0.2em]">
                    {prof.category}
                  </span>
                  <span className="font-mono px-2.5 py-0.5 bg-[var(--accent)] text-black text-[0.65rem] font-bold tracking-[0.2em]">
                    {prof.matchPercentage}%
                  </span>
                </div>

                <h4 className="font-syne font-bold text-lg uppercase text-[var(--ink)]">
                  {prof.profession}
                </h4>

                {/* Salary & Growth */}
                <div className="p-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(224,224,230,0.08)] space-y-1.5 font-mono text-[0.65rem] font-bold uppercase tracking-[0.1em]">
                  <div className="flex items-center justify-between">
                    <span className="opacity-40">Salary:</span>
                    <span className="text-[var(--accent)]">{prof.salaryRange}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="opacity-40">Outlook:</span>
                    <span className="text-[var(--accent)]">{prof.growthOutlook}</span>
                  </div>
                </div>

                {/* Target Job Titles */}
                <div>
                  <h5 className="font-mono text-[0.6rem] font-bold opacity-40 mb-2 uppercase tracking-[0.1em]">
                    Job Titles:
                  </h5>
                  <div className="space-y-1 font-mono text-xs text-[var(--ink)]">
                    {prof.matchingJobTitles.map((title, idx) => (
                      <div key={idx} className="p-2 bg-[rgba(255,255,255,0.01)] border border-[rgba(224,224,230,0.08)]">
                        {title}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Environments */}
              <div className="pt-3 border-t border-[rgba(224,224,230,0.1)]">
                <span className="font-mono text-[0.65rem] font-bold text-[var(--accent)] uppercase tracking-[0.1em] flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  {prof.typicalEnvironments[0]}
                </span>
              </div>

            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[rgba(224,224,230,0.1)] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 font-mono bg-transparent border-2 border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-black text-xs font-bold uppercase tracking-[0.2em] transition-all cursor-pointer"
          >
            Close_
          </button>
        </div>

      </div>
    </div>
  );
};
