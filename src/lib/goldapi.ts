import axios from 'axios';

import config from '@/config';
import { ORE_TYPE, CURRENCY } from '@/constants/enums';

export const fetchOrePrice = async (
  type: ORE_TYPE,
  currency: CURRENCY = CURRENCY.THB,
) => {
  const BASE_URL = config.GOLDAPI_BASE_URL;
  const API_KEY = config.GOLDAPI_API_KEY;

  const res = await axios.get(`${BASE_URL}/${type}/${currency}`, {
    headers: {
      'x-access-token': API_KEY,
      'Content-Type': 'application/json',
    },
  });

  return res.data;
};
