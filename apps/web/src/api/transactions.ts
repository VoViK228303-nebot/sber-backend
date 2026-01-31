import { apiClient } from './client'
import type { Transaction, ApiResponse, PaginationInfo } from '@/types'

export interface TransactionFilters {
  accountId?: string
  category?: string
  from?: string
  to?: string
  minAmount?: number
  maxAmount?: number
  limit?: number
  offset?: number
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
}

export interface TransactionSummary {
  income: number
  expense: number
  byCategory: Array<{
    category: string
    amount: number
  }>
}

export const transactionsApi = {
  getTransactions: (params?: TransactionFilters) =>
    apiClient.get<ApiResponse<{ 
      transactions: Transaction[]
      summary: { income: number; expense: number }
      pagination: PaginationInfo 
    }>>('/transactions', { params }),

  getTransaction: (id: string) =>
    apiClient.get<ApiResponse<{ transaction: Transaction }>>(`/transactions/${id}`),

  getSummary: (period?: 'day' | 'week' | 'month' | 'year') =>
    apiClient.get<ApiResponse<TransactionSummary>>('/transactions/summary', { params: { period } }),

  getCategories: () =>
    apiClient.get<ApiResponse<{ categories: Category[] }>>('/transactions/categories'),
}
