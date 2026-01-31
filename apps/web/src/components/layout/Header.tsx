import { useNavigate } from 'react-router-dom'
import { Bell, LogOut, Menu } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useUIStore } from '@/stores/uiStore'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import toast from 'react-hot-toast'

export interface HeaderProps {
  // Props can be added here if needed in the future
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Header(_props: HeaderProps) {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { toggleSidebar } = useUIStore()

  const initials = user 
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`
    : ''

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Вы успешно вышли из системы')
      navigate('/login')
    } catch (error) {
      toast.error('Ошибка при выходе')
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Left side - Mobile menu button */}
        <div className="flex items-center lg:hidden">
          <Button variant="ghost" size="sm" className="p-2" onClick={toggleSidebar}>
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Notifications */}
          <button className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-error rounded-full border-2 border-white" />
          </button>

          {/* User menu */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <button 
              onClick={() => navigate('/app/profile')}
              className="flex items-center gap-3 hover:bg-gray-50 rounded-xl p-2 transition-colors"
            >
              <Avatar
                src={user?.avatar}
                initials={initials}
                size="sm"
              />
              <div className="hidden sm:block text-left">
                <p className="text-body-sm font-medium text-dark">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-caption text-gray-500">{user?.email}</p>
              </div>
            </button>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-error"
              title="Выйти"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
