"use client"

import type { Client, Order, Supplier } from "@/app/home/orders/order.interface"
import { IsLoadingCard } from "@/components/global/isloading-card"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/ui/pagination"
import { formatCurrency } from "@/functions/format-functions"
import { getStatusColor } from "@/functions/style-functions"
import { CheckCircle, Info, Package, Truck } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { ConfirmationModal } from "./confirmation-modal"
import { ReadyToShipFilters } from "./readytoship-filters"

interface EntregasViewProps {
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
    selectedEntregas: { orderId: number; action: 'entregar' | 'pronta_entrega' }[]
    toggleEntregaSelection: (orderId: number, action: 'entregar' | 'pronta_entrega') => void
    getEntregaAction: (orderId: number) => 'entregar' | 'pronta_entrega' | null
    onConfirm: () => Promise<void>
}

export function EntregasView({
    orders,
    clients,
    suppliers,
    isLoading,
    isUpdatingStatus,
    pagination,
    onPageChange,
    onFiltersChange,
    selectedEntregas,
    toggleEntregaSelection,
    getEntregaAction,
    onConfirm,
}: EntregasViewProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleConfirm = async () => {
        try {
            await onConfirm()
            const entregasCount = selectedEntregas.filter(s => s.action === 'entregar').length
            const prontaCount = selectedEntregas.filter(s => s.action === 'pronta_entrega').length

            let message = ""
            if (entregasCount > 0) message += `${entregasCount} ENTREGUE`
            if (entregasCount > 0 && prontaCount > 0) message += ", "
            if (prontaCount > 0) message += `${prontaCount} PRONTA ENTREGA`

            toast.success("Status atualizado", {
                description: `Pedidos marcados como: ${message}`,
            })
            setIsModalOpen(false)
        } catch {
            toast.error("Erro ao atualizar status")
        }
    }

    // Calculate selected totals
    const selectedOrdersData = orders.filter(order =>
        selectedEntregas.some(s => s.orderId === order.id)
    )
    const selectedTotal = selectedOrdersData.reduce(
        (total, order) => total + order.cost_price * order.amount,
        0
    )

    // Count actions
    const entregasCount = selectedEntregas.filter(s => s.action === 'entregar').length
    const prontaEntregaCount = selectedEntregas.filter(s => s.action === 'pronta_entrega').length

    if (isLoading && orders.length === 0) return <IsLoadingCard />

    return (
        <div className="space-y-4">
            {/* Status Legend */}
            <div className="p-3 sm:p-4 bg-white/80 backdrop-blur rounded-lg border border-purple-100 shadow-sm">
                <div className="flex items-start gap-2 mb-3">
                    <Info className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-900">Legenda de Status</h3>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <StatusLegendItem color="bg-blue-400" label="CONFERIDO" description="Aguardando destino" />
                    <StatusLegendItem color="bg-green-500" label="ENTREGUE" description="Entregue ao cliente" />
                    <StatusLegendItem color="bg-purple-500" label="PRONTA ENTREGA" description="Disponível em estoque" />
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
                        <h3 className="text-lg font-semibold mb-2">Nenhum pedido para entregar</h3>
                        <p className="text-gray-500">Não há pedidos conferidos aguardando destino.</p>
                    </div>
                ) : (
                    <>
                        {/* HTML Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gradient-to-r from-green-50 to-purple-50 border-b border-gray-200">
                                    <tr>
                                        <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase">Código</th>
                                        <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase">Descrição</th>
                                        <th className="p-3 text-center text-xs font-semibold text-gray-600 uppercase">QTDE</th>
                                        <th className="p-3 text-right text-xs font-semibold text-gray-600 uppercase">Preço (compra)</th>
                                        <th className="p-3 text-right text-xs font-semibold text-gray-600 uppercase">Total</th>
                                        <th className="p-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                                        <th className="p-3 w-28 text-center text-xs font-semibold text-gray-600 uppercase">
                                            <div className="flex items-center justify-center gap-1">
                                                <Truck className="w-3 h-3" />
                                                <span>Entregar</span>
                                            </div>
                                        </th>
                                        <th className="p-3 w-32 text-center text-xs font-semibold text-gray-600 uppercase">
                                            <div className="flex items-center justify-center gap-1">
                                                <Package className="w-3 h-3" />
                                                <span>Pronta Entrega</span>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => {
                                        const currentAction = getEntregaAction(order.id)
                                        const total = order.cost_price * order.amount
                                        const isCheckedStatus = order.status === "Conferido" || order.status === "CONFERIDO"

                                        return (
                                            <tr
                                                key={order.id}
                                                className={`
                                                    border-b border-gray-100 last:border-0 transition-colors
                                                    ${currentAction
                                                        ? currentAction === 'entregar' ? 'bg-green-50' : 'bg-purple-50'
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
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border bg-white/20 ${getStatusColor(order.status || "CONFERIDO")}`}>
                                                        {order.status || "CONFERIDO"}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-center">
                                                    {isCheckedStatus && (
                                                        <button
                                                            onClick={() => toggleEntregaSelection(order.id, 'entregar')}
                                                            disabled={isLoading || isUpdatingStatus}
                                                            className={`
                                                                w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                                                                ${currentAction === 'entregar'
                                                                    ? 'bg-green-500 border-green-500 text-white'
                                                                    : 'border-gray-300 hover:border-green-400'
                                                                }
                                                                disabled:opacity-50 disabled:cursor-not-allowed
                                                            `}
                                                        >
                                                            {currentAction === 'entregar' && (
                                                                <CheckCircle className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    )}
                                                </td>
                                                <td className="p-3 text-center">
                                                    {isCheckedStatus && (
                                                        <button
                                                            onClick={() => toggleEntregaSelection(order.id, 'pronta_entrega')}
                                                            disabled={isLoading || isUpdatingStatus}
                                                            className={`
                                                                w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                                                                ${currentAction === 'pronta_entrega'
                                                                    ? 'bg-purple-500 border-purple-500 text-white'
                                                                    : 'border-gray-300 hover:border-purple-400'
                                                                }
                                                                disabled:opacity-50 disabled:cursor-not-allowed
                                                            `}
                                                        >
                                                            {currentAction === 'pronta_entrega' && (
                                                                <CheckCircle className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Selected Summary */}
                        <div className="p-4 border-t border-gray-200 bg-gray-50">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="bg-blue-50 rounded-lg px-3 py-2 border border-blue-200">
                                        <p className="text-xs text-gray-500">Selecionados</p>
                                        <p className="text-lg font-bold text-blue-700">
                                            {selectedEntregas.length} pedido(s)
                                        </p>
                                    </div>
                                    {entregasCount > 0 && (
                                        <div className="bg-green-50 rounded-lg px-3 py-2 border border-green-200">
                                            <p className="text-xs text-gray-500">Entregar</p>
                                            <p className="text-lg font-bold text-green-700">{entregasCount}</p>
                                        </div>
                                    )}
                                    {prontaEntregaCount > 0 && (
                                        <div className="bg-purple-50 rounded-lg px-3 py-2 border border-purple-200">
                                            <p className="text-xs text-gray-500">Pronta Entrega</p>
                                            <p className="text-lg font-bold text-purple-700">{prontaEntregaCount}</p>
                                        </div>
                                    )}
                                    <div className="bg-amber-50 rounded-lg px-3 py-2 border border-amber-200">
                                        <p className="text-xs text-gray-500">Total</p>
                                        <p className="text-lg font-bold text-amber-700">
                                            {formatCurrency(selectedTotal)}
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => setIsModalOpen(true)}
                                    disabled={selectedEntregas.length === 0 || isUpdatingStatus}
                                    className="bg-gradient-to-r from-green-600 to-purple-600 hover:from-green-700 hover:to-purple-700 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    size="lg"
                                >
                                    <span className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5" />
                                        Confirmar Destino
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
                title="Confirmar Destino dos Pedidos"
                description={
                    `Você está prestes a atualizar ${selectedEntregas.length} pedido(s):\n` +
                    (entregasCount > 0 ? `• ${entregasCount} serão marcados como ENTREGUE\n` : '') +
                    (prontaEntregaCount > 0 ? `• ${prontaEntregaCount} serão marcados como PRONTA ENTREGA` : '')
                }
                confirmLabel="Confirmar"
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
