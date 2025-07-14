import { Router } from 'express';

import { USER_ROLE } from '@/types/enums';

import authorize from '@/middlewares/authorize';
import authenticate from '@/middlewares/authenticate';
import validationError from '@/middlewares/validation-error';

import getCurrentUser from '@/controllers/v1/user/get-me';
import updateMe from '@/controllers/v1/user/put-update-me';

import { UserUpdateSchema } from '@/validators/user.validator';
import deleteMe from '@/controllers/v1/user/delete.me';

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
router.delete(
  '/me',
  authenticate,
  authorize([USER_ROLE.Admin, USER_ROLE.User]),
  deleteMe,
);

export default router;
