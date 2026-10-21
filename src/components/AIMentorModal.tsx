'use client';

import React, { useState } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  AlertCircle, 
  ShieldCheck, 
  Lightbulb, 
  HelpCircle,
  Cpu
} from 'lucide-react';

interface AIMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  currentStep: number;
  currentCode?: string;
  language?: string;
}

export default function AIMentorModal({
  isOpen,
  onClose,
  projectTitle,
  currentStep,
  currentCode = '',
  language = 'python'
}: AIMentorModalProps) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; disclaimer?: string; provider?: string }>>([
    {
      sender: 'ai',
      text: `Hello! I am your KITE STEM Project Mentor. I'm here to help you understand Step ${currentStep} of "${projectTitle}", debug code errors, and understand your electronics. What are you working on or stuck with right now?`,
      provider: 'kite_mentor'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    'Why is my motor not moving?',
    'How does the distance calculation formula work?',
    'Check my code for common syntax errors',
    `Explain Step ${currentStep} concepts simply`
  ];

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || question;
    if (!q.trim() || loading) return;

    setError(null);
    setMessages(prev => [...prev, { sender: 'user', text: q }]);
    setQuestion('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectTitle,
          currentStep,
          code: currentCode,
          language,
          userQuestion: q
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to get mentor response');
      }

      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: data.reply,
          disclaimer: data.disclaimer,
          provider: data.provider
        }
      ]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Mentor could not be reached right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">KITE AI STEM Mentor</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                  Step {currentStep} Active
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-md">
                Guiding: {projectTitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs sm:text-sm">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                    : 'bg-slate-800/90 text-slate-100 rounded-bl-none border border-slate-700/80 shadow-md'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed font-sans">
                  {m.text}
                </div>
                {m.disclaimer && (
                  <p className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-700/60 italic">
                    {m.disclaimer}
                  </p>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-cyan-400 p-2">
              <Sparkles className="h-4 w-4 animate-spin" />
              <span>KITE Mentor is reasoning and analyzing your setup...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-950/40 border border-rose-800/60 p-3 rounded-xl">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Quick Question Chips */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800 overflow-x-auto flex gap-1.5 scrollbar-none">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              disabled={loading}
              className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all flex items-center gap-1 disabled:opacity-50"
            >
              <Lightbulb className="h-3 w-3 text-amber-400" />
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about your circuit, motors, code bug, or physics..."
              maxLength={1000}
              disabled={loading}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-cyan-500/20 disabled:opacity-50 transition-all"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">Ask</span>
            </button>
          </form>
          <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-400" /> Minor Safe • Rate-limited to 25 queries/hour
            </span>
            <span>{question.length}/1000</span>
          </div>
        </div>
      </div>
    </div>
  );
}
