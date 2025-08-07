export const EXPENSE_CATEGORIES = [
  'Gıda',
  'Ulaşım',
  'Konut',
  'Sağlık',
  'Eğitim',
  'Eğlence',
  'Giyim',
  'Teknoloji',
  'Diğer'
] as const

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number]

export const CHART_COLORS = {
  primary: '#3B82F6',
  secondary: '#6366F1',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#06B6D4',
  gray: '#6B7280'
}