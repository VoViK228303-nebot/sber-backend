import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Shield, Gift, Clock, CheckCircle2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { RegisterForm } from '@/components/RegisterForm'
import toast from 'react-hot-toast'

export function RegisterPage() {
  const navigate = useNavigate()
  const { register, isAuthenticated } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleRegister = async (formData: {
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
    confirmPassword: string
    agreeToTerms: boolean
  }) => {
    setError('')
    setIsLoading(true)

    try {
      await register({
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      })
      
      toast.success('Регистрация успешна! Добро пожаловать!')
      navigate('/app/dashboard')
    } catch (err: any) {
      // Детальное логирование ошибки для диагностики
      console.error('=== REGISTER ERROR DETAILS ===')
      console.error('Full error object:', err)
      console.error('Error response:', err.response)
      console.error('Error response data:', err.response?.data)
      console.error('Error response status:', err.response?.status)
      console.error('Error message:', err.message)
      console.error('Error stack:', err.stack)
      console.error('Request config:', err.config)
      console.error('=== END REGISTER ERROR DETAILS ===')

      const message = err.response?.data?.error?.message || 'Ошибка при регистрации. Попробуйте позже.'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
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
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Benefits */}
          <div className="hidden lg:block order-2 lg:order-1">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-dark mb-4">
                  Станьте клиентом СберБанка
                </h2>
                <p className="text-lg text-gray-600">
                  Откройте счёт за 5 минут и получите доступ ко всем возможностям онлайн-банка
                </p>
              </div>

              {/* Promo Card */}
              <div className="bg-gradient-to-br from-sber to-sber-dark rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Gift className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Приветственный бонус</h3>
                    <p className="text-sber-light text-body-sm">Для новых клиентов</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {[
                    'Бесплатное обслуживание навсегда',
                    'Кэшбэк 10% на всё первый месяц',
                    'Бесплатные переводы без ограничений',
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                      <span className="text-body-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <BenefitCard
                  icon={Clock}
                  title="Быстрое оформление"
                  description="Откройте счёт онлайн за 5 минут без посещения офиса"
                />
                <BenefitCard
                  icon={Shield}
                  title="Надёжная защита"
                  description="Ваши данные защищены современными технологиями шифрования"
                />
              </div>

              {/* Trust indicators */}
              <div className="pt-8 border-t border-gray-200">
                <p className="text-body-sm text-gray-500 mb-4">Нам доверяют более 100 млн клиентов</p>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-sber-light border-2 border-white flex items-center justify-center text-sber font-medium text-body-sm"
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-body-sm text-gray-600 ml-1">4.9</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Register Form */}
          <div className="order-1 lg:order-2">
            <RegisterForm
              onSubmit={handleRegister}
              onLogin={() => navigate('/login')}
              loading={isLoading}
              error={error}
            />
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
              <Link to="#" className="hover:text-sber transition-colors">Условия использования</Link>
              <Link to="#" className="hover:text-sber transition-colors">Конфиденциальность</Link>
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
