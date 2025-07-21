import type { Request, Response } from 'express';
import { Types } from 'mongoose';

import { logger } from '@/lib/winston';
import { sendError } from '@/utils/http-error';

import { WalletService } from '@/services/v1/wallet.service';
import { CreateWalletSchemaType } from '@/validators/wallet.validator';
import { walletDto } from '@/dtos/wallet.dto';

export const getBalance = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;

    const balance = await WalletService.getBalance(userId as Types.ObjectId);
    res.status(200).json({ data: { balance } });
  } catch (error) {
    sendError.internalServer(res, error);
    logger.error('Error while getBalance, ', error);
  }
};

export const getWalletHistories = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;
    const listData = await WalletService.getHistoriesByUserId(
      userId as Types.ObjectId,
    );

    const listDataFormats = listData.map((item) => walletDto(item));
    res.status(200).json({ data: listDataFormats });
  } catch (error) {
    sendError.internalServer(res, error);
    logger.error('Error while getHistories, ', error);
  }
};

export const transaction = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;
    const body = req.body as CreateWalletSchemaType;

    const data = await WalletService.transaction(
      userId as Types.ObjectId,
      body,
    );
    res.status(201).json({ data: walletDto(data) });
  } catch (error) {
    sendError.internalServer(res, error);
    logger.error('Error while transaction, ', error);
  }
};
