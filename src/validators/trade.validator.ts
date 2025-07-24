import { CURRENCY, ORE_NAME } from '@/constants/enums';
import z from 'zod';

// Ore param
export const TradeOrePriceParamsSchema = z.object({
  type: z.enum(Object.values(ORE_NAME) as [string, ...string[]], {
    message: `type must be one of ${Object.values(ORE_NAME).join(', ')}`,
  }),
});
export type TradeOrePriceParamsSchemaType = z.infer<
  typeof TradeOrePriceParamsSchema
>;

// Ores, ore query
export const TradeOrePriceQuerySchema = z.object({
  currency: z
    .enum(Object.values(CURRENCY) as [string, ...string[]], {
      message: `currency must be one of ${Object.values(CURRENCY).join(', ')}`,
    })
    .optional(),
});
export type TradeOrePriceQuerySchemaType = z.infer<
  typeof TradeOrePriceQuerySchema
>;
