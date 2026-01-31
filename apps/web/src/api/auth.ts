import { apiClient } from './client'
import type { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  ApiResponse,
  User 
} from '@/types'

export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials),

  register: (data: RegisterData) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data),

  logout: () =>
    apiClient.post<ApiResponse<{ message: string }>>('/auth/logout'),

  refresh: () =>
    apiClient.post<ApiResponse<{ accessToken: string; refreshToken: string }>>('/auth/refresh'),

  forgotPassword: (email: string) =>
    apiClient.post<ApiResponse<{ message: string }>>('/auth/forgot-password', { email }),

  resetPassword: (token: string, newPassword: string) =>
    apiClient.post<ApiResponse<{ message: string }>>('/auth/reset-password', { token, newPassword }),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiClient.put<ApiResponse<{ message: string }>>('/users/me/password', { currentPassword, newPassword }),

  getProfile: () =>
    apiClient.get<ApiResponse<{ user: User }>>('/users/me'),

  updateProfile: (data: Partial<User>) =>
    apiClient.put<ApiResponse<{ user: User }>>('/users/me', data),

  getSettings: () =>
    apiClient.get<ApiResponse<{ settings: unknown }>>('/users/me/settings'),

  updateSettings: (settings: unknown) =>
    apiClient.put<ApiResponse<{ settings: unknown }>>('/users/me/settings', settings),
}
