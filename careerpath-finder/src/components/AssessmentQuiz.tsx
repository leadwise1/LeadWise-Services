import React, { useState } from 'react';
import { QUESTIONS } from '../data/questions';
import { UserAnswers } from '../types';
import { ChevronRight, ChevronLeft, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';

interface AssessmentQuizProps {
  answers: UserAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<UserAnswers>>;
  onComplete: () => void;
}

export const AssessmentQuiz: React.FC<AssessmentQuizProps> = ({
  answers,
  setAnswers,
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQuestion = QUESTIONS[currentIndex];
  const totalQuestions = QUESTIONS.length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const selectedOptionId = answers[currentQuestion.id];

  const handleSelectOption = (optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 text-[var(--ink)] font-mono animate-fade-in">
      
      {/* Quiz Progress Top Bar */}
      <div className="mb-8 bg-[var(--bg)] border border-[rgba(224,224,230,0.1)] p-5 relative">
        <div className="flex items-center justify-between text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--accent)] mb-3 font-mono">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            CATEGORY // {currentQuestion.category}
          </span>
          <span className="opacity-50">
            QUESTION [0{currentIndex + 1} / 0{totalQuestions}]
          </span>
        </div>

        {/* Progress Fill Bar */}
        <div className="w-full h-1 bg-[rgba(224,224,230,0.08)] overflow-hidden">
          <div
            className="h-full bg-[var(--accent)] transition-all duration-300 ease-out shadow-[0_0_8px_var(--accent)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Header Card */}
      <div className="mb-8 space-y-3">
        <span className="text-[var(--accent)] text-[0.65rem] uppercase tracking-widest block font-mono">
          PARAMETER_INPUT // 0{currentIndex + 1}
        </span>
        <h2 className="font-syne font-extrabold text-2xl sm:text-4xl uppercase leading-tight tracking-tight text-[var(--ink)]">
          {currentQuestion.title}
        </h2>
        <p className="text-xs sm:text-sm opacity-60 font-mono flex items-center gap-2 pt-1">
          <HelpCircle className="w-4 h-4 text-[var(--accent)] shrink-0" />
          {currentQuestion.subtitle}
        </p>
      </div>

      {/* Multiple Choice Options List with 1px hairline industrial spacing */}
      <div className="flex flex-col gap-[1px] bg-[rgba(224,224,230,0.1)] border border-[rgba(224,224,230,0.1)] my-6">
        {currentQuestion.options.map((option, idx) => {
          const isSelected = selectedOptionId === option.id;
          const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D

          return (
            <div
              key={option.id}
              onClick={() => handleSelectOption(option.id)}
              className={`p-5 sm:p-6 cursor-pointer transition-all ${
                isSelected
                  ? 'bg-[var(--accent)] text-black'
                  : 'bg-[var(--bg)] text-[var(--ink)] hover:bg-[rgba(255,255,255,0.03)]'
              }`}
            >
              <div className="flex items-start gap-4">
                
                {/* Option Letter Indicator */}
                <div
                  className={`w-7 h-7 font-mono font-bold text-xs flex items-center justify-center shrink-0 border ${
                    isSelected
                      ? 'border-black text-black bg-black/10'
                      : 'border-[rgba(224,224,230,0.2)] text-[var(--accent)]'
                  }`}
                >
                  {isSelected ? <CheckCircle2 className="w-4 h-4 text-black" /> : optionLetter}
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[0.65rem] font-mono uppercase tracking-[0.15em] font-bold ${
                        isSelected ? 'text-black opacity-80' : 'text-[var(--accent)]'
                      }`}
                    >
                      {option.subtitle}
                    </span>
                  </div>
                  <p
                    className={`mt-1.5 text-xs sm:text-sm leading-relaxed ${
                      isSelected ? 'text-black font-semibold' : 'text-[var(--ink)] opacity-80'
                    }`}
                  >
                    {option.text}
                  </p>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Footer */}
      <div className="mt-8 flex items-center justify-between pt-6 border-t border-[rgba(224,224,230,0.1)]">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`flex items-center gap-1.5 px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] transition-all cursor-pointer border ${
            currentIndex === 0
              ? 'opacity-20 cursor-not-allowed border-transparent text-[var(--ink)]'
              : 'border-[rgba(224,224,230,0.1)] bg-transparent text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Prev
        </button>

        <button
          onClick={handleNext}
          disabled={!selectedOptionId}
          className={`flex items-center gap-2 px-8 py-3.5 font-mono text-xs uppercase tracking-[0.15em] font-bold transition-all cursor-pointer border-2 ${
            selectedOptionId
              ? 'border-[var(--accent)] bg-[var(--accent)] text-black hover:opacity-90 shadow-[0_0_15px_color-mix(in_srgb,var(--accent)_30%,transparent)]'
              : 'border-[rgba(224,224,230,0.1)] bg-transparent text-[var(--ink)] opacity-30 cursor-not-allowed'
          }`}
        >
          {currentIndex === totalQuestions - 1 ? 'Execute Matching_' : 'Next Step'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
