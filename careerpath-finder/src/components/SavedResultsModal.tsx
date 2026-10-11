import React from 'react';
import { AssessmentResult } from '../types';
import { X, History, Trash2, Calendar } from 'lucide-react';

interface SavedResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedResults: AssessmentResult[];
  onSelectResult: (res: AssessmentResult) => void;
  onDeleteResult: (id: string) => void;
}

export const SavedResultsModal: React.FC<SavedResultsModalProps> = ({
  isOpen,
  onClose,
  savedResults,
  onSelectResult,
  onDeleteResult,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-mono text-[var(--ink)]">
      <div className="bg-[#0c0c0e] border border-[rgba(224,224,230,0.2)] max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[rgba(224,224,230,0.1)]">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[var(--accent)]" />
            <h3 className="font-syne font-bold text-2xl uppercase text-[var(--ink)]">
              Saved Assessments
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 opacity-50 hover:opacity-100 hover:text-[var(--accent)] transition-colors cursor-pointer border border-transparent hover:border-[rgba(224,224,230,0.1)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        {savedResults.length === 0 ? (
          <div className="p-8 text-center bg-[rgba(255,255,255,0.01)] border border-[rgba(224,224,230,0.08)]">
            <p className="font-mono text-xs opacity-40 uppercase tracking-wider">
              No saved assessments logged.
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {savedResults.map((res) => {
              const topProfession = res.topMatches[0];
              const dateStr = new Date(res.timestamp).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={res.id}
                  className="p-4 border border-[rgba(224,224,230,0.1)] bg-[rgba(255,255,255,0.01)] flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 font-mono text-[0.6rem] font-bold text-[var(--accent)] uppercase tracking-[0.2em]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {dateStr}
                      </span>
                      <span>•</span>
                      <span className="capitalize">{res.learnerLevel.replace(/_/g, ' ')}</span>
                    </div>

                    <h4 className="mt-1 font-syne font-bold text-sm uppercase text-[var(--ink)] truncate">
                      {topProfession.profession} ({topProfession.matchPercentage}%)
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        onSelectResult(res);
                        onClose();
                      }}
                      className="px-4 py-2 font-mono bg-[var(--accent)] text-black hover:opacity-90 text-xs font-bold uppercase tracking-[0.2em] transition-all cursor-pointer"
                    >
                      Load
                    </button>

                    <button
                      onClick={() => onDeleteResult(res.id)}
                      className="p-2 bg-transparent opacity-40 hover:opacity-100 hover:text-red-400 border border-[rgba(224,224,230,0.1)] transition-colors cursor-pointer"
                      title="Delete Saved Assessment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-[rgba(224,224,230,0.1)] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 font-mono bg-transparent border-2 border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-black text-xs font-bold uppercase tracking-[0.2em] transition-all cursor-pointer"
          >
            Done_
          </button>
        </div>

      </div>
    </div>
  );
};
