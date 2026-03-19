import OpenAI from 'openai';
import { logger } from '../utils/logger';

if (!process.env.GROQ_API_KEY) {
  logger.warn('GROQ_API_KEY is not set. AI features will be unavailable.');
}

export const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || '',
  baseURL: 'https://api.groq.com/openai/v1',
});

export const OPENAI_MODEL = 'llama-3.3-70b-versatile';
export const MAX_TOKENS = 2000;