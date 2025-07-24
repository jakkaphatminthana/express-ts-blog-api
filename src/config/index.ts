import dotenv from 'dotenv';
import type ms from 'ms';

dotenv.config();

const config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV,
  WHITELIST_ORIGINS: process.env.WHITELIST_ORIGINS?.split(',') ?? [],
  MONGO_URI: process.env.MONGO_URI,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY as ms.StringValue,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY as ms.StringValue,
  WHITELIST_ADMINS_MAIL: process.env.WHITELIST_ADMINS_MAIL?.split(',') ?? [],
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET!,
  GOLDAPI_API_KEY: process.env.GOLDAPI_API_KEY!,
  GOLDAPI_BASE_URL: process.env.GOLDAPI_BASE_URL!,
  EXCHANGE_RATE_BASE_URL: process.env.EXCHANGE_RATE_BASE_URL!,
  EXCHANGE_RATE_API_KEY: process.env.EXCHANGE_RATE_API_KEY!,
};

export default config;
