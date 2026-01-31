import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  User,
  Lock,
  Bell,
  Shield,
  Smartphone,
  Camera,
  Mail,
  Phone,
  CheckCircle2,
  Loader2
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { authApi } from '@/api'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Avatar } from '@/components/ui/Avatar'
import { Modal } from '@/components/ui/Modal'
import { Skeleton } from '@/components/ui/Skeleton'
import toast from 'react-hot-toast'

export function ProfilePage() {
  const queryClient = useQueryClient()
  const { user, setUser } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'personal' | 'security' | 'notifications'>('personal')
  
  // Personal info form state
  const [personalForm, setPersonalForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Notifications state
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: false,
    transactionAlerts: true,
    marketingEmails: false,
  })

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => authApi.getProfile(),
  })

  const updateProfileMutation = useMutation({
    mutationFn: (data: Partial<typeof personalForm>) => authApi.updateProfile(data),
    onSuccess: (response) => {
      setUser(response.data.user)
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      setIsEditModalOpen(false)
      toast.success('Профиль обновлён')
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || 'Ошибка при обновлении профиля'
      toast.error(message)
    },
  })

  const changePasswordMutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) => 
      authApi.changePassword(data.currentPassword, data.newPassword),
    onSuccess: () => {
      setIsPasswordModalOpen(false)
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      toast.success('Пароль успешно изменён')
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || 'Ошибка при смене пароля'
      toast.error(message)
    },
  })

  useEffect(() => {
    if (profileData?.data.user) {
      const { firstName, lastName, email, phone } = profileData.data.user
      setPersonalForm({ firstName, lastName, email, phone })
    }
  }, [profileData])

  const profile = profileData?.data.user || user
  const initials = profile 
    ? `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`
    : ''

  const handleSavePersonal = () => {
    updateProfileMutation.mutate(personalForm)
  }

  const handleChangePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Пароли не совпадают')
      return
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error('Пароль должен содержать минимум 8 символов')
      return
    }
    changePasswordMutation.mutate({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    })
  }

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
    // TODO: Save notification preferences to API
    toast.success('Настройки уведомлений обновлены')
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-4 border-b border-gray-200 pb-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-h2 font-bold text-dark">Профиль</h1>
        <p className="text-body text-gray-600">Управление личными данными и настройками</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'personal', label: 'Личные данные', icon: User },
          { id: 'security', label: 'Безопасность', icon: Lock },
          { id: 'notifications', label: 'Уведомления', icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 text-body-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-sber text-sber'
                  : 'border-transparent text-gray-500 hover:text-dark'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Personal Tab */}
      {activeTab === 'personal' && profile && (
        <div className="space-y-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle>Личные данные</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar
                    src={profile.avatar || undefined}
                    initials={initials}
                    size="xl"
                  />
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-sber rounded-full flex items-center justify-center text-white hover:bg-sber-dark transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h3 className="font-semibold text-dark text-h4">
                    {profile.fullName || `${profile.firstName} ${profile.lastName}`}
                  </h3>
                  <p className="text-body text-gray-500">Клиент с {formatDate(profile.createdAt)}</p>
                  {profile.verified && (
                    <div className="flex items-center gap-1 mt-1">
                      <CheckCircle2 className="w-4 h-4 text-sber" />
                      <span className="text-body-sm text-sber">Верифицирован</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-sber-light flex items-center justify-center">
                    <User className="w-5 h-5 text-sber" />
                  </div>
                  <div>
                    <p className="text-body-sm text-gray-500">Имя</p>
                    <p className="font-medium text-dark">{profile.firstName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-sber-light flex items-center justify-center">
                    <User className="w-5 h-5 text-sber" />
                  </div>
                  <div>
                    <p className="text-body-sm text-gray-500">Фамилия</p>
                    <p className="font-medium text-dark">{profile.lastName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-sber-light flex items-center justify-center">
                    <Mail className="w-5 h-5 text-sber" />
                  </div>
                  <div>
                    <p className="text-body-sm text-gray-500">Email</p>
                    <p className="font-medium text-dark">{profile.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-sber-light flex items-center justify-center">
                    <Phone className="w-5 h-5 text-sber" />
                  </div>
                  <div>
                    <p className="text-body-sm text-gray-500">Телефон</p>
                    <p className="font-medium text-dark">{profile.phone}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => setIsEditModalOpen(true)}
                  variant="secondary"
                >
                  Редактировать
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Безопасность</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <SecurityItem
                icon={Lock}
                title="Пароль"
                description="Последнее изменение: 3 месяца назад"
                action="Изменить"
                onClick={() => setIsPasswordModalOpen(true)}
              />
              <SecurityItem
                icon={Shield}
                title="Двухфакторная аутентификация"
                description="Дополнительный уровень защиты"
                action="Настроить"
                onClick={() => toast.success('Функция будет доступна позже')}
              />
              <SecurityItem
                icon={Smartphone}
                title="Привязанные устройства"
                description="2 устройства"
                action="Управление"
                onClick={() => toast.success('Функция будет доступна позже')}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <Card>
          <CardHeader>
            <CardTitle>Настройки уведомлений</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { key: 'email', title: 'Email-уведомления', desc: 'Получать уведомления на email' },
              { key: 'sms', title: 'SMS-уведомления', desc: 'Получать SMS о операциях' },
              { key: 'push', title: 'Push-уведомления', desc: 'Push-уведомления в браузере' },
              { key: 'transactionAlerts', title: 'Оповещения о транзакциях', desc: 'Мгновенные уведомления о всех операциях' },
              { key: 'marketingEmails', title: 'Маркетинговые сообщения', desc: 'Новости, акции и специальные предложения' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-dark">{item.title}</p>
                  <p className="text-body-sm text-gray-500">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications[item.key as keyof typeof notifications]}
                    onChange={() => handleNotificationChange(item.key as keyof typeof notifications)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sber-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sber"></div>
                </label>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Редактировать профиль"
        actions={[
          {
            label: 'Отмена',
            variant: 'secondary',
            onClick: () => setIsEditModalOpen(false),
          },
          {
            label: updateProfileMutation.isPending ? 'Сохранение...' : 'Сохранить',
            variant: 'primary',
            onClick: handleSavePersonal,
            loading: updateProfileMutation.isPending,
          },
        ]}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Имя"
              value={personalForm.firstName}
              onChange={(e) => setPersonalForm({ ...personalForm, firstName: e.target.value })}
            />
            <Input
              label="Фамилия"
              value={personalForm.lastName}
              onChange={(e) => setPersonalForm({ ...personalForm, lastName: e.target.value })}
            />
          </div>
          <Input
            label="Email"
            type="email"
            value={personalForm.email}
            onChange={(e) => setPersonalForm({ ...personalForm, email: e.target.value })}
          />
          <Input
            label="Телефон"
            value={personalForm.phone}
            onChange={(e) => setPersonalForm({ ...personalForm, phone: e.target.value })}
          />
          {updateProfileMutation.error && (
            <div className="p-4 rounded-xl bg-red-50 text-error text-body-sm">
              Ошибка при сохранении. Попробуйте позже.
            </div>
          )}
        </div>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Смена пароля"
        actions={[
          {
            label: 'Отмена',
            variant: 'secondary',
            onClick: () => setIsPasswordModalOpen(false),
          },
          {
            label: changePasswordMutation.isPending ? 'Изменение...' : 'Изменить пароль',
            variant: 'primary',
            onClick: handleChangePassword,
            loading: changePasswordMutation.isPending,
          },
        ]}
      >
        <div className="space-y-4">
          <Input
            label="Текущий пароль"
            type="password"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
          />
          <Input
            label="Новый пароль"
            type="password"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
          />
          <Input
            label="Подтвердите новый пароль"
            type="password"
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
          />
          <div className="p-4 rounded-xl bg-gray-50">
            <p className="text-body-sm text-gray-600">Требования к паролю:</p>
            <ul className="mt-2 space-y-1 text-caption text-gray-500">
              <li>• Минимум 8 символов</li>
              <li>• Заглавная и строчная буква</li>
              <li>• Минимум одна цифра</li>
            </ul>
          </div>
          {changePasswordMutation.error && (
            <div className="p-4 rounded-xl bg-red-50 text-error text-body-sm">
              Ошибка при смене пароля. Попробуйте позже.
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}

interface SecurityItemProps {
  icon: React.ElementType
  title: string
  description: string
  action: string
  onClick: () => void
}

function SecurityItem({ icon: Icon, title, description, action, onClick }: SecurityItemProps) {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
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

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long' })
}
