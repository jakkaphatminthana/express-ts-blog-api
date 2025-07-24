import { Router } from 'express';

import authorize from '@/middlewares/authorize';
import authenticate from '@/middlewares/authenticate';
import validationError from '@/middlewares/validation-error';

import { USER_ROLE } from '@/constants/enums';
import { getOrePrice } from '@/controllers/v1/trade.controller';

const router = Router();

router.get('/price', getOrePrice);

export default router;
