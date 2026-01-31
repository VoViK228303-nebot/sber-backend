import React from 'react'
import { cn } from '@/lib/utils'

/**
 * Button - базовый компонент кнопки в стиле Сбербанка
 * 
 * @example
 * // Primary кнопка
 * <Button>Перевести</Button>
 * 
 * // Secondary кнопка
 * <Button variant="secondary">Отмена</Button>
 * 
 * // С иконкой
 * <Button icon={<ArrowRight className="w-4 h-4" />}>Далее</Button>
 * 
 * // Загрузка
 * <Button loading>Сохранение...</Button>
 * 
 * // Полная ширина
 * <Button fullWidth>Войти</Button>
 */

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Вариант кнопки */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  /** Размер кнопки */
  size?: 'sm' | 'md' | 'lg'
  /** Иконка слева от текста */
  icon?: React.ReactNode
  /** Иконка справа от текста */
  iconRight?: React.ReactNode
  /** Состояние загрузки */
  loading?: boolean
  /** Полная ширина */
  fullWidth?: boolean
  /** Дополнительные классы */
  className?: string
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      icon,
      iconRight,
      loading = false,
      fullWidth = false,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sber focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]'
    
    const variants = {
      primary: 'bg-sber text-white hover:bg-sber-dark shadow-sm',
      secondary: 'bg-white text-dark border border-gray-200 hover:bg-gray-100',
      ghost: 'bg-transparent text-sber hover:bg-sber-light',
      danger: 'bg-error text-white hover:bg-red-600',
    }
    
    const sizes = {
      sm: 'px-4 py-2 text-body-sm',
      md: 'px-6 py-3 text-body',
      lg: 'px-8 py-4 text-body-lg',
    }

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && icon}
        {children}
        {!loading && iconRight}
      </button>
    )
  }
)

Button.displayName = 'Button'
