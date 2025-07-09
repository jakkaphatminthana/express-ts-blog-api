import { body } from 'express-validator';
import bcrypt from 'bcrypt';

import { USER_ROLE } from '@/types/enums';

import User from '@/models/user';

export const registerValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isLength({ max: 50 })
    .withMessage('Email must be less than 50 characters')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async (value) => {
      const userExists = await User.exists({ email: value });
      if (userExists) {
        throw new Error('Email or password is invalid');
      }
    }),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('role')
    .optional()
    .isString()
    .withMessage('Role must be a string')
    .isIn(Object.values(USER_ROLE))
    .withMessage(`Role must be one of ${Object.values(USER_ROLE).join(', ')}`),
];

export const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isLength({ max: 50 })
    .withMessage('Email must be less than 50 characters')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async (value) => {
      const userExists = await User.exists({ email: value });
      if (!userExists) {
        throw new Error('Email or password is invalid');
      }
    }),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .custom(async (value, { req }) => {
      const { email } = req.body as { email: string };
      const user = await User.findOne({ email })
        .select('password')
        .lean()
        .exec();

      if (!user) {
        throw new Error('Email or password is invalid');
      }

      const passwordMatch = await bcrypt.compare(value, user.password);
      if (!passwordMatch) {
        throw new Error('Email or password is invalid');
      }
    }),
];
