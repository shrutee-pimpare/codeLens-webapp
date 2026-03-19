import { useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { Play, Trash2, Loader2, Code2 } from 'lucide-react';
import { FileUploader } from '../FileUploader/FileUploader';
import { SUPPORTED_LANGUAGES } from '../../types/review.types';

interface CodeEditorProps {
  code: string;
  language: string;
  isLoading: boolean;
  isFetchingGitHub: boolean;
  githubError: string | null;
  onCodeChange: (code: string) => void;
  onLanguageChange: (lang: string) => void;
  onReview: () => void;
  onGitHubFetch: (url: string) => Promise<void>;
  onClearGitHubError: () => void;
}

const PLACEHOLDER = `// Paste your code here or load from GitHub
// Example: a simple bubble sort

function bubbleSort(arr: number[]): number[] {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`;

export function CodeEditor({
  code,
  language,
  isLoading,
  isFetchingGitHub,
  githubError,
  onCodeChange,
  onLanguageChange,
  onReview,
  onGitHubFetch,
  onClearGitHubError,
}: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const monacoLang = language === 'csharp' ? 'csharp'
    : language === 'cpp' ? 'cpp'
    : language;

  return (
    <div className="panel flex flex-col h-full">
      {/* Header */}
      <div className="panel-header flex-wrap gap-y-2">
        <Code2 size={15} className="text-brand-400" />
        <span className="text-xs font-medium text-surface-100 mr-auto">Code Editor</span>

        {/* Language selector */}
        <select
          value={language}
          onChange={e => onLanguageChange(e.target.value)}
          className="bg-surface-700 border border-surface-400 rounded-lg px-2 py-1 text-xs text-surface-100 focus:outline-none focus:border-brand-500 cursor-pointer"
        >
          {SUPPORTED_LANGUAGES.map(l => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </select>

        {/* GitHub importer */}
        <FileUploader
          onFetch={onGitHubFetch}
          isLoading={isFetchingGitHub}
          error={githubError}
          onClearError={onClearGitHubError}
        />

        {/* Clear */}
        <button
          onClick={() => onCodeChange('')}
          className="btn-ghost !px-2"
          title="Clear editor"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Monaco editor */}
      <div className="flex-1 min-h-0">
        <MonacoEditor
          height="100%"
          language={monacoLang}
          value={code || PLACEHOLDER}
          onChange={val => onCodeChange(val ?? '')}
          onMount={editor => { editorRef.current = editor; }}
          theme="vs-dark"
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontLigatures: true,
            lineHeight: 22,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 12, bottom: 12 },
            renderLineHighlight: 'gutter',
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            bracketPairColorization: { enabled: true },
            guides: { bracketPairs: true },
            tabSize: 2,
            wordWrap: 'on',
          }}
        />
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-surface-400 flex items-center justify-between">
        <span className="text-xs text-surface-200 font-mono">
          {code.split('\n').filter(l => l.trim()).length} lines
        </span>
        <button
          onClick={onReview}
          disabled={isLoading || !code.trim()}
          className="btn-primary"
        >
          {isLoading
            ? <><Loader2 size={14} className="animate-spin" /> Analyzing…</>
            : <><Play size={14} /> Review Code</>
          }
        </button>
      </div>
    </div>
  );
}
