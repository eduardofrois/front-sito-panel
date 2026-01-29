"use client"

import type { Client, Order, Supplier } from "@/app/home/orders/order.interface"
import { IsLoadingCard } from "@/components/global/isloading-card"
import { SharedDataTable, StatusBadge, type TableColumn } from "@/components/shared/shared-data-table"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/ui/pagination"
import { Status, Status_String } from "@/constants/order-status"
import { formatCurrency } from "@/functions/format-functions"
import { Info, Package, ShoppingCart } from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { AccountsFilters } from "./accounts-filters"
import { PurchaseConfirmModal } from "./purchase-confirm-modal"

interface AccountsPayViewProps {
    orders: Order[]
    clients: Client[]
    suppliers: Supplier[]
    isLoading: boolean
    isUpdatingStatus?: boolean
    pagination: {
        pageIndex: number
        pageSize: number
        totalPages?: number
        totalCount?: number
    }
    onPageChange: (page: number) => void
    onFiltersChange: (filters: {
        dateStart?: string
        dateEnd?: string
        statuses?: number[]
        clientId?: number
        supplierId?: number
    }) => void
    onUpdateStatus: (orderIds: number[], newStatus: number) => Promise<void>
}

export function AccountsPayView({
    orders,
    clients,
    suppliers,
    isLoading,
    isUpdatingStatus = false,
    pagination,
    onPageChange,
    onFiltersChange,
    onUpdateStatus,
}: AccountsPayViewProps) {
    const [purchaseModalOpen, setPurchaseModalOpen] = useState(false)
    const [selectedOrderForPurchase, setSelectedOrderForPurchase] = useState<Order | null>(null)
    const [selectedOrders, setSelectedOrders] = useState<number[]>([])

    // Filter orders that are pending purchase (can be selected)
    const pendingOrders = orders.filter(order => order.status === Status_String.PendingPurchase)

    const handleToggleSelect = (order: Order) => {
        // Only allow selecting orders with pending purchase
        if (order.status !== Status_String.PendingPurchase) return

        setSelectedOrders(prev =>
            prev.includes(order.id)
                ? prev.filter(id => id !== order.id)
                : [...prev, order.id]
        )
    }

    const handleSelectAll = () => {
        // Only select orders that have pending purchase
        const pendingOrderIds = pendingOrders.map(order => order.id)

        if (pendingOrders.every(order => selectedOrders.includes(order.id))) {
            setSelectedOrders([])
        } else {
            setSelectedOrders(pendingOrderIds)
        }
    }

    const handleOpenPurchaseModal = (order: Order) => {
        setSelectedOrderForPurchase(order)
        setPurchaseModalOpen(true)
    }

    const handleClosePurchaseModal = () => {
        setPurchaseModalOpen(false)
        setSelectedOrderForPurchase(null)
    }

    const handleConfirmPurchase = async () => {
        if (!selectedOrderForPurchase) return

        try {
            await onUpdateStatus([selectedOrderForPurchase.id], Status.ConfirmSale)
            toast.success("Compra confirmada", {
                description: `O pedido foi marcado como COMPRA REALIZADA`,
            })
            handleClosePurchaseModal()
        } catch {
            toast.error("Erro ao confirmar compra")
        }
    }

    // Calculate totals
    const totalItems = orders.reduce((total, order) => total + order.amount, 0)
    const totalCost = orders.reduce((total, order) => total + order.cost_price * order.amount, 0)
    const totalPaid = orders.reduce((total, order) => total + (order.paid_price || 0), 0)
    const totalToPay = totalCost - totalPaid

    // Helper function to determine display status
    const getDisplayStatus = (order: Order): string => {
        if (order.status === Status_String.PendingPurchase) {
            return "COMPRA PENDENTE"
        }
        return "COMPRA REALIZADA"
    }

    // Check if order is pending purchase
    const isPendingPurchase = (order: Order): boolean => {
        return order.status === Status_String.PendingPurchase
    }

    // Define columns for Contas a Pagar
    const columns: TableColumn<Order>[] = useMemo(() => [
        {
            key: 'supplier',
            header: 'Fornecedor',
            accessor: (order) => order.supplier_infos?.supplier_name || "-",
        },
        {
            key: 'description',
            header: 'Descrição',
            accessor: (order) => order.description || order.brand || "-",
        },
        {
            key: 'amount',
            header: 'QTDE',
            accessor: (order) => order.amount,
            align: 'center' as const,
            className: 'font-bold',
        },
        {
            key: 'cost_price',
            header: 'Valor (compra)',
            accessor: (order) => formatCurrency(order.cost_price),
            align: 'right' as const,
        },
        {
            key: 'total_cost',
            header: 'Valor Total (compra)',
            accessor: (order) => formatCurrency(order.cost_price * order.amount),
            align: 'right' as const,
            className: 'font-semibold',
        },
        {
            key: 'paid_price',
            header: 'Valor Pago',
            accessor: (order) => (
                <span className="text-green-600 font-medium">
                    {formatCurrency(order.paid_price || 0)}
                </span>
            ),
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
                const totalOrderValue = order.cost_price * order.amount
                const toPay = totalOrderValue - (order.paid_price || 0)
                return (
                    <span className={toPay > 0 ? "text-orange-600 font-medium" : "text-gray-400"}>
                        {formatCurrency(Math.max(0, toPay))}
                    </span>
                )
            },
            align: 'right' as const,
        },
        {
            key: 'purchase_action',
            header: 'Comprar',
            accessor: (order) => {
                if (!isPendingPurchase(order)) {
                    return (
                        <span className="text-green-600 text-xs font-medium">Comprado</span>
                    )
                }
                return (
                    <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-3 text-xs bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleOpenPurchaseModal(order)
                        }}
                    >
                        <ShoppingCart className="w-3 h-3 mr-1" />
                        Comprar
                    </Button>
                )
            },
            align: 'center' as const,
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
    ], [])

    if (isLoading && orders.length === 0) return <IsLoadingCard />

    return (
        <div className="space-y-4">
            {/* Status Legend */}
            <div className="p-3 sm:p-4 bg-white/80 backdrop-blur rounded-lg border border-purple-100 shadow-sm">
                <div className="flex items-start gap-2 mb-3">
                    <Info className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-900">Legenda de Status</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <StatusLegendItem color="bg-yellow-400" label="COMPRA PENDENTE" />
                    <StatusLegendItem color="bg-green-500" label="COMPRA REALIZADA" />
                </div>
            </div>

            {/* Summary Stats */}
            <div className="bg-white rounded-xl border border-purple-100 shadow-sm p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
                            Contas a Pagar ({pagination.totalCount || orders.length})
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-600">Controle operacional de compras</p>
                    </div>
                    <div className="text-right bg-white/80 backdrop-blur rounded-lg px-4 py-2 border border-purple-100">
                        <p className="text-xs text-gray-500">Total a Pagar</p>
                        <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                            {formatCurrency(totalToPay > 0 ? totalToPay : 0)}
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <StatCard label="Total de Pedidos" value={(pagination.totalCount || orders.length).toString()} color="purple" />
                    <StatCard label="Total de Itens" value={totalItems.toString()} color="blue" />
                    <StatCard label="Custo Total" value={formatCurrency(totalCost)} color="red" />
                    <StatCard label="Valor Pago" value={formatCurrency(totalPaid)} color="green" />
                </div>
            </div>

            {/* Filters */}
            <AccountsFilters
                clients={clients}
                suppliers={suppliers}
                onFiltersChange={onFiltersChange}
                isLoading={isLoading}
            />

            {/* Orders Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                {orders.length === 0 ? (
                    <div className="text-center py-12">
                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Nenhum pedido encontrado</h3>
                        <p className="text-gray-500">Tente ajustar os filtros de busca.</p>
                    </div>
                ) : (
                    <SharedDataTable
                        data={orders}
                        columns={columns}
                        showCheckbox={true}
                        selectedIds={selectedOrders}
                        onToggleSelect={handleToggleSelect}
                        onSelectAll={handleSelectAll}
                        isLoading={isLoading || isUpdatingStatus}
                        emptyMessage="Nenhum pedido para exibir."
                        emptySubMessage="Tente ajustar os filtros de busca."
                        canSelect={(order) => order.status === Status_String.PendingPurchase}
                    />
                )}

                {/* Pagination */}
                {orders.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <Pagination
                            pageIndex={pagination.pageIndex}
                            pageSize={pagination.pageSize}
                            totalPages={pagination.totalPages}
                            currentDataLength={orders.length}
                            onPageChange={onPageChange}
                            disabled={isLoading}
                        />
                    </div>
                )}
            </div>

            {/* Purchase Confirmation Modal */}
            <PurchaseConfirmModal
                isOpen={purchaseModalOpen}
                onClose={handleClosePurchaseModal}
                onConfirm={handleConfirmPurchase}
                orderInfo={selectedOrderForPurchase ? {
                    id: selectedOrderForPurchase.id,
                    supplier: selectedOrderForPurchase.supplier_infos?.supplier_name || "-",
                    description: selectedOrderForPurchase.description || selectedOrderForPurchase.brand || "-",
                    amount: selectedOrderForPurchase.amount,
                    costPrice: selectedOrderForPurchase.cost_price,
                    totalCost: selectedOrderForPurchase.cost_price * selectedOrderForPurchase.amount,
                } : null}
                isProcessing={isUpdatingStatus}
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

const StatCard = ({ label, value, color }: { label: string; value: string; color: "purple" | "red" | "blue" | "green" }) => {
    const colorStyles = {
        purple: "text-purple-600",
        red: "text-red-600",
        blue: "text-blue-600",
        green: "text-green-600",
    }

    return (
        <div className="bg-white/80 backdrop-blur rounded-lg p-3 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs text-gray-500 font-medium">{label}</p>
            <p className={`text-lg font-bold ${colorStyles[color]}`}>{value}</p>
        </div>
    )
}
