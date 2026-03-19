import axios from 'axios';
import { logger } from './logger';

export interface GitHubFile {
  content: string;
  filename: string;
  language: string;
}

const LANGUAGE_MAP: Record<string, string> = {
  ts: 'typescript',
  tsx: 'typescript',
  js: 'javascript',
  jsx: 'javascript',
  py: 'python',
  java: 'java',
  cpp: 'cpp',
  c: 'c',
  cs: 'csharp',
  go: 'go',
  rs: 'rust',
  rb: 'ruby',
  php: 'php',
  swift: 'swift',
  kt: 'kotlin',
  sh: 'bash',
  sql: 'sql',
  html: 'html',
  css: 'css',
  scss: 'scss',
  json: 'json',
  yaml: 'yaml',
  yml: 'yaml',
  md: 'markdown',
};

function detectLanguageFromExtension(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return LANGUAGE_MAP[ext] || 'plaintext';
}

function convertToRawUrl(url: string): string {
  // Handle github.com URLs
  if (url.includes('github.com') && !url.includes('raw.githubusercontent.com')) {
    return url
      .replace('github.com', 'raw.githubusercontent.com')
      .replace('/blob/', '/');
  }
  return url;
}

export async function fetchGitHubFile(url: string): Promise<GitHubFile> {
  const rawUrl = convertToRawUrl(url);
  logger.info(`Fetching GitHub file from: ${rawUrl}`);

  const response = await axios.get<string>(rawUrl, {
    timeout: 10000,
    headers: { Accept: 'text/plain' },
    responseType: 'text',
  });

  const filename = rawUrl.split('/').pop() || 'unknown';
  const language = detectLanguageFromExtension(filename);

  return {
    content: response.data,
    filename,
    language,
  };
}
