import mongoose from 'mongoose';
import config from '@/config';

import type { ConnectOptions } from 'mongoose';
import { logger } from './winston';

const clientOptions: ConnectOptions = {
  dbName: 'express-blog-db',
  appName: 'Blog API',
  serverApi: {
    version: '1',
    strict: true, // disallow api not include v1
    deprecationErrors: true, //throw error when use deprecated api
  },
};

export const connectToDatabase = async (): Promise<void> => {
  if (!config.MONGO_URI) {
    throw new Error('MongoDB URI is not define in the configuration.');
  }

  try {
    await mongoose.connect(config.MONGO_URI, clientOptions);
    logger.info('✅ Connected to the database successful.', {
      uri: config.MONGO_URI,
      options: clientOptions,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    logger.error('💥 Error connecting to the database', error);
  }
};

export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.warn('❌ Disconnected from the database successful.', {
      uri: config.MONGO_URI,
      options: clientOptions,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    logger.error('💥 Error disconnecting from the database', error);
  }
};
