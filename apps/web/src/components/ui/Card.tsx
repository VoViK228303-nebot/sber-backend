import React from 'react'
import { cn } from '@/lib/utils'

/**
 * Card - компонент карточки в стиле Сбербанка
 * 
 * @example
 * // Базовая карточка
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Заголовок</CardTitle>
 *   </CardHeader>
 *   <CardContent>Контент</CardContent>
 * </Card>
 * 
 * // Карточка с hover эффектом
 * <Card hoverable>
 *   <CardContent>Наведи на меня</CardContent>
 * </Card>
 * 
 * // Карточка с градиентом
 * <Card gradient>
 *   <CardContent>Премиум карточка</CardContent>
 * </Card>
 */

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Hover эффект */
  hoverable?: boolean
  /** Градиентный фон */
  gradient?: boolean
  /** Отступы */
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** Дополнительные классы */
  className?: string
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, hoverable = false, gradient = false, padding = 'md', className, ...props }, ref) => {
    const paddingStyles = {
      none: '',
      sm: 'p-3',
      md: 'p-5',
      lg: 'p-6',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl border border-gray-100 transition-all duration-200',
          gradient
            ? 'bg-gradient-to-br from-sber to-sber-dark text-white'
            : 'bg-white shadow-card',
          hoverable && 'hover:shadow-card-hover cursor-pointer',
          paddingStyles[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

// CardHeader
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-1.5 pb-4', className)} {...props}>
      {children}
    </div>
  )
)

CardHeader.displayName = 'CardHeader'

// CardTitle
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string
}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-h4 font-semibold text-dark', className)}
      {...props}
    >
      {children}
    </h3>
  )
)

CardTitle.displayName = 'CardTitle'

// CardDescription
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string
}

export const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ children, className, ...props }, ref) => (
    <p ref={ref} className={cn('text-body-sm text-gray-600', className)} {...props}>
      {children}
    </p>
  )
)

CardDescription.displayName = 'CardDescription'

// CardContent
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props}>
      {children}
    </div>
  )
)

CardContent.displayName = 'CardContent'

// CardFooter
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center pt-4 mt-4 border-t border-gray-100', className)} {...props}>
      {children}
    </div>
  )
)

CardFooter.displayName = 'CardFooter'
