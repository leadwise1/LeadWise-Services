import React, { useState, useEffect } from 'react';
import { LearnerLevel, UserAnswers, AssessmentResult, ProfessionMatch } from './types';
import { calculateTraitTotals, matchProfessions } from './utils/calculator';
import { Navbar } from './components/Navbar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { AssessmentQuiz } from './components/AssessmentQuiz';
import { ResultsView } from './components/ResultsView';
import { CareerCoachChat } from './components/CareerCoachChat';
import { ComparisonModal } from './components/ComparisonModal';
import { SavedResultsModal } from './components/SavedResultsModal';

const LOCAL_STORAGE_KEY = 'careermatch_saved_results_v1';

export default function App() {
  const [view, setView] = useState<'welcome' | 'quiz' | 'results'>('welcome');
  const [learnerLevel, setLearnerLevel] = useState<LearnerLevel>('college_student');
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [currentResult, setCurrentResult] = useState<AssessmentResult | null>(null);
  const [savedResults, setSavedResults] = useState<AssessmentResult[]>([]);

  // Modals state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [compareList, setCompareList] = useState<ProfessionMatch[]>([]);

  // Load saved results from localStorage on initial render
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        setSavedResults(JSON.parse(raw));
      }
    } catch (e) {
      console.error('Failed to parse saved results:', e);
    }
  }, []);

  const handleStartQuiz = () => {
    setAnswers({});
    setCurrentResult(null);
    setView('quiz');
  };

  const handleCompleteQuiz = () => {
    const traitTotals = calculateTraitTotals(answers);
    const topMatches = matchProfessions(traitTotals);

    const newResult: AssessmentResult = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      learnerLevel,
      answers,
      traitTotals,
      topMatches,
    };

    setCurrentResult(newResult);
    setView('results');
  };

  const handleSaveResult = (res: AssessmentResult) => {
    const exists = savedResults.some((item) => item.id === res.id);
    let updated: AssessmentResult[];
    if (exists) {
      updated = savedResults.filter((item) => item.id !== res.id);
    } else {
      updated = [res, ...savedResults];
    }
    setSavedResults(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to write to localStorage:', e);
    }
  };

  const handleDeleteSavedResult = (id: string) => {
    const updated = savedResults.filter((item) => item.id !== id);
    setSavedResults(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update localStorage:', e);
    }
  };

  const handleLoadSavedResult = (res: AssessmentResult) => {
    setCurrentResult(res);
    setLearnerLevel(res.learnerLevel);
    setView('results');
  };

  const handleOpenCompare = (professions: ProfessionMatch[]) => {
    setCompareList(professions);
    setIsCompareOpen(true);
  };

  const isCurrentSaved = currentResult
    ? savedResults.some((item) => item.id === currentResult.id)
    : false;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] flex font-mono selection:bg-[var(--accent)] selection:text-black relative">
      
      {/* 80px Technical Industrial Left Sidebar (Visible on md+ screens) */}
      <aside className="hidden md:flex w-20 shrink-0 border-r border-[rgba(224,224,230,0.1)] bg-[rgba(255,255,255,0.02)] flex-col justify-between items-center py-8 z-20 select-none">
        <div className="vertical-text">SYS.004-PRT</div>
        <div className="w-7 h-7 bg-[var(--accent)] shadow-[0_0_15px_var(--accent)]" />
        <div className="vertical-text">LEADWISE_DATA_CENTER</div>
      </aside>

      {/* Main Technical Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* Navbar */}
        <Navbar
          learnerLevel={learnerLevel}
          setLearnerLevel={setLearnerLevel}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenChat={() => setIsChatOpen(true)}
          onRestart={() => setView('welcome')}
          hasStarted={view !== 'welcome'}
          savedCount={savedResults.length}
        />

        {/* Dynamic Main View Area */}
        <main className="flex-1 overflow-x-hidden">
          {view === 'welcome' && (
            <WelcomeScreen
              learnerLevel={learnerLevel}
              setLearnerLevel={setLearnerLevel}
              onStartQuiz={handleStartQuiz}
            />
          )}

          {view === 'quiz' && (
            <div className="p-6 sm:p-10 max-w-4xl mx-auto">
              <AssessmentQuiz
                answers={answers}
                setAnswers={setAnswers}
                onComplete={handleCompleteQuiz}
              />
            </div>
          )}

          {view === 'results' && currentResult && (
            <div className="p-4 sm:p-8">
              <ResultsView
                result={currentResult}
                onRetake={() => setView('welcome')}
                onOpenChat={() => setIsChatOpen(true)}
                onOpenCompare={handleOpenCompare}
                onSaveResult={handleSaveResult}
                isSaved={isCurrentSaved}
              />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="px-6 sm:px-12 py-4 border-t border-[rgba(224,224,230,0.1)] bg-[var(--bg)] flex flex-col sm:flex-row items-center justify-between gap-2 text-[0.6rem] uppercase tracking-widest opacity-40 font-mono z-10">
          <div>PATHFINDER_PROTOCOL_V2.0.4 • POWERED_BY_GEMINI_AI</div>
          <div>STRICT_CONFIDENTIAL // <span style={{ color: 'var(--accent)', opacity: 1 }}>SYS_OK</span></div>
        </footer>

      </div>

      {/* Modals & Slide-overs */}
      <CareerCoachChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        result={currentResult}
      />

      <ComparisonModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        professions={compareList}
      />

      <SavedResultsModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedResults={savedResults}
        onSelectResult={handleLoadSavedResult}
        onDeleteResult={handleDeleteSavedResult}
      />

    </div>
  );
}
