import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './Button'

/**
 * Modal - компонент модального окна в стиле Сбербанка
 * 
 * @example
 * // Базовое использование
 * <Modal isOpen={isOpen} onClose={handleClose} title="Заголовок">
 *   <p>Содержимое модального окна</p>
 * </Modal>
 * 
 * // С кнопками действий
 * <Modal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   title="Подтверждение"
 *   actions={[
 *     { label: 'Отмена', variant: 'secondary', onClick: handleClose },
 *     { label: 'Подтвердить', variant: 'primary', onClick: handleConfirm },
 *   ]}
 * >
 *   <p>Вы уверены?</p>
 * </Modal>
 * 
 * // Размеры
 * <Modal size="sm" ... /> // маленький
 * <Modal size="md" ... /> // средний (по умолчанию)
 * <Modal size="lg" ... /> // большой
 * 
 * // Без закрытия по клику вне окна
 * <Modal closeOnOverlayClick={false} ... />
 */

export interface ModalAction {
  label: string
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  onClick: () => void
  loading?: boolean
  disabled?: boolean
}

export interface ModalProps {
  /** Открыто ли модальное окно */
  isOpen: boolean
  /** Callback при закрытии */
  onClose: () => void
  /** Заголовок */
  title?: React.ReactNode
  /** Описание под заголовком */
  description?: React.ReactNode
  /** Содержимое */
  children: React.ReactNode
  /** Кнопки действий в футере */
  actions?: ModalAction[]
  /** Размер модального окна */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Закрывать при клике на оверлей */
  closeOnOverlayClick?: boolean
  /** Показывать кнопку закрытия */
  showCloseButton?: boolean
  /** Дополнительные классы для контента */
  contentClassName?: string
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  actions,
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true,
  contentClassName,
}: ModalProps) {
  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Блокировка скролла body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative w-full mx-4 bg-white rounded-2xl shadow-2xl animate-slide-up',
          sizes[size]
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between p-6 pb-0">
            <div className="flex-1 pr-4">
              {title && (
                <h2 className="text-h3 font-semibold text-dark">{title}</h2>
              )}
              {description && (
                <p className="mt-1 text-body text-gray-600">{description}</p>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Закрыть"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className={cn('p-6', contentClassName)}>{children}</div>

        {/* Footer */}
        {actions && actions.length > 0 && (
          <div className="flex items-center justify-end gap-3 p-6 pt-0">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'primary'}
                onClick={action.onClick}
                loading={action.loading}
                disabled={action.disabled}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ModalHeader - отдельный компонент для заголовка
export interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export const ModalHeader = React.forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center justify-between p-6 pb-0', className)} {...props}>
      {children}
    </div>
  )
)

ModalHeader.displayName = 'ModalHeader'

// ModalFooter - отдельный компонент для футера
export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export const ModalFooter = React.forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center justify-end gap-3 p-6 pt-0', className)} {...props}>
      {children}
    </div>
  )
)

ModalFooter.displayName = 'ModalFooter'
