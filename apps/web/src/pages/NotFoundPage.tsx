import { Link, useNavigate } from 'react-router-dom'
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useAuthStore } from '@/stores/authStore'

export function NotFoundPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()

  const homePath = isAuthenticated ? '/app/dashboard' : '/'

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="text-center p-8 sm:p-12">
          {/* 404 Icon */}
          <div className="w-24 h-24 rounded-2xl bg-sber-light flex items-center justify-center mx-auto mb-8">
            <span className="text-sber text-5xl font-bold">404</span>
          </div>
          
          {/* Title */}
          <h1 className="text-h1 font-bold text-dark mb-4">
            Страница не найдена
          </h1>
          
          {/* Description */}
          <p className="text-body-lg text-gray-600 mb-8 max-w-md mx-auto">
            Извините, запрашиваемая страница не существует или была перемещена. 
            Проверьте правильность адреса или вернитесь на главную.
          </p>

          {/* Search suggestion */}
          <div className="flex items-center justify-center gap-2 text-body text-gray-500 mb-8">
            <Search className="w-4 h-4" />
            <span>Попробуйте воспользоваться поиском или перейдите по ссылкам ниже</span>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate(-1)}
              icon={<ArrowLeft className="w-5 h-5" />}
            >
              Назад
            </Button>
            
            <Link to={homePath}>
              <Button
                size="lg"
                icon={<Home className="w-5 h-5" />}
              >
                На главную
              </Button>
            </Link>
          </div>

          {/* Help Links */}
          <div className="pt-8 border-t border-gray-100">
            <p className="text-body-sm text-gray-500 mb-4">Возможно, вам помогут эти ссылки:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to={isAuthenticated ? '/app/dashboard' : '/'} 
                className="text-sber hover:underline text-body-sm"
              >
                Главная страница
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/app/accounts" className="text-sber hover:underline text-body-sm">
                    Мои счета
                  </Link>
                  <Link to="/app/transfers" className="text-sber hover:underline text-body-sm">
                    Переводы
                  </Link>
                  <Link to="/app/history" className="text-sber hover:underline text-body-sm">
                    История
                  </Link>
                </>
              )}
              <Link to="#" className="text-sber hover:underline text-body-sm flex items-center gap-1">
                <HelpCircle className="w-4 h-4" />
                Помощь
              </Link>
            </div>
          </div>
        </Card>

        {/* Support Info */}
        <div className="mt-8 text-center">
          <p className="text-body-sm text-gray-500">
            Если проблема повторяется, обратитесь в службу поддержки
          </p>
          <div className="mt-2 flex items-center justify-center gap-4 text-body-sm">
            <a href="tel:900" className="text-sber hover:underline">
              900
            </a>
            <span className="text-gray-300">|</span>
            <a href="tel:+74955005550" className="text-sber hover:underline">
              +7 (495) 500-55-50
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
