import { Router } from 'express';

import validationError from '@/middlewares/validation-error';
import { loginValidator, registerValidator } from '@/validators/auth-validator';

import login from '@/controllers/v1/auth/login';
import register from '@/controllers/v1/auth/regsiter';

const router = Router();

router.post('/register', registerValidator, validationError, register);
// router.post('/register', validationError(RegisterSchema, 'body'), register);

router.post('/login', loginValidator, validationError, login);

export default router;
