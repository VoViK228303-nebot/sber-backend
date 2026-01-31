import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'
import { authApi } from '@/api'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Actions
  setUser: (user: User | null) => void
  setAccessToken: (token: string | null) => void
  setRefreshToken: (token: string | null) => void
  login: (user: User, accessToken: string, refreshToken: string) => void
  logout: () => Promise<void>
  setLoading: (loading: boolean) => void
  fetchUser: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  register: (data: {
    email: string
    phone: string
    password: string
    firstName: string
    lastName: string
  }) => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      
      setUser: (user) => set({ user }),
      
      setAccessToken: (accessToken) => set({ accessToken }),
      
      setRefreshToken: (refreshToken) => set({ refreshToken }),
      
      login: (user, accessToken, refreshToken) => set({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
      }),
      
      logout: async () => {
        try {
          await authApi.logout()
        } catch (error) {
          console.error('Logout error:', error)
        }
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        })
      },
      
      setLoading: (isLoading) => set({ isLoading }),

      fetchUser: async () => {
        try {
          set({ isLoading: true })
          const response = await authApi.getProfile()
          set({ user: response.data.user, isAuthenticated: true })
        } catch (error) {
          console.error('Fetch user error:', error)
          set({ user: null, isAuthenticated: false })
        } finally {
          set({ isLoading: false })
        }
      },

      updateProfile: async (data) => {
        try {
          set({ isLoading: true })
          const response = await authApi.updateProfile(data)
          set({ user: response.data.user })
        } catch (error) {
          console.error('Update profile error:', error)
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      register: async (data) => {
        try {
          set({ isLoading: true })
          const response = await authApi.register(data)
          set({
            user: response.data.user,
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
            isAuthenticated: true,
          })
        } catch (error) {
          console.error('Register error:', error)
          throw error
        } finally {
          set({ isLoading: false })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
