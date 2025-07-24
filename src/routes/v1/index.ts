import { Router } from 'express';

import authRoutes from '@/routes/v1/auth';
import userRoutes from '@/routes/v1/user';
import blogRoutes from '@/routes/v1/blog';
import walletRoutes from '@/routes/v1/wallet';
import tradeRoutes from '@/routes/v1/trade';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is live',
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/blogs', blogRoutes);
router.use('/wallet', walletRoutes);
router.use('/trade', tradeRoutes);

export default router;
