import React from 'react'
import { 
  ShoppingCart, 
  Utensils, 
  Car, 
  Home, 
  Gamepad2, 
  Heart, 
  Briefcase, 
  ArrowDownLeft, 
  ArrowUpRight,
  MoreHorizontal 
} from 'lucide-react'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import type { Transaction } from '@/types'

/**
 * TransactionItem - элемент истории операции в стиле Сбербанка
 * 
 * @example
 * // Базовый элемент
 * <TransactionItem transaction={transaction} />
 * 
 * // С кликом
 * <TransactionItem transaction={transaction} onClick={() => openDetails(transaction)} />
 * 
 * // Компактный вид
 * <TransactionItem transaction={transaction} compact />
 * 
 * // Без иконки категории
 * <TransactionItem transaction={transaction} showIcon={false} />
 */

export interface TransactionItemProps {
  /** Данные транзакции */
  transaction: Transaction
  /** Callback при клике */
  onClick?: () => void
  /** Компактный вид */
  compact?: boolean
  /** Показывать иконку категории */
  showIcon?: boolean
  /** Дополнительные классы */
  className?: string
}

// Карта категорий и иконок
const categoryIcons: Record<string, React.ElementType> = {
  'продукты': ShoppingCart,
  'еда': Utensils,
  'рестораны': Utensils,
  'транспорт': Car,
  'такси': Car,
  'жилье': Home,
  'коммунальные': Home,
  'развлечения': Gamepad2,
  'здоровье': Heart,
  'работа': Briefcase,
  'зарплата': Briefcase,
  'пополнение': ArrowDownLeft,
  'перевод': ArrowUpRight,
}

// Карта цветов категорий
const categoryColors: Record<string, string> = {
  'продукты': 'bg-green-100 text-green-600',
  'еда': 'bg-orange-100 text-orange-600',
  'рестораны': 'bg-orange-100 text-orange-600',
  'транспорт': 'bg-blue-100 text-blue-600',
  'такси': 'bg-yellow-100 text-yellow-600',
  'жилье': 'bg-purple-100 text-purple-600',
  'коммунальные': 'bg-cyan-100 text-cyan-600',
  'развлечения': 'bg-pink-100 text-pink-600',
  'здоровье': 'bg-red-100 text-red-600',
  'работа': 'bg-gray-100 text-gray-600',
  'зарплата': 'bg-sber-light text-sber',
  'пополнение': 'bg-sber-light text-sber',
  'перевод': 'bg-blue-100 text-blue-600',
}

function getCategoryIcon(category: string): React.ElementType {
  const normalizedCategory = category.toLowerCase()
  return categoryIcons[normalizedCategory] || Briefcase
}

function getCategoryColor(category: string): string {
  const normalizedCategory = category.toLowerCase()
  return categoryColors[normalizedCategory] || 'bg-gray-100 text-gray-600'
}

export function TransactionItem({
  transaction,
  onClick,
  compact = false,
  showIcon = true,
  className,
}: TransactionItemProps) {
  const isIncome = transaction.type === 'credit'
  const Icon = getCategoryIcon(transaction.category)
  const iconColorClass = getCategoryColor(transaction.category)

  if (compact) {
    return (
      <div
        onClick={onClick}
        className={cn(
          'flex items-center gap-3 py-3',
          onClick && 'cursor-pointer',
          className
        )}
      >
        {showIcon && (
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', iconColorClass)}>
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-dark truncate">
            {transaction.description}
          </p>
          <p className="text-caption text-gray-500">
            {formatDate(transaction.createdAt)}
          </p>
        </div>
        <p
          className={cn(
            'font-semibold shrink-0',
            isIncome ? 'text-sber' : 'text-dark'
          )}
        >
          {isIncome ? '+' : '-'}{formatCurrency(transaction.amount, transaction.currency)}
        </p>
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center gap-4 p-4 rounded-xl transition-colors',
        onClick && 'cursor-pointer hover:bg-gray-50',
        className
      )}
    >
      {showIcon && (
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shrink-0', iconColorClass)}>
          <Icon className="w-6 h-6" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-dark truncate">
            {transaction.description}
          </p>
          {transaction.merchant?.name && (
            <span className="text-body-sm text-gray-500 hidden sm:inline">
              • {transaction.merchant.name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-caption text-gray-500">
          <span>{formatDate(transaction.createdAt)}</span>
          <span>•</span>
          <span className="capitalize">{transaction.category}</span>
        </div>
      </div>

      <div className="text-right shrink-0">
        <p
          className={cn(
            'font-semibold text-body-lg',
            isIncome ? 'text-sber' : 'text-dark'
          )}
        >
          {isIncome ? '+' : '-'}{formatCurrency(transaction.amount, transaction.currency)}
        </p>
        <p className="text-caption text-gray-500">
          {formatCurrency(transaction.balanceAfter, transaction.currency)}
        </p>
      </div>

      {onClick && (
        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}
