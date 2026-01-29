"use client"

import useMutateUpdatePaidPrice, { UpdatePaidPriceDto } from "@/app/home/accounts/hooks/useMutateUpdatePaidPrice"
import type { Client, Supplier } from "@/app/home/orders/order.interface"
import { IsLoadingCard } from "@/components/global/isloading-card"
import { SharedDataTable, StatusBadge, type TableColumn } from "@/components/shared/shared-data-table"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/ui/pagination"
import { formatCurrency } from "@/functions/format-functions"
import { useQueryClient } from "@tanstack/react-query"
import { CheckCircle2, CreditCard, Info, Package } from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { AccountsReceiveFilters } from "./accounts-receive-filters"
import { PaymentModal } from "./payment-modal"

interface Order {
  id: number
  code: string
  description: string
  size: string
  amount: number
  cost_price: number
  sale_price: number
  total_price: number
  status: string
  date_creation_order: string
  price_paid?: number
  client_infos?: {
    client_id: number
    client_name: string
  } | null
  supplier_infos?: {
    supplier_id: number
    supplier_name: string
  } | null
  clientJoin?: {
    name: string
  }
}

interface AccountsReceiveProps {
  isLoading: boolean
  orders: Order[]
  clients: Client[]
  suppliers: Supplier[]
  pagination: { pageIndex: number; pageSize: number; totalPages?: number }
  setPagination: React.Dispatch<React.SetStateAction<{ pageIndex: number; pageSize: number }>>
  totalPages?: number
  onFiltersChange: (filters: {
    dateStart?: string
    dateEnd?: string
    clientId?: number
    supplierId?: number
  }) => void
}

export const AccountsReceive = ({
  isLoading,
  orders,
  clients,
  suppliers,
  pagination,
  setPagination,
  totalPages,
  onFiltersChange,
}: AccountsReceiveProps) => {
  const [selectedOrders, setSelectedOrders] = useState<number[]>([])
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState<Order | null>(null)

  const queryClient = useQueryClient()
  const { mutateAsync: updatePaidPrice, isPending } = useMutateUpdatePaidPrice()

  const calculatePendingAmount = (order: Order) => {
    const paidPrice = Number(order.price_paid ?? 0)
    // For Contas a Receber, use sale value (amount * sale_price)
    const saleTotal = (order.amount || 0) * (order.sale_price || 0)
    return Math.max(0, saleTotal - paidPrice)
  }

  // Filter orders that have pending payments (can be selected)
  const pendingOrders = orders.filter(order => calculatePendingAmount(order) > 0)

  const handleToggleSelect = (order: Order) => {
    // Only allow selecting orders with pending payments
    if (calculatePendingAmount(order) <= 0) return

    setSelectedOrders(prev =>
      prev.includes(order.id)
        ? prev.filter(id => id !== order.id)
        : [...prev, order.id]
    )
  }

  const handleSelectAll = () => {
    // Only select orders that have pending payments
    const pendingOrderIds = pendingOrders.map(order => order.id)

    if (pendingOrders.every(order => selectedOrders.includes(order.id))) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(pendingOrderIds)
    }
  }

  const handleOpenPaymentModal = (order: Order) => {
    setSelectedOrderForPayment(order)
    setPaymentModalOpen(true)
  }

  const handleClosePaymentModal = () => {
    setPaymentModalOpen(false)
    setSelectedOrderForPayment(null)
  }

  const handleConfirmPayment = async (amount: number) => {
    if (!selectedOrderForPayment) return

    const currentPaid = Number(selectedOrderForPayment.price_paid ?? 0)
    const newTotalPaid = currentPaid + amount

    const payment: UpdatePaidPriceDto = {
      order_id: selectedOrderForPayment.id,
      paid_price: newTotalPaid,
    }

    try {
      await updatePaidPrice([payment])

      toast.success("Pagamento registrado", {
        description: `${formatCurrency(amount)} foi registrado para o pedido #${selectedOrderForPayment.code}`,
      })

      await queryClient.invalidateQueries({
        queryKey: ["getPendingPaidOrders"],
      })

      handleClosePaymentModal()
      setSelectedOrders([])
    } catch {
      toast.error("Erro ao processar pagamento")
    }
  }

  const handleBatchPayment = async () => {
    if (selectedOrders.length === 0) return

    const payments: UpdatePaidPriceDto[] = selectedOrders.map(orderId => {
      const order = orders.find(o => o.id === orderId)
      if (!order) return null

      // For batch payment, mark as fully paid
      return {
        order_id: orderId,
        paid_price: Number(order.total_price ?? 0),
      }
    }).filter(Boolean) as UpdatePaidPriceDto[]

    try {
      await updatePaidPrice(payments)

      toast.success("Pagamentos processados", {
        description: `${payments.length} pagamento(s) foram marcados como pagos.`,
      })

      await queryClient.invalidateQueries({
        queryKey: ["getPendingPaidOrders"],
      })

      setSelectedOrders([])
    } catch {
      toast.error("Erro ao processar pagamentos")
    }
  }

  // Get display status based on payment - simplified to PAGO/PENDENTE only
  const getDisplayStatus = (order: Order): string => {
    const pendingAmount = calculatePendingAmount(order)
    if (pendingAmount <= 0) {
      return "PAGO"
    }
    return "PENDENTE"
  }

  // Calculate sale total (amount * sale_price)
  const calculateSaleTotal = (order: Order) => {
    return (order.amount || 0) * (order.sale_price || 0)
  }

  // Calculate totals
  const totalPendingAmount = useMemo(() => {
    return orders.reduce((sum, order) => sum + calculatePendingAmount(order), 0)
  }, [orders])

  const totalPaidAmount = useMemo(() => {
    return orders.reduce((sum, order) => sum + Number(order.price_paid ?? 0), 0)
  }, [orders])

  const selectedOrdersData = orders.filter(order => selectedOrders.includes(order.id))
  const selectedTotalPending = selectedOrdersData.reduce((sum, order) => sum + calculatePendingAmount(order), 0)

  // Define columns for Contas a Receber
  const columns: TableColumn<Order>[] = useMemo(() => [
    {
      key: 'client',
      header: 'Cliente',
      accessor: (order) => order.client_infos?.client_name || order.clientJoin?.name || "-",
    },
    {
      key: 'description',
      header: 'Descrição',
      accessor: (order) => order.description || "-",
    },
    {
      key: 'amount',
      header: 'QTDE',
      accessor: (order) => order.amount,
      align: 'center' as const,
      className: 'font-bold',
    },
    {
      key: 'sale_price',
      header: 'Valor (venda)',
      accessor: (order) => formatCurrency(order.sale_price || 0),
      align: 'right' as const,
    },
    {
      key: 'total_sale',
      header: 'Valor Total (venda)',
      accessor: (order) => formatCurrency(calculateSaleTotal(order)),
      align: 'right' as const,
      className: 'font-semibold',
    },
    {
      key: 'paid_price',
      header: 'Valor Pago',
      accessor: (order) => (
        <span className="text-green-600 font-medium">
          {formatCurrency(order.price_paid || 0)}
        </span>
      ),
      align: 'right' as const,
    },
    {
      key: 'to_receive',
      header: 'Valor a Receber',
      accessor: (order) => {
        const pending = calculatePendingAmount(order)
        return (
          <span className={pending > 0 ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
            {formatCurrency(pending)}
          </span>
        )
      },
      align: 'right' as const,
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (order) => <StatusBadge status={getDisplayStatus(order)} />,
    },
    {
      key: 'to_pay',
      header: 'Valor a Pagar',
      accessor: (order) => {
        const pending = calculatePendingAmount(order)
        return (
          <span className={pending > 0 ? "text-orange-600 font-medium" : "text-gray-400"}>
            {formatCurrency(pending)}
          </span>
        )
      },
      align: 'right' as const,
    },
    {
      key: 'actions',
      header: 'Quitar',
      accessor: (order) => {
        const pending = calculatePendingAmount(order)
        if (pending <= 0) {
          return (
            <span className="text-green-600 text-xs font-medium">Quitado</span>
          )
        }
        return (
          <Button
            size="sm"
            variant="outline"
            className="h-7 px-3 text-xs bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
            onClick={(e) => {
              e.stopPropagation()
              handleOpenPaymentModal(order)
            }}
          >
            <CreditCard className="w-3 h-3 mr-1" />
            Quitar
          </Button>
        )
      },
      align: 'center' as const,
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [])

  if (isLoading) return <IsLoadingCard />

  return (
    <div className="space-y-4">
      {/* Status Legend */}
      <div className="p-3 sm:p-4 bg-white/80 backdrop-blur rounded-lg border border-purple-100 shadow-sm">
        <div className="flex items-start gap-2 mb-3">
          <Info className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900">Legenda de Status</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <StatusLegendItem color="bg-orange-400" label="PENDENTE" />
          <StatusLegendItem color="bg-green-500" label="PAGO" />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-white rounded-xl border border-purple-100 shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
              Contas a Receber ({orders.length})
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">Gerencie os recebimentos de clientes</p>
          </div>
          <div className="text-right bg-white/80 backdrop-blur rounded-lg px-4 py-2 border border-purple-100">
            <p className="text-xs text-gray-500">Total a Receber</p>
            <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {formatCurrency(totalPendingAmount)}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <StatCard label="Total de Pedidos" value={orders.length.toString()} color="purple" />
          <StatCard label="Valor Recebido" value={formatCurrency(totalPaidAmount)} color="green" />
          <StatCard label="Valor Pendente" value={formatCurrency(totalPendingAmount)} color="red" />
        </div>
      </div>

      {/* Filters */}
      <AccountsReceiveFilters
        clients={clients}
        suppliers={suppliers}
        onFiltersChange={onFiltersChange}
        isLoading={isLoading}
      />

      {/* Selected Orders Action Bar */}
      {selectedOrders.length > 0 && (
        <div className="sticky top-0 z-10 bg-purple-600 text-white rounded-xl p-4 shadow-lg border border-purple-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">
                  {selectedOrders.length} pedido{selectedOrders.length > 1 ? 's' : ''} selecionado{selectedOrders.length > 1 ? 's' : ''}
                </p>
                <p className="text-sm text-purple-200">
                  Total pendente: {formatCurrency(selectedTotalPending)}
                </p>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => setSelectedOrders([])}
                className="flex-1 sm:flex-none bg-transparent border-white/30 text-white hover:bg-white/10"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleBatchPayment}
                disabled={isPending}
                className="flex-1 sm:flex-none bg-white text-purple-600 hover:bg-purple-50"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                    Processando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Marcar como Pago
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Orders Table */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhuma conta pendente</h3>
          <p className="text-gray-500">Todos os pedidos foram pagos integralmente.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <SharedDataTable
            data={orders}
            columns={columns}
            showCheckbox={true}
            selectedIds={selectedOrders}
            onToggleSelect={handleToggleSelect}
            onSelectAll={handleSelectAll}
            isLoading={isLoading || isPending}
            emptyMessage="Nenhuma conta a receber."
            emptySubMessage="Todos os valores foram recebidos."
            canSelect={(order) => calculatePendingAmount(order) > 0}
          />

          {/* Pagination */}
          {orders.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Pagination
                pageIndex={pagination.pageIndex}
                pageSize={pagination.pageSize}
                totalPages={totalPages}
                currentDataLength={orders.length}
                onPageChange={(page: number) => setPagination(prev => ({ ...prev, pageIndex: page }))}
                disabled={isLoading}
              />
            </div>
          )}
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={handleClosePaymentModal}
        onConfirm={handleConfirmPayment}
        orderInfo={selectedOrderForPayment ? {
          id: selectedOrderForPayment.id,
          code: selectedOrderForPayment.code,
          description: selectedOrderForPayment.description,
          totalPrice: (selectedOrderForPayment.amount || 0) * (selectedOrderForPayment.sale_price || 0),
          paidPrice: Number(selectedOrderForPayment.price_paid ?? 0),
          pendingAmount: calculatePendingAmount(selectedOrderForPayment),
        } : null}
        isProcessing={isPending}
      />
    </div>
  )
}

const StatusLegendItem = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-2">
    <div className={`w-3 h-3 rounded-full ${color} shadow-sm`}></div>
    <span className="text-xs text-gray-700 font-medium">{label}</span>
  </div>
)

const StatCard = ({ label, value, color }: { label: string; value: string; color: "purple" | "red" | "green" }) => {
  const colorStyles = {
    purple: "text-purple-600",
    red: "text-red-600",
    green: "text-green-600",
  }

  return (
    <div className="bg-white/80 backdrop-blur rounded-lg p-3 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className={`text-lg font-bold ${colorStyles[color]}`}>{value}</p>
    </div>
  )
}
