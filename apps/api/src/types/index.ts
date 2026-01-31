import { Request } from 'express';
import { User } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export interface TokenPayload {
  userId: string;
  email: string;
  type: 'access' | 'refresh';
}

export interface JWTTokens {
  accessToken: string;
  refreshToken: string;
}

export interface PaginationParams {
  limit: number;
  offset: number;
  cursor?: string;
}

export interface PaginationMeta {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  nextCursor?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

// Auth DTOs
export interface RegisterDTO {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  patronymic?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface ResetPasswordDTO {
  token: string;
  newPassword: string;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

// Account DTOs
export interface CreateAccountDTO {
  type: 'DEBIT' | 'CREDIT' | 'SAVINGS' | 'DEPOSIT';
  currency: string;
  name?: string;
}

export interface UpdateAccountDTO {
  name?: string;
}

export interface CloseAccountDTO {
  transferToAccountId?: string;
}

// Transfer DTOs
export interface CreateTransferDTO {
  fromAccountId: string;
  toAccountNumber: string;
  amount: number;
  currency: string;
  description?: string;
  recipientName?: string;
}

export interface CreateTransferTemplateDTO {
  name: string;
  toAccountNumber: string;
  recipientName?: string;
  amount?: number;
  currency?: string;
  description?: string;
}

export interface TransferFilters {
  accountId?: string;
  from?: Date;
  to?: Date;
  type?: 'incoming' | 'outgoing';
}

// Transaction DTOs
export interface TransactionFilters {
  accountId?: string;
  category?: string;
  from?: Date;
  to?: Date;
  minAmount?: number;
  maxAmount?: number;
}

// User DTOs
export interface UpdateProfileDTO {
  firstName?: string;
  lastName?: string;
  patronymic?: string;
  avatar?: string;
}

export interface UpdateSettingsDTO {
  notifications?: {
    email?: boolean;
    sms?: boolean;
    push?: boolean;
    transactionAlerts?: boolean;
    marketingEmails?: boolean;
  };
  security?: {
    twoFactorEnabled?: boolean;
    loginNotifications?: boolean;
    sessionTimeout?: number;
  };
  interface?: {
    language?: string;
    theme?: string;
    compactMode?: boolean;
  };
}

// Dashboard
export interface DashboardData {
  totalBalance: {
    amount: number;
    currency: string;
  };
  accounts: Array<{
    id: string;
    type: string;
    maskedNumber: string;
    balance: number;
    currency: string;
  }>;
  quickActions: Array<{
    id: string;
    name: string;
    icon: string;
    route: string;
  }>;
  recentTransactions: Array<{
    id: string;
    type: string;
    amount: number;
    description: string;
    createdAt: Date;
  }>;
  spendingChart: {
    period: string;
    data: Array<{
      category: string;
      amount: number;
    }>;
  };
}

// Session
export interface SessionInfo {
  id: string;
  device: string;
  ip: string;
  location: string;
  current: boolean;
  lastActive: Date;
}
