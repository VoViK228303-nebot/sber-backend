import rateLimit from 'express-rate-limit';
import { config } from '../config';
import { TooManyRequestsError } from '../utils/errors';

// General rate limiter
export const generalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(new TooManyRequestsError());
  },
  keyGenerator: (req) => {
    return req.ip || 'unknown';
  },
});

// Strict rate limiter for auth endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (_req, _res, next) => {
    next(new TooManyRequestsError('Too many login attempts, please try again later'));
  },
});

// Registration rate limiter
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(new TooManyRequestsError('Too many registration attempts, please try again later'));
  },
});

// Transfer rate limiter
export const transferLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 transfers
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(new TooManyRequestsError('Too many transfers, please try again later'));
  },
});
