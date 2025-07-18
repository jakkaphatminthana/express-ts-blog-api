import z from 'zod';
import { PaginationSchema } from './core.validator';

const socialLinkSchema = z
  .string()
  .url({ message: 'Invalid URL' })
  .max(100, { message: 'must be less than 100 characters' })
  .optional();

// User update
export const UserUpdateSchema = z.object({
  username: z
    .string()
    .trim()
    .max(20, { message: 'Username must be less than 20 characters' })
    .optional(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .optional(),
  firstName: z
    .string()
    .trim()
    .max(30, { message: 'FirstName must be less than 20 characters' })
    .optional(),
  lastName: z
    .string()
    .trim()
    .max(30, { message: 'LastName must be less than 20 characters' })
    .optional(),
  website: socialLinkSchema,
  facebook: socialLinkSchema,
  instagram: socialLinkSchema,
  linkedin: socialLinkSchema,
  x: socialLinkSchema,
  youtube: socialLinkSchema,
});
export type UserUpdateSchemaType = z.infer<typeof UserUpdateSchema>;

// Get Users
export const UsersSchema = PaginationSchema;
export type UsersSchemaType = z.infer<typeof UsersSchema>;
