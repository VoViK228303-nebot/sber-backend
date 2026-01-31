import winston from 'winston';
import { config } from '../config';

const { combine, timestamp, json, printf, colorize, errors } = winston.format;

// Custom format for development
const devFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  if (stack) {
    msg += `\n${stack}`;
  }
  return msg;
});

// Create logger instance
export const logger = winston.createLogger({
  level: config.env === 'production' ? 'info' : 'debug',
  defaultMeta: { service: 'sber-api' },
  transports: [
    new winston.transports.Console({
      format: combine(
        timestamp(),
        errors({ stack: true }),
        config.env === 'production' ? json() : combine(colorize(), devFormat)
      ),
    }),
  ],
});

// Add file transports in production
if (config.env === 'production') {
  logger.add(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: combine(timestamp(), json()),
    })
  );
  logger.add(
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: combine(timestamp(), json()),
    })
  );
}

// HTTP request logger format
export const httpLoggerFormat = ':method :url :status :res[content-length] - :response-time ms';

export default logger;
