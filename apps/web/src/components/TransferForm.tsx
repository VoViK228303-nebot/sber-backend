import React, { useState } from 'react'
import { ArrowRight, Wallet, User, FileText } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import type { Account } from '@/types'
import { Card } from './ui/Card'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { AccountCard } from './AccountCard'

/**
 * TransferForm - форма перевода в стиле Сбербанка
 * 
 * @example
 * // Базовое использование
 * <TransferForm 
 *   accounts={accounts}
 *   onSubmit={handleTransfer}
 * />
 * 
 * // С предвыбранным счётом
 * <TransferForm 
 *   accounts={accounts}
 *   defaultFromAccountId="account-123"
 *   onSubmit={handleTransfer}
 * />
 * 
 * // С ограничением суммы
 * <TransferForm 
 *   accounts={accounts}
 *   maxAmount={100000}
 *   onSubmit={handleTransfer}
 * />
 */

export interface TransferFormData {
  fromAccountId: string
  toAccountNumber: string
  recipientName: string
  amount: string
  description: string
}

export interface TransferFormProps {
  /** Список счетов пользователя */
  accounts: Account[]
  /** Callback при отправке формы */
  onSubmit: (data: TransferFormData) => void
  /** Предвыбранный счёт списания */
  defaultFromAccountId?: string
  /** Максимальная сумма перевода */
  maxAmount?: number
  /** Загрузка */
  loading?: boolean
  /** Дополнительные классы */
  className?: string
}

export function TransferForm({
  accounts,
  onSubmit,
  defaultFromAccountId,
  maxAmount,
  loading = false,
  className,
}: TransferFormProps) {
  const [formData, setFormData] = useState<TransferFormData>({
    fromAccountId: defaultFromAccountId || accounts[0]?.id || '',
    toAccountNumber: '',
    recipientName: '',
    amount: '',
    description: '',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof TransferFormData, string>>>({})
  const [showAccountSelector, setShowAccountSelector] = useState(false)

  const selectedAccount = accounts.find(a => a.id === formData.fromAccountId)

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TransferFormData, string>> = {}

    if (!formData.fromAccountId) {
      newErrors.fromAccountId = 'Выберите счёт списания'
    }

    if (!formData.toAccountNumber.trim()) {
      newErrors.toAccountNumber = 'Введите номер счёта получателя'
    } else if (formData.toAccountNumber.length < 16) {
      newErrors.toAccountNumber = 'Номер счёта должен содержать минимум 16 цифр'
    }

    if (!formData.recipientName.trim()) {
      newErrors.recipientName = 'Введите имя получателя'
    }

    const amount = parseFloat(formData.amount)
    if (!formData.amount || isNaN(amount) || amount <= 0) {
      newErrors.amount = 'Введите корректную сумму'
    } else if (selectedAccount && amount > selectedAccount.balance) {
      newErrors.amount = 'Недостаточно средств на счёте'
    } else if (maxAmount && amount > maxAmount) {
      newErrors.amount = `Максимальная сумма перевода: ${formatCurrency(maxAmount, 'RUB')}`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  const handleChange = (field: keyof TransferFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <Card className={className}>
      <h2 className="text-h3 font-semibold text-dark mb-6">Перевод между счетами</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Счёт списания */}
        <div>
          <label className="text-body-sm font-medium text-dark mb-2 block">
            Счёт списания
          </label>
          {selectedAccount ? (
            <div className="relative">
              <AccountCard
                account={selectedAccount}
                compact
                onClick={() => setShowAccountSelector(!showAccountSelector)}
                className={cn(
                  'cursor-pointer',
                  showAccountSelector && 'ring-2 ring-sber'
                )}
              />
              {showAccountSelector && (
                <div className="absolute top-full left-0 right-0 mt-2 z-10 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                  {accounts.map(account => (
                    <button
                      key={account.id}
                      type="button"
                      onClick={() => {
                        handleChange('fromAccountId', account.id)
                        setShowAccountSelector(false)
                      }}
                      className="w-full text-left hover:bg-gray-50 transition-colors"
                    >
                      <AccountCard account={account} compact className="shadow-none border-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-gray-100 text-gray-500 text-center">
              Нет доступных счетов
            </div>
          )}
          {errors.fromAccountId && (
            <p className="text-caption text-error mt-1">{errors.fromAccountId}</p>
          )}
        </div>

        {/* Получатель */}
        <div className="space-y-4">
          <Input
            label="Номер счёта получателя"
            placeholder="Введите номер счёта (16-20 цифр)"
            icon={<Wallet className="w-5 h-5" />}
            value={formData.toAccountNumber}
            onChange={(e) => handleChange('toAccountNumber', e.target.value)}
            error={errors.toAccountNumber}
            maxLength={20}
          />

          <Input
            label="ФИО получателя"
            placeholder="Введите полное имя получателя"
            icon={<User className="w-5 h-5" />}
            value={formData.recipientName}
            onChange={(e) => handleChange('recipientName', e.target.value)}
            error={errors.recipientName}
          />
        </div>

        {/* Сумма */}
        <div>
          <Input
            label="Сумма перевода"
            placeholder="0.00"
            type="number"
            step="0.01"
            min="0.01"
            value={formData.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            error={errors.amount}
            rightIcon={<span className="text-gray-500 font-medium">₽</span>}
          />
          {selectedAccount && (
            <p className="text-caption text-gray-500 mt-1">
              Доступно: {formatCurrency(selectedAccount.balance, selectedAccount.currency)}
            </p>
          )}
        </div>

        {/* Назначение платежа */}
        <Input
          label="Назначение платежа (необязательно)"
          placeholder="Введите назначение платежа"
          icon={<FileText className="w-5 h-5" />}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />

        {/* Кнопка отправки */}
        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={loading}
          disabled={!selectedAccount}
          icon={<ArrowRight className="w-5 h-5" />}
        >
          Перевести
        </Button>

        {/* Примечание о безопасности */}
        <p className="text-caption text-gray-500 text-center">
          Переводы защищены шифрованием. Комиссия не взимается.
        </p>
      </form>
    </Card>
  )
}
