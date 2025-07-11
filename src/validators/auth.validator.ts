import z from 'zod';

import { USER_ROLE } from '@/types/enums';

// Register
export const RegisterSchema = z.object({
  email: z
    .string({ message: 'Email is required' })
    .trim()
    .max(50, { message: 'Email must be less than 50 characters' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string({ message: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters' }),
  role: z
    .enum(Object.values(USER_ROLE) as [string, ...string[]], {
      message: `Role must be one of ${Object.values(USER_ROLE).join(', ')}`,
    })
    .optional(),
});
export type RegisterSchemaType = z.infer<typeof RegisterSchema>;

// Login
export const LoginSchema = z.object({
  email: z
    .string({ message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string({ message: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters' }),
});
export type LoginSchemaType = z.infer<typeof LoginSchema>;
