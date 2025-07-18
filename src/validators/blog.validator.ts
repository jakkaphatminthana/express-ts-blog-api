import z from 'zod';
import { BLOG_STATUS } from '@/constants/enums';
import { PaginationSchema } from './core.validator';

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

// Get all
export const BlogsSchema = PaginationSchema.extend({
  status: z
    .enum(Object.values(BLOG_STATUS) as [string, ...string[]], {
      message: `status must be one of ${Object.values(BLOG_STATUS).join(', ')}`,
    })
    .optional(),
});
export type BlogsSchemaType = z.infer<typeof BlogsSchema>;
