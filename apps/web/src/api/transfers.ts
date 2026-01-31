import { apiClient } from './client'
import type { Transfer, ApiResponse, PaginationInfo } from '@/types'

export interface CreateTransferData {
  fromAccountId: string
  toAccountNumber: string
  amount: number
  currency: string
  description?: string
  recipientName: string
}

export interface CreateTransferTemplateData {
  name: string
  toAccountNumber: string
  recipientName?: string
  amount?: number
  currency?: string
  description?: string
}

export interface TransferHistoryParams {
  accountId?: string
  from?: string
  to?: string
  type?: 'incoming' | 'outgoing'
  limit?: number
  offset?: number
}

export interface TransferTemplate {
  id: string
  name: string
  toAccountNumber: string
  recipientName?: string
  amount?: number
  currency?: string
  description?: string
}

export const transfersApi = {
  createTransfer: (data: CreateTransferData) =>
    apiClient.post<ApiResponse<{ transfer: Transfer; newBalance: number }>>('/transfers', data),

  getTransfers: (params?: TransferHistoryParams) =>
    apiClient.get<ApiResponse<{ transfers: Transfer[]; pagination: PaginationInfo }>>('/transfers', { params }),

  getTransfer: (id: string) =>
    apiClient.get<ApiResponse<{ transfer: Transfer }>>(`/transfers/${id}`),

  getTemplates: () =>
    apiClient.get<ApiResponse<{ templates: TransferTemplate[] }>>('/transfers/templates'),

  createTemplate: (data: CreateTransferTemplateData) =>
    apiClient.post<ApiResponse<{ template: TransferTemplate }>>('/transfers/templates', data),

  deleteTemplate: (id: string) =>
    apiClient.delete<ApiResponse<{ message: string }>>(`/transfers/templates/${id}`),
}
