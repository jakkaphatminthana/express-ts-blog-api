import mongoose from 'mongoose';
import config from '@/config';

import type { ConnectOptions } from 'mongoose';

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
    console.log('✅ Connected to the database successful.', {
      uri: config.MONGO_URI,
      options: clientOptions,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.log('💥 Error connecting to the database', error);
  }
};

export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('❌ Disconnected from the database successful.', {
      uri: config.MONGO_URI,
      options: clientOptions,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    console.log('💥 Error disconnecting from the database', error);
  }
};
