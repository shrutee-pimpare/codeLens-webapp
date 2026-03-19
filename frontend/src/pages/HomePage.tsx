import { useState } from "react";
import { AlertTriangle, X, RefreshCw, Cpu } from "lucide-react";
import { CodeEditor } from "../components/CodeEditor/CodeEditor";
import { ReviewPanel } from "../components/ReviewPanel/ReviewPanel";
import { Loader } from "../components/Loader/Loader";
import { useReview } from "../hooks/useReview";

export function HomePage() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("typescript");

  const {
    result,
    isLoading,
    error,
    isFetchingGitHub,
    githubError,
    runReview,
    loadFromGitHub,
    clearResult,
    clearError,
  } = useReview();

  const handleReview = () => runReview(code, language);

  const handleGitHubFetch = async (url: string) => {
    const file = await loadFromGitHub(url);
    if (file) {
      setCode(file.content);
      setLanguage(file.language);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-surface-900">
      {/* Top bar */}
      <header className="flex-shrink-0 h-14 border-b border-surface-400 flex items-center px-6 gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-brand-500/20 border border-brand-500/40 flex items-center justify-center">
            <Cpu size={14} className="text-brand-400" />
          </div>
          <span className="font-display font-semibold text-white tracking-tight">
            CodeLens
          </span>
          <span className="tag bg-brand-500/10 text-brand-400 border border-brand-500/20">
            AI
          </span>
        </div>

        <div className="h-5 w-px bg-surface-400 mx-1" />

        <nav className="flex items-center gap-1 text-xs text-surface-200">
          <span className="text-surface-100">Code Review</span>
          <span className="text-surface-400">—</span>
          <span>Powered by OpenAI llama-3.3-70b-versatile</span>
        </nav>

        {result && (
          <button onClick={clearResult} className="ml-auto btn-ghost !text-xs">
            <RefreshCw size={12} />
            New Review
          </button>
        )}
      </header>

      {/* Error banner */}
      {error && (
        <div className="flex-shrink-0 mx-6 mt-3 flex items-start gap-3 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 animate-slide-up">
          <AlertTriangle
            size={14}
            className="text-red-400 mt-0.5 flex-shrink-0"
          />
          <div className="flex-1 text-sm text-red-300">{error}</div>
          <button
            onClick={clearError}
            className="text-red-400 hover:text-red-300 flex-shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 min-h-0 p-6">
        {isLoading ? (
          <div className="panel h-full flex items-center justify-center">
            <Loader />
          </div>
        ) : result ? (
          <ReviewPanel result={result} />
        ) : (
          <CodeEditor
            code={code}
            language={language}
            isLoading={isLoading}
            isFetchingGitHub={isFetchingGitHub}
            githubError={githubError}
            onCodeChange={setCode}
            onLanguageChange={setLanguage}
            onReview={handleReview}
            onGitHubFetch={handleGitHubFetch}
            onClearGitHubError={clearError}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="flex-shrink-0 h-8 border-t border-surface-400 flex items-center px-6">
        <p className="text-xs text-surface-200">
          Max 10,000 chars · Rate limited · Powered by OpenAI
        </p>
        <div className="ml-auto flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
          <span className="text-xs text-surface-200">API Connected</span>
        </div>
      </footer>
    </div>
  );
}
