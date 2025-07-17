import { body } from 'express-validator';

export const careatePostValidationRules = [
  body('title').trim().notEmpty().withMessage('Title is required').bail().isLength({ min: 3 }),
  body('content').trim().notEmpty().withMessage('Content is required').isLength({ min: 8 }).bail(),
];
export const updatePostValidationRules = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .bail()
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters long'),

  body('content')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Content cannot be empty')
    .bail()
    .isLength({ min: 8 })
    .withMessage('Content must be at least 8 characters long'),
];
