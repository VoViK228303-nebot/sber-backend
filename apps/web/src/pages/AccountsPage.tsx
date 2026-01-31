import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Plus,
  Wallet,
  CreditCard,
  PiggyBank,
  Search,
  X,
  CheckCircle2
} from 'lucide-react'
import { accountsApi } from '@/api'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { SkeletonAccountCard } from '@/components/ui/Skeleton'
import { AccountCard } from '@/components/AccountCard'
import type { AccountType } from '@/types'
import toast from 'react-hot-toast'

export function AccountsPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<AccountType | 'all'>('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createFormData, setCreateFormData] = useState({
    type: 'debit' as AccountType,
    currency: 'RUB',
    name: '',
  })

  const { data: accountsData, isLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountsApi.getAccounts(),
  })

  const createAccountMutation = useMutation({
    mutationFn: (data: { type: AccountType; currency: string; name?: string }) =>
      accountsApi.createAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      setIsCreateModalOpen(false)
      setCreateFormData({ type: 'debit', currency: 'RUB', name: '' })
      toast.success('Счёт успешно создан')
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || 'Ошибка при создании счёта'
      toast.error(message)
    },
  })

  const accounts = accountsData?.data.accounts || []

  // Filter accounts
  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch = 
      account.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.maskedNumber.includes(searchQuery)
    const matchesType = filterType === 'all' || account.type === filterType
    return matchesSearch && matchesType
  })

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)

  const handleCreateAccount = () => {
    createAccountMutation.mutate({
      type: createFormData.type,
      currency: createFormData.currency,
      name: createFormData.name || undefined,
    })
  }

  const accountTypeOptions: { value: AccountType; label: string; icon: React.ElementType; description: string }[] = [
    { value: 'debit', label: 'Дебетовый', icon: Wallet, description: 'Для повседневных расходов' },
    { value: 'credit', label: 'Кредитный', icon: CreditCard, description: 'С льготным периодом' },
    { value: 'savings', label: 'Накопительный', icon: PiggyBank, description: 'Начисление процентов' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-h2 font-bold text-dark">Счета</h1>
          <p className="text-body text-gray-600">
            {accounts.length} {accounts.length === 1 ? 'счёт' : accounts.length < 5 ? 'счёта' : 'счетов'} • {' '}
            Общий баланс: {formatCurrency(totalBalance, 'RUB')}
          </p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          icon={<Plus className="w-5 h-5" />}
        >
          Открыть счёт
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Поиск по названию или номеру..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-5 h-5" />}
                rightIcon={searchQuery && (
                  <button onClick={() => setSearchQuery('')}>
                    <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === 'all' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setFilterType('all')}
              >
                Все
              </Button>
              <Button
                variant={filterType === 'debit' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setFilterType('debit')}
              >
                Дебетовые
              </Button>
              <Button
                variant={filterType === 'credit' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setFilterType('credit')}
              >
                Кредитные
              </Button>
              <Button
                variant={filterType === 'savings' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setFilterType('savings')}
              >
                Накопительные
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accounts Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <SkeletonAccountCard key={i} />
          ))}
        </div>
      ) : filteredAccounts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAccounts.map((account) => (
            <AccountCard 
              key={account.id} 
              account={account}
              onClick={() => navigate(`/app/accounts/${account.id}`)}
            />
          ))}
        </div>
      ) : (
        <Card className="text-center py-16">
          <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-h4 font-semibold text-dark mb-2">
            {searchQuery ? 'Ничего не найдено' : 'У вас пока нет счетов'}
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {searchQuery 
              ? 'Попробуйте изменить параметры поиска' 
              : 'Откройте первый счёт и начните пользоваться всеми возможностями онлайн-банка'}
          </p>
          {!searchQuery && (
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Открыть счёт
            </Button>
          )}
        </Card>
      )}

      {/* Create Account Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Открыть новый счёт"
        description="Выберите тип счёта и валюту"
        actions={[
          {
            label: 'Отмена',
            variant: 'secondary',
            onClick: () => setIsCreateModalOpen(false),
          },
          {
            label: createAccountMutation.isPending ? 'Открытие...' : 'Открыть счёт',
            variant: 'primary',
            onClick: handleCreateAccount,
            loading: createAccountMutation.isPending,
          },
        ]}
      >
        <div className="space-y-6">
          {/* Account Type Selection */}
          <div>
            <label className="text-body-sm font-medium text-dark mb-3 block">
              Тип счёта
            </label>
            <div className="space-y-3">
              {accountTypeOptions.map((option) => {
                const Icon = option.icon
                return (
                  <label
                    key={option.value}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      createFormData.type === option.value
                        ? 'border-sber bg-sber-light/50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="accountType"
                      value={option.value}
                      checked={createFormData.type === option.value}
                      onChange={(e) => setCreateFormData({ ...createFormData, type: e.target.value as AccountType })}
                      className="sr-only"
                    />
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      createFormData.type === option.value ? 'bg-sber text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-dark">{option.label}</p>
                      <p className="text-body-sm text-gray-500">{option.description}</p>
                    </div>
                    {createFormData.type === option.value && (
                      <CheckCircle2 className="w-6 h-6 text-sber" />
                    )}
                  </label>
                )
              })}
            </div>
          </div>

          {/* Currency Selection */}
          <div>
            <label className="text-body-sm font-medium text-dark mb-3 block">
              Валюта
            </label>
            <div className="flex gap-3">
              {['RUB', 'USD', 'EUR'].map((currency) => (
                <button
                  key={currency}
                  onClick={() => setCreateFormData({ ...createFormData, currency })}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                    createFormData.currency === currency
                      ? 'border-sber bg-sber-light text-sber'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {currency}
                </button>
              ))}
            </div>
          </div>

          {/* Account Name (Optional) */}
          <div>
            <label className="text-body-sm font-medium text-dark mb-2 block">
              Название счёта <span className="text-gray-400">(необязательно)</span>
            </label>
            <Input
              placeholder="Например: Основной, Сбережения"
              value={createFormData.name}
              onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
            />
          </div>

          {createAccountMutation.error && (
            <div className="p-4 rounded-xl bg-red-50 text-error text-body-sm">
              Ошибка при создании счёта. Попробуйте позже.
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
