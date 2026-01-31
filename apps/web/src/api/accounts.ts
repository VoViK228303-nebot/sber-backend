import { apiClient } from './client'
import type { Account, ApiResponse, Transaction } from '@/types'

export interface CreateAccountData {
  type: 'debit' | 'credit' | 'savings'
  currency: string
  name?: string
}

export interface UpdateAccountData {
  name?: string
}

export interface CloseAccountData {
  transferToAccountId?: string
}

export const accountsApi = {
  getAccounts: (params?: { type?: string; currency?: string }) =>
    apiClient.get<ApiResponse<{ accounts: Account[] }>>('/accounts', { params }),

  getAccount: (id: string) =>
    apiClient.get<ApiResponse<{ account: Account }>>(`/accounts/${id}`),

  createAccount: (data: CreateAccountData) =>
    apiClient.post<ApiResponse<{ account: Account }>>('/accounts', data),

  updateAccount: (id: string, data: UpdateAccountData) =>
    apiClient.put<ApiResponse<{ account: Account }>>(`/accounts/${id}`, data),

  closeAccount: (id: string, data?: CloseAccountData) =>
    apiClient.delete<ApiResponse<{ message: string }>>(`/accounts/${id}`, { data }),

  getAccountTransactions: (id: string, params?: { limit?: number; offset?: number }) =>
    apiClient.get<ApiResponse<{ transactions: Transaction[]; pagination: { total: number; limit: number; offset: number; hasMore: boolean } }>>(`/accounts/${id}/transactions`, { params }),
}
