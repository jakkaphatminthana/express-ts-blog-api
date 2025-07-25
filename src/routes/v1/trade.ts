import { Router } from 'express';

import authorize from '@/middlewares/authorize';
import authenticate from '@/middlewares/authenticate';
import validationError from '@/middlewares/validation-error';

import { USER_ROLE } from '@/constants/enums';
import {
  getAllOrePrices,
  getOrePrice,
} from '@/controllers/v1/trade.controller';
import {
  TradeOrePriceParamsSchema,
  TradeOrePriceQuerySchema,
} from '@/validators/trade.validator';

const router = Router();

router.get(
  '/price/:type',
  validationError(TradeOrePriceParamsSchema, 'params'),
  validationError(TradeOrePriceQuerySchema, 'query'),
  getOrePrice,
);

router.get(
  '/price',
  validationError(TradeOrePriceQuerySchema, 'query'),
  getAllOrePrices,
);

export default router;
