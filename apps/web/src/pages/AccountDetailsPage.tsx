import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  CreditCard,
  Copy,
  CheckCircle2,
  AlertCircle,
  ArrowLeftRight,
  Plus,
  Trash2,
  History,
  FileText
} from 'lucide-react'
import { accountsApi, transactionsApi } from '@/api'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Skeleton, SkeletonTransactionItem } from '@/components/ui/Skeleton'
import { TransactionItem } from '@/components/TransactionItem'
import toast from 'react-hot-toast'

export function AccountDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showDetails, setShowDetails] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false)

  const { data: accountData, isLoading: isAccountLoading } = useQuery({
    queryKey: ['account', id],
    queryFn: () => accountsApi.getAccount(id!),
    enabled: !!id,
  })

  const { data: transactionsData, isLoading: isTransactionsLoading } = useQuery({
    queryKey: ['transactions', id],
    queryFn: () => transactionsApi.getTransactions({ accountId: id, limit: 10 }),
    enabled: !!id,
  })

  const closeAccountMutation = useMutation({
    mutationFn: () => accountsApi.closeAccount(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Счёт успешно закрыт')
      navigate('/app/accounts')
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || 'Ошибка при закрытии счёта'
      toast.error(message)
    },
  })

  const account = accountData?.data.account
  const transactions = transactionsData?.data.transactions || []

  const isLoading = isAccountLoading || isTransactionsLoading

  const typeLabels: Record<string, string> = {
    debit: 'Дебетовый счёт',
    credit: 'Кредитный счёт',
    savings: 'Накопительный счёт',
  }

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    toast.success('Скопировано в буфер обмена')
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleTransfer = () => {
    navigate('/app/transfers', { state: { fromAccountId: id } })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-40 rounded-2xl" />
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!account) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-h3 font-bold text-dark mb-2">Счёт не найден</h2>
        <p className="text-gray-500 mb-6">Запрашиваемый счёт не существует или был удалён</p>
        <Button onClick={() => navigate('/app/accounts')}>
          <ArrowLeft className="w-5 h-5 mr-2" />
          Ко всем счетам
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/app/accounts')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-h2 font-bold text-dark">{typeLabels[account.type]}</h1>
            <p className="text-body text-gray-600">{account.maskedNumber}</p>
          </div>
        </div>
        <Badge variant={account.isActive ? 'success' : 'error'}>
          {account.isActive ? 'Активен' : 'Заблокирован'}
        </Badge>
      </div>

      {/* Balance Card */}
      <Card gradient className="relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/80 text-body">
              {account.type === 'credit' ? 'Текущий баланс' : 'Доступно'}
            </p>
            {account.name && (
              <span className="text-white/80 text-body-sm">{account.name}</span>
            )}
          </div>
          <p className="text-4xl font-bold text-white mb-4">
            {formatCurrency(account.balance, account.currency)}
          </p>
          {account.availableBalance !== undefined && account.availableBalance !== account.balance && (
            <p className="text-white/80 text-body">
              Доступно: {formatCurrency(account.availableBalance, account.currency)}
            </p>
          )}
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      </Card>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={handleTransfer} icon={<ArrowLeftRight className="w-5 h-5" />}>
          Перевести
        </Button>
        <Button variant="secondary" icon={<Plus className="w-5 h-5" />}>
          Пополнить
        </Button>
        <Button 
          variant="secondary" 
          icon={<FileText className="w-5 h-5" />}
          onClick={() => setShowDetails(!showDetails)}
        >
          Реквизиты
        </Button>
        <Button 
          variant="ghost" 
          className="text-error hover:bg-red-50 ml-auto"
          onClick={() => setIsCloseModalOpen(true)}
        >
          <Trash2 className="w-5 h-5 mr-2" />
          Закрыть счёт
        </Button>
      </div>

      {/* Account Details */}
      {showDetails && (
        <Card>
          <CardHeader>
            <CardTitle>Реквизиты счёта</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <DetailRow 
                label="Номер счёта" 
                value={account.number} 
                onCopy={() => handleCopy(account.number, 'number')}
                copied={copiedField === 'number'}
              />
              <DetailRow 
                label="Валюта" 
                value={account.currency} 
              />
              <DetailRow 
                label="Тип счёта" 
                value={typeLabels[account.type]} 
              />
              <DetailRow 
                label="Дата открытия" 
                value={formatDate(account.createdAt)} 
              />
              <DetailRow 
                label="Статус" 
                value={account.isActive ? 'Активен' : 'Заблокирован'} 
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cards Section */}
      {account.cards && account.cards.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Привязанные карты</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {account.cards.map((card) => (
                <div
                  key={card.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                >
                  <div className="w-12 h-12 bg-sber-light rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-sber" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-dark">{card.maskedNumber}</p>
                    <p className="text-body-sm text-gray-500">
                      Действует до {card.expiryDate}
                    </p>
                  </div>
                  {card.isVirtual && (
                    <Badge variant="info">Виртуальная</Badge>
                  )}
                  {card.isBlocked ? (
                    <Badge variant="error">Заблокирована</Badge>
                  ) : (
                    <Badge variant="success">Активна</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Limits Section */}
      {account.limits && (
        <Card>
          <CardHeader>
            <CardTitle>Лимиты</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-body-sm text-gray-500 mb-1">Суточный лимит переводов</p>
                <p className="text-h4 font-semibold text-dark">
                  {formatCurrency(account.limits.dailyTransferLimit, account.currency)}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-body-sm text-gray-500 mb-1">Суточный лимит снятия</p>
                <p className="text-h4 font-semibold text-dark">
                  {formatCurrency(account.limits.dailyWithdrawalLimit, account.currency)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>История операций</CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/app/history', { state: { accountId: id } })}
          >
            Все операции
            <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {isTransactionsLoading ? (
            <div className="divide-y divide-gray-100">
              {[1, 2, 3].map((i) => (
                <SkeletonTransactionItem key={i} />
              ))}
            </div>
          ) : transactions.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {transactions.slice(0, 5).map((transaction) => (
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
        </CardContent>
      </Card>

      {/* Close Account Modal */}
      <Modal
        isOpen={isCloseModalOpen}
        onClose={() => setIsCloseModalOpen(false)}
        title="Закрыть счёт"
        description="Вы уверены, что хотите закрыть этот счёт?"
        actions={[
          {
            label: 'Отмена',
            variant: 'secondary',
            onClick: () => setIsCloseModalOpen(false),
          },
          {
            label: closeAccountMutation.isPending ? 'Закрытие...' : 'Закрыть счёт',
            variant: 'danger',
            onClick: () => closeAccountMutation.mutate(),
            loading: closeAccountMutation.isPending,
          },
        ]}
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-body-sm text-amber-800 font-medium">Важно</p>
              <p className="text-body-sm text-amber-700">
                После закрытия счёта все средства будут недоступны. 
                Убедитесь, что на счету нет остатка или привязанных автоплатежей.
              </p>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-body-sm text-gray-500 mb-1">Текущий баланс</p>
            <p className="text-h4 font-semibold text-dark">
              {formatCurrency(account.balance, account.currency)}
            </p>
          </div>

          {closeAccountMutation.error && (
            <div className="p-4 rounded-xl bg-red-50 text-error text-body-sm">
              Ошибка при закрытии счёта. Попробуйте позже.
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}

interface DetailRowProps {
  label: string
  value: string
  onCopy?: () => void
  copied?: boolean
}

function DetailRow({ label, value, onCopy, copied }: DetailRowProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-gray-500">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-medium text-dark">{value}</span>
        {onCopy && (
          <button
            onClick={onCopy}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            title="Копировать"
          >
            {copied ? (
              <CheckCircle2 className="w-4 h-4 text-sber" />
            ) : (
              <Copy className="w-4 h-4 text-gray-400" />
            )}
          </button>
        )}
      </div>
    </div>
  )
}
