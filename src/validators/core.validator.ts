import z from 'zod';

export const PaginationSchema = z.object({
  page: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => val > 0, { message: 'page must be a positive number' })
    .optional(),
  pageSize: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => val > 0, { message: 'pageSize must be a positive number' })
    .optional(),
  search: z.string().optional(),
});
