import React from 'react';
import { LearnerLevel } from '../types';

interface NavbarProps {
  learnerLevel: LearnerLevel;
  setLearnerLevel: (level: LearnerLevel) => void;
  onOpenHistory: () => void;
  onOpenChat: () => void;
  onRestart: () => void;
  hasStarted: boolean;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  learnerLevel: _learnerLevel,
  setLearnerLevel: _setLearnerLevel,
  onOpenHistory,
  onOpenChat,
  onRestart,
  hasStarted,
  savedCount,
}) => {
  return (
    <header className="px-6 sm:px-12 py-5 flex items-center justify-between border-b border-[rgba(224,224,230,0.1)] bg-[var(--bg)] text-[var(--ink)] font-mono z-30">
      
      {/* High-Impact Logo Box */}
      <div
        onClick={onRestart}
        className="font-syne font-extrabold text-sm sm:text-base tracking-wider uppercase bg-[var(--accent)] text-black px-4 py-2 cursor-pointer hover:opacity-90 transition-opacity select-none shadow-[0_0_15px_color-mix(in_srgb,var(--accent)_30%,transparent)]"
      >
        LeadWise_Pathfinder
      </div>

      {/* Industrial Nav Controls */}
      <div className="flex items-center gap-2 sm:gap-4 text-[0.65rem] uppercase tracking-wider">
        <button
          onClick={onRestart}
          className="border border-[rgba(224,224,230,0.1)] bg-transparent px-3 sm:px-4 py-2 text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors cursor-pointer font-mono text-[0.65rem] uppercase tracking-widest"
        >
          Terminal
        </button>

        <button
          onClick={onOpenChat}
          className="border border-[rgba(224,224,230,0.1)] bg-transparent px-3 sm:px-4 py-2 text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors cursor-pointer font-mono text-[0.65rem] uppercase tracking-widest"
        >
          AI_Coach
        </button>

        <button
          onClick={onOpenHistory}
          className="border border-[rgba(224,224,230,0.1)] bg-transparent px-3 sm:px-4 py-2 text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors cursor-pointer font-mono text-[0.65rem] uppercase tracking-widest flex items-center gap-1.5"
        >
          Archive
          {savedCount > 0 && (
            <span className="bg-[var(--accent)] text-black text-[0.6rem] px-1 py-0.2 font-bold">
              {savedCount}
            </span>
          )}
        </button>

        {hasStarted && (
          <button
            onClick={onRestart}
            className="border border-red-500/30 bg-transparent px-3 py-2 text-red-400 hover:border-red-400 hover:bg-red-500/10 transition-colors cursor-pointer font-mono text-[0.65rem] uppercase tracking-widest"
          >
            Reset
          </button>
        )}

        {/* Industrial SYS_READY Status */}
        <div className="hidden sm:flex items-center gap-2 text-[var(--accent)] font-bold text-[0.65rem] tracking-widest pl-2">
          <div className="w-2 h-2 bg-[var(--accent)] shadow-[0_0_10px_var(--accent)] animate-pulse" />
          SYS_READY
        </div>
      </div>

    </header>
  );
};
