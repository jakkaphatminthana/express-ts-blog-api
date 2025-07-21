import { Router } from 'express';

import authorize from '@/middlewares/authorize';
import authenticate from '@/middlewares/authenticate';
import validationError from '@/middlewares/validation-error';

import { USER_ROLE } from '@/constants/enums';
import {
  getBalance,
  getWalletHistories,
  transaction,
} from '@/controllers/v1/wallet.controller';
import { CreateWalletSchema } from '@/validators/wallet.validator';

const router = Router();

router.get(
  '/balance',
  authenticate,
  authorize([USER_ROLE.Admin, USER_ROLE.User]),
  getBalance,
);

router.get(
  '/histories',
  authenticate,
  authorize([USER_ROLE.Admin, USER_ROLE.User]),
  getWalletHistories,
);

router.post(
  '/transaction',
  authenticate,
  authorize([USER_ROLE.Admin, USER_ROLE.User]),
  validationError(CreateWalletSchema, 'body'),
  transaction,
);

export default router;
