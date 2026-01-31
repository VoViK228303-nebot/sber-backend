import React from 'react'
import { CreditCard, Wallet, PiggyBank, ChevronRight } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import type { Account, AccountType } from '@/types'
import { Card } from './ui/Card'
import { Badge } from './ui/Badge'

/**
 * AccountCard - карточка счёта/карты с балансом в стиле Сбербанка
 * 
 * @example
 * // Базовая карточка счёта
 * <AccountCard account={account} />
 * 
 * // С кликом
 * <AccountCard account={account} onClick={() => navigate('/accounts/123')} />
 * 
 * // Компактный вид
 * <AccountCard account={account} compact />
 * 
 * // Выбранная карточка
 * <AccountCard account={account} selected />
 */

export interface AccountCardProps {
  /** Данные счёта */
  account: Account
  /** Callback при клике */
  onClick?: () => void
  /** Компактный вид */
  compact?: boolean
  /** Выбранное состояние */
  selected?: boolean
  /** Показывать баланс */
  showBalance?: boolean
  /** Дополнительные классы */
  className?: string
}

const accountTypeConfig: Record<AccountType, { icon: React.ElementType; label: string; color: string }> = {
  debit: {
    icon: Wallet,
    label: 'Дебетовый счёт',
    color: 'bg-sber-light text-sber',
  },
  credit: {
    icon: CreditCard,
    label: 'Кредитная карта',
    color: 'bg-purple-100 text-purple-600',
  },
  savings: {
    icon: PiggyBank,
    label: 'Накопительный счёт',
    color: 'bg-amber-100 text-amber-600',
  },
}

export function AccountCard({
  account,
  onClick,
  compact = false,
  selected = false,
  showBalance = true,
  className,
}: AccountCardProps) {
  const config = accountTypeConfig[account.type]
  const Icon = config.icon

  if (compact) {
    return (
      <Card
        hoverable={!!onClick}
        onClick={onClick}
        className={cn(
          'cursor-pointer transition-all',
          selected && 'ring-2 ring-sber ring-offset-2',
          className
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', config.color)}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-dark truncate">
              {account.name || config.label}
            </p>
            <p className="text-body-sm text-gray-500">
              {account.maskedNumber}
            </p>
          </div>
          {showBalance && (
            <p className="font-semibold text-dark">
              {formatCurrency(account.balance, account.currency)}
            </p>
          )}
        </div>
      </Card>
    )
  }

  return (
    <Card
      hoverable={!!onClick}
      onClick={onClick}
      className={cn(
        'cursor-pointer transition-all',
        selected && 'ring-2 ring-sber ring-offset-2',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', config.color)}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="font-semibold text-dark">
              {account.name || config.label}
            </p>
            <p className="text-body-sm text-gray-500">
              {account.maskedNumber}
            </p>
          </div>
        </div>
        <Badge variant={account.isActive ? 'success' : 'error'}>
          {account.isActive ? 'Активен' : 'Заблокирован'}
        </Badge>
      </div>

      {/* Balance */}
      {showBalance && (
        <div className="mb-4">
          <p className="text-h2 font-bold text-dark">
            {formatCurrency(account.balance, account.currency)}
          </p>
          <p className="text-body-sm text-gray-500">
            {account.type === 'credit' && account.availableBalance
              ? `Доступно: ${formatCurrency(account.availableBalance, account.currency)}`
              : 'Доступный баланс'}
          </p>
        </div>
      )}

      {/* Cards */}
      {account.cards && account.cards.length > 0 && (
        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
          <div className="flex -space-x-2">
            {account.cards.slice(0, 3).map((card) => (
              <div
                key={card.id}
                className="w-8 h-5 rounded bg-gradient-to-r from-gray-700 to-gray-800 border-2 border-white flex items-center justify-center"
              >
                <div className="w-2 h-1.5 rounded-sm bg-yellow-500/80" />
              </div>
            ))}
          </div>
          <span className="text-caption text-gray-500">
            {account.cards.length} {account.cards.length === 1 ? 'карта' : account.cards.length < 5 ? 'карты' : 'карт'}
          </span>
        </div>
      )}

      {/* Action hint */}
      {onClick && (
        <div className="flex items-center justify-end mt-4 pt-4 border-t border-gray-100">
          <span className="text-body-sm text-sber font-medium flex items-center gap-1">
            Подробнее
            <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      )}
    </Card>
  )
}
