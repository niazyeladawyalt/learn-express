import { body } from 'express-validator';

export const productValidationRules = [
  body('title').trim().notEmpty().withMessage('Title is required').bail().isLength({ min: 3 }),

  body('price').trim().notEmpty().withMessage('Price is required').bail().isFloat(),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 8 })
    .bail(),

  // body('imgUrl')
  //   .trim()
  //   .notEmpty()
  //   .withMessage('Image URL is required')
  //   .bail()
  //   .isURL()
  //   .withMessage('Image URL must be a valid URL'),
];
