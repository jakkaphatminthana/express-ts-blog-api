import { ORE_TYPE } from '@/constants/enums';
import z from 'zod';

export const TradeOrePriceParamsSchema = z.object({
  type: z
    .enum(Object.values(ORE_TYPE) as [string, ...string[]], {
      message: `type must be one of ${Object.values(ORE_TYPE).join(', ')}`,
    })
    .optional(),
});

export const TradeOrePriceBodySchema = z.object({});
