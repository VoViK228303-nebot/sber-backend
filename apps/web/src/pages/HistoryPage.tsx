import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Search,
  Filter,
  Download,
  X,
  FileText,
  Printer
} from 'lucide-react'
import { transactionsApi } from '@/api'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { SkeletonTransactionItem } from '@/components/ui/Skeleton'
import { TransactionItem } from '@/components/TransactionItem'
import type { Transaction } from '@/types'
import toast from 'react-hot-toast'

export function HistoryPage() {
  const location = useLocation()
  const initialAccountId = location.state?.accountId

  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month')
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  const { data: transactionsData, isLoading, error } = useQuery({
    queryKey: ['transactions', dateRange, typeFilter, categoryFilter, initialAccountId],
    queryFn: () => transactionsApi.getTransactions({
      accountId: initialAccountId,
      from: getDateFromRange(dateRange),
      limit: 50,
    }),
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => transactionsApi.getCategories(),
  })

  if (error) {
    toast.error('Ошибка загрузки истории операций')
  }

  const transactions = transactionsData?.data.transactions || []
  const categories = categoriesData?.data.categories || []
  const summary = transactionsData?.data.summary || { income: 0, expense: 0 }

  // Filter transactions by search query
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = 
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = 
      typeFilter === 'all' || 
      (typeFilter === 'income' && transaction.type === 'credit') ||
      (typeFilter === 'expense' && transaction.type === 'debit')
    
    const matchesCategory = 
      categoryFilter === 'all' || 
      transaction.category === categoryFilter

    return matchesSearch && matchesType && matchesCategory
  })

  const handleExport = () => {
    // TODO: Implement export functionality
    toast.success('Экспорт будет доступен в следующей версии')
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-h2 font-bold text-dark">История операций</h1>
          <p className="text-body text-gray-600">
            {transactions.length} {transactions.length === 1 ? 'операция' : transactions.length < 5 ? 'операции' : 'операций'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={handleExport}
            icon={<Download className="w-4 h-4" />}
          >
            Экспорт
          </Button>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={handlePrint}
            icon={<Printer className="w-4 h-4" />}
            className="hidden sm:flex"
          >
            Печать
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-body-sm text-gray-500 mb-1">Приход</p>
            <p className="text-h3 font-bold text-sber">
              +{formatCurrency(summary.income || 0, 'RUB')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-body-sm text-gray-500 mb-1">Расход</p>
            <p className="text-h3 font-bold text-dark">
              -{formatCurrency(summary.expense || 0, 'RUB')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-body-sm text-gray-500 mb-1">Баланс</p>
            <p className={`text-h3 font-bold ${
              (summary.income - summary.expense) >= 0 ? 'text-sber' : 'text-error'
            }`}>
              {formatCurrency(summary.income - summary.expense, 'RUB')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            {/* Search and Date Range */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Поиск по описанию или категории..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="w-5 h-5" />}
                  rightIcon={searchQuery && (
                    <button onClick={() => setSearchQuery('')}>
                      <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                />
              </div>
              <div className="flex gap-2">
                {(['week', 'month', 'quarter', 'year'] as const).map((range) => (
                  <Button
                    key={range}
                    variant={dateRange === range ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setDateRange(range)}
                  >
                    {range === 'week' && 'Неделя'}
                    {range === 'month' && 'Месяц'}
                    {range === 'quarter' && 'Квартал'}
                    {range === 'year' && 'Год'}
                  </Button>
                ))}
              </div>
            </div>

            {/* Additional Filters */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-body-sm text-gray-500">Фильтры:</span>
              </div>
              
              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
                className="px-3 py-2 rounded-lg border border-gray-200 text-body-sm focus:border-sber focus:ring-2 focus:ring-sber/10 outline-none"
              >
                <option value="all">Все операции</option>
                <option value="income">Только приход</option>
                <option value="expense">Только расход</option>
              </select>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-200 text-body-sm focus:border-sber focus:ring-2 focus:ring-sber/10 outline-none"
              >
                <option value="all">Все категории</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>

              {/* Clear Filters */}
              {(typeFilter !== 'all' || categoryFilter !== 'all' || searchQuery) && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setTypeFilter('all')
                    setCategoryFilter('all')
                    setSearchQuery('')
                  }}
                  className="text-error"
                >
                  <X className="w-4 h-4 mr-1" />
                  Сбросить
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="divide-y divide-gray-100">
              {[1, 2, 3, 4, 5].map((i) => (
                <SkeletonTransactionItem key={i} />
              ))}
            </div>
          ) : filteredTransactions.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {filteredTransactions.map((transaction) => (
                <TransactionItem 
                  key={transaction.id} 
                  transaction={transaction}
                  onClick={() => setSelectedTransaction(transaction)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-h4 font-semibold text-dark mb-2">Нет операций</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchQuery 
                  ? 'Попробуйте изменить параметры поиска' 
                  : 'За выбранный период операций не найдено'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Details Modal */}
      <Modal
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        title="Детали операции"
        actions={[
          {
            label: 'Закрыть',
            variant: 'secondary',
            onClick: () => setSelectedTransaction(null),
          },
          {
            label: 'Скачать чек',
            variant: 'primary',
            onClick: () => toast.success('Функция будет доступна позже'),
          },
        ]}
      >
        {selectedTransaction && (
          <div className="space-y-4">
            <div className="text-center py-4">
              <p className={`text-h2 font-bold ${
                selectedTransaction.type === 'credit' ? 'text-sber' : 'text-dark'
              }`}>
                {selectedTransaction.type === 'credit' ? '+' : '-'}
                {formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}
              </p>
              <Badge 
                variant={selectedTransaction.type === 'credit' ? 'success' : 'default'}
                className="mt-2"
              >
                {selectedTransaction.type === 'credit' ? 'Поступление' : 'Списание'}
              </Badge>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-100">
              <DetailRow label="Описание" value={selectedTransaction.description} />
              <DetailRow label="Категория" value={selectedTransaction.category} />
              <DetailRow label="Дата" value={formatDate(selectedTransaction.createdAt)} />
              <DetailRow label="Баланс после" value={formatCurrency(selectedTransaction.balanceAfter, selectedTransaction.currency)} />
              {selectedTransaction.merchant?.name && (
                <DetailRow label="Мерчант" value={selectedTransaction.merchant.name} />
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function getDateFromRange(range: 'week' | 'month' | 'quarter' | 'year'): string {
  const now = new Date()
  const date = new Date()
  
  switch (range) {
    case 'week':
      date.setDate(now.getDate() - 7)
      break
    case 'month':
      date.setMonth(now.getMonth() - 1)
      break
    case 'quarter':
      date.setMonth(now.getMonth() - 3)
      break
    case 'year':
      date.setFullYear(now.getFullYear() - 1)
      break
  }
  
  return date.toISOString().split('T')[0]
}

interface DetailRowProps {
  label: string
  value: string
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex justify-between py-2">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-dark">{value}</span>
    </div>
  )
}
