import { useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import {
  Bug, Zap, BookOpen, Lightbulb, RefreshCw,
  Copy, CheckCheck, ChevronDown, ChevronUp, Star
} from 'lucide-react';
import type { ReviewResult, ReviewTab } from '../../types/review.types';
import { getScoreColor, getScoreLabel, getScoreBg, getTotalIssues, formatTimestamp } from '../../utils/formatResponse';
import { ComplexityChart } from '../ComplexityChart/ComplexityChart';

interface ReviewPanelProps {
  result: ReviewResult;
}

interface TabConfig {
  id: ReviewTab;
  label: string;
  icon: React.ReactNode;
  items: string[];
  color: string;
  dotColor: string;
}

function IssueList({ items, dotColor }: { items: string[]; dotColor: string }) {
  if (items.length === 0) {
    return (
      <div className="flex items-center gap-2 p-4 rounded-lg bg-surface-700/30 border border-surface-400/20">
        <CheckCheck size={14} className="text-emerald-400" />
        <span className="text-sm text-surface-200">No issues found in this category.</span>
      </div>
    );
  }
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="issue-item">
          <span className={`dot mt-1.5 ${dotColor}`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function RefactorTab({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const monacoLang = language === 'csharp' ? 'csharp' : language === 'cpp' ? 'cpp' : language;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-surface-200">AI-suggested refactored version of your code</p>
        <button onClick={handleCopy} className="btn-ghost !text-xs !py-1.5">
          {copied ? <><CheckCheck size={12} className="text-emerald-400" /> Copied!</> : <><Copy size={12} /> Copy</>}
        </button>
      </div>
      <div className="rounded-lg overflow-hidden border border-surface-400/30 h-72">
        <MonacoEditor
          height="100%"
          language={monacoLang}
          value={code}
          theme="vs-dark"
          options={{
            readOnly: true,
            fontSize: 12,
            fontFamily: "'JetBrains Mono', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 8 },
            lineNumbers: 'on',
            wordWrap: 'on',
          }}
        />
      </div>
    </div>
  );
}

export function ReviewPanel({ result }: ReviewPanelProps) {
  const [activeTab, setActiveTab] = useState<ReviewTab>('bugs');
  const [summaryOpen, setSummaryOpen] = useState(true);

  const totalIssues = getTotalIssues(result);
  const scoreColor = getScoreColor(result.overall_score);
  const scoreBg = getScoreBg(result.overall_score);

  const tabs: TabConfig[] = [
    { id: 'bugs', label: 'Bugs', icon: <Bug size={13} />, items: result.bugs, color: 'text-red-400', dotColor: 'bg-red-400' },
    { id: 'performance', label: 'Performance', icon: <Zap size={13} />, items: result.performance, color: 'text-yellow-400', dotColor: 'bg-yellow-400' },
    { id: 'readability', label: 'Readability', icon: <BookOpen size={13} />, items: result.readability, color: 'text-blue-400', dotColor: 'bg-blue-400' },
    { id: 'improvements', label: 'Suggestions', icon: <Lightbulb size={13} />, items: result.improvements, color: 'text-purple-400', dotColor: 'bg-purple-400' },
    { id: 'refactor', label: 'Refactor', icon: <RefreshCw size={13} />, items: [], color: 'text-brand-400', dotColor: 'bg-brand-400' },
  ];

  const activeConfig = tabs.find(t => t.id === activeTab)!;

  return (
    <div className="flex flex-col gap-4 h-full animate-slide-up">
      {/* Score card */}
      <div className={`panel border ${scoreBg}`}>
        <div className="p-4 flex items-start gap-4">
          <div className="flex-shrink-0 text-center">
            <div className={`text-4xl font-display font-bold ${scoreColor}`}>{result.overall_score}</div>
            <div className={`text-xs font-medium ${scoreColor} mt-0.5`}>{getScoreLabel(result.overall_score)}</div>
            <div className="text-xs text-surface-200 mt-0.5">out of 10</div>
          </div>

          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Star size={12} className="text-brand-400" />
                <span className="text-xs font-medium text-surface-100">Code Quality Score</span>
              </div>
              <span className="text-xs text-surface-200 font-mono">{formatTimestamp(result.analyzedAt)}</span>
            </div>

            {/* Summary toggle */}
            <button
              onClick={() => setSummaryOpen(o => !o)}
              className="flex items-center gap-1 text-xs text-surface-200 hover:text-surface-100 transition-colors"
            >
              {summaryOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {summaryOpen ? 'Hide' : 'Show'} summary
            </button>
            {summaryOpen && (
              <p className="text-xs text-surface-100 leading-relaxed animate-fade-in">{result.summary}</p>
            )}
          </div>

          {/* Issue counts */}
          <div className="flex-shrink-0 text-right space-y-1">
            <div className="text-2xl font-display font-bold text-surface-100">{totalIssues}</div>
            <div className="text-xs text-surface-200">total issues</div>
            <div className="flex gap-1 justify-end flex-wrap">
              {result.bugs.length > 0 && (
                <span className="tag bg-red-500/10 text-red-400">{result.bugs.length} bug{result.bugs.length > 1 ? 's' : ''}</span>
              )}
              {result.performance.length > 0 && (
                <span className="tag bg-yellow-500/10 text-yellow-400">{result.performance.length} perf</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content: tabs + complexity */}
      <div className="grid grid-cols-[1fr_240px] gap-4 flex-1 min-h-0">
        {/* Tabs */}
        <div className="panel flex flex-col min-h-0">
          {/* Tab bar */}
          <div className="flex border-b border-surface-400 overflow-x-auto flex-shrink-0">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              const count = tab.id !== 'refactor' ? tab.items.length : undefined;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-all ${
                    isActive
                      ? `border-brand-400 ${tab.color}`
                      : 'border-transparent text-surface-200 hover:text-surface-100'
                  }`}
                >
                  <span className={isActive ? tab.color : ''}>{tab.icon}</span>
                  {tab.label}
                  {count !== undefined && (
                    <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-xs font-mono ${
                      isActive ? `${tab.color} bg-white/10` : 'bg-surface-600 text-surface-200'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-4 min-h-0 animate-fade-in">
            {activeTab === 'refactor'
              ? <RefactorTab code={result.refactor_example} language={result.language} />
              : <IssueList items={activeConfig.items} dotColor={activeConfig.dotColor} />
            }
          </div>
        </div>

        {/* Complexity sidebar */}
        <ComplexityChart complexity={result.complexity} />
      </div>
    </div>
  );
}
