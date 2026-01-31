import { apiClient } from './client'
import type { DashboardData, ApiResponse } from '@/types'

export const dashboardApi = {
  getDashboard: () =>
    apiClient.get<ApiResponse<DashboardData>>('/dashboard'),
}
