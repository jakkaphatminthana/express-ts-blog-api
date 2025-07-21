import z from 'zod';

export const CreateWalletSchema = z.object({
  amount: z
    .number({ message: 'amount is required' })
    .refine((val) => val !== 0, { message: 'amount must be not 0' }),
  note: z.string().optional(),
});

export type CreateWalletSchemaType = z.infer<typeof CreateWalletSchema>;
