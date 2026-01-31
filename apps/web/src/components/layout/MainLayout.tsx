import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { cn } from '@/lib/utils'

/**
 * MainLayout - основной layout с sidebar и content в стиле Сбербанка
 * 
 * @example
 * // Базовое использование (в роутере)
 * <Route element={<MainLayout />}>
 *   <Route path="/dashboard" element={<DashboardPage />} />
 *   <Route path="/accounts" element={<AccountsPage />} />
 * </Route>
 * 
 * // С кастомным классом для контента
 * <MainLayout contentClassName="bg-gray-50" />
 */

export interface MainLayoutProps {
  /** Дополнительные классы для контейнера */
  className?: string
  /** Дополнительные классы для контента */
  contentClassName?: string
  /** Скрыть header */
  hideHeader?: boolean
  /** Скрыть sidebar */
  hideSidebar?: boolean
}

export function MainLayout({
  className,
  contentClassName,
  hideHeader = false,
  hideSidebar = false,
}: MainLayoutProps) {

  return (
    <div className={cn('min-h-screen bg-gray-50', className)}>
      {/* Sidebar */}
      {!hideSidebar && <Sidebar />}
      
      {/* Main content wrapper */}
      <div 
        className={cn(
          'transition-all duration-300',
          !hideSidebar && 'lg:ml-[280px]'
        )}
      >
        {/* Header */}
        {!hideHeader && <Header />}
        
        {/* Main content */}
        <main 
          className={cn(
            'p-4 lg:p-8',
            !hideHeader && 'pt-4',
            contentClassName
          )}
        >
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
