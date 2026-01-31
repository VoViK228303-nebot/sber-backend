// User types
export interface User {
  id: string
  email: string
  phone: string
  firstName: string
  lastName: string
  patronymic?: string
  fullName: string
  avatar?: string
  verified: boolean
  createdAt: string
}

export interface UserSettings {
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
    transactionAlerts: boolean
    marketingEmails: boolean
  }
  security: {
    twoFactorEnabled: boolean
    loginNotifications: boolean
    sessionTimeout: number
  }
  interface: {
    language: string
    theme: 'light' | 'dark'
    compactMode: boolean
  }
}

// Account types
export type AccountType = 'debit' | 'credit' | 'savings'

export interface Account {
  id: string
  type: AccountType
  number: string
  maskedNumber: string
  balance: number
  availableBalance?: number
  currency: string
  name?: string
  isActive: boolean
  createdAt: string
  cards: Card[]
  limits?: {
    dailyTransferLimit: number
    dailyWithdrawalLimit: number
  }
}

// Card types
export interface Card {
  id: string
  number: string
  maskedNumber: string
  expiryDate: string
  holderName: string
  isVirtual: boolean
  isBlocked: boolean
}

// Transaction types
export type TransactionType = 'debit' | 'credit'
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled'

export interface Transaction {
  id: string
  accountId: string
  type: TransactionType
  amount: number
  currency: string
  description: string
  category: string
  merchant?: {
    name: string
    logo?: string
    address?: string
  }
  balanceAfter: number
  createdAt: string
}

// Transfer types
export type TransferStatus = 'pending' | 'completed' | 'failed'

export interface Transfer {
  id: string
  fromAccountId?: string
  fromAccount?: {
    id: string
    maskedNumber: string
  }
  toAccountNumber: string
  recipientName: string
  amount: number
  currency: string
  description?: string
  status: TransferStatus
  commission?: number
  createdAt: string
  completedAt?: string
}

// Auth types
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  phone: string
  password: string
  firstName: string
  lastName: string
  patronymic?: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data: T
}

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
}

// Dashboard types
export interface DashboardData {
  totalBalance: {
    amount: number
    currency: string
  }
  accounts: Account[]
  quickActions: QuickAction[]
  recentTransactions: Transaction[]
  spendingChart: {
    period: string
    data: Array<{
      category: string
      amount: number
    }>
  }
}

export interface QuickAction {
  id: string
  name: string
  icon: string
  route: string
}

// Pagination
export interface PaginationInfo {
  total: number
  limit: number
  offset: number
  hasMore: boolean
  nextCursor?: string
}