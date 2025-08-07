import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Expense } from './store/expenseStore'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'Bir hata oluştu'
}

export function setAuthToken(token: string) {
  localStorage.setItem('token', token)
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

export function removeAuthToken() {
  localStorage.removeItem('token')
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY'
  }).format(amount)
}

export function exportToCSV(expenses: Expense[], fileName: string) {
  // CSV başlıkları
  const headers = ['Tarih', 'Kategori', 'Açıklama', 'Tutar']

  // Verileri CSV formatına dönüştür
  const csvData = expenses.map(expense => [
    format(new Date(expense.date), 'd MMMM yyyy', { locale: tr }),
    expense.category,
    expense.description,
    formatCurrency(expense.amount)
  ])

  // Başlıkları ve verileri birleştir
  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  // CSV dosyasını oluştur ve indir
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `${fileName}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}