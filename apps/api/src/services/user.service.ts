import { prisma } from '../lib/prisma';
import { User, Session } from '@prisma/client';
import { NotFoundError } from '../utils/errors';
import { UpdateProfileInput, UpdateSettingsInput, SessionInfo } from '../types';

export class UserService {
  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    return user;
  }

  /**
   * Get user profile with settings
   */
  async getProfile(userId: string): Promise<User & { settings: unknown }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { settings: true },
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    return user;
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    data: UpdateProfileInput
  ): Promise<User> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        patronymic: data.patronymic,
        avatar: data.avatar,
      },
    });

    return user;
  }

  /**
   * Get user settings
   */
  async getSettings(userId: string) {
    const settings = await prisma.userSettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      // Create default settings if not exists
      return prisma.userSettings.create({
        data: { userId },
      });
    }

    return settings;
  }

  /**
   * Update user settings
   */
  async updateSettings(
    userId: string,
    data: UpdateSettingsInput
  ) {
    const existingSettings = await prisma.userSettings.findUnique({
      where: { userId },
    });

    if (!existingSettings) {
      // Create settings with provided data
      return prisma.userSettings.create({
        data: {
          userId,
          ...(data.notifications && {
            emailNotifications: data.notifications.email,
            smsNotifications: data.notifications.sms,
            pushNotifications: data.notifications.push,
            transactionAlerts: data.notifications.transactionAlerts,
            marketingEmails: data.notifications.marketingEmails,
          }),
          ...(data.security && {
            twoFactorEnabled: data.security.twoFactorEnabled,
            loginNotifications: data.security.loginNotifications,
            sessionTimeout: data.security.sessionTimeout,
          }),
          ...(data.interface && {
            language: data.interface.language,
            theme: data.interface.theme,
            compactMode: data.interface.compactMode,
          }),
        },
      });
    }

    // Update existing settings
    return prisma.userSettings.update({
      where: { userId },
      data: {
        ...(data.notifications && {
          emailNotifications: data.notifications.email,
          smsNotifications: data.notifications.sms,
          pushNotifications: data.notifications.push,
          transactionAlerts: data.notifications.transactionAlerts,
          marketingEmails: data.notifications.marketingEmails,
        }),
        ...(data.security && {
          twoFactorEnabled: data.security.twoFactorEnabled,
          loginNotifications: data.security.loginNotifications,
          sessionTimeout: data.security.sessionTimeout,
        }),
        ...(data.interface && {
          language: data.interface.language,
          theme: data.interface.theme,
          compactMode: data.interface.compactMode,
        }),
      },
    });
  }

  /**
   * Get active sessions for user
   */
  async getSessions(userId: string, currentSessionId?: string): Promise<SessionInfo[]> {
    const sessions = await prisma.session.findMany({
      where: {
        userId,
        isActive: true,
        expiresAt: { gt: new Date() },
      },
      orderBy: { lastActive: 'desc' },
    });

    return sessions.map((session) => ({
      id: session.id,
      device: session.device || 'Unknown device',
      ip: session.ip || 'Unknown',
      location: session.location || 'Unknown',
      current: session.id === currentSessionId,
      lastActive: session.lastActive,
    }));
  }

  /**
   * Terminate a session
   */
  async terminateSession(
    userId: string,
    sessionId: string
  ): Promise<void> {
    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
        userId,
      },
    });

    if (!session) {
      throw new NotFoundError('Session');
    }

    await prisma.session.update({
      where: { id: sessionId },
      data: { isActive: false },
    });
  }

  /**
   * Terminate all sessions except current
   */
  async terminateOtherSessions(
    userId: string,
    currentSessionId: string
  ): Promise<void> {
    await prisma.session.updateMany({
      where: {
        userId,
        id: { not: currentSessionId },
        isActive: true,
      },
      data: { isActive: false },
    });
  }
}

export const userService = new UserService();
