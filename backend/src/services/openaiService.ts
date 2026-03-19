import { openai, OPENAI_MODEL, MAX_TOKENS } from '../config/openai';
import { logger } from '../utils/logger';

export interface ReviewFeedback {
  bugs: string[];
  performance: string[];
  readability: string[];
  improvements: string[];
  refactor_example: string;
  overall_score: number;
  summary: string;
}

const SYSTEM_PROMPT = `You are a senior software engineer with 15+ years of experience performing thorough code reviews.
Your task is to analyze code and return structured, actionable feedback.

Always respond with VALID JSON only. No markdown, no explanations outside JSON.

Return exactly this structure:
{
  "bugs": ["list of potential bugs or null safety issues"],
  "performance": ["list of performance improvement suggestions"],
  "readability": ["list of readability and naming suggestions"],
  "improvements": ["list of general best practice improvements"],
  "refactor_example": "a refactored version of the code as a string with \\n for newlines",
  "overall_score": <number 1-10>,
  "summary": "a 2-3 sentence overall assessment"
}

Be specific, actionable, and reference actual line numbers or code patterns when possible.`;

function buildUserPrompt(code: string, language: string): string {
  return `Review the following ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nReturn JSON feedback only.`;
}

function parseAIResponse(content: string): ReviewFeedback {
  const cleaned = content
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();

  const parsed = JSON.parse(cleaned) as ReviewFeedback;

  return {
    bugs: Array.isArray(parsed.bugs) ? parsed.bugs : [],
    performance: Array.isArray(parsed.performance) ? parsed.performance : [],
    readability: Array.isArray(parsed.readability) ? parsed.readability : [],
    improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
    refactor_example: parsed.refactor_example || '',
    overall_score: typeof parsed.overall_score === 'number' ? parsed.overall_score : 5,
    summary: parsed.summary || 'Analysis complete.',
  };
}

export async function reviewCodeWithAI(
  code: string,
  language: string
): Promise<ReviewFeedback> {
  logger.info(`Sending code review request to Groq for language: ${language}`);

  try {
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      max_tokens: MAX_TOKENS,
      temperature: 0.3,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt(code, language) },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('Groq returned an empty response');

    logger.debug(`Groq response received, tokens used: ${response.usage?.total_tokens}`);
    return parseAIResponse(content);

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error(`Groq API error: ${msg}`);
    throw new Error(`Groq API error: ${msg}`);
  }
}