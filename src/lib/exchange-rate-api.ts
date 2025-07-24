import axios from 'axios';
import config from '@/config';

import { logger } from '@/lib/winston';
import { ExchangeCurrency } from '@/types/trade.types';

const BASE_URL = config.EXCHANGE_RATE_BASE_URL;
const API_KEY = config.EXCHANGE_RATE_API_KEY;

interface PairProp {
  from: string;
  to: string;
}

export const fetchExchangeRateCurrency = async ({ from, to }: PairProp) => {
  try {
    const result = await axios.get(`${BASE_URL}/${API_KEY}/pair/${from}/${to}`);
    const resultData: ExchangeCurrency = result.data;

    if (resultData.result !== 'success') {
      throw new Error('Error fetching exchange rate currency');
    }

    return resultData.conversion_rate;
  } catch (error) {
    logger.error('Error while fetchExchangeRateCurrency', error);
  }
};
