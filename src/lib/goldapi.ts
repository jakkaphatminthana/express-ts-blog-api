import axios from 'axios';

import config from '@/config';
import { logger } from '@/lib/winston';
import { ORE_SYMBOL, CURRENCY, ORE_NAME } from '@/constants/enums';
import { OreNameToSymbolMap } from '@/utils/ore';

const BASE_URL = config.GOLDAPI_BASE_URL;
const HEADERS = {
  'x-access-token': config.GOLDAPI_API_KEY,
  'Content-Type': 'application/json',
};

export const fetchOrePrice = async (
  symbol: ORE_SYMBOL,
  currency: CURRENCY = CURRENCY.THB,
) => {
  try {
    const res = await axios.get(`${BASE_URL}/${symbol}/${currency}`, {
      headers: HEADERS,
    });

    return res.data;
  } catch (error) {
    logger.error('Error while fetchOrePrice', error);
  }
};

export const fetchAllOrePrices = async (currency: CURRENCY = CURRENCY.THB) => {
  const entries = Object.entries(OreNameToSymbolMap) as [
    ORE_NAME,
    ORE_SYMBOL,
  ][];

  try {
    const results = await Promise.all(
      entries.map(async ([name, symbol]) => {
        // no have THB for platinum, so use USD instead
        const actualCurrency =
          symbol === ORE_SYMBOL.PLATINUM ? CURRENCY.USD : currency;

        const data = await fetchOrePrice(symbol, actualCurrency);
        return {
          name,
          metal: data.metal,
          price: data.price,
          currency: data.currency,
          timestamp: data.timestamp,
        };
      }),
    );
    return results;
  } catch (error) {
    logger.error('Error while fetchAllOrePrices', error);
  }
};
