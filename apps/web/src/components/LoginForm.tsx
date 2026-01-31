import React, { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from './ui/Card'
import { Input } from './ui/Input'
import { Button } from './ui/Button'

/**
 * LoginForm - форма авторизации в стиле Сбербанка
 * 
 * @example
 * // Базовое использование
 * <LoginForm onSubmit={handleLogin} />
 * 
 * // С загрузкой
 * <LoginForm onSubmit={handleLogin} loading />
 * 
 * // С ошибкой
 * <LoginForm onSubmit={handleLogin} error="Неверный email или пароль" />
 * 
 * // С callback для "Забыли пароль?"
 * <LoginForm 
 *   onSubmit={handleLogin}
 *   onForgotPassword={() => navigate('/forgot-password')}
 * />
 */

export interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

export interface LoginFormProps {
  /** Callback при отправке формы */
  onSubmit: (data: LoginFormData) => void
  /** Callback для "Забыли пароль?" */
  onForgotPassword?: (email: string) => void
  /** Callback для "Зарегистрироваться" */
  onRegister?: () => void
  /** Состояние загрузки */
  loading?: boolean
  /** Общая ошибка формы */
  error?: string
  /** Дополнительные классы */
  className?: string
}

export function LoginForm({
  onSubmit,
  onForgotPassword,
  onRegister,
  loading = false,
  error,
  className,
}: LoginFormProps) {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({})

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof LoginFormData, string>> = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Введите email'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Введите корректный email'
    }

    if (!formData.password) {
      newErrors.password = 'Введите пароль'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов'
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

  const handleChange = (field: keyof LoginFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <Card className={cn('w-full max-w-md mx-auto', className)}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-sber flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-2xl">СБ</span>
        </div>
        <h1 className="text-h2 font-bold text-dark">Вход в СберБанк</h1>
        <p className="text-body text-gray-500 mt-2">
          Введите свои данные для входа
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
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
          autoFocus
        />

        {/* Password */}
        <div>
          <Input
            type={showPassword ? 'text' : 'password'}
            label="Пароль"
            placeholder="Введите пароль"
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
            autoComplete="current-password"
          />
          
          {/* Forgot password link */}
          {onForgotPassword && (
            <div className="flex justify-end mt-1">
              <button
                type="button"
                onClick={() => onForgotPassword(formData.email)}
                className="text-body-sm text-sber hover:underline"
              >
                Забыли пароль?
              </button>
            </div>
          )}
        </div>

        {/* Remember me */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.rememberMe}
            onChange={(e) => handleChange('rememberMe', e.target.checked)}
            className="w-5 h-5 rounded-md border-gray-300 text-sber focus:ring-sber"
            disabled={loading}
          />
          <span className="text-body text-dark">Запомнить меня</span>
        </label>

        {/* General error */}
        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-error text-body-sm text-center">
            {error}
          </div>
        )}

        {/* Submit button */}
        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={loading}
          icon={<ArrowRight className="w-5 h-5" />}
        >
          Войти
        </Button>
      </form>

      {/* Register link */}
      {onRegister && (
        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-body text-gray-500">
            Ещё нет аккаунта?{' '}
            <button
              type="button"
              onClick={onRegister}
              className="text-sber font-medium hover:underline"
            >
              Зарегистрироваться
            </button>
          </p>
        </div>
      )}

      {/* Security note */}
      <p className="text-caption text-gray-400 text-center mt-4">
        Защищено шифрованием SSL
      </p>
    </Card>
  )
}
