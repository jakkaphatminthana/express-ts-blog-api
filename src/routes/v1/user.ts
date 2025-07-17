import { Router } from 'express';

import authorize from '@/middlewares/authorize';
import authenticate from '@/middlewares/authenticate';
import validationError from '@/middlewares/validation-error';

import { USER_ROLE } from '@/constants/enums';
import { UsersSchema, UserUpdateSchema } from '@/validators/user.validator';
import {
  deleteMe,
  deleteUser,
  getMe,
  getUser,
  getUsers,
  updateMe,
} from '@/controllers/v1/user.controller';

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
