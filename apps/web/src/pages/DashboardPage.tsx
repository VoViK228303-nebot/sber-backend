import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Wallet,
  ArrowLeftRight,
  History,
  Plus,
  ChevronRight,
  Bell,
  Eye
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { dashboardApi, accountsApi } from '@/api'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Skeleton, SkeletonAccountCard, SkeletonTransactionItem } from '@/components/ui/Skeleton'
import { QuickActions } from '@/components/QuickActions'
import { AccountCard } from '@/components/AccountCard'
import { TransactionItem } from '@/components/TransactionItem'
import { BalanceChart } from '@/components/BalanceChart'
import toast from 'react-hot-toast'

export function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const { data: dashboardData, isLoading: isDashboardLoading, error: dashboardError } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardApi.getDashboard(),
  })

  const { data: accountsData, isLoading: isAccountsLoading, error: accountsError } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountsApi.getAccounts(),
  })

  // Show error toast if data fetching fails
  if (dashboardError) {
    toast.error('Ошибка загрузки данных дашборда')
  }
  if (accountsError) {
    toast.error('Ошибка загрузки счетов')
  }

  const isLoading = isDashboardLoading || isAccountsLoading

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'transfer':
        navigate('/app/transfers')
        break
      case 'pay':
        navigate('/app/transfers')
        break
      case 'mobile':
        navigate('/app/transfers')
        break
      case 'utilities':
        navigate('/app/transfers')
        break
      case 'internet':
        navigate('/app/transfers')
        break
      case 'savings':
        navigate('/app/accounts')
        break
      default:
        break
    }
  }

  const dashboard = dashboardData?.data
  const accounts = accountsData?.data.accounts || []

  // Calculate total balance from accounts if dashboard data is not available
  const totalBalance = dashboard?.totalBalance || {
    amount: accounts.reduce((sum, acc) => sum + acc.balance, 0),
    currency: 'RUB'
  }

  // Generate chart data from accounts
  const chartData = accounts.map((account, index) => ({
    label: account.name || `Счёт ${index + 1}`,
    value: account.balance,
    fullDate: account.createdAt
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h2 font-bold text-dark">
            Здравствуйте, {user?.firstName || 'Клиент'}!
          </h1>
          <p className="text-body text-gray-600">
            {new Date().toLocaleDateString('ru-RU', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-error rounded-full border-2 border-white" />
          </button>
        </div>
      </div>

      {/* Total Balance Card */}
      <Card gradient className="relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/80 text-body">Общий баланс</p>
            <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
              <Eye className="w-5 h-5 text-white" />
            </button>
          </div>
          <p className="text-4xl font-bold text-white mb-4">
            {isLoading ? (
              <Skeleton className="h-10 w-48 bg-white/20" />
            ) : (
              formatCurrency(totalBalance.amount, totalBalance.currency)
            )}
          </p>
          <div className="flex items-center gap-4">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => navigate('/app/transfers')}
              className="bg-white/20 text-white border-0 hover:bg-white/30"
            >
              <ArrowLeftRight className="w-4 h-4 mr-2" />
              Перевести
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              className="bg-white/20 text-white border-0 hover:bg-white/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              Пополнить
            </Button>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      </Card>

      {/* Quick Actions */}
      <div>
        <h2 className="text-h4 font-semibold text-dark mb-4">Быстрые действия</h2>
        <QuickActions onAction={handleQuickAction} />
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Accounts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Accounts Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-h4 font-semibold text-dark">Ваши счета</h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/app/accounts')}
              >
                Все счета
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            
            {isLoading ? (
              <div className="grid sm:grid-cols-2 gap-4">
                <SkeletonAccountCard />
                <SkeletonAccountCard />
              </div>
            ) : accounts.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {accounts.slice(0, 4).map((account) => (
                  <AccountCard 
                    key={account.id} 
                    account={account}
                    onClick={() => navigate(`/app/accounts/${account.id}`)}
                  />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">У вас пока нет счетов</p>
                <Button onClick={() => navigate('/app/accounts')}>Открыть счёт</Button>
              </Card>
            )}
          </div>

          {/* Balance Chart */}
          {accounts.length > 0 && (
            <BalanceChart 
              data={chartData}
              title="Динамика баланса"
              period="Последние 30 дней"
              height={200}
            />
          )}
        </div>

        {/* Right Column - Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-h4 font-semibold text-dark">Последние операции</h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/app/history')}
            >
              Все
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <Card>
            {isLoading ? (
              <div className="divide-y divide-gray-100">
                {[1, 2, 3, 4, 5].map((i) => (
                  <SkeletonTransactionItem key={i} />
                ))}
              </div>
            ) : dashboard?.recentTransactions && dashboard.recentTransactions.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {dashboard.recentTransactions.slice(0, 5).map((transaction) => (
                  <TransactionItem 
                    key={transaction.id} 
                    transaction={transaction}
                    compact
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-body-sm">Нет операций</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
