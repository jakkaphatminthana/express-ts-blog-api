import { Router } from 'express';

import validationError from '@/middlewares/validation-error';
import {
  LoginSchema,
  LogoutSchema,
  RefreshTokenSchema,
  RegisterSchema,
} from '@/validators/auth.validator';

import login from '@/controllers/v1/auth/login';
import register from '@/controllers/v1/auth/regsiter';
import refreshToken from '@/controllers/v1/auth/refresh-token';
import authenticate from '@/middlewares/authenticate';
import logout from '@/controllers/v1/auth/logout';

const router = Router();

router.post('/register', validationError(RegisterSchema, 'body'), register);
router.post('/login', validationError(LoginSchema, 'body'), login);
router.post(
  '/refresh-token',
  validationError(RefreshTokenSchema, 'body'),
  refreshToken,
);
router.post(
  '/logout',
  validationError(LogoutSchema, 'body'),
  authenticate,
  logout,
);

export default router;
