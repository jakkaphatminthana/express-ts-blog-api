import type { Request, Response } from 'express';
import { Types } from 'mongoose';

import { logger } from '@/lib/winston';
import { sendError } from '@/utils/http-error';
import { fetchOrePrice } from '@/lib/goldapi';
import { ORE_TYPE } from '@/constants/enums';

export const getOrePrice = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const data = await fetchOrePrice(ORE_TYPE.GOLD);
    res.status(200).json({ data: data });
  } catch (error) {
    sendError.internalServer(res, error);
    logger.error('Error while getMatalPrice, ', error);
  }
};
