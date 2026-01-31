import React from 'react'
import { 
  ArrowLeftRight, 
  CreditCard, 
  Smartphone, 
  Zap, 
  Globe, 
  PiggyBank
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from './ui/Card'

/**
 * QuickActions - блок быстрых действий (переводы, платежи) в стиле Сбербанка
 * 
 * @example
 * // Базовое использование
 * <QuickActions onAction={handleAction} />
 * 
 * // С кастомными действиями
 * <QuickActions 
 *   actions={[
 *     { id: 'transfer', icon: ArrowLeftRight, label: 'Перевод', color: 'bg-sber-light text-sber' },
 *     { id: 'pay', icon: CreditCard, label: 'Оплатить', color: 'bg-blue-100 text-blue-600' },
 *   ]}
 *   onAction={handleAction}
 * />
 * 
 * // Горизонтальный вид
 * <QuickActions layout="horizontal" onAction={handleAction} />
 * 
 * // Компактный вид
 * <QuickActions compact onAction={handleAction} />
 */

export interface QuickAction {
  /** Уникальный идентификатор */
  id: string
  /** Иконка действия */
  icon: React.ElementType
  /** Название действия */
  label: string
  /** Цветовая схема */
  color: string
  /** Доступно ли действие */
  disabled?: boolean
}

export interface QuickActionsProps {
  /** Список действий */
  actions?: QuickAction[]
  /** Callback при выборе действия */
  onAction: (actionId: string) => void
  /** Раскладка */
  layout?: 'grid' | 'horizontal'
  /** Компактный вид */
  compact?: boolean
  /** Заголовок */
  title?: string
  /** Дополнительные классы */
  className?: string
}

const defaultActions: QuickAction[] = [
  {
    id: 'transfer',
    icon: ArrowLeftRight,
    label: 'Перевод',
    color: 'bg-sber-light text-sber',
  },
  {
    id: 'pay',
    icon: CreditCard,
    label: 'Оплатить',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: 'mobile',
    icon: Smartphone,
    label: 'Мобильный',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    id: 'utilities',
    icon: Zap,
    label: 'ЖКХ',
    color: 'bg-yellow-100 text-yellow-600',
  },
  {
    id: 'internet',
    icon: Globe,
    label: 'Интернет',
    color: 'bg-cyan-100 text-cyan-600',
  },
  {
    id: 'savings',
    icon: PiggyBank,
    label: 'Накопления',
    color: 'bg-pink-100 text-pink-600',
  },
]

export function QuickActions({
  actions = defaultActions,
  onAction,
  layout = 'grid',
  compact = false,
  title = 'Быстрые действия',
  className,
}: QuickActionsProps) {
  if (compact) {
    return (
      <div className={cn('flex gap-3 overflow-x-auto pb-2 scrollbar-hide', className)}>
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.id}
              onClick={() => onAction(action.id)}
              disabled={action.disabled}
              className={cn(
                'flex flex-col items-center gap-2 min-w-[72px] p-3 rounded-xl transition-colors',
                'hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', action.color)}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-caption text-dark text-center whitespace-nowrap">
                {action.label}
              </span>
            </button>
          )
        })}
      </div>
    )
  }

  if (layout === 'horizontal') {
    return (
      <Card className={className}>
        {title && <h3 className="text-h4 font-semibold text-dark mb-4">{title}</h3>}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.id}
                onClick={() => onAction(action.id)}
                disabled={action.disabled}
                className={cn(
                  'flex flex-col items-center gap-3 min-w-[80px] p-4 rounded-xl transition-colors',
                  'hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                <div className={cn('w-14 h-14 rounded-xl flex items-center justify-center', action.color)}>
                  <Icon className="w-7 h-7" />
                </div>
                <span className="text-body-sm text-dark text-center whitespace-nowrap">
                  {action.label}
                </span>
              </button>
            )
          })}
        </div>
      </Card>
    )
  }

  return (
    <Card className={className}>
      {title && <h3 className="text-h4 font-semibold text-dark mb-4">{title}</h3>}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.id}
              onClick={() => onAction(action.id)}
              disabled={action.disabled}
              className={cn(
                'flex flex-col items-center gap-3 p-4 rounded-xl transition-colors',
                'hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              <div className={cn('w-14 h-14 rounded-xl flex items-center justify-center', action.color)}>
                <Icon className="w-7 h-7" />
              </div>
              <span className="text-body-sm text-dark text-center">
                {action.label}
              </span>
            </button>
          )
        })}
      </div>
    </Card>
  )
}
