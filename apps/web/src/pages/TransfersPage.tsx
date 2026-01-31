import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  ArrowLeftRight, 
  Clock, 
  Star, 
  User, 
  Building2,
  Smartphone,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Trash2
} from 'lucide-react'
import { accountsApi, transfersApi } from '@/api'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { TransferForm } from '@/components/TransferForm'
import type { Account } from '@/types'
import toast from 'react-hot-toast'

export function TransfersPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const defaultFromAccountId = location.state?.fromAccountId

  const [activeTab, setActiveTab] = useState<'transfer' | 'templates' | 'recent'>('transfer')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [transferResult, setTransferResult] = useState<{ amount: number; recipientName: string } | null>(null)

  const { data: accountsData, isLoading: isAccountsLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountsApi.getAccounts(),
  })

  const { data: templatesData, isLoading: isTemplatesLoading } = useQuery({
    queryKey: ['transfer-templates'],
    queryFn: () => transfersApi.getTemplates(),
  })

  const { data: transfersData, isLoading: isTransfersLoading } = useQuery({
    queryKey: ['transfers'],
    queryFn: () => transfersApi.getTransfers({ limit: 10 }),
  })

  const transferMutation = useMutation({
    mutationFn: (data: {
      fromAccountId: string
      toAccountNumber: string
      amount: number
      currency: string
      description?: string
      recipientName: string
    }) => transfersApi.createTransfer(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['transfers'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      setTransferResult({
        amount: response.data.transfer.amount,
        recipientName: response.data.transfer.recipientName,
      })
      setShowSuccessModal(true)
      toast.success('Перевод выполнен успешно')
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || 'Ошибка при выполнении перевода'
      toast.error(message)
    },
  })

  const deleteTemplateMutation = useMutation({
    mutationFn: (id: string) => transfersApi.deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfer-templates'] })
      toast.success('Шаблон удалён')
    },
    onError: () => {
      toast.error('Ошибка при удалении шаблона')
    },
  })

  const accounts = accountsData?.data.accounts || []
  const templates = templatesData?.data.templates || []
  const recentTransfers = transfersData?.data.transfers || []

  const handleTransfer = (formData: {
    fromAccountId: string
    toAccountNumber: string
    recipientName: string
    amount: string
    description: string
  }) => {
    const fromAccount = accounts.find(a => a.id === formData.fromAccountId)
    
    transferMutation.mutate({
      fromAccountId: formData.fromAccountId,
      toAccountNumber: formData.toAccountNumber,
      amount: parseFloat(formData.amount),
      currency: fromAccount?.currency || 'RUB',
      description: formData.description,
      recipientName: formData.recipientName,
    })
  }

  const handleSelectTemplate = (template: typeof templates[0]) => {
    // Navigate to transfer tab with pre-filled data
    setActiveTab('transfer')
    // TODO: Pre-fill form with template data
    toast.success('Шаблон выбран')
  }

  const handleSelectRecent = (transfer: typeof recentTransfers[0]) => {
    setActiveTab('transfer')
    // TODO: Pre-fill form with recipient data
    toast.success('Получатель выбран')
  }

  const isLoading = isAccountsLoading || isTemplatesLoading || isTransfersLoading

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-h2 font-bold text-dark">Переводы</h1>
        <p className="text-body text-gray-600">Переводы между счетами и другим клиентам</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'transfer', label: 'Новый перевод', icon: ArrowLeftRight },
          { id: 'templates', label: 'Шаблоны', icon: Star },
          { id: 'recent', label: 'Недавние', icon: Clock },
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
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      {activeTab === 'transfer' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Transfer Form */}
          <div className="lg:col-span-2">
            <TransferForm
              accounts={accounts}
              defaultFromAccountId={defaultFromAccountId}
              onSubmit={handleTransfer}
              loading={transferMutation.isPending}
            />
          </div>

          {/* Quick Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sber-light flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-sber" />
                  </div>
                  <div>
                    <p className="font-medium text-dark">Без комиссии</p>
                    <p className="text-body-sm text-gray-500">
                      Переводы между своими счетами и внутри банка
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sber-light flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-sber" />
                  </div>
                  <div>
                    <p className="font-medium text-dark">Мгновенно</p>
                    <p className="text-body-sm text-gray-500">
                      Переводы выполняются в режиме реального времени
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sber-light flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-sber" />
                  </div>
                  <div>
                    <p className="font-medium text-dark">В любой банк</p>
                    <p className="text-body-sm text-gray-500">
                      Переводы по России в любые банки
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Limits Card */}
            <Card>
              <CardHeader>
                <CardTitle>Лимиты переводов</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-body-sm text-gray-500">В сутки</span>
                  <span className="font-medium text-dark">до 1 000 000 ₽</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-body-sm text-gray-500">В месяц</span>
                  <span className="font-medium text-dark">до 5 000 000 ₽</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin w-8 h-8 border-2 border-sber border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-500">Загрузка шаблонов...</p>
            </div>
          ) : templates.length > 0 ? (
            <>
              {templates.map((template) => (
                <Card 
                  key={template.id} 
                  hoverable
                  className="cursor-pointer relative group"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-sber-light flex items-center justify-center">
                        <User className="w-6 h-6 text-sber" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-sber fill-sber" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteTemplateMutation.mutate(template.id)
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-error transition-all"
                          title="Удалить шаблон"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <h3 className="font-semibold text-dark mb-1">{template.name}</h3>
                    <p className="text-body-sm text-gray-500 mb-2">{template.toAccountNumber}</p>
                    {template.amount && (
                      <p className="text-caption text-sber font-medium">
                        {formatCurrency(template.amount, template.currency || 'RUB')}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <div className="col-span-full text-center py-12">
              <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-h4 font-semibold text-dark mb-2">Нет шаблонов</h3>
              <p className="text-gray-500">Создайте шаблон для быстрых переводов</p>
            </div>
          )}
          
          {/* Add Template Card */}
          <Card 
            hoverable
            className="cursor-pointer border-dashed border-2 border-gray-200"
            onClick={() => setActiveTab('transfer')}
          >
            <CardContent className="p-5 flex flex-col items-center justify-center h-full min-h-[160px]">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
                <Star className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-body-sm text-gray-500">Добавить шаблон</p>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'recent' && (
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-sber border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-500">Загрузка истории...</p>
              </div>
            ) : recentTransfers.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {recentTransfers.map((transfer) => (
                  <button
                    key={transfer.id}
                    onClick={() => handleSelectRecent(transfer)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="w-12 h-12 rounded-xl bg-sber-light flex items-center justify-center">
                      <User className="w-6 h-6 text-sber" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-dark">{transfer.recipientName}</p>
                      <p className="text-body-sm text-gray-500">{transfer.toAccountNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-dark">
                        {formatCurrency(transfer.amount, transfer.currency)}
                      </p>
                      <p className="text-caption text-gray-400">
                        {new Date(transfer.createdAt).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-h4 font-semibold text-dark mb-2">Нет недавних переводов</h3>
                <p className="text-gray-500">История переводов появится здесь</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false)
          setTransferResult(null)
        }}
        title="Перевод выполнен"
        actions={[
          {
            label: 'Новый перевод',
            variant: 'secondary',
            onClick: () => {
              setShowSuccessModal(false)
              setTransferResult(null)
            },
          },
          {
            label: 'К истории',
            variant: 'primary',
            onClick: () => navigate('/app/history'),
          },
        ]}
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-sber-light flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-sber" />
          </div>
          <p className="text-h3 font-bold text-dark mb-2">
            {transferResult && formatCurrency(transferResult.amount, 'RUB')}
          </p>
          <p className="text-body text-gray-600">
            Успешно переведено {transferResult?.recipientName}
          </p>
        </div>
      </Modal>
    </div>
  )
}
