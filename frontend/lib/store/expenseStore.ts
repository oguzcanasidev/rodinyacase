import { create } from 'zustand'
import api from '../api/axios'

import { ExpenseCategory } from '../constants'

export interface Expense {
  _id: string
  amount: number
  category: ExpenseCategory
  description?: string
  date: Date
  userId: string
  createdAt: string
  updatedAt: string
}

interface ExpenseState {
  expenses: Expense[]
  isLoading: boolean
  error: string | null
  totalExpenses: number
  // Metrikler için state
  weeklyTotal: number
  monthlyTotal: number
  topCategory: {
    category: ExpenseCategory
    amount: number
  } | null
  
  // Actions
  fetchExpenses: () => Promise<void>
  addExpense: (expense: Omit<Expense, '_id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>
  deleteExpense: (id: string) => Promise<void>
  calculateMetrics: () => void
  clearError: () => void
}

export const useExpenseStore = create<ExpenseState>((set, get) => ({
  expenses: [],
  isLoading: false,
  error: null,
  totalExpenses: 0,
  weeklyTotal: 0,
  monthlyTotal: 0,
  topCategory: null,

  fetchExpenses: async () => {
    try {
      set({ isLoading: true, error: null })
      const response = await api.get('/expenses')
      const expenses = response.data
      set({ expenses, isLoading: false })
      get().calculateMetrics()
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Harcamalar yüklenirken bir hata oluştu',
        isLoading: false
      })
    }
  },

  addExpense: async (expense) => {
    try {
      set({ isLoading: true, error: null })
      const response = await api.post('/expenses', expense)
      const newExpense = response.data
      set(state => ({
        expenses: [...state.expenses, newExpense],
        isLoading: false
      }))
      get().calculateMetrics()
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Harcama eklenirken bir hata oluştu',
        isLoading: false
      })
    }
  },

  updateExpense: async (id, expense) => {
    try {
      set({ isLoading: true, error: null })
      const response = await api.patch(`/expenses/${id}`, expense)
      const updatedExpense = response.data
      set(state => ({
        expenses: state.expenses.map(exp => 
          exp._id === id ? updatedExpense : exp
        ),
        isLoading: false
      }))
      get().calculateMetrics()
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Harcama güncellenirken bir hata oluştu',
        isLoading: false
      })
    }
  },

  deleteExpense: async (id) => {
    try {
      set({ isLoading: true, error: null })
      await api.delete(`/expenses/${id}`)
      set(state => ({
        expenses: state.expenses.filter(expense => expense._id !== id),
        isLoading: false
      }))
      get().calculateMetrics()
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Harcama silinirken bir hata oluştu',
        isLoading: false
      })
    }
  },

  calculateMetrics: () => {
    const { expenses } = get()
    
    // Bugünün tarihini al ve saat bilgisini sıfırla
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    
    // Tarihleri hesapla
    const oneWeekAgo = new Date(now)
    oneWeekAgo.setDate(now.getDate() - 7)
    
    const oneMonthAgo = new Date(now)
    oneMonthAgo.setDate(now.getDate() - 30)

    // Toplam harcama
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)

    // Haftalık toplam
    const weeklyExpenses = expenses.filter(exp => {
      const expDate = exp.date instanceof Date ? exp.date : new Date(exp.date)
      expDate.setHours(0, 0, 0, 0)
      return expDate >= oneWeekAgo && expDate <= now
    })
    const weeklyTotal = weeklyExpenses.reduce((sum, exp) => sum + exp.amount, 0)

    // Aylık toplam
    const monthlyExpenses = expenses.filter(exp => {
      const expDate = exp.date instanceof Date ? exp.date : new Date(exp.date)
      expDate.setHours(0, 0, 0, 0)
      return expDate >= oneMonthAgo && expDate <= now
    })
    const monthlyTotal = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0)

    // En çok harcama yapılan kategori
    const categoryTotals = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount
      return acc
    }, {} as Record<ExpenseCategory, number>)

    const topCategory = Object.entries(categoryTotals).length > 0
      ? {
          category: Object.entries(categoryTotals).reduce((a, b) => 
            b[1] > a[1] ? b : a
          )[0],
          amount: Math.max(...Object.values(categoryTotals))
        }
      : null

    set({
      totalExpenses,
      weeklyTotal,
      monthlyTotal,
      topCategory: topCategory as { category: ExpenseCategory, amount: number } | null
    })
  },

  clearError: () => set({ error: null })
}))