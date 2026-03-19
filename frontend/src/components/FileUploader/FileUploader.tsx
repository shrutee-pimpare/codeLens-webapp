import { useState } from 'react';
import { Github, Link, X, Loader2 } from 'lucide-react';

interface FileUploaderProps {
  onFetch: (url: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  onClearError: () => void;
}

export function FileUploader({ onFetch, isLoading, error, onClearError }: FileUploaderProps) {
  const [url, setUrl] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    await onFetch(url.trim());
    setUrl('');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => { setIsOpen(o => !o); onClearError(); }}
        className="btn-ghost"
        title="Load from GitHub"
      >
        <Github size={15} />
        <span>GitHub</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-96 panel z-50 shadow-2xl animate-slide-up">
          <div className="panel-header">
            <Github size={14} className="text-brand-400" />
            <span className="text-xs font-medium text-surface-100">Import from GitHub</span>
            <button onClick={() => setIsOpen(false)} className="ml-auto text-surface-200 hover:text-white">
              <X size={14} />
            </button>
          </div>
          <div className="p-4 space-y-3">
            <p className="text-xs text-surface-200 leading-relaxed">
              Paste a GitHub file URL or raw URL. We'll fetch the content and detect the language automatically.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <Link size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-200" />
                <input
                  type="url"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://github.com/user/repo/blob/main/file.ts"
                  className="w-full bg-surface-700 border border-surface-400 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-surface-100 placeholder-surface-200 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
              {error && (
                <p className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={isLoading || !url.trim()}
                className="btn-primary w-full justify-center"
              >
                {isLoading ? <Loader2 size={13} className="animate-spin" /> : <Github size={13} />}
                {isLoading ? 'Fetching…' : 'Fetch File'}
              </button>
            </form>
            <div className="text-xs text-surface-200 space-y-1 pt-1 border-t border-surface-400">
              <p className="font-medium text-surface-100">Examples:</p>
              <p className="font-mono truncate opacity-70">github.com/user/repo/blob/main/app.py</p>
              <p className="font-mono truncate opacity-70">raw.githubusercontent.com/…/file.ts</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
