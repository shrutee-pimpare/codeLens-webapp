import { useState, useCallback } from 'react';
import { submitReview, fetchGitHubFile } from '../services/api';
import type { ReviewResult } from '../types/review.types';

interface UseReviewState {
  result: ReviewResult | null;
  isLoading: boolean;
  error: string | null;
  isFetchingGitHub: boolean;
  githubError: string | null;
}

interface UseReviewReturn extends UseReviewState {
  runReview: (code: string, language: string) => Promise<void>;
  loadFromGitHub: (url: string) => Promise<{ content: string; language: string } | null>;
  clearResult: () => void;
  clearError: () => void;
}

export function useReview(): UseReviewReturn {
  const [state, setState] = useState<UseReviewState>({
    result: null,
    isLoading: false,
    error: null,
    isFetchingGitHub: false,
    githubError: null,
  });

  const runReview = useCallback(async (code: string, language: string) => {
    if (!code.trim()) return;
    setState(s => ({ ...s, isLoading: true, error: null }));
    try {
      const result = await submitReview({ code, language });
      setState(s => ({ ...s, result, isLoading: false }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Review failed';
      setState(s => ({ ...s, error: message, isLoading: false }));
    }
  }, []);

  const loadFromGitHub = useCallback(async (url: string) => {
    setState(s => ({ ...s, isFetchingGitHub: true, githubError: null }));
    try {
      const file = await fetchGitHubFile(url);
      setState(s => ({ ...s, isFetchingGitHub: false }));
      return { content: file.content, language: file.language };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch file';
      setState(s => ({ ...s, githubError: message, isFetchingGitHub: false }));
      return null;
    }
  }, []);

  const clearResult = useCallback(() => setState(s => ({ ...s, result: null })), []);
  const clearError = useCallback(() => setState(s => ({ ...s, error: null, githubError: null })), []);

  return { ...state, runReview, loadFromGitHub, clearResult, clearError };
}
