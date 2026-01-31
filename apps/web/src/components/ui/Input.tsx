import React from 'react'
import { cn } from '@/lib/utils'

/**
 * Input - компонент поля ввода в стиле Сбербанка
 * 
 * @example
 * // Базовый input
 * <Input placeholder="Введите сумму" />
 * 
 * // С label
 * <Input label="Сумма" placeholder="0.00" />
 * 
 * // С ошибкой
 * <Input label="Email" error="Неверный формат email" />
 * 
 * // С иконкой
 * <Input icon={<Search className="w-5 h-5" />} placeholder="Поиск" />
 * 
 * // Полная ширина
 * <Input fullWidth placeholder="Введите текст" />
 */

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label над полем */
  label?: string
  /** Подсказка под полем */
  hint?: string
  /** Сообщение об ошибке */
  error?: string
  /** Иконка слева */
  icon?: React.ReactNode
  /** Иконка справа */
  rightIcon?: React.ReactNode
  /** Полная ширина */
  fullWidth?: boolean
  /** Дополнительные классы */
  className?: string
  /** Дополнительные классы для контейнера */
  containerClassName?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hint,
      error,
      icon,
      rightIcon,
      fullWidth = false,
      className,
      containerClassName,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full', containerClassName)}>
        {label && (
          <label className="text-body-sm font-medium text-dark">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'h-12 px-4 rounded-xl border bg-white text-body placeholder:text-gray-400 transition-all duration-200',
              'focus:outline-none focus:border-sber focus:ring-2 focus:ring-sber/10',
              'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500',
              error
                ? 'border-error bg-red-50 focus:border-error focus:ring-error/10'
                : 'border-gray-200',
              icon && 'pl-12',
              rightIcon && 'pr-12',
              fullWidth && 'w-full',
              className
            )}
            disabled={disabled}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {hint && !error && (
          <p className="text-caption text-gray-500">{hint}</p>
        )}
        {error && (
          <p className="text-caption text-error">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
