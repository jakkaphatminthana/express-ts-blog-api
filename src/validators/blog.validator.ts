import z from 'zod';
import { BLOG_STATUS } from '@/constants/enums';
import { PaginationSchema } from './core.validator';

// Get all
export const BlogsSchema = PaginationSchema.extend({
  status: z
    .enum(Object.values(BLOG_STATUS) as [string, ...string[]], {
      message: `status must be one of ${Object.values(BLOG_STATUS).join(', ')}`,
    })
    .optional(),
  author: z.string().optional(),
});
export type BlogsSchemaType = z.infer<typeof BlogsSchema>;

// Create
export const CreateBlogSchema = z.object({
  title: z
    .string({ message: 'title is required' })
    .max(180, { message: 'title must be less than 50 characters' }),
  content: z.string({ message: 'content is required' }),
  status: z
    .enum(Object.values(BLOG_STATUS) as [string, ...string[]], {
      message: `status must be one of ${Object.values(BLOG_STATUS).join(', ')}`,
    })
    .optional(),
});
export type CreateBlogSchemaType = z.infer<typeof CreateBlogSchema>;

// Update
// Create
export const UpdateBlogSchema = z.object({
  title: z
    .string()
    .max(180, { message: 'title must be less than 50 characters' })
    .optional(),
  content: z.string().optional(),
  status: z
    .enum(Object.values(BLOG_STATUS) as [string, ...string[]], {
      message: `status must be one of ${Object.values(BLOG_STATUS).join(', ')}`,
    })
    .optional(),
});
export type UpdateBlogSchemaType = z.infer<typeof UpdateBlogSchema>;
