import { Router } from 'express';
import register from '@/controllers/v1/auth/regsiter';
import validationError from '@/middlewares/validationError';
import { registerValidator } from '@/validators/authValidator';

const router = Router();

router.post('/register', registerValidator, validationError, register);

export default router;
