import { Expense } from '@/lib/store/expenseStore'
import { formatCurrency } from '@/lib/utils'
import { CHART_COLORS } from '@/lib/constants'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

interface CategoryDistributionChartProps {
  expenses: Expense[]
}

export default function CategoryDistributionChart({ expenses }: CategoryDistributionChartProps) {
  // Kategori bazlı toplam harcamaları hesapla
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {} as Record<string, number>)

  const categories = Object.keys(categoryTotals)
  const amounts = Object.values(categoryTotals)

  // Chart.js renk paleti
  const backgroundColors = [
    CHART_COLORS.primary,
    CHART_COLORS.secondary,
    CHART_COLORS.success,
    CHART_COLORS.warning,
    CHART_COLORS.danger,
    CHART_COLORS.info,
    CHART_COLORS.gray,
  ]

  const data = {
    labels: categories,
    datasets: [
      {
        data: amounts,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors.map(color => color),
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Kategori Bazlı Harcama Dağılımı',
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || ''
            const value = context.raw || 0
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
            const percentage = ((value / total) * 100).toFixed(1)
            return `${label}: ${formatCurrency(value)} (${percentage}%)`
          },
        },
      },
    },
  }

  return <Pie data={data} options={options} />
}