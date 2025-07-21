import { Types } from 'mongoose';

import { createError } from '@/types/core.error';
import { logger } from '@/lib/winston';

import Wallet, { WalletDocument } from '@/models/wallet';
import { CreateWalletSchemaType } from '@/validators/wallet.validator';

export const WalletService = {
  getBalance: async (userId: Types.ObjectId | string): Promise<number> => {
    const userTransactions = await Wallet.find({ userId }).exec();
    const total = userTransactions.reduce((sum, t) => sum + t.amount, 0);
    return total;
  },

  getHistoriesByUserId: async (
    userId: Types.ObjectId | string,
  ): Promise<WalletDocument[]> => {
    return await Wallet.find({ userId })
      .select('-__v')
      .sort({ createdAt: 1 }) //ASC
      .exec();
  },

  transaction: async (
    userId: Types.ObjectId | string,
    requestData: CreateWalletSchemaType,
  ): Promise<WalletDocument> => {
    const { amount, note } = requestData;

    if (amount === 0) {
      throw createError.badRequest('Amount must not be 0');
    }

    const balance = await WalletService.getBalance(userId);

    // If withdraw
    if (amount < 0 && balance + amount < 0) {
      logger.warn('withdraw too much than Balance');
      throw createError.badRequest('Insufficient balance');
    }

    const transaction = await Wallet.create({
      userId,
      amount,
      note,
    });

    logger.info('Wallet transaction created', transaction);

    return transaction;
  },
};
