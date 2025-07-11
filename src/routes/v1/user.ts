import { Router } from 'express';

import { USER_ROLE } from '@/types/enums';

import authenticate from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';
import getCurrentUser from '@/controllers/v1/user/user.me';

const router = Router();

router.get(
  '/me',
  authenticate,
  authorize([USER_ROLE.Admin, USER_ROLE.User]),
  getCurrentUser,
);

export default router;
