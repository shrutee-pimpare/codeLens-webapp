export interface ReviewRequest {
  code: string;
  language: string;
}

export interface ComplexityInfo {
  time: string;
  space: string;
  cyclomatic: number;
  linesOfCode: number;
  details: string;
}

export interface ReviewResult {
  bugs: string[];
  performance: string[];
  readability: string[];
  improvements: string[];
  refactor_example: string;
  overall_score: number;
  summary: string;
  complexity: ComplexityInfo;
  language: string;
  analyzedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { message: string };
}

export interface GitHubFetchResult {
  content: string;
  filename: string;
  language: string;
}

export type ReviewTab = 'bugs' | 'performance' | 'readability' | 'improvements' | 'refactor';

export const SUPPORTED_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'php', label: 'PHP' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'sql', label: 'SQL' },
] as const;
