import { Router } from 'express';

import { USER_ROLE } from '@/types/enums';

import authenticate from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';
import getCurrentUser from '@/controllers/v1/user/get-me';
import updateMe from '@/controllers/v1/user/put-update-me';
import validationError from '@/middlewares/validation-error';
import { UserUpdateSchema } from '@/validators/user.validator';

const router = Router();

router.get(
  '/me',
  authenticate,
  authorize([USER_ROLE.Admin, USER_ROLE.User]),
  getCurrentUser,
);
router.put(
  '/me',
  authenticate,
  authorize([USER_ROLE.Admin, USER_ROLE.User]),
  validationError(UserUpdateSchema, 'body'),
  updateMe,
);

export default router;
