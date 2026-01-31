import React, { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from './ui/Card'
import { Input } from './ui/Input'
import { Button } from './ui/Button'

/**
 * RegisterForm - форма регистрации в стиле Сбербанка
 * 
 * @example
 * // Базовое использование
 * <RegisterForm onSubmit={handleRegister} />
 * 
 * // С загрузкой
 * <RegisterForm onSubmit={handleRegister} loading />
 * 
 * // С ошибкой
 * <RegisterForm onSubmit={handleRegister} error="Email уже занят" />
 * 
 * // С callback для входа
 * <RegisterForm 
 *   onSubmit={handleRegister}
 *   onLogin={() => navigate('/login')}
 * />
 */

export interface RegisterFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

export interface RegisterFormProps {
  /** Callback при отправке формы */
  onSubmit: (data: RegisterFormData) => void
  /** Callback для перехода к входу */
  onLogin?: () => void
  /** Состояние загрузки */
  loading?: boolean
  /** Общая ошибка формы */
  error?: string
  /** Дополнительные классы */
  className?: string
}

export function RegisterForm({
  onSubmit,
  onLogin,
  loading = false,
  error,
  className,
}: RegisterFormProps) {
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({})
  const [step, setStep] = useState(1)

  const validateStep1 = (): boolean => {
    const newErrors: Partial<Record<keyof RegisterFormData, string>> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Введите имя'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Введите фамилию'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Введите email'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Введите корректный email'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Введите номер телефона'
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Введите корректный номер телефона'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = (): boolean => {
    const newErrors: Partial<Record<keyof RegisterFormData, string>> = {}

    if (!formData.password) {
      newErrors.password = 'Введите пароль'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Пароль должен содержать минимум 8 символов'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Пароль должен содержать заглавную, строчную букву и цифру'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают'
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'Необходимо согласие с условиями'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2)
    }
  }

  const handleBack = () => {
    setStep(1)
  }

  const normalizePhone = (phone: string): string => {
    // Убираем все символы, кроме цифр и +
    let normalized = phone.replace(/[^\d+]/g, '')
    // Убеждаемся, что + только в начале
    if (normalized.includes('+') && !normalized.startsWith('+')) {
      normalized = normalized.replace(/\+/g, '')
    }
    return normalized
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateStep2()) {
      onSubmit({
        ...formData,
        phone: normalizePhone(formData.phone)
      })
    }
  }

  const handleChange = (field: keyof RegisterFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // Password strength indicator
  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z0-9]/.test(password)) strength++

    const labels = ['Очень слабый', 'Слабый', 'Средний', 'Хороший', 'Отличный']
    const colors = ['bg-error', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-sber']

    return { strength, label: labels[strength - 1] || 'Введите пароль', color: colors[strength - 1] || 'bg-gray-200' }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  return (
    <Card className={cn('w-full max-w-md mx-auto', className)}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-sber flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-2xl">СБ</span>
        </div>
        <h1 className="text-h2 font-bold text-dark">Регистрация</h1>
        <p className="text-body text-gray-500 mt-2">
          {step === 1 ? 'Шаг 1 из 2: Личные данные' : 'Шаг 2 из 2: Создание пароля'}
        </p>
      </div>

      {/* Progress */}
      <div className="flex gap-2 mb-8">
        <div className={cn('h-1 flex-1 rounded-full transition-colors', step >= 1 ? 'bg-sber' : 'bg-gray-200')} />
        <div className={cn('h-1 flex-1 rounded-full transition-colors', step >= 2 ? 'bg-sber' : 'bg-gray-200')} />
      </div>

      {/* Form */}
      <form onSubmit={step === 1 ? (e) => { e.preventDefault(); handleNext() } : handleSubmit} className="space-y-5">
        {step === 1 ? (
          <>
            {/* Name fields */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Имя"
                placeholder="Иван"
                icon={<User className="w-5 h-5" />}
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                error={errors.firstName}
                disabled={loading}
              />
              <Input
                label="Фамилия"
                placeholder="Иванов"
                icon={<User className="w-5 h-5" />}
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                error={errors.lastName}
                disabled={loading}
              />
            </div>

            {/* Email */}
            <Input
              type="email"
              label="Email"
              placeholder="your@email.com"
              icon={<Mail className="w-5 h-5" />}
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
              disabled={loading}
              autoComplete="email"
            />

            {/* Phone */}
            <Input
              type="tel"
              label="Телефон"
              placeholder="+7 (999) 123-45-67"
              icon={<Phone className="w-5 h-5" />}
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              error={errors.phone}
              disabled={loading}
              autoComplete="tel"
            />

            {/* Next button */}
            <Button
              type="submit"
              fullWidth
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Далее
            </Button>
          </>
        ) : (
          <>
            {/* Password */}
            <div>
              <Input
                type={showPassword ? 'text' : 'password'}
                label="Пароль"
                placeholder="Создайте надёжный пароль"
                icon={<Lock className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                error={errors.password}
                disabled={loading}
                autoComplete="new-password"
              />
              
              {/* Password strength */}
              <div className="mt-2">
                <div className="flex gap-1 h-1 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        'flex-1 rounded-full transition-colors',
                        i <= passwordStrength.strength ? passwordStrength.color : 'bg-gray-200'
                      )}
                    />
                  ))}
                </div>
                <p className="text-caption text-gray-500">
                  Надёжность: {passwordStrength.label}
                </p>
              </div>
            </div>

            {/* Confirm Password */}
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              label="Подтвердите пароль"
              placeholder="Повторите пароль"
              icon={<Lock className="w-5 h-5" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              }
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
              disabled={loading}
              autoComplete="new-password"
            />

            {/* Terms checkbox */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) => handleChange('agreeToTerms', e.target.checked)}
                className="w-5 h-5 rounded-md border-gray-300 text-sber focus:ring-sber mt-0.5"
                disabled={loading}
              />
              <span className="text-body-sm text-gray-600">
                Я согласен с{' '}
                <a href="#" className="text-sber hover:underline">условиями использования</a>
                {' '}и{' '}
                <a href="#" className="text-sber hover:underline">политикой конфиденциальности</a>
              </span>
            </label>
            {errors.agreeToTerms && (
              <p className="text-caption text-error -mt-3">{errors.agreeToTerms}</p>
            )}

            {/* General error */}
            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-error text-body-sm text-center">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={handleBack}
                disabled={loading}
              >
                Назад
              </Button>
              <Button
                type="submit"
                className="flex-1"
                loading={loading}
                icon={<Check className="w-5 h-5" />}
              >
                Зарегистрироваться
              </Button>
            </div>
          </>
        )}
      </form>

      {/* Login link */}
      {onLogin && (
        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-body text-gray-500">
            Уже есть аккаунт?{' '}
            <button
              type="button"
              onClick={onLogin}
              className="text-sber font-medium hover:underline"
            >
              Войти
            </button>
          </p>
        </div>
      )}

      {/* Security note */}
      <p className="text-caption text-gray-400 text-center mt-4">
        Ваши данные защищены шифрованием
      </p>
    </Card>
  )
}
