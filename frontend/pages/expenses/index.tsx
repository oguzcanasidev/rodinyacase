import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ExpenseForm from '@/components/expenses/ExpenseForm'
import ExpenseList from '@/components/expenses/ExpenseList'
import { useExpenseStore, Expense } from '@/lib/store/expenseStore'
import { Dialog } from '@headlessui/react'
import { PlusIcon } from '@heroicons/react/24/outline'

export default function ExpensesPage() {
  const {
    expenses,
    isLoading,
    error,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
  } = useExpenseStore()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<Expense | undefined>()

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])

  const handleSubmit = async (data: Omit<Expense, '_id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (selectedExpense) {
        await updateExpense(selectedExpense._id, data)
      } else {
        await addExpense(data)
      }
      setIsFormOpen(false)
      setSelectedExpense(undefined)
    } catch (error) {
      console.error('Harcama kaydedilirken hata oluştu:', error)
    }
  }

  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense)
    setIsFormOpen(true)
  }

  const handleDelete = async (expense: Expense) => {
    if (window.confirm('Bu harcamayı silmek istediğinizden emin misiniz?')) {
      try {
        await deleteExpense(expense._id)
      } catch (error) {
        console.error('Harcama silinirken hata oluştu:', error)
      }
    }
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setSelectedExpense(undefined)
  }

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
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Harcamalar</h1>
            <p className="mt-2 text-sm text-gray-700">
              Harcamalarınızı görüntüleyin, ekleyin, düzenleyin veya silin
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              Yeni Harcama
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Hata</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        <ExpenseList
          expenses={expenses}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <Dialog
          as="div"
          className="relative z-10"
          open={isFormOpen}
          onClose={handleFormClose}
        >
          <div className="fixed inset-0 bg-black/25" />
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  {selectedExpense ? 'Harcama Düzenle' : 'Yeni Harcama'}
                </Dialog.Title>
                <ExpenseForm
                  expense={selectedExpense}
                  onSubmit={handleSubmit}
                  onCancel={handleFormClose}
                />
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}