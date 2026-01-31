import { z } from 'zod';

// Common schemas
export const emailSchema = z
  .string()
  .email('Invalid email format')
  .min(1, 'Email is required');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format');

export const uuidSchema = z.string().uuid('Invalid UUID format');

export const currencySchema = z.enum(['RUB', 'USD', 'EUR']).default('RUB');

// Auth schemas
export const registerSchema = z.object({
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  patronymic: z.string().max(100).optional(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: passwordSchema,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
});

// Account schemas
export const createAccountSchema = z.object({
  type: z.enum(['DEBIT', 'CREDIT', 'SAVINGS', 'DEPOSIT']),
  currency: currencySchema,
  name: z.string().max(100).optional(),
});

export const updateAccountSchema = z.object({
  name: z.string().max(100).optional(),
});

export const closeAccountSchema = z.object({
  transferToAccountId: uuidSchema.optional(),
});

// Transfer schemas
export const createTransferSchema = z.object({
  fromAccountId: uuidSchema,
  toAccountNumber: z.string().min(1, 'Account number is required'),
  amount: z.number().positive('Amount must be positive'),
  currency: currencySchema,
  description: z.string().max(500).optional(),
  recipientName: z.string().max(200).optional(),
});

export const createTransferTemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required').max(100),
  toAccountNumber: z.string().min(1, 'Account number is required'),
  recipientName: z.string().max(200).optional(),
  amount: z.number().positive().optional(),
  currency: currencySchema,
  description: z.string().max(500).optional(),
});

export const transferFiltersSchema = z.object({
  accountId: uuidSchema.optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  type: z.enum(['incoming', 'outgoing']).optional(),
});

// Transaction schemas
export const transactionFiltersSchema = z.object({
  accountId: uuidSchema.optional(),
  category: z.string().optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  minAmount: z.coerce.number().optional(),
  maxAmount: z.coerce.number().optional(),
});

// User schemas
export const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  patronymic: z.string().max(100).optional(),
  avatar: z.string().url().optional(),
});

export const updateSettingsSchema = z.object({
  notifications: z
    .object({
      email: z.boolean().optional(),
      sms: z.boolean().optional(),
      push: z.boolean().optional(),
      transactionAlerts: z.boolean().optional(),
      marketingEmails: z.boolean().optional(),
    })
    .optional(),
  security: z
    .object({
      twoFactorEnabled: z.boolean().optional(),
      loginNotifications: z.boolean().optional(),
      sessionTimeout: z.number().min(5).max(120).optional(),
    })
    .optional(),
  interface: z
    .object({
      language: z.enum(['ru', 'en']).optional(),
      theme: z.enum(['light', 'dark']).optional(),
      compactMode: z.boolean().optional(),
    })
    .optional(),
});

// Pagination schema
export const paginationSchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
  cursor: z.string().optional(),
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type CreateTransferInput = z.infer<typeof createTransferSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
