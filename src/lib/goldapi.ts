import axios from 'axios';

import config from '@/config';
import { logger } from '@/lib/winston';
import { ORE_SYMBOL, CURRENCY, ORE_NAME } from '@/constants/enums';
import { OreNameToSymbolMap } from '@/utils/ore';
import { fetchExchangeRateCurrency } from './exchange-rate-api';

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

  // covert USD to THB (for Platinum)
  // no have THB for platinum, so use USD instead
  let usdToTHBRate = 1;
  if (currency === CURRENCY.THB) {
    const rate = await fetchExchangeRateCurrency({
      from: CURRENCY.USD,
      to: CURRENCY.THB,
    });

    if (!rate) {
      logger.error('Unable to fetch USD to THB rate');
      throw new Error('Unable to fetch exchange rate');
    }
    usdToTHBRate = rate;
  }

  try {
    const results = await Promise.all(
      entries.map(async ([name, symbol]) => {
        // no have THB for platinum, so use USD instead
        const actualCurrency =
          symbol === ORE_SYMBOL.PLATINUM ? CURRENCY.USD : currency;

        const data = await fetchOrePrice(symbol, actualCurrency);

        const price: number =
          symbol === ORE_SYMBOL.PLATINUM && currency === CURRENCY.THB
            ? data.price * usdToTHBRate
            : data.price;

        return {
          name,
          metal: data.metal,
          price: Number(price.toFixed(2)),
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
