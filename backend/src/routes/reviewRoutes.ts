import { Router } from 'express';
import { body } from 'express-validator';
import { reviewCode, fetchFromGitHub } from '../controllers/reviewController';

const router = Router();

router.post(
  '/review',
  [
    body('code')
      .notEmpty().withMessage('Code is required')
      .isString().withMessage('Code must be a string')
      .isLength({ min: 1, max: 10000 }).withMessage('Code must be between 1 and 10000 characters'),
    body('language')
      .optional()
      .isString().withMessage('Language must be a string')
      .isLength({ max: 50 }).withMessage('Language name too long'),
  ],
  reviewCode
);

router.post(
  '/fetch-github',
  [
    body('url')
      .notEmpty().withMessage('URL is required')
      .isURL().withMessage('Must be a valid URL')
      .contains('github').withMessage('Must be a GitHub URL'),
  ],
  fetchFromGitHub
);

export default router;
