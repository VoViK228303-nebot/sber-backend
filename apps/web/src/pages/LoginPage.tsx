import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Shield, Smartphone, Lock } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { authApi } from '@/api'
import { LoginForm } from '@/components/LoginForm'
import toast from 'react-hot-toast'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleLogin = async (formData: { email: string; password: string; rememberMe: boolean }) => {
    setError('')
    setIsLoading(true)

    try {
      const response = await authApi.login({
        email: formData.email,
        password: formData.password,
      })
      
      const { user, accessToken, refreshToken } = response.data
      login(user, accessToken, refreshToken)
      
      toast.success('Добро пожаловать!')
      navigate('/app/dashboard')
    } catch (err: any) {
      const message = err.response?.data?.error?.message || 'Неверный email или пароль'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (email: string) => {
    try {
      await authApi.forgotPassword(email)
      toast.success('Инструкции по восстановлению пароля отправлены на email')
    } catch (err: any) {
      const message = err.response?.data?.error?.message || 'Ошибка при отправке запроса'
      toast.error(message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-dark transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>На главную</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Login Form */}
          <div>
            <LoginForm
              onSubmit={handleLogin}
              onForgotPassword={handleForgotPassword}
              onRegister={() => navigate('/register')}
              loading={isLoading}
              error={error}
            />
          </div>

          {/* Right Side - Benefits */}
          <div className="hidden lg:block">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-dark mb-4">
                  Вход в СберБанк Онлайн
                </h2>
                <p className="text-lg text-gray-600">
                  Управляйте своими финансами из любой точки мира
                </p>
              </div>

              <div className="space-y-6">
                <BenefitCard
                  icon={Shield}
                  title="Безопасность"
                  description="Защита данных по стандарту PCI DSS и двухфакторная аутентификация"
                />
                <BenefitCard
                  icon={Smartphone}
                  title="Доступность 24/7"
                  description="Все операции доступны в любое время из любой точки мира"
                />
                <BenefitCard
                  icon={Lock}
                  title="Контроль"
                  description="Мгновенные уведомления обо всех операциях по счетам"
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200">
                <div>
                  <p className="text-3xl font-bold text-sber">100M+</p>
                  <p className="text-body-sm text-gray-500">Клиентов</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-sber">24/7</p>
                  <p className="text-body-sm text-gray-500">Поддержка</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-sber">0 ₽</p>
                  <p className="text-body-sm text-gray-500">Обслуживание</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-body-sm text-gray-500">
            <p>© 2026 ПАО СберБанк. Все права защищены.</p>
            <div className="flex items-center gap-4">
              <Link to="#" className="hover:text-sber transition-colors">Помощь</Link>
              <Link to="#" className="hover:text-sber transition-colors">Безопасность</Link>
              <Link to="#" className="hover:text-sber transition-colors">Контакты</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

interface BenefitCardProps {
  icon: React.ElementType
  title: string
  description: string
}

function BenefitCard({ icon: Icon, title, description }: BenefitCardProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 bg-sber-light rounded-xl flex items-center justify-center flex-shrink-0">
        <Icon className="w-6 h-6 text-sber" />
      </div>
      <div>
        <h3 className="font-semibold text-dark mb-1">{title}</h3>
        <p className="text-body-sm text-gray-600">{description}</p>
      </div>
    </div>
  )
}
