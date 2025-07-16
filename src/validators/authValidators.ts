import { body } from 'express-validator';
import User from '../models/user';

export const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Email is invalid')
    .bail()
    .normalizeEmail(),

  body('password').trim().isStrongPassword().withMessage('Password is not strong enough!'),
];

export const signupValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Email is invalid')
    .bail()
    .custom(async (email) => {
      const foundUser = await User.findOne({ email });
      if (foundUser) {
        throw new Error('User already exists!');
      }
    })
    .normalizeEmail(),

  body('password').isStrongPassword().withMessage('Password is not strong enough!'),

  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Confirm password does not match password!');
    }
    return true;
  }),
];
