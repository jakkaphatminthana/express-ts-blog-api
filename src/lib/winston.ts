import config from '@/config';
import winston from 'winston';

const { combine, timestamp, json, errors, align, printf, colorize } =
  winston.format;

const transports: winston.transport[] = [];

// Add console logging only if not in prod env
if (config.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }), // enable color log
        timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }),
        align(), // align message
        printf(({ timestamp, level, message, ...meta }) => {
          // convert into JSON string pretty
          const metaStr = Object.keys(meta).length
            ? `\n${JSON.stringify(meta)}`
            : '';

          // final log output format
          return `${timestamp} [${level.toUpperCase()}]: ${message}${metaStr}`;
        }),
      ),
    }),
  );
}

// instance logger winston
const logger = winston.createLogger({
  level: config.LOG_LEVEL || 'info',
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports,
  silent: config.NODE_ENV === 'test', //disable in test env
});

export { logger };
