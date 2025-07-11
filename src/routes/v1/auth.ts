import { Router } from 'express';

import validationError from '@/middlewares/validation-error';
import { LoginSchema, RegisterSchema } from '@/validators/auth.validator';

import login from '@/controllers/v1/auth/login';
import register from '@/controllers/v1/auth/regsiter';
import refreshToken from '@/controllers/v1/auth/refresh-token';

const router = Router();

router.post('/register', validationError(RegisterSchema, 'body'), register);
router.post('/login', validationError(LoginSchema, 'body'), login);
// router.post('/refresh-token', registerValidator, validationError, refreshToken);

export default router;
