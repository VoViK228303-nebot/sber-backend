import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  Home, 
  Wallet, 
  ArrowLeftRight, 
  History, 
  User, 
  Settings,
  X,
  LogOut,
  HelpCircle,
  ChevronRight
} from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/lib/utils'
import { Avatar } from '../ui/Avatar'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

/**
 * Sidebar - боковое меню навигации в стиле Сбербанка
 * 
 * @example
 * // Базовое использование
 * <Sidebar />
 * 
 * // С дополнительными ссылками
 * <Sidebar extraLinks={[{ name: 'Помощь', href: '/help', icon: HelpCircle }]} />
 */

export interface SidebarLink {
  name: string
  href: string
  icon: React.ElementType
  badge?: string
}

export interface SidebarProps {
  /** Дополнительные ссылки в навигации */
  extraLinks?: SidebarLink[]
  /** Дополнительные классы */
  className?: string
}

const defaultNavigation: SidebarLink[] = [
  { name: 'Главная', href: '/app/dashboard', icon: Home },
  { name: 'Счета', href: '/app/accounts', icon: Wallet },
  { name: 'Переводы', href: '/app/transfers', icon: ArrowLeftRight },
  { name: 'История', href: '/app/history', icon: History },
  { name: 'Профиль', href: '/app/profile', icon: User },
  { name: 'Настройки', href: '/app/settings', icon: Settings },
]

export function Sidebar({ extraLinks = [], className }: SidebarProps) {
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useUIStore()
  const { logout, user } = useAuthStore()
  const location = useLocation()

  const navigation = [...defaultNavigation, ...extraLinks]

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`
    : ''

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-[280px] bg-white border-r border-gray-200 transition-transform duration-300 lg:translate-x-0 flex flex-col",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
        className
      )}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 shrink-0">
          <NavLink to="/app/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sber flex items-center justify-center">
              <span className="text-white font-bold">СБ</span>
            </div>
            <div>
              <span className="font-bold text-dark block leading-tight">СберБанк</span>
              <span className="text-caption text-gray-500 block leading-tight">Онлайн</span>
            </div>
          </NavLink>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="lg:hidden p-2"
            icon={<X className="w-5 h-5" />}
          >
            <span className="sr-only">Закрыть меню</span>
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href || 
                           location.pathname.startsWith(`${item.href}/`)
            
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                  isActive 
                    ? "bg-sber-light text-sber shadow-sm" 
                    : "text-gray-700 hover:bg-gray-100 hover:text-dark"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-sber" : "text-gray-500 group-hover:text-gray-700"
                )} />
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 text-caption bg-sber text-white rounded-full">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <ChevronRight className="w-4 h-4 opacity-50" />
                )}
              </NavLink>
            )
          })}

          {/* Help link */}
          <div className="pt-4 mt-4 border-t border-gray-100">
            <NavLink
              to="/help"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-dark transition-all"
            >
              <HelpCircle className="w-5 h-5 text-gray-500" />
              <span>Помощь и поддержка</span>
            </NavLink>
          </div>
        </nav>

        {/* User info & Logout */}
        <div className="p-4 border-t border-gray-200 shrink-0">
          {/* User card */}
          <Card padding="sm" className="mb-3">
            <div className="flex items-center gap-3">
              <Avatar
                src={user?.avatar}
                initials={initials}
                size="md"
                status="online"
              />
              <div className="flex-1 min-w-0">
                <p className="text-body-sm font-semibold text-dark truncate">
                  {user?.fullName || `${user?.firstName} ${user?.lastName}`}
                </p>
                <p className="text-caption text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </Card>

          {/* Logout button */}
          <Button
            variant="ghost"
            fullWidth
            onClick={handleLogout}
            className="justify-start text-error hover:bg-red-50"
            icon={<LogOut className="w-5 h-5" />}
          >
            Выйти
          </Button>
        </div>
      </aside>
    </>
  )
}
