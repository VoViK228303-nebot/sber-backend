import React from 'react'
import { cn } from '@/lib/utils'

/**
 * Badge - компонент бейджа для статусов в стиле Сбербанка
 * 
 * @example
 * // Успешный статус
 * <Badge variant="success">Выполнено</Badge>
 * 
 * // Ошибка
 * <Badge variant="error">Ошибка</Badge>
 * 
 * // Предупреждение
 * <Badge variant="warning">В обработке</Badge>
 * 
 * // Информация
 * <Badge variant="info">Новое</Badge>
 * 
 * // С иконкой
 * <Badge variant="success" icon={<Check className="w-3 h-3" />}>Успешно</Badge>
 */

export type BadgeVariant = 'default' | 'success' | 'error' | 'warning' | 'info'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Вариант бейджа */
  variant?: BadgeVariant
  /** Размер бейджа */
  size?: 'sm' | 'md'
  /** Иконка слева */
  icon?: React.ReactNode
  /** Дополнительные классы */
  className?: string
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = 'default', size = 'md', icon, className, ...props }, ref) => {
    const variants: Record<BadgeVariant, string> = {
      default: 'bg-gray-100 text-gray-800',
      success: 'bg-sber-light text-sber',
      error: 'bg-red-50 text-error',
      warning: 'bg-amber-50 text-amber-600',
      info: 'bg-blue-50 text-info',
    }

    const sizes = {
      sm: 'px-2 py-0.5 text-caption',
      md: 'px-2.5 py-1 text-body-sm',
    }

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1 rounded-full font-medium',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {icon}
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'
