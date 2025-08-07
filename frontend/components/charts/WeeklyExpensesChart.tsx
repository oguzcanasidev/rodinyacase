import { Expense } from '@/lib/store/expenseStore'
import { formatCurrency } from '@/lib/utils'
import { format, startOfWeek, eachDayOfInterval, addDays } from 'date-fns'
import { tr } from 'date-fns/locale'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface WeeklyExpensesChartProps {
  expenses: Expense[]
}

export default function WeeklyExpensesChart({ expenses }: WeeklyExpensesChartProps) {
  // Haftanın başlangıç gününü al (Pazartesi)
  const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 })
  
  // Haftalık günleri oluştur
  const weekDays = eachDayOfInterval({
    start: startOfCurrentWeek,
    end: addDays(startOfCurrentWeek, 6)
  })

  // Her gün için harcamaları hesapla
  const dailyExpenses = weekDays.map(day => {
    const dayExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return format(expenseDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    })
    return dayExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  })

  const data = {
    labels: weekDays.map(day => format(day, 'EEEE', { locale: tr })),
    datasets: [
      {
        label: 'Günlük Harcama',
        data: dailyExpenses,
        backgroundColor: 'rgba(59, 130, 246, 0.5)', // blue-500 with opacity
        borderColor: 'rgb(59, 130, 246)', // blue-500
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Haftalık Harcama Dağılımı',
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${formatCurrency(context.raw)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => formatCurrency(value),
        },
      },
    },
  }

  return <Bar data={data} options={options as any} />
}