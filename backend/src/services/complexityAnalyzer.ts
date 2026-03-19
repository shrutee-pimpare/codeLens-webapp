export interface ComplexityResult {
  timeComplexity: string;
  spaceComplexity: string;
  cyclomaticComplexity: number;
  linesOfCode: number;
  details: string;
}

interface ComplexityHints {
  hasNestedLoops: boolean;
  loopDepth: number;
  hasRecursion: boolean;
  hasSorting: boolean;
  hasHashMap: boolean;
  hasBinarySearch: boolean;
  hasDivideConquer: boolean;
  hasDynamicProgramming: boolean;
}

function detectComplexityHints(code: string): ComplexityHints {
  const lines = code.split('\n');
  let loopDepth = 0;
  let maxLoopDepth = 0;
  let currentDepth = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    const loopPatterns = /\b(for|while|forEach|map|filter|reduce|do)\b/;
    if (loopPatterns.test(trimmed)) {
      currentDepth++;
      if (currentDepth > maxLoopDepth) maxLoopDepth = currentDepth;
    }
    if (trimmed.includes('{')) loopDepth++;
    if (trimmed.includes('}')) {
      loopDepth = Math.max(0, loopDepth - 1);
      if (loopDepth < currentDepth) currentDepth = Math.max(0, currentDepth - 1);
    }
  }

  const codeStr = code.toLowerCase();
  const fnNameMatch = code.match(/function\s+(\w+)/);
  const fnName = fnNameMatch?.[1] || '';
  const hasRecursion = fnName ? new RegExp(`\\b${fnName}\\s*\\(`).test(code) : false;

  return {
    hasNestedLoops: maxLoopDepth >= 2,
    loopDepth: maxLoopDepth,
    hasRecursion,
    hasSorting: /\.sort\s*\(|sort\s*\(|quicksort|mergesort|heapsort/i.test(codeStr),
    hasHashMap: /map|dict|hashmap|hashtable|{}/i.test(codeStr),
    hasBinarySearch: /binary.?search|bsearch/i.test(codeStr),
    hasDivideConquer: /divide|conquer|merge.?sort|quick.?sort/i.test(codeStr),
    hasDynamicProgramming: /dp\[|memo|memoiz|tabulation|cache/i.test(codeStr),
  };
}

function calculateCyclomaticComplexity(code: string): number {
  const decisionPoints = [
    /\bif\b/g,
    /\belse\s+if\b/g,
    /\bwhile\b/g,
    /\bfor\b/g,
    /\bcase\b/g,
    /\bcatch\b/g,
    /\?\s*:/g,
    /&&/g,
    /\|\|/g,
  ];

  let count = 1; // Base complexity
  for (const pattern of decisionPoints) {
    const matches = code.match(pattern);
    if (matches) count += matches.length;
  }
  return count;
}

export function analyzeComplexity(code: string, language: string): ComplexityResult {
  const hints = detectComplexityHints(code);
  const linesOfCode = code.split('\n').filter(l => l.trim().length > 0).length;
  const cyclomaticComplexity = calculateCyclomaticComplexity(code);

  let timeComplexity = 'O(1)';
  let spaceComplexity = 'O(1)';
  let details = '';

  if (hints.hasDynamicProgramming) {
    timeComplexity = 'O(n²)';
    spaceComplexity = 'O(n)';
    details = 'Dynamic programming pattern detected — typically polynomial time with memoization.';
  } else if (hints.hasDivideConquer) {
    timeComplexity = 'O(n log n)';
    spaceComplexity = 'O(log n)';
    details = 'Divide-and-conquer pattern detected — typical of merge/quick sort algorithms.';
  } else if (hints.hasBinarySearch) {
    timeComplexity = 'O(log n)';
    spaceComplexity = 'O(1)';
    details = 'Binary search pattern detected — logarithmic time complexity.';
  } else if (hints.hasSorting && hints.hasNestedLoops) {
    timeComplexity = 'O(n² log n)';
    spaceComplexity = 'O(n)';
    details = 'Sorting with nested loops detected — combined complexity.';
  } else if (hints.hasSorting) {
    timeComplexity = 'O(n log n)';
    spaceComplexity = 'O(n)';
    details = 'Sorting operation detected — typically O(n log n) for comparison-based sorts.';
  } else if (hints.hasRecursion) {
    timeComplexity = 'O(2ⁿ)';
    spaceComplexity = 'O(n)';
    details = 'Recursive pattern detected — could be exponential without memoization.';
  } else if (hints.loopDepth >= 3) {
    timeComplexity = 'O(n³)';
    spaceComplexity = 'O(1)';
    details = 'Triple nested loops detected — cubic time complexity.';
  } else if (hints.loopDepth >= 2) {
    timeComplexity = 'O(n²)';
    spaceComplexity = hints.hasHashMap ? 'O(n)' : 'O(1)';
    details = 'Nested loops detected — quadratic time complexity.';
  } else if (hints.loopDepth >= 1) {
    timeComplexity = 'O(n)';
    spaceComplexity = hints.hasHashMap ? 'O(n)' : 'O(1)';
    details = 'Single loop detected — linear time complexity.';
  } else {
    timeComplexity = 'O(1)';
    spaceComplexity = 'O(1)';
    details = 'No significant loops or recursion — constant time complexity.';
  }

  return {
    timeComplexity,
    spaceComplexity,
    cyclomaticComplexity,
    linesOfCode,
    details,
  };
}
