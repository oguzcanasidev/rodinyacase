import { EXPENSE_CATEGORIES, ExpenseCategory } from '@/lib/constants'
import { Expense } from '@/lib/store/expenseStore'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const expenseSchema = z.object({
  amount: z.string()
    .min(1, 'Tutar alanı boş bırakılamaz')
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), 'Geçerli bir sayı giriniz')
    .refine((val) => val > 0, 'Tutar 0\'dan büyük olmalıdır'),
  category: z.custom<ExpenseCategory>((val) => 
    EXPENSE_CATEGORIES.includes(val as ExpenseCategory), 
    'Geçerli bir kategori seçin'
  ),
  description: z.string().optional(),
  date: z.string(),
})

type ExpenseFormData = z.infer<typeof expenseSchema>

interface ExpenseFormProps {
  expense?: Expense
  onSubmit: (data: ExpenseFormData) => void
  onCancel: () => void
}

export default function ExpenseForm({ expense, onSubmit, onCancel }: ExpenseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: expense
      ? {
          amount: expense.amount,
          category: expense.category,
          description: expense.description,
          date: expense.date.toISOString().split('T')[0], // YYYY-MM-DD formatına çevir
        }
      : {
          date: new Date().toISOString().split('T')[0],
        },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Tutar
        </label>
        <input
          type="number"
          step="0.01"
          {...register('amount')}
          className="mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-2"
        />
        {errors.amount && (
          <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Kategori
        </label>
        <select
          {...register('category')}
          className="mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-2"
        >
          <option value="">Kategori seçin</option>
          {EXPENSE_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Açıklama
        </label>
        <textarea
          {...register('description')}
          className="mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-2"
          rows={3}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Tarih
        </label>
        <input
          type="date"
          {...register('date')}
          className="mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-2"
        />
        {errors.date && (
          <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          İptal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isSubmitting ? 'Kaydediliyor...' : expense ? 'Güncelle' : 'Ekle'}
        </button>
      </div>
    </form>
  )
}