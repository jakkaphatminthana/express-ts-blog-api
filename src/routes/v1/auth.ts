import { Router } from 'express';

import validationError from '@/middlewares/validation-error';
import authenticate from '@/middlewares/authenticate';
import {
  LoginSchema,
  LogoutSchema,
  RefreshTokenSchema,
  RegisterSchema,
} from '@/validators/auth.validator';

import {
  login,
  register,
  refreshToken,
  logout,
} from '@/controllers/v1/auth.controller';

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
