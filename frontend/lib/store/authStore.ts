import { create } from 'zustand'
import api from '../api/axios'
import { setAuthToken, removeAuthToken, getAuthToken } from '../utils'

interface User {
  id: string
  email: string
  username: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
  initAuth: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null })
      const response = await api.post('/auth/login', { email, password })
      const { accessToken, user } = response.data
      setAuthToken(accessToken)
      
      set({ 
        user,
        isAuthenticated: true,
        isLoading: false 
      })
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Giriş yapılırken bir hata oluştu',
        isLoading: false 
      })
    }
  },

  register: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null })
      const registerResponse = await api.post('/auth/register', { email, password })
      const { user } = registerResponse.data
      
      // Kayıt başarılı, otomatik login yap
      const loginResponse = await api.post('/auth/login', { email, password })
      const { accessToken } = loginResponse.data
      setAuthToken(accessToken)
      
      set({ 
        user,
        isAuthenticated: true,
        isLoading: false 
      })
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Kayıt olurken bir hata oluştu',
        isLoading: false 
      })
    }
  },

  logout: () => {
    removeAuthToken()
    set({ 
      user: null, 
      isAuthenticated: false,
      error: null 
    })
  },

  clearError: () => set({ error: null }),

  initAuth: async () => {
    try {
      set({ isLoading: true })
      
      const token = getAuthToken()
      if (!token) {
        set({ 
          user: null,
          isAuthenticated: false,
          isLoading: false
        })
        return
      }

      // Token varsa kullanıcı bilgilerini al
      const response = await api.post('/auth/profile')
      const user = response.data // profile endpoint direkt user döndürüyor

      set({
        user,
        isAuthenticated: true,
        isLoading: false
      })
    } catch (error) {
      // Token geçersizse temizle
      removeAuthToken()
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false
      })
    }
  }
}))