import { Router } from 'express';

import validationError from '@/middlewares/validationError';
import { loginValidator, registerValidator } from '@/validators/authValidator';

import login from '@/controllers/v1/auth/login';
import register from '@/controllers/v1/auth/regsiter';

const router = Router();

router.post('/register', registerValidator, validationError, register);
router.post('/login', loginValidator, validationError, login);

export default router;
