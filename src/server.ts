import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

import type { CorsOptions } from 'cors';

import config from '@/config';
import limiter from '@/lib/express_rate_limit';
import v1Routes from '@/routes/v1/index';

const app = express();

// CORS Middleware
const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (
      config.NODE_ENV === 'development' ||
      !origin ||
      config.WHITELIST_ORIGINS.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(
        new Error(`CORS error: ${origin} is not allowed by CORS`),
        false,
      );
      console.log(`CORS error: ${origin} is not allowed by CORS`);
    }
  },
};
app.use(cors(corsOptions));

// Enable URL-encoded request body parsing with extended mode
app.use(express.urlencoded({ extended: true }));

// Enable JSON request body parsing
app.use(express.json());

// Enable Cookie header parser
app.use(cookieParser());

// Enable response compression to reduce payload size and improve performance
app.use(
  compression({
    threshold: 1024, //larger than 1KB
  }),
);

// Enhance security HTTP header
app.use(helmet());

// Enhance security rate limiting middleware to prevent excessive requests
app.use(limiter);

(async () => {
  try {
    app.use('/api/v1', v1Routes);

    app.listen(config.PORT, () => {
      console.log(`✅ Server running: http://localhost:${config.PORT}`);
    });
  } catch (error) {
    console.log('Failed to start the server', error);
    if (config.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
})();

const handleServerShutdown = async () => {
  try {
    console.log('❌ Server SHUTDOWN');
    process.exit(0);
  } catch (error) {
    console.log('💥 Error during server shutdown:', error);
  }
};

// Shutdown by kill command
process.on('SIGTERM', handleServerShutdown);
// Shutdown by Ctrl+C
process.on('SIGINT', handleServerShutdown);
