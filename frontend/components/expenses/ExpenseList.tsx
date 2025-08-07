import { Expense } from '@/lib/store/expenseStore'
import { formatCurrency, exportToCSV } from '@/lib/utils'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { PencilIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { useState, useMemo } from 'react'
import { EXPENSE_CATEGORIES } from '@/lib/constants'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

interface ExpenseListProps {
  expenses: Expense[]
  onEdit: (expense: Expense) => void
  onDelete: (expense: Expense) => void
}

type SortDirection = 'asc' | 'desc' | null

export default function ExpenseList({ expenses, onEdit, onDelete }: ExpenseListProps) {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [searchDescription, setSearchDescription] = useState('')
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  const [showFilters, setShowFilters] = useState(false)

  const [startDate, endDate] = dateRange

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      const matchesDate = (!startDate || !endDate) ? true : 
        (expenseDate >= startDate && expenseDate <= endDate)
      
      const matchesCategory = !selectedCategory || expense.category === selectedCategory
      
      const matchesDescription = !searchDescription || 
        expense.description.toLowerCase().includes(searchDescription.toLowerCase())

      return matchesDate && matchesCategory && matchesDescription
    })
  }, [expenses, startDate, endDate, selectedCategory, searchDescription])

  const sortedExpenses = useMemo(() => {
    if (!sortDirection) return filteredExpenses

    return [...filteredExpenses].sort((a, b) => {
      if (sortDirection === 'asc') {
        return a.amount - b.amount
      }
      return b.amount - a.amount
    })
  }, [filteredExpenses, sortDirection])

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Henüz harcama bulunmuyor</h3>
        <p className="mt-1 text-sm text-gray-500">Yeni bir harcama ekleyerek başlayın.</p>
      </div>
    )
  }

  const handleSortClick = () => {
    setSortDirection(current => {
      if (current === null) return 'asc'
      if (current === 'asc') return 'desc'
      return null
    })
  }

  const FilterSection = () => (
    <div className={`bg-gray-50 p-4 rounded-lg mb-4 ${showFilters ? 'block' : 'hidden md:block'}`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tarih</label>
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => setDateRange(update)}
            dateFormat="dd/MM/yyyy"
            className="block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            placeholderText="Tarih aralığı seçin"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          >
            <option value="">Tümü</option>
            {EXPENSE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
          <input
            type="text"
            value={searchDescription}
            onChange={(e) => setSearchDescription(e.target.value)}
            placeholder="Açıklama ara..."
            className="block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sıralama</label>
          <button
            onClick={handleSortClick}
            className="inline-flex items-center justify-center w-full rounded-md border shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Tutar
            {sortDirection === 'asc' && <ArrowUpIcon className="ml-2 h-4 w-4" />}
            {sortDirection === 'desc' && <ArrowDownIcon className="ml-2 h-4 w-4" />}
            {!sortDirection && <ArrowUpIcon className="ml-2 h-4 w-4 opacity-0" />}
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-4 gap-2">
        <div className="md:hidden">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FunnelIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
            Filtreleri {showFilters ? 'Gizle' : 'Göster'}
          </button>
        </div>
        <button
          type="button"
          onClick={() => exportToCSV(sortedExpenses, 'harcamalar')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          CSV Olarak İndir
        </button>
      </div>

      <FilterSection />

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Tarih</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Kategori</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Açıklama</th>
              <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Tutar</th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">İşlemler</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {sortedExpenses.map((expense) => (
              <tr key={expense._id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">
                  {format(new Date(expense.date), 'd MMMM yyyy', { locale: tr })}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {expense.category}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500">
                  {expense.description}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                  {formatCurrency(expense.amount)}
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onEdit(expense)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <PencilIcon className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">Düzenle</span>
                    </button>
                    <button
                      onClick={() => onDelete(expense)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">Sil</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}