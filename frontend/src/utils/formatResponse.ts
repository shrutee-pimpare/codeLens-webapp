import type { ReviewResult } from '../types/review.types';

export function getScoreColor(score: number): string {
  if (score >= 8) return 'text-emerald-400';
  if (score >= 6) return 'text-yellow-400';
  if (score >= 4) return 'text-orange-400';
  return 'text-red-400';
}

export function getScoreLabel(score: number): string {
  if (score >= 9) return 'Excellent';
  if (score >= 7) return 'Good';
  if (score >= 5) return 'Fair';
  if (score >= 3) return 'Poor';
  return 'Critical';
}

export function getScoreBg(score: number): string {
  if (score >= 8) return 'bg-emerald-500/10 border-emerald-500/30';
  if (score >= 6) return 'bg-yellow-500/10 border-yellow-500/30';
  if (score >= 4) return 'bg-orange-500/10 border-orange-500/30';
  return 'bg-red-500/10 border-red-500/30';
}

export function getTotalIssues(result: ReviewResult): number {
  return result.bugs.length + result.performance.length + result.readability.length + result.improvements.length;
}

export function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function getCyclomaticLabel(score: number): string {
  if (score <= 5) return 'Simple';
  if (score <= 10) return 'Moderate';
  if (score <= 20) return 'Complex';
  return 'Very Complex';
}

export function getCyclomaticColor(score: number): string {
  if (score <= 5) return 'text-emerald-400';
  if (score <= 10) return 'text-yellow-400';
  if (score <= 20) return 'text-orange-400';
  return 'text-red-400';
}
