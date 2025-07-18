import z from 'zod';
import { BLOG_STATUS } from '@/constants/enums';

export const BlogSchema = z.object({
  title: z
    .string({ message: 'title is required' })
    .max(180, { message: 'title must be less than 50 characters' }),
  content: z.string({ message: 'content is required' }),
  status: z
    .enum(Object.values(BLOG_STATUS) as [string, ...string[]], {
      message: `Role must be one of ${Object.values(BLOG_STATUS).join(', ')}`,
    })
    .optional(),
});
export type BlogSchemaType = z.infer<typeof BlogSchema>;
