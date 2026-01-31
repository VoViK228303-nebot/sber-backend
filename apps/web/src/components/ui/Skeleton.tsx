import React from 'react'
import { cn } from '@/lib/utils'

/**
 * Skeleton - компонент скелетона для загрузки в стиле Сбербанка
 * 
 * @example
 * // Базовый скелетон
 * <Skeleton className="h-4 w-48" />
 * 
 * // Круглый (для аватаров)
 * <Skeleton className="h-12 w-12 rounded-full" />
 * 
 * // Карточка со скелетонами
 * <Card>
 *   <div className="flex items-center gap-4">
 *     <Skeleton className="h-12 w-12 rounded-full" />
 *     <div className="space-y-2">
 *       <Skeleton className="h-4 w-32" />
 *       <Skeleton className="h-3 w-24" />
 *     </div>
 *   </div>
 * </Card>
 * 
 * // Список скелетонов
 * <div className="space-y-4">
 *   <Skeleton className="h-16 w-full" />
 *   <Skeleton className="h-16 w-full" />
 *   <Skeleton className="h-16 w-full" />
 * </div>
 */

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Дополнительные классы */
  className?: string
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse rounded-md bg-gray-200',
          className
        )}
        {...props}
      />
    )
  }
)

Skeleton.displayName = 'Skeleton'

// SkeletonText - скелетон для текста
export interface SkeletonTextProps {
  /** Количество строк */
  lines?: number
  /** Ширина последней строки */
  lastLineWidth?: string
  /** Расстояние между строками */
  gap?: 'sm' | 'md' | 'lg'
  /** Дополнительные классы */
  className?: string
}

export function SkeletonText({
  lines = 3,
  lastLineWidth = '60%',
  gap = 'md',
  className,
}: SkeletonTextProps) {
  const gaps = {
    sm: 'space-y-1',
    md: 'space-y-2',
    lg: 'space-y-3',
  }

  return (
    <div className={cn(gaps[gap], className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 ? `w-[${lastLineWidth}]` : 'w-full'
          )}
          style={i === lines - 1 ? { width: lastLineWidth } : undefined}
        />
      ))}
    </div>
  )
}

// SkeletonCard - скелетон для карточки
export interface SkeletonCardProps {
  /** Показывать ли аватар */
  showAvatar?: boolean
  /** Показывать ли заголовок */
  showHeader?: boolean
  /** Показывать ли футер */
  showFooter?: boolean
  /** Количество строк контента */
  contentLines?: number
  /** Дополнительные классы */
  className?: string
}

export function SkeletonCard({
  showAvatar = true,
  showHeader = true,
  showFooter = false,
  contentLines = 2,
  className,
}: SkeletonCardProps) {
  return (
    <div className={cn('rounded-2xl border border-gray-100 bg-white p-5 space-y-4', className)}>
      {showHeader && (
        <div className="flex items-center gap-3">
          {showAvatar && <Skeleton className="h-10 w-10 rounded-full" />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      )}
      <div className="space-y-2">
        {Array.from({ length: contentLines }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-4"
            style={{ width: i === contentLines - 1 ? '60%' : '100%' }}
          />
        ))}
      </div>
      {showFooter && (
        <div className="pt-4 border-t border-gray-100 flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      )}
    </div>
  )
}

// SkeletonAccountCard - скелетон для карточки счёта
export function SkeletonAccountCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-2xl border border-gray-100 bg-white p-5', className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div>
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-8 w-40 mb-1" />
      <Skeleton className="h-3 w-24" />
    </div>
  )
}

// SkeletonTransactionItem - скелетон для элемента транзакции
export function SkeletonTransactionItem({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-4 p-4', className)}>
      <Skeleton className="h-12 w-12 rounded-xl" />
      <div className="flex-1">
        <Skeleton className="h-4 w-32 mb-1" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-5 w-20" />
    </div>
  )
}
