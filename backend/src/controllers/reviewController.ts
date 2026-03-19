import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { reviewCodeWithAI } from '../services/openaiService';
import { analyzeComplexity } from '../services/complexityAnalyzer';
import { fetchGitHubFile } from '../utils/githubFetcher';
import { createError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const MAX_CODE_LENGTH = 10000;

export async function reviewCode(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError(errors.array()[0].msg as string, 400));
    }

    const { code, language = 'javascript' } = req.body as { code: string; language: string };

    if (code.length > MAX_CODE_LENGTH) {
      return next(createError(`Code exceeds maximum length of ${MAX_CODE_LENGTH} characters`, 400));
    }

    logger.info(`Processing review for ${language} code (${code.length} chars)`);

    const [aiReview, complexityResult] = await Promise.all([
      reviewCodeWithAI(code, language),
      Promise.resolve(analyzeComplexity(code, language)),
    ]);

    res.json({
      success: true,
      data: {
        ...aiReview,
        complexity: {
          time: complexityResult.timeComplexity,
          space: complexityResult.spaceComplexity,
          cyclomatic: complexityResult.cyclomaticComplexity,
          linesOfCode: complexityResult.linesOfCode,
          details: complexityResult.details,
        },
        language,
        analyzedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function fetchFromGitHub(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError(errors.array()[0].msg as string, 400));
    }

    const { url } = req.body as { url: string };
    logger.info(`Fetching GitHub file: ${url}`);

    const file = await fetchGitHubFile(url);
    res.json({ success: true, data: file });
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      return next(createError('GitHub file not found. Check the URL and try again.', 404));
    }
    next(error);
  }
}
