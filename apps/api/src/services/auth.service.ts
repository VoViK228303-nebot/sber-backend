import { prisma } from '../lib/prisma';
import { redis } from '../lib/redis';
import {
  generateTokens,
  verifyRefreshToken,
  verifyAccessToken,
} from '../utils/jwt';
import {
  hashPassword,
  comparePassword,
  validatePasswordStrength,
} from '../utils/password';
import {
  RegisterInput,
  LoginInput,
  JWTTokens,
  TokenPayload,
} from '../types';
import {
  EmailExistsError,
  PhoneExistsError,
  WeakPasswordError,
  InvalidCredentialsError,
  AccountBlockedError,
  InvalidTokenError,
  TokenExpiredError,
  NotFoundError,
} from '../utils/errors';
import { User } from '@prisma/client';
import crypto from 'crypto';

const REFRESH_TOKEN_PREFIX = 'refresh:';
const PASSWORD_RESET_PREFIX = 'password_reset:';
const PASSWORD_RESET_EXPIRY = 3600; // 1 hour

export class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterInput): Promise<{ user: User; tokens: JWTTokens }> {
    // Check password strength
    const passwordCheck = validatePasswordStrength(data.password);
    if (!passwordCheck.isValid) {
      throw new WeakPasswordError();
    }

    // Check if email exists
    const existingEmail = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingEmail) {
      throw new EmailExistsError();
    }

    // Check if phone exists
    const existingPhone = await prisma.user.findUnique({
      where: { phone: data.phone },
    });
    if (existingPhone) {
      throw new PhoneExistsError();
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user with settings
    const user = await prisma.user.create({
      data: {
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        patronymic: data.patronymic,
        settings: {
          create: {},
        },
      },
    });

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
    });

    // Store refresh token in Redis
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return { user, tokens };
  }

  /**
   * Login user
   */
  async login(
    data: LoginInput,
    deviceInfo?: { device?: string; ip?: string; location?: string }
  ): Promise<{ user: User; tokens: JWTTokens }> {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new InvalidCredentialsError();
    }

    // Check if account is active
    if (!user.isActive) {
      throw new AccountBlockedError();
    }

    // Verify password
    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
    });

    // Store refresh token
    await this.storeRefreshToken(user.id, tokens.refreshToken, deviceInfo);

    return { user, tokens };
  }

  /**
   * Logout user
   */
  async logout(refreshToken: string): Promise<void> {
    try {
      const payload = verifyRefreshToken(refreshToken);
      const key = `${REFRESH_TOKEN_PREFIX}${payload.userId}:${refreshToken}`;
      await redis.del(key);
    } catch {
      // Ignore invalid token on logout
    }
  }

  /**
   * Refresh access token
   */
  async refresh(refreshToken: string): Promise<JWTTokens> {
    // Verify token
    let payload: TokenPayload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (error) {
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        throw new TokenExpiredError();
      }
      throw new InvalidTokenError();
    }

    // Check if token exists in Redis
    const key = `${REFRESH_TOKEN_PREFIX}${payload.userId}:${refreshToken}`;
    const exists = await redis.exists(key);
    if (!exists) {
      throw new InvalidTokenError();
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || !user.isActive) {
      throw new InvalidTokenError();
    }

    // Delete old refresh token
    await redis.del(key);

    // Generate new tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
    });

    // Store new refresh token
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if email exists
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetKey = `${PASSWORD_RESET_PREFIX}${resetToken}`;

    // Store in Redis with expiry
    await redis.setex(resetKey, PASSWORD_RESET_EXPIRY, user.id);

    // TODO: Send email with reset link
    console.log(`Password reset token for ${email}: ${resetToken}`);
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    // Check password strength
    const passwordCheck = validatePasswordStrength(newPassword);
    if (!passwordCheck.isValid) {
      throw new WeakPasswordError();
    }

    // Verify token
    const resetKey = `${PASSWORD_RESET_PREFIX}${token}`;
    const userId = await redis.get(resetKey);

    if (!userId) {
      throw new InvalidTokenError();
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Delete reset token
    await redis.del(resetKey);

    // Invalidate all refresh tokens for this user
    await this.invalidateAllUserTokens(userId);
  }

  /**
   * Change password (authenticated)
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    // Check password strength
    const passwordCheck = validatePasswordStrength(newPassword);
    if (!passwordCheck.isValid) {
      throw new WeakPasswordError();
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    // Verify current password
    const isPasswordValid = await comparePassword(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Invalidate all refresh tokens
    await this.invalidateAllUserTokens(userId);
  }

  /**
   * Store refresh token in Redis
   */
  private async storeRefreshToken(
    userId: string,
    refreshToken: string,
    deviceInfo?: { device?: string; ip?: string; location?: string }
  ): Promise<void> {
    const key = `${REFRESH_TOKEN_PREFIX}${userId}:${refreshToken}`;
    const value = JSON.stringify({
      createdAt: new Date().toISOString(),
      ...deviceInfo,
    });

    // Store for 7 days (604800 seconds)
    await redis.setex(key, 604800, value);
  }

  /**
   * Invalidate all refresh tokens for a user
   */
  private async invalidateAllUserTokens(userId: string): Promise<void> {
    const pattern = `${REFRESH_TOKEN_PREFIX}${userId}:*`;
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }

  /**
   * Verify access token
   */
  verifyAccessToken(token: string): TokenPayload {
    return verifyAccessToken(token);
  }
}

export const authService = new AuthService();
