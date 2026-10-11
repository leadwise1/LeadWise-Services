import React, { useState, useRef, useEffect } from 'react';
import { AssessmentResult, ChatMessage } from '../types';
import { Bot, Send, X, User, Loader2 } from 'lucide-react';
import { generateCareerReply, careerAIError } from '../lib/careerAI';

interface CareerCoachChatProps {
  isOpen: boolean;
  onClose: () => void;
  result: AssessmentResult | null;
}

export const CareerCoachChat: React.FC<CareerCoachChatProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message
  useEffect(() => {
    if (result && messages.length === 0) {
      const topRoles = result.topMatches.map((m) => m.profession).slice(0, 2).join(' and ');
      setMessages([
        {
          id: 'welcome',
          sender: 'ai',
          text: `Hello! I'm your AI Career Coach. Based on your assessment, you scored highest for **${topRoles}**!\n\nHow can I help you today? You can ask me about:\n- Recommended online courses & bootcamps\n- Portfolio project ideas\n- Resume & interview tips for target job titles\n- Salary expectations & career transitions`,
          timestamp: Date.now(),
        },
      ]);
    }
  }, [result]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const aiText = await generateCareerReply(userText, messages, result);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiText,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          sender: 'ai',
          text: careerAIError(err),
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    setInput(promptText);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fade-in font-mono text-[var(--ink)]">
      <div className="w-full max-w-md bg-[#0c0c0e] border-l border-[rgba(224,224,230,0.15)] flex flex-col h-full shadow-2xl">
        
        {/* Header */}
        <div className="p-4 border-b border-[rgba(224,224,230,0.1)] flex items-center justify-between bg-[#0c0c0e]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[var(--accent)] text-black font-bold flex items-center justify-center font-syne">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-syne font-bold text-base uppercase text-[var(--ink)]">
                AI Career Advisor
              </h3>
              <p className="font-mono text-[0.6rem] text-[var(--accent)] uppercase tracking-[0.15em]">Neural Career Engine</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 opacity-40 hover:opacity-100 hover:text-[var(--accent)] transition-colors cursor-pointer border border-transparent hover:border-[rgba(224,224,230,0.1)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestions Bar */}
        <div className="px-4 py-2 bg-[rgba(255,255,255,0.01)] border-b border-[rgba(224,224,230,0.1)] flex items-center gap-1.5 overflow-x-auto font-mono text-[0.6rem] uppercase tracking-[0.15em] no-scrollbar">
          <span className="opacity-40 shrink-0">Prompts:</span>
          <button
            onClick={() => handleQuickPrompt('What entry-level projects should I build?')}
            className="shrink-0 px-2.5 py-1 bg-transparent border border-[rgba(224,224,230,0.15)] hover:border-[var(--accent)] hover:text-[var(--accent)] text-[var(--ink)] transition-colors cursor-pointer"
          >
            Project Ideas
          </button>
          <button
            onClick={() => handleQuickPrompt('How do I prepare for job interviews in this field?')}
            className="shrink-0 px-2.5 py-1 bg-transparent border border-[rgba(224,224,230,0.15)] hover:border-[var(--accent)] hover:text-[var(--accent)] text-[var(--ink)] transition-colors cursor-pointer"
          >
            Interview Tips
          </button>
          <button
            onClick={() => handleQuickPrompt('What free courses or certifications should I take?')}
            className="shrink-0 px-2.5 py-1 bg-transparent border border-[rgba(224,224,230,0.15)] hover:border-[var(--accent)] hover:text-[var(--accent)] text-[var(--ink)] transition-colors cursor-pointer"
          >
            Certifications
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0c0c0e]">
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${isAi ? '' : 'flex-row-reverse'}`}
              >
                <div
                  className={`w-7 h-7 font-mono font-bold text-xs flex items-center justify-center shrink-0 border ${
                    isAi
                      ? 'bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/30'
                      : 'bg-[var(--accent)] text-black border-[var(--accent)]'
                  }`}
                >
                  {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[82%] p-3.5 text-xs leading-relaxed whitespace-pre-wrap border ${
                    isAi
                      ? 'bg-[rgba(255,255,255,0.02)] border-[rgba(224,224,230,0.1)] text-[var(--ink)]'
                      : 'bg-[var(--accent)] border-[var(--accent)] text-black font-semibold'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/30 p-3 w-fit">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing Query...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <div className="p-3 border-t border-[rgba(224,224,230,0.1)] bg-[#0c0c0e]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Query parameters..."
              className="flex-1 bg-[rgba(255,255,255,0.02)] border border-[rgba(224,224,230,0.15)] px-3.5 py-2.5 text-xs text-[var(--ink)] placeholder-[var(--ink)]/30 focus:outline-none focus:border-[var(--accent)] transition-colors font-mono"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 bg-[var(--accent)] text-black hover:opacity-90 disabled:opacity-20 disabled:cursor-not-allowed font-bold transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
