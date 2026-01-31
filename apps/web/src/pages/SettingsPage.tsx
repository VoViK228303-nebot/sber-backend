import { useState } from 'react'
import { 
  Moon, 
  Sun, 
  Shield, 
  Smartphone,
  Monitor,
  Bell,
  Lock,
  Eye,
  LogOut
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useUIStore } from '@/stores/uiStore'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'

export function SettingsPage() {
  const { logout } = useAuthStore()
  const { theme, setTheme } = useUIStore()
  const [language, setLanguage] = useState('ru')
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showSessionsModal, setShowSessionsModal] = useState(false)

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  const sessions = [
    { id: '1', device: 'Chrome на Windows', location: 'Москва, Россия', lastActive: 'Сейчас', isCurrent: true },
    { id: '2', device: 'Safari на iPhone', location: 'Москва, Россия', lastActive: '2 часа назад', isCurrent: false },
    { id: '3', device: 'Firefox на macOS', location: 'Санкт-Петербург, Россия', lastActive: '3 дня назад', isCurrent: false },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-h2 font-bold text-dark">Настройки</h1>
        <p className="text-body text-gray-600">Управление приложением и предпочтениями</p>
      </div>

      {/* Interface Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Интерфейс</CardTitle>
          <CardDescription>Настройки внешнего вида и языка</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Selection */}
          <div>
            <label className="text-body-sm font-medium text-dark mb-3 block">
              Тема оформления
            </label>
            <div className="grid grid-cols-3 gap-3">
              <ThemeOption
                icon={Sun}
                label="Светлая"
                selected={theme === 'light'}
                onClick={() => setTheme('light')}
              />
              <ThemeOption
                icon={Moon}
                label="Тёмная"
                selected={theme === 'dark'}
                onClick={() => setTheme('dark')}
              />
              <ThemeOption
                icon={Monitor}
                label="Системная"
                selected={false}
                onClick={() => alert('Функция будет доступна позже')}
              />
            </div>
          </div>

          {/* Language Selection */}
          <div className="pt-6 border-t border-gray-100">
            <label className="text-body-sm font-medium text-dark mb-3 block">
              Язык интерфейса
            </label>
            <div className="flex gap-3">
              {[
                { code: 'ru', label: 'Русский', flag: '🇷🇺' },
                { code: 'en', label: 'English', flag: '🇬🇧' },
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 font-medium transition-all ${
                    language === lang.code
                      ? 'border-sber bg-sber-light text-sber'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span className="text-body-sm">{lang.label}</span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Безопасность</CardTitle>
          <CardDescription>Управление доступом и сессиями</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingItem
            icon={Lock}
            title="Смена пароля"
            description="Рекомендуется менять пароль каждые 3 месяца"
            action="Изменить"
            onClick={() => alert('Функция будет доступна позже')}
          />
          <SettingItem
            icon={Shield}
            title="Двухфакторная аутентификация"
            description="Дополнительный уровень защиты аккаунта"
            action="Настроить"
            onClick={() => alert('Функция будет доступна позже')}
          />
          <SettingItem
            icon={Smartphone}
            title="Активные сессии"
            description={`${sessions.length} активных устройств`}
            action="Управление"
            onClick={() => setShowSessionsModal(true)}
          />
        </CardContent>
      </Card>

      {/* Notifications Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Уведомления</CardTitle>
          <CardDescription>Настройка способов получения уведомлений</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleItem
            icon={Bell}
            title="Push-уведомления"
            description="Уведомления в браузере"
            checked={true}
            onChange={() => {}}
          />
          <ToggleItem
            icon={Shield}
            title="Оповещения о входе"
            description="Уведомлять при входе с нового устройства"
            checked={true}
            onChange={() => {}}
          />
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Приватность</CardTitle>
          <CardDescription>Управление видимостью данных</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleItem
            icon={Eye}
            title="Показывать баланс"
            description="Отображать сумму на главном экране"
            checked={true}
            onChange={() => {}}
          />
        </CardContent>
      </Card>

      {/* Logout Section */}
      <Card className="border-error/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                <LogOut className="w-6 h-6 text-error" />
              </div>
              <div>
                <h3 className="font-semibold text-dark">Выйти из аккаунта</h3>
                <p className="text-body-sm text-gray-500">Завершить текущую сессию</p>
              </div>
            </div>
            <Button 
              variant="danger"
              onClick={() => setShowLogoutModal(true)}
            >
              Выйти
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* App Info */}
      <div className="text-center text-body-sm text-gray-400 pt-8">
        <p>СберБанк Онлайн v1.0.0</p>
        <p className="mt-1">© 2026 ПАО СберБанк. Все права защищены.</p>
      </div>

      {/* Logout Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Подтверждение выхода"
        description="Вы уверены, что хотите выйти из аккаунта?"
        actions={[
          {
            label: 'Отмена',
            variant: 'secondary',
            onClick: () => setShowLogoutModal(false),
          },
          {
            label: 'Выйти',
            variant: 'danger',
            onClick: handleLogout,
          },
        ]}
      >
        <div className="p-4 bg-amber-50 rounded-xl">
          <p className="text-body-sm text-amber-800">
            После выхода вам потребуется снова войти в систему для доступа к счетам.
          </p>
        </div>
      </Modal>

      {/* Sessions Modal */}
      <Modal
        isOpen={showSessionsModal}
        onClose={() => setShowSessionsModal(false)}
        title="Активные сессии"
        description="Управление устройствами с доступом к аккаунту"
        actions={[
          {
            label: 'Закрыть',
            variant: 'secondary',
            onClick: () => setShowSessionsModal(false),
          },
        ]}
      >
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`flex items-center justify-between p-4 rounded-xl ${
                session.isCurrent ? 'bg-sber-light/50' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-dark">{session.device}</p>
                    {session.isCurrent && (
                      <Badge variant="success" size="sm">Текущая</Badge>
                    )}
                  </div>
                  <p className="text-body-sm text-gray-500">
                    {session.location} • {session.lastActive}
                  </p>
                </div>
              </div>
              {!session.isCurrent && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-error hover:bg-red-50"
                  onClick={() => alert('Сессия завершена')}
                >
                  Завершить
                </Button>
              )}
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
}

interface ThemeOptionProps {
  icon: React.ElementType
  label: string
  selected: boolean
  onClick: () => void
}

function ThemeOption({ icon: Icon, label, selected, onClick }: ThemeOptionProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
        selected
          ? 'border-sber bg-sber-light text-sber'
          : 'border-gray-200 text-gray-600 hover:border-gray-300'
      }`}
    >
      <Icon className="w-6 h-6" />
      <span className="text-body-sm font-medium">{label}</span>
    </button>
  )
}

interface SettingItemProps {
  icon: React.ElementType
  title: string
  description: string
  action: string
  onClick: () => void
}

function SettingItem({ icon: Icon, title, description, action, onClick }: SettingItemProps) {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
          <Icon className="w-5 h-5 text-gray-500" />
        </div>
        <div>
          <p className="font-medium text-dark">{title}</p>
          <p className="text-body-sm text-gray-500">{description}</p>
        </div>
      </div>
      <Button variant="secondary" size="sm" onClick={onClick}>
        {action}
      </Button>
    </div>
  )
}

interface ToggleItemProps {
  icon: React.ElementType
  title: string
  description: string
  checked: boolean
  onChange: () => void
}

function ToggleItem({ icon: Icon, title, description, checked, onChange }: ToggleItemProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
          <Icon className="w-5 h-5 text-gray-500" />
        </div>
        <div>
          <p className="font-medium text-dark">{title}</p>
          <p className="text-body-sm text-gray-500">{description}</p>
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sber-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sber"></div>
      </label>
    </div>
  )
}
