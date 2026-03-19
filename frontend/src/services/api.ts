import axios, { AxiosError } from 'axios';
import type { ReviewRequest, ReviewResult, ApiResponse, GitHubFetchResult } from '../types/review.types';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
});

function extractErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return (
      (error.response?.data as ApiResponse<unknown>)?.error?.message ??
      error.message ??
      'Request failed'
    );
  }
  return error instanceof Error ? error.message : 'Unknown error occurred';
}

export async function submitReview(request: ReviewRequest): Promise<ReviewResult> {
  try {
    const { data } = await api.post<ApiResponse<ReviewResult>>('/review', request);
    if (!data.success || !data.data) throw new Error('Invalid response from server');
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function fetchGitHubFile(url: string): Promise<GitHubFetchResult> {
  try {
    const { data } = await api.post<ApiResponse<GitHubFetchResult>>('/fetch-github', { url });
    if (!data.success || !data.data) throw new Error('Failed to fetch GitHub file');
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}
