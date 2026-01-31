import React from 'react'
import { cn } from '@/lib/utils'

/**
 * Avatar - компонент аватара пользователя в стиле Сбербанка
 * 
 * @example
 * // С изображением
 * <Avatar src="/avatar.jpg" alt="Иван Иванов" />
 * 
 * // С инициалами
 * <Avatar initials="ИИ" />
 * 
 * // Разные размеры
 * <Avatar size="sm" initials="ИИ" />
 * <Avatar size="md" initials="ИИ" />
 * <Avatar size="lg" initials="ИИ" />
 * <Avatar size="xl" initials="ИИ" />
 * 
 * // С индикатором статуса
 * <Avatar initials="ИИ" status="online" />
 * <Avatar initials="ИИ" status="offline" />
 * <Avatar initials="ИИ" status="away" />
 */

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type AvatarStatus = 'online' | 'offline' | 'away' | 'busy'

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** URL изображения */
  src?: string
  /** Alt текст для изображения */
  alt?: string
  /** Инициалы (показываются если нет изображения) */
  initials?: string
  /** Размер аватара */
  size?: AvatarSize
  /** Статус пользователя */
  status?: AvatarStatus
  /** Дополнительные классы */
  className?: string
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt, initials, size = 'md', status, className, ...props }, ref) => {
    const sizes: Record<AvatarSize, string> = {
      xs: 'w-6 h-6 text-caption',
      sm: 'w-8 h-8 text-body-sm',
      md: 'w-10 h-10 text-body',
      lg: 'w-14 h-14 text-h4',
      xl: 'w-20 h-20 text-h3',
    }

    const statusSizes: Record<AvatarSize, string> = {
      xs: 'w-1.5 h-1.5',
      sm: 'w-2 h-2',
      md: 'w-2.5 h-2.5',
      lg: 'w-3 h-3',
      xl: 'w-4 h-4',
    }

    const statusColors: Record<AvatarStatus, string> = {
      online: 'bg-success',
      offline: 'bg-gray-400',
      away: 'bg-warning',
      busy: 'bg-error',
    }

    return (
      <div
        ref={ref}
        className={cn('relative inline-flex shrink-0', className)}
        {...props}
      >
        <div
          className={cn(
            'inline-flex items-center justify-center rounded-full font-semibold overflow-hidden',
            sizes[size],
            src ? '' : 'bg-sber-light text-sber'
          )}
        >
          {src ? (
            <img
              src={src}
              alt={alt || initials || 'Avatar'}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Если изображение не загрузилось, показываем инициалы
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        {status && (
          <span
            className={cn(
              'absolute bottom-0 right-0 rounded-full border-2 border-white',
              statusSizes[size],
              statusColors[status]
            )}
          />
        )}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'

// AvatarGroup - группа аватаров
export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Максимальное количество отображаемых аватаров */
  max?: number
  /** Дополнительные классы */
  className?: string
}

export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ children, max = 4, className, ...props }, ref) => {
    const childrenArray = React.Children.toArray(children)
    const total = childrenArray.length
    const visible = childrenArray.slice(0, max)
    const remaining = total - max

    return (
      <div ref={ref} className={cn('flex -space-x-2', className)} {...props}>
        {visible}
        {remaining > 0 && (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-body-sm font-medium text-gray-600 border-2 border-white">
            +{remaining}
          </div>
        )}
      </div>
    )
  }
)

AvatarGroup.displayName = 'AvatarGroup'
