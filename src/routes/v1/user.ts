import { Router } from 'express';

import { USER_ROLE } from '@/types/core.enums';

import authorize from '@/middlewares/authorize';
import authenticate from '@/middlewares/authenticate';
import validationError from '@/middlewares/validation-error';

import { UsersSchema, UserUpdateSchema } from '@/validators/user.validator';

import getMe from '@/controllers/v1/user/get-me';
import updateMe from '@/controllers/v1/user/put-update-me';
import deleteMe from '@/controllers/v1/user/delete-me';
import getUsers from '@/controllers/v1/user/get-users';
import getUser from '@/controllers/v1/user/get-user';
import deleteUser from '@/controllers/v1/user/delete-user';

const router = Router();

router.get(
  '/me',
  authenticate,
  authorize([USER_ROLE.Admin, USER_ROLE.User]),
  getMe,
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

router.get(
  '/',
  authenticate,
  authorize([USER_ROLE.Admin]),
  validationError(UsersSchema, 'query'),
  getUsers,
);
router.get('/:userId', authenticate, authorize([USER_ROLE.Admin]), getUser);
router.delete(
  '/:userId',
  authenticate,
  authorize([USER_ROLE.Admin]),
  deleteUser,
);

export default router;
