import type { Request, Response } from 'express';
import { Types } from 'mongoose';

import { logger } from '@/lib/winston';
import { fetchAllOrePrices, fetchOrePrice } from '@/lib/goldapi';

import { CURRENCY, ORE_NAME } from '@/constants/enums';
import { sendError } from '@/utils/http-error';
import { OreNameToSymbolMap } from '@/utils/ore';

import {
  TradeOrePriceParamsSchemaType,
  TradeOrePriceQuerySchemaType,
} from '@/validators/trade.validator';

export const getOrePrice = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const params = req.params as TradeOrePriceParamsSchemaType;
    const query = req.query as TradeOrePriceQuerySchemaType;

    const type = params.type as ORE_NAME;
    const currency = query.currency as CURRENCY | undefined;

    const symbolOre = OreNameToSymbolMap[type];

    const data = await fetchOrePrice(symbolOre, currency);
    res.status(200).json({ data: data });
  } catch (error) {
    sendError.internalServer(res, error);
    logger.error('Error while getOrePrice, ', error);
  }
};

export const getAllOrePrices = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const query = req.query as TradeOrePriceQuerySchemaType;
    const currency = query.currency as CURRENCY | undefined;

    const data = await fetchAllOrePrices(currency);
    res.status(200).json({ data: data });
  } catch (error) {
    sendError.internalServer(res, error);
    logger.error('Error while getOrePrice, ', error);
  }
};
