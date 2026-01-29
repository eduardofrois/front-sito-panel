"use client"

import type { Client, Order, Supplier } from "@/app/home/orders/order.interface"
import { IsLoadingCard } from "@/components/global/isloading-card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Pagination } from "@/components/ui/pagination"
import { formatCurrency } from "@/functions/format-functions"
import { getStatusColor } from "@/functions/style-functions"
import { CheckCircle, Info, Package } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { ConfirmationModal } from "./confirmation-modal"
import { ReadyToShipFilters } from "./readytoship-filters"

interface RecebimentoViewProps {
    orders: Order[]
    clients: Client[]
    suppliers: Supplier[]
    isLoading: boolean
    isUpdatingStatus: boolean
    pagination: {
        pageIndex: number
        pageSize: number
        totalPages?: number
        totalCount?: number
    }
    onPageChange: (page: number) => void
    onFiltersChange: (filters: { clientId?: number; supplierId?: number }) => void
    selectedOrders: number[]
    setSelectedOrders: React.Dispatch<React.SetStateAction<number[]>>
    onConfirm: () => Promise<void>
}

export function RecebimentoView({
    orders,
    clients,
    suppliers,
    isLoading,
    isUpdatingStatus,
    pagination,
    onPageChange,
    onFiltersChange,
    selectedOrders,
    setSelectedOrders,
    onConfirm,
}: RecebimentoViewProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleToggleSelect = (orderId: number) => {
        setSelectedOrders(prev =>
            prev.includes(orderId)
                ? prev.filter(id => id !== orderId)
                : [...prev, orderId]
        )
    }

    const handleSelectAll = () => {
        if (orders.every(order => selectedOrders.includes(order.id))) {
            setSelectedOrders([])
        } else {
            setSelectedOrders(orders.map(order => order.id))
        }
    }

    const handleConfirm = async () => {
        try {
            await onConfirm()
            toast.success("Conferência confirmada", {
                description: `${selectedOrders.length} pedido(s) marcado(s) como CONFERIDO`,
            })
            setIsModalOpen(false)
        } catch {
            toast.error("Erro ao confirmar conferência")
        }
    }

    // Calculate selected total
    const selectedOrdersData = orders.filter(order => selectedOrders.includes(order.id))
    const selectedTotal = selectedOrdersData.reduce(
        (total, order) => total + order.cost_price * order.amount,
        0
    )

    // Check selection state
    const allSelected = orders.length > 0 && orders.every(order => selectedOrders.includes(order.id))
    const someSelected = orders.some(order => selectedOrders.includes(order.id)) && !allSelected

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
                    <StatusLegendItem color="bg-green-400" label="COMPRA REALIZADA" description="Aguardando conferência" />
                    <StatusLegendItem color="bg-blue-500" label="CONFERIDO" description="Conferência realizada" />
                </div>
            </div>

            {/* Filters */}
            <ReadyToShipFilters
                clients={clients}
                suppliers={suppliers}
                onFiltersChange={onFiltersChange}
                isLoading={isLoading}
            />

            {/* Orders Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {orders.length === 0 ? (
                    <div className="text-center py-12">
                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Nenhum pedido para conferir</h3>
                        <p className="text-gray-500">Não há pedidos com status COMPRA REALIZADA.</p>
                    </div>
                ) : (
                    <>
                        {/* HTML Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
                                    <tr>
                                        <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase">Código</th>
                                        <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase">Descrição</th>
                                        <th className="p-3 text-center text-xs font-semibold text-gray-600 uppercase">QTDE</th>
                                        <th className="p-3 text-right text-xs font-semibold text-gray-600 uppercase">Preço (compra)</th>
                                        <th className="p-3 text-right text-xs font-semibold text-gray-600 uppercase">Total</th>
                                        <th className="p-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                                        <th className="p-3 w-24 text-center text-xs font-semibold text-gray-600 uppercase">
                                            <div className="flex items-center justify-center gap-2">
                                                <Checkbox
                                                    checked={allSelected}
                                                    ref={(el) => {
                                                        if (el) {
                                                            (el as HTMLButtonElement).dataset.state = someSelected ? "indeterminate" : allSelected ? "checked" : "unchecked"
                                                        }
                                                    }}
                                                    onCheckedChange={handleSelectAll}
                                                    className="border-gray-400"
                                                    disabled={isLoading || isUpdatingStatus}
                                                />
                                                <span>Conferir</span>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => {
                                        const isSelected = selectedOrders.includes(order.id)
                                        const total = order.cost_price * order.amount

                                        return (
                                            <tr
                                                key={order.id}
                                                className={`
                                                    border-b border-gray-100 last:border-0 transition-colors
                                                    ${isSelected
                                                        ? 'bg-purple-50'
                                                        : 'bg-white hover:bg-gray-50'
                                                    }
                                                    ${(isLoading || isUpdatingStatus) ? 'opacity-50' : ''}
                                                `}
                                            >
                                                <td className="p-3 font-mono text-sm text-gray-900">
                                                    {order.code || "-"}
                                                </td>
                                                <td className="p-3 text-gray-900">
                                                    {order.description || order.brand || "-"}
                                                </td>
                                                <td className="p-3 text-center font-bold text-gray-900">
                                                    {order.amount}
                                                </td>
                                                <td className="p-3 text-right text-gray-900">
                                                    {formatCurrency(order.cost_price)}
                                                </td>
                                                <td className="p-3 text-right font-semibold text-purple-700">
                                                    {formatCurrency(total)}
                                                </td>
                                                <td className="p-3 text-center">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border bg-white/20 ${getStatusColor(order.status || "COMPRA REALIZADA")}`}>
                                                        {order.status || "COMPRA REALIZADA"}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-center">
                                                    <Checkbox
                                                        checked={isSelected}
                                                        onCheckedChange={() => handleToggleSelect(order.id)}
                                                        className={isSelected
                                                            ? "border-purple-600 data-[state=checked]:bg-purple-600 data-[state=checked]:text-white"
                                                            : "border-gray-400"
                                                        }
                                                        disabled={isLoading || isUpdatingStatus}
                                                    />
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Selected Total Summary */}
                        <div className="p-4 border-t border-gray-200 bg-gray-50">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="bg-purple-50 rounded-lg px-4 py-2 border border-purple-200">
                                        <p className="text-xs text-gray-500">Selecionados</p>
                                        <p className="text-lg font-bold text-purple-700">
                                            {selectedOrders.length} {selectedOrders.length === 1 ? 'pedido' : 'pedidos'}
                                        </p>
                                    </div>
                                    <div className="bg-green-50 rounded-lg px-4 py-2 border border-green-200">
                                        <p className="text-xs text-gray-500">Total dos Selecionados</p>
                                        <p className="text-lg font-bold text-green-700">
                                            {formatCurrency(selectedTotal)}
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => setIsModalOpen(true)}
                                    disabled={selectedOrders.length === 0 || isUpdatingStatus}
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    size="lg"
                                >
                                    <span className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5" />
                                        Confirmar Conferência
                                    </span>
                                </Button>
                            </div>
                        </div>

                        {/* Pagination */}
                        <div className="p-4 border-t border-gray-200">
                            <Pagination
                                pageIndex={pagination.pageIndex}
                                pageSize={pagination.pageSize}
                                totalPages={pagination.totalPages}
                                currentDataLength={orders.length}
                                onPageChange={onPageChange}
                                disabled={isLoading}
                            />
                        </div>
                    </>
                )}
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                title="Confirmar Conferência"
                description={`Você está prestes a marcar ${selectedOrders.length} pedido(s) como CONFERIDO. Esta ação não pode ser desfeita.`}
                confirmLabel="Confirmar Conferência"
                onConfirm={handleConfirm}
                isLoading={isUpdatingStatus}
            />
        </div>
    )
}

const StatusLegendItem = ({ color, label, description }: { color: string; label: string; description?: string }) => (
    <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${color} shadow-sm`}></div>
        <div>
            <span className="text-xs text-gray-700 font-medium">{label}</span>
            {description && <p className="text-[10px] text-gray-500">{description}</p>}
        </div>
    </div>
)
