import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Wallet, 
  ArrowLeftRight, 
  History, 
  Shield, 
  CreditCard, 
  PiggyBank, 
  Smartphone,
  ChevronRight,
  Star,
  CheckCircle2,
  ArrowRight
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export function LandingPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app/dashboard')
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-sber flex items-center justify-center">
                <span className="text-white font-bold text-lg">СБ</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-dark text-lg block leading-tight">СберБанк</span>
                <span className="text-caption text-gray-500 block leading-tight">Онлайн</span>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Войти
                </Button>
              </Link>
              <Link to="/register" className="hidden sm:block">
                <Button size="sm">
                  Регистрация
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sber-pale via-white to-white" />
        <div className="absolute top-20 right-0 w-1/2 h-1/2 bg-sber-light/30 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sber-light text-sber text-body-sm font-medium mb-8">
              <Star className="w-4 h-4" />
              <span>Новое мобильное приложение</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-dark mb-6 leading-tight">
              Банк всегда
              <span className="text-sber"> под рукой</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Управляйте своими финансами легко и безопасно. 
              Переводы, платежи и контроль счетов в одном приложении.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                  Открыть счёт
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="lg">
                  Войти в приложение
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-body-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-sber" />
                <span>Бесплатное открытие</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-sber" />
                <span>Мгновенные переводы</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-sber" />
                <span>24/7 поддержка</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
              Наши продукты
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Выбирайте подходящие решения для управления вашими финансами
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ProductCard
              icon={CreditCard}
              title="Дебетовые карты"
              description="Бесплатное обслуживание, кэшбэк до 10% и бесплатные переводы"
              features={['Бесплатная доставка', 'Кэшбэк до 10%', 'Apple Pay / Google Pay']}
              color="sber"
            />
            <ProductCard
              icon={PiggyBank}
              title="Накопительные счета"
              description="Начните копить с выгодной процентной ставкой до 8% годовых"
              features={['Ставка до 8% годовых', 'Пополнение без комиссии', 'Снятие в любой момент']}
              color="amber"
            />
            <ProductCard
              icon={Wallet}
              title="Кредитные карты"
              description="Льготный период до 100 дней и кредитный лимит до 1 000 000 ₽"
              features={['100 дней без %', 'Лимит до 1 млн ₽', 'Мгновенное решение']}
              color="purple"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
              Почему выбирают нас
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Современные технологии и надёжность традиционного банка
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={Wallet}
              title="Управление счетами"
              description="Открывайте и управляйте дебетовыми, кредитными и накопительными счетами в одном приложении"
            />
            <FeatureCard
              icon={ArrowLeftRight}
              title="Быстрые переводы"
              description="Мгновенные переводы между счетами и другим клиентам 24/7 без комиссии"
            />
            <FeatureCard
              icon={History}
              title="История операций"
              description="Полная история всех операций с фильтрами, поиском и аналитикой"
            />
            <FeatureCard
              icon={Shield}
              title="Безопасность"
              description="Защита данных, двухфакторная аутентификация и подтверждение операций"
            />
          </div>
        </div>
      </section>

      {/* Mobile App Section */}
      <section className="py-20 bg-sber text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Всё под контролем в смартфоне
              </h2>
              <p className="text-lg text-sber-light mb-8">
                Устанавливайте мобильное приложение СберБанк Онлайн и управляйте 
                финансами где бы вы ни находились
              </p>
              <div className="space-y-4">
                {[
                  'Оплата услуг и переводы',
                  'Управление картами и счетами',
                  'Аналитика расходов',
                  'Поддержка 24/7'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-body-lg">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl" />
              <div className="relative bg-white rounded-3xl p-6 shadow-2xl max-w-sm mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-xl bg-sber flex items-center justify-center">
                    <span className="text-white font-bold">СБ</span>
                  </div>
                  <div className="text-right">
                    <p className="text-body-sm text-gray-500">Общий баланс</p>
                    <p className="text-h3 font-bold text-dark">125 000 ₽</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 rounded-lg bg-sber-light flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-sber" />
                      </div>
                      <div className="flex-1">
                        <p className="text-body-sm font-medium text-dark">Счёт {i}</p>
                        <p className="text-caption text-gray-500">**** 123{i}</p>
                      </div>
                      <p className="font-semibold text-dark">{i * 25000} ₽</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 grid grid-cols-4 gap-2">
                  {[ArrowLeftRight, Smartphone, PiggyBank, History].map((Icon, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="w-10 h-10 rounded-xl bg-sber-light flex items-center justify-center">
                        <Icon className="w-5 h-5 text-sber" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-dark rounded-3xl p-8 sm:p-12 lg:p-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Готовы начать?
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Присоединяйтесь к миллионам клиентов СберБанка. 
              Откройте счёт за 5 минут.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-sber hover:bg-sber-dark">
                  Открыть счёт
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="lg" className="bg-white/10 text-white hover:bg-white/20 border-0">
                  Уже есть аккаунт
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-sber flex items-center justify-center">
                  <span className="text-white font-bold text-sm">СБ</span>
                </div>
                <span className="font-bold text-dark">СберБанк</span>
              </div>
              <p className="text-body-sm text-gray-500">
                Современный онлайн-банк для удобного управления финансами
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-dark mb-4">Продукты</h4>
              <ul className="space-y-2 text-body-sm text-gray-500">
                <li><Link to="#" className="hover:text-sber transition-colors">Дебетовые карты</Link></li>
                <li><Link to="#" className="hover:text-sber transition-colors">Кредитные карты</Link></li>
                <li><Link to="#" className="hover:text-sber transition-colors">Накопительные счета</Link></li>
                <li><Link to="#" className="hover:text-sber transition-colors">Кредиты</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-dark mb-4">Поддержка</h4>
              <ul className="space-y-2 text-body-sm text-gray-500">
                <li><Link to="#" className="hover:text-sber transition-colors">Помощь</Link></li>
                <li><Link to="#" className="hover:text-sber transition-colors">FAQ</Link></li>
                <li><Link to="#" className="hover:text-sber transition-colors">Контакты</Link></li>
                <li><Link to="#" className="hover:text-sber transition-colors">Безопасность</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-dark mb-4">Контакты</h4>
              <ul className="space-y-2 text-body-sm text-gray-500">
                <li>Горячая линия: 900</li>
                <li>Для звонков из-за рубежа: +7 (495) 500-55-50</li>
                <li>support@sberbank.ru</li>
                <li>Круглосуточно, без выходных</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-body-sm text-gray-500">
              © 2026 ПАО СберБанк. Все права защищены.
            </p>
            <div className="flex items-center gap-4 text-body-sm text-gray-500">
              <Link to="#" className="hover:text-sber transition-colors">Политика конфиденциальности</Link>
              <Link to="#" className="hover:text-sber transition-colors">Условия использования</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ElementType
  title: string
  description: string
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Card className="h-full hover:shadow-card-hover transition-shadow">
      <div className="w-14 h-14 bg-sber-light rounded-2xl flex items-center justify-center mb-5">
        <Icon className="w-7 h-7 text-sber" />
      </div>
      <h3 className="text-h4 font-semibold text-dark mb-3">{title}</h3>
      <p className="text-body text-gray-600 leading-relaxed">{description}</p>
    </Card>
  )
}

interface ProductCardProps {
  icon: React.ElementType
  title: string
  description: string
  features: string[]
  color: 'sber' | 'amber' | 'purple'
}

function ProductCard({ icon: Icon, title, description, features, color }: ProductCardProps) {
  const colorClasses = {
    sber: 'bg-sber-light text-sber',
    amber: 'bg-amber-100 text-amber-600',
    purple: 'bg-purple-100 text-purple-600',
  }

  return (
    <Card className="h-full hover:shadow-card-hover transition-shadow group">
      <div className={`w-14 h-14 ${colorClasses[color]} rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110`}>
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-h4 font-semibold text-dark mb-3">{title}</h3>
      <p className="text-body text-gray-600 mb-5 leading-relaxed">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-body-sm text-gray-600">
            <CheckCircle2 className="w-4 h-4 text-sber flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6 pt-6 border-t border-gray-100">
        <Link 
          to="/register" 
          className="inline-flex items-center gap-2 text-sber font-medium hover:gap-3 transition-all"
        >
          Подробнее
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </Card>
  )
}
