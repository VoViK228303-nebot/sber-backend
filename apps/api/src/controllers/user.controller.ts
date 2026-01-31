import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { ApiResponse } from '../types';
import { updateProfileSchema, updateSettingsSchema, uuidSchema } from '../utils/validation';

export class UserController {
  /**
   * Get current user profile
   */
  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const user = await userService.getProfile(userId);

      const response: ApiResponse = {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            phone: user.phone,
            firstName: user.firstName,
            lastName: user.lastName,
            patronymic: user.patronymic,
            fullName: `${user.lastName} ${user.firstName} ${user.patronymic || ''}`.trim(),
            avatar: user.avatar,
            verified: user.verified,
            createdAt: user.createdAt,
          },
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const data = updateProfileSchema.parse(req.body);

      const user = await userService.updateProfile(userId, data);

      const response: ApiResponse = {
        success: true,
        data: {
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            patronymic: user.patronymic,
            avatar: user.avatar,
          },
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user settings
   */
  async getSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const settings = await userService.getSettings(userId);

      const response: ApiResponse = {
        success: true,
        data: {
          settings: {
            notifications: {
              email: settings.emailNotifications,
              sms: settings.smsNotifications,
              push: settings.pushNotifications,
              transactionAlerts: settings.transactionAlerts,
              marketingEmails: settings.marketingEmails,
            },
            security: {
              twoFactorEnabled: settings.twoFactorEnabled,
              loginNotifications: settings.loginNotifications,
              sessionTimeout: settings.sessionTimeout,
            },
            interface: {
              language: settings.language,
              theme: settings.theme,
              compactMode: settings.compactMode,
            },
          },
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user settings
   */
  async updateSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const data = updateSettingsSchema.parse(req.body);

      const settings = await userService.updateSettings(userId, data);

      const response: ApiResponse = {
        success: true,
        data: {
          settings: {
            notifications: {
              email: settings.emailNotifications,
              sms: settings.smsNotifications,
              push: settings.pushNotifications,
              transactionAlerts: settings.transactionAlerts,
              marketingEmails: settings.marketingEmails,
            },
            security: {
              twoFactorEnabled: settings.twoFactorEnabled,
              loginNotifications: settings.loginNotifications,
              sessionTimeout: settings.sessionTimeout,
            },
            interface: {
              language: settings.language,
              theme: settings.theme,
              compactMode: settings.compactMode,
            },
          },
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get active sessions
   */
  async getSessions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      // TODO: Get current session ID from request
      const currentSessionId = undefined;

      const sessions = await userService.getSessions(userId, currentSessionId);

      const response: ApiResponse = {
        success: true,
        data: {
          sessions,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Terminate a session
   */
  async terminateSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      
      // Validate UUID
      uuidSchema.parse(id);

      await userService.terminateSession(userId, id);

      const response: ApiResponse = {
        success: true,
        data: {
          message: 'Session terminated',
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
