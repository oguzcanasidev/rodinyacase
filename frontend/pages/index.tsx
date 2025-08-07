import DashboardLayout from '@/components/layout/DashboardLayout'
import { useExpenseStore } from '@/lib/store/expenseStore'
import { useEffect } from 'react'
import { Card, Metric, Text } from '@tremor/react'
import { formatCurrency } from '@/lib/utils'
import WeeklyExpensesChart from '@/components/charts/WeeklyExpensesChart'
import CategoryDistributionChart from '@/components/charts/CategoryDistributionChart'

export default function DashboardPage() {
  const { 
    fetchExpenses,
    isLoading,
    expenses,
    totalExpenses,
    weeklyTotal,
    monthlyTotal,
    topCategory
  } = useExpenseStore()

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Harcamalarınızın genel görünümü
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <Text>Toplam Harcama</Text>
            <Metric>{formatCurrency(totalExpenses)}</Metric>
          </Card>

          <Card>
            <Text>Haftalık Toplam</Text>
            <Metric>{formatCurrency(weeklyTotal)}</Metric>
          </Card>

          <Card>
            <Text>Aylık Toplam</Text>
            <Metric>{formatCurrency(monthlyTotal)}</Metric>
          </Card>

          <Card>
            <Text>En Çok Harcanan Kategori</Text>
            <Metric>
              {topCategory ? (
                <>
                  {topCategory.category}
                  <span className="text-sm text-gray-500 ml-2">
                    ({formatCurrency(topCategory.amount)})
                  </span>
                </>
              ) : (
                '-'
              )}
            </Metric>
          </Card>
        </div>

        {/* Grafikler buraya eklenecek */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Card>
            <div className="h-80">
              <WeeklyExpensesChart expenses={expenses} />
            </div>
          </Card>

          <Card>
            <div className="h-80">
              <CategoryDistributionChart expenses={expenses} />
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}