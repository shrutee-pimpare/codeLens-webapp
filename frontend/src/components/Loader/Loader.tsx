import { useEffect, useState } from 'react';

const MESSAGES = [
  'Parsing abstract syntax tree…',
  'Detecting code smells…',
  'Analyzing complexity patterns…',
  'Consulting the AI oracle…',
  'Checking for performance bottlenecks…',
  'Generating refactor suggestions…',
  'Reviewing best practices…',
  'Almost done…',
];

export function Loader() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const msgTimer = setInterval(() => {
      setMsgIndex(i => (i + 1) % MESSAGES.length);
    }, 2200);
    const dotTimer = setInterval(() => {
      setDots(d => (d.length >= 3 ? '' : d + '.'));
    }, 400);
    return () => { clearInterval(msgTimer); clearInterval(dotTimer); };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-8 animate-fade-in">
      {/* Animated scanner */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-2xl border-2 border-brand-500/30" />
        <div className="absolute inset-1 rounded-xl border border-brand-500/20" />
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-400 to-transparent animate-scan opacity-80" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-brand-400">
            <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-400 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-brand-400 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-brand-400 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-400 rounded-br-lg" />
      </div>

      <div className="text-center space-y-2">
        <p className="text-sm font-mono text-brand-400 min-h-[1.25rem] transition-all duration-300">
          {MESSAGES[msgIndex]}{dots}
        </p>
        <p className="text-xs text-surface-200">AI is analyzing your code</p>
      </div>

      {/* Progress bar */}
      <div className="w-48 h-1 bg-surface-600 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full animate-pulse-slow w-3/4" />
      </div>
    </div>
  );
}
