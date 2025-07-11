import { body } from 'express-validator';

import { USER_ROLE } from '@/types/enums';

// export const RegisterSchema = z.object({
//   email: z
//     .string({ message: 'Email is required' })
//     .trim()
//     .max(50, { message: 'Email must be less than 50 characters' })
//     .email({ message: 'Invalid email address' }),
//   password: z
//     .string({ message: 'Password is required' })
//     .min(8, { message: 'Password must be at least 8 characters' }),
//   role: z.enum(Object.values(USER_ROLE) as [string, ...string[]]).optional(),
// });
// export type RegisterSchemaType = z.infer<typeof RegisterSchema>;

export const registerValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isLength({ max: 50 })
    .withMessage('Email must be less than 50 characters')
    .isEmail()
    .withMessage('Invalid email address'),
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
    .withMessage('Invalid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
];
