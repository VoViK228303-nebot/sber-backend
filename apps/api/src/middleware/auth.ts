import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { UnauthorizedError, InvalidTokenError, TokenExpiredError } from '../utils/errors';
import { prisma } from '../lib/prisma';

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Access token is required');
    }

    const token = authHeader.substring(7);

    if (!token) {
      throw new UnauthorizedError('Access token is required');
    }

    // Verify token
    const payload = verifyAccessToken(token);

    if (payload.type !== 'access') {
      throw new InvalidTokenError();
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Account is deactivated');
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      next(error);
      return;
    }
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
        next(new TokenExpiredError());
        return;
      }
      if (error.name === 'JsonWebTokenError') {
        next(new InvalidTokenError());
        return;
      }
    }
    next(new UnauthorizedError('Invalid token'));
  }
}

// Optional authentication - doesn't throw error if no token
export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);

    if (!token) {
      return next();
    }

    const payload = verifyAccessToken(token);

    if (payload.type === 'access') {
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (user && user.isActive) {
        req.user = user;
      }
    }

    next();
  } catch {
    // Ignore errors for optional auth
    next();
  }
}
