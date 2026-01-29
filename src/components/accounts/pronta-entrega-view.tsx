"use client"

import type { Client, Order, Supplier } from "@/app/home/orders/order.interface"
import { IsLoadingCard } from "@/components/global/isloading-card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Pagination } from "@/components/ui/pagination"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Status } from "@/constants/order-status"
import { triggerStyle } from "@/constants/style/trigger.style"
import { formatCurrency } from "@/functions/format-functions"
import { getStatusColor } from "@/functions/style-functions"
import { CheckCircle, Info, Package, Truck } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { ConfirmationModal } from "../readytoship/confirmation-modal"
import { ProntaEntregaFilters } from "./pronta-entrega-filters"

// Helper function to get conference status color
const getConferenceStatusColor = (status: string): string => {
    const statusLower = status?.toLowerCase() || ""
    if (statusLower.includes("conferir") || statusLower.includes("a conferir")) {
        return "text-yellow-700 border-yellow-300 bg-yellow-50"
    }
    if (statusLower.includes("conferido")) {
        return "text-blue-700 border-blue-300 bg-blue-50"
    }
    return "text-gray-700 border-gray-300 bg-gray-50"
}

interface ProntaEntregaViewProps {
    // Aba 1: Recebimento
    ordersRecebimento: Order[]
    isLoadingRecebimento: boolean
    paginationRecebimento: {
        pageIndex: number
        pageSize: number
        totalPages?: number
        totalCount?: number
    }
    onPageChangeRecebimento: (page: number) => void
    onFiltersChangeRecebimento: (filters: { clientId?: number; supplierId?: number }) => void
    // Aba 2: Entregas
    ordersEntregas: Order[]
    isLoadingEntregas: boolean
    paginationEntregas: {
        pageIndex: number
        pageSize: number
        totalPages?: number
        totalCount?: number
    }
    onPageChangeEntregas: (page: number) => void
    onFiltersChangeEntregas: (filters: { clientId?: number; supplierId?: number }) => void
    // Common
    clients: Client[]
    suppliers: Supplier[]
    isUpdatingStatus?: boolean
    onUpdateStatus: (orderIds: number[], newStatus: number) => Promise<void>
}

export function ProntaEntregaView({
    ordersRecebimento,
    isLoadingRecebimento,
    paginationRecebimento,
    onPageChangeRecebimento,
    onFiltersChangeRecebimento,
    ordersEntregas,
    isLoadingEntregas,
    paginationEntregas,
    onPageChangeEntregas,
    onFiltersChangeEntregas,
    clients,
    suppliers,
    isUpdatingStatus = false,
    onUpdateStatus,
}: ProntaEntregaViewProps) {
    // Aba 1: Selection state
    const [selectedRecebimento, setSelectedRecebimento] = useState<number[]>([])
    const [isRecebimentoModalOpen, setIsRecebimentoModalOpen] = useState(false)

    // Aba 2: Selection state with action type
    const [selectedEntregas, setSelectedEntregas] = useState<{
        orderId: number
        action: 'entregar' | 'pronta_entrega'
    }[]>([])
    const [isEntregasModalOpen, setIsEntregasModalOpen] = useState(false)

    // ===== Aba 1: Recebimento handlers =====
    const handleToggleRecebimento = (orderId: number) => {
        setSelectedRecebimento(prev =>
            prev.includes(orderId)
                ? prev.filter(id => id !== orderId)
                : [...prev, orderId]
        )
    }

    const handleSelectAllRecebimento = () => {
        if (ordersRecebimento.every(order => selectedRecebimento.includes(order.id))) {
            setSelectedRecebimento([])
        } else {
            setSelectedRecebimento(ordersRecebimento.map(order => order.id))
        }
    }

    const handleConfirmRecebimento = async () => {
        if (selectedRecebimento.length === 0) return

        try {
            // Change status_conference from "A Conferir" to "Conferido"
            await onUpdateStatus(selectedRecebimento, Status.Checked)
            toast.success("Conferência confirmada", {
                description: `${selectedRecebimento.length} pedido(s) marcado(s) como CONFERIDO`,
            })
            setSelectedRecebimento([])
            setIsRecebimentoModalOpen(false)
        } catch {
            toast.error("Erro ao confirmar conferência")
        }
    }

    // ===== Aba 2: Entregas handlers =====
    const toggleEntregaSelection = (orderId: number, action: 'entregar' | 'pronta_entrega') => {
        setSelectedEntregas(prev => {
            const existingIndex = prev.findIndex(item => item.orderId === orderId)

            if (existingIndex !== -1) {
                if (prev[existingIndex].action === action) {
                    return prev.filter(item => item.orderId !== orderId)
                }
                return prev.map(item =>
                    item.orderId === orderId ? { ...item, action } : item
                )
            }
            return [...prev, { orderId, action }]
        })
    }

    const getEntregaAction = (orderId: number): 'entregar' | 'pronta_entrega' | null => {
        const item = selectedEntregas.find(s => s.orderId === orderId)
        return item?.action || null
    }

    const handleConfirmEntregas = async () => {
        if (selectedEntregas.length === 0) return

        try {
            // All selected orders go to ENTREGUE AO CLIENTE
            const orderIds = selectedEntregas.map(s => s.orderId)
            await onUpdateStatus(orderIds, Status.DeliveredToClient)

            toast.success("Entrega confirmada", {
                description: `${orderIds.length} pedido(s) marcado(s) como ENTREGUE`,
            })
            setSelectedEntregas([])
            setIsEntregasModalOpen(false)
        } catch {
            toast.error("Erro ao confirmar entrega")
        }
    }

    // Calculate totals for Recebimento
    const selectedRecebimentoData = ordersRecebimento.filter(order => selectedRecebimento.includes(order.id))
    const selectedRecebimentoTotal = selectedRecebimentoData.reduce(
        (total, order) => total + order.cost_price * order.amount, 0
    )
    const allRecebimentoSelected = ordersRecebimento.length > 0 && ordersRecebimento.every(order => selectedRecebimento.includes(order.id))
    const someRecebimentoSelected = ordersRecebimento.some(order => selectedRecebimento.includes(order.id)) && !allRecebimentoSelected

    // Calculate totals for Entregas
    const selectedEntregasData = ordersEntregas.filter(order => selectedEntregas.some(s => s.orderId === order.id))
    const selectedEntregasTotal = selectedEntregasData.reduce(
        (total, order) => total + order.cost_price * order.amount, 0
    )
    const entregasCount = selectedEntregas.filter(s => s.action === 'entregar').length
    const prontaEntregaCount = selectedEntregas.filter(s => s.action === 'pronta_entrega').length

    const isLoading = isLoadingRecebimento && isLoadingEntregas

    if (isLoading && ordersRecebimento.length === 0 && ordersEntregas.length === 0) {
        return <IsLoadingCard />
    }

    return (
        <div className="space-y-4">
            <Tabs defaultValue="conferencia" className="w-full">
                <TabsList className="grid w-full grid-cols-2 p-1 h-12 bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
                    <TabsTrigger value="conferencia" className={triggerStyle}>
                        <Package className="w-4 h-4" />
                        <span className="hidden sm:inline">Conferência de Mercadoria</span>
                        <span className="sm:hidden">Conferência</span>
                    </TabsTrigger>
                    <TabsTrigger value="entregas" className={triggerStyle}>
                        <Truck className="w-4 h-4" />
                        <span className="hidden sm:inline">Entregas</span>
                        <span className="sm:hidden">Entregas</span>
                    </TabsTrigger>
                </TabsList>

                {/* ===== ABA 1: RECEBIMENTO DE MERCADORIA ===== */}
                <TabsContent value="conferencia" className="mt-0">
                    <div className="space-y-4">
                        {/* Status Legend */}
                        <div className="p-3 sm:p-4 bg-white/80 backdrop-blur rounded-lg border border-purple-100 shadow-sm">
                            <div className="flex items-start gap-2 mb-3">
                                <Info className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                                <h3 className="text-xs sm:text-sm font-semibold text-gray-900">Legenda de Conferência</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <StatusLegendItem color="bg-yellow-400" label="A CONFERIR" description="Aguardando conferência" />
                                <StatusLegendItem color="bg-blue-500" label="CONFERIDO" description="Conferência realizada" />
                            </div>
                        </div>

                        {/* Filters */}
                        <ProntaEntregaFilters
                            clients={clients}
                            suppliers={suppliers}
                            onFiltersChange={onFiltersChangeRecebimento}
                            isLoading={isLoadingRecebimento}
                        />

                        {/* Table */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            {ordersRecebimento.length === 0 ? (
                                <div className="text-center py-12">
                                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">Nenhum pedido para receber</h3>
                                    <p className="text-gray-500">Não há pedidos com status COMPRA REALIZADA.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
                                                <tr>
                                                    <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase">Código</th>
                                                    <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase">Descrição</th>
                                                    <th className="p-3 text-center text-xs font-semibold text-gray-600 uppercase">QTDE</th>
                                                    <th className="p-3 text-right text-xs font-semibold text-gray-600 uppercase">Preço (compra)</th>
                                                    <th className="p-3 text-right text-xs font-semibold text-gray-600 uppercase">Total</th>
                                                    <th className="p-3 text-center text-xs font-semibold text-gray-600 uppercase">Conferência</th>
                                                    <th className="p-3 w-24 text-center text-xs font-semibold text-gray-600 uppercase">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Checkbox
                                                                checked={allRecebimentoSelected}
                                                                ref={(el) => {
                                                                    if (el) {
                                                                        (el as HTMLButtonElement).dataset.state = someRecebimentoSelected ? "indeterminate" : allRecebimentoSelected ? "checked" : "unchecked"
                                                                    }
                                                                }}
                                                                onCheckedChange={handleSelectAllRecebimento}
                                                                className="border-gray-400"
                                                                disabled={isLoadingRecebimento || isUpdatingStatus}
                                                            />
                                                            <span>Conferir</span>
                                                        </div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {ordersRecebimento.map((order) => {
                                                    const isSelected = selectedRecebimento.includes(order.id)
                                                    const total = order.cost_price * order.amount

                                                    return (
                                                        <tr
                                                            key={order.id}
                                                            className={`border-b border-gray-100 last:border-0 transition-colors
                                                                ${isSelected ? 'bg-purple-50' : 'bg-white hover:bg-gray-50'}
                                                                ${(isLoadingRecebimento || isUpdatingStatus) ? 'opacity-50' : ''}
                                                            `}
                                                        >
                                                            <td className="p-3 font-mono text-sm text-gray-900">{order.code || "-"}</td>
                                                            <td className="p-3 text-gray-900">{order.description || order.brand || "-"}</td>
                                                            <td className="p-3 text-center font-bold text-gray-900">{order.amount}</td>
                                                            <td className="p-3 text-right text-gray-900">{formatCurrency(order.cost_price)}</td>
                                                            <td className="p-3 text-right font-semibold text-purple-700">{formatCurrency(total)}</td>
                                                            <td className="p-3 text-center">
                                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold border bg-white/20 ${getConferenceStatusColor(order.status_conference || "A Conferir")}`}>
                                                                    {order.status_conference || "A Conferir"}
                                                                </span>
                                                            </td>
                                                            <td className="p-3 text-center">
                                                                <Checkbox
                                                                    checked={isSelected}
                                                                    onCheckedChange={() => handleToggleRecebimento(order.id)}
                                                                    className={isSelected
                                                                        ? "border-purple-600 data-[state=checked]:bg-purple-600 data-[state=checked]:text-white"
                                                                        : "border-gray-400"
                                                                    }
                                                                    disabled={isLoadingRecebimento || isUpdatingStatus}
                                                                />
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Summary */}
                                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-purple-50 rounded-lg px-4 py-2 border border-purple-200">
                                                    <p className="text-xs text-gray-500">Selecionados</p>
                                                    <p className="text-lg font-bold text-purple-700">
                                                        {selectedRecebimento.length} pedido(s)
                                                    </p>
                                                </div>
                                                <div className="bg-green-50 rounded-lg px-4 py-2 border border-green-200">
                                                    <p className="text-xs text-gray-500">Total</p>
                                                    <p className="text-lg font-bold text-green-700">
                                                        {formatCurrency(selectedRecebimentoTotal)}
                                                    </p>
                                                </div>
                                            </div>

                                            <Button
                                                onClick={() => setIsRecebimentoModalOpen(true)}
                                                disabled={selectedRecebimento.length === 0 || isUpdatingStatus}
                                                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
                                                size="lg"
                                            >
                                                <CheckCircle className="w-5 h-5 mr-2" />
                                                Confirmar Conferência
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Pagination */}
                                    <div className="p-4 border-t border-gray-200">
                                        <Pagination
                                            pageIndex={paginationRecebimento.pageIndex}
                                            pageSize={paginationRecebimento.pageSize}
                                            totalPages={paginationRecebimento.totalPages}
                                            currentDataLength={ordersRecebimento.length}
                                            onPageChange={onPageChangeRecebimento}
                                            disabled={isLoadingRecebimento}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </TabsContent>

                {/* ===== ABA 2: ENTREGAS ===== */}
                <TabsContent value="entregas" className="mt-0">
                    <div className="space-y-4">
                        {/* Status Legend */}
                        <div className="p-3 sm:p-4 bg-white/80 backdrop-blur rounded-lg border border-green-100 shadow-sm">
                            <div className="flex items-start gap-2 mb-3">
                                <Info className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <h3 className="text-xs sm:text-sm font-semibold text-gray-900">Legenda de Status</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <StatusLegendItem color="bg-purple-500" label="PRONTA ENTREGA" description="Disponível em estoque" />
                                <StatusLegendItem color="bg-green-500" label="ENTREGUE" description="Entregue ao cliente" />
                            </div>
                        </div>

                        {/* Filters */}
                        <ProntaEntregaFilters
                            clients={clients}
                            suppliers={suppliers}
                            onFiltersChange={onFiltersChangeEntregas}
                            isLoading={isLoadingEntregas}
                        />

                        {/* Table */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            {ordersEntregas.length === 0 ? (
                                <div className="text-center py-12">
                                    <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">Nenhum pedido para entregar</h3>
                                    <p className="text-gray-500">Não há pedidos conferidos aguardando destino.</p>
                                </div>
                            ) : (
                                <>
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
                                                            <span>P. Entrega</span>
                                                        </div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {ordersEntregas.map((order) => {
                                                    const currentAction = getEntregaAction(order.id)
                                                    const total = order.cost_price * order.amount
                                                    // Show buttons only for PRONTA ENTREGA status (can change to ENTREGUE)
                                                    const isProntaEntregaStatus = order.status === "Pronta a Entrega" || order.status === "PRONTA ENTREGA" || order.status === "Pronta Entrega"

                                                    return (
                                                        <tr
                                                            key={order.id}
                                                            className={`border-b border-gray-100 last:border-0 transition-colors
                                                                ${currentAction
                                                                    ? currentAction === 'entregar' ? 'bg-green-50' : 'bg-purple-50'
                                                                    : 'bg-white hover:bg-gray-50'
                                                                }
                                                                ${(isLoadingEntregas || isUpdatingStatus) ? 'opacity-50' : ''}
                                                            `}
                                                        >
                                                            <td className="p-3 font-mono text-sm text-gray-900">{order.code || "-"}</td>
                                                            <td className="p-3 text-gray-900">{order.description || order.brand || "-"}</td>
                                                            <td className="p-3 text-center font-bold text-gray-900">{order.amount}</td>
                                                            <td className="p-3 text-right text-gray-900">{formatCurrency(order.cost_price)}</td>
                                                            <td className="p-3 text-right font-semibold text-purple-700">{formatCurrency(total)}</td>
                                                            <td className="p-3 text-center">
                                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold border bg-white/20 ${getStatusColor(order.status || "CONFERIDO")}`}>
                                                                    {order.status || "CONFERIDO"}
                                                                </span>
                                                            </td>
                                                            <td className="p-3 text-center">
                                                                {isProntaEntregaStatus && (
                                                                    <button
                                                                        onClick={() => toggleEntregaSelection(order.id, 'entregar')}
                                                                        disabled={isLoadingEntregas || isUpdatingStatus}
                                                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all mx-auto
                                                                            ${currentAction === 'entregar'
                                                                                ? 'bg-green-500 border-green-500 text-white'
                                                                                : 'border-gray-300 hover:border-green-400'
                                                                            }
                                                                            disabled:opacity-50 disabled:cursor-not-allowed
                                                                        `}
                                                                    >
                                                                        {currentAction === 'entregar' && <CheckCircle className="w-4 h-4" />}
                                                                    </button>
                                                                )}
                                                            </td>
                                                            <td className="p-3 text-center">
                                                                {/* Pronta Entrega button - not needed since they're already in pronta entrega */}
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Summary */}
                                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <div className="bg-blue-50 rounded-lg px-3 py-2 border border-blue-200">
                                                    <p className="text-xs text-gray-500">Selecionados</p>
                                                    <p className="text-lg font-bold text-blue-700">{selectedEntregas.length}</p>
                                                </div>
                                                {entregasCount > 0 && (
                                                    <div className="bg-green-50 rounded-lg px-3 py-2 border border-green-200">
                                                        <p className="text-xs text-gray-500">Entregar</p>
                                                        <p className="text-lg font-bold text-green-700">{entregasCount}</p>
                                                    </div>
                                                )}
                                                {prontaEntregaCount > 0 && (
                                                    <div className="bg-purple-50 rounded-lg px-3 py-2 border border-purple-200">
                                                        <p className="text-xs text-gray-500">P. Entrega</p>
                                                        <p className="text-lg font-bold text-purple-700">{prontaEntregaCount}</p>
                                                    </div>
                                                )}
                                                <div className="bg-amber-50 rounded-lg px-3 py-2 border border-amber-200">
                                                    <p className="text-xs text-gray-500">Total</p>
                                                    <p className="text-lg font-bold text-amber-700">{formatCurrency(selectedEntregasTotal)}</p>
                                                </div>
                                            </div>

                                            <Button
                                                onClick={() => setIsEntregasModalOpen(true)}
                                                disabled={selectedEntregas.length === 0 || isUpdatingStatus}
                                                className="bg-gradient-to-r from-green-600 to-purple-600 hover:from-green-700 hover:to-purple-700 text-white shadow-lg"
                                                size="lg"
                                            >
                                                <CheckCircle className="w-5 h-5 mr-2" />
                                                Confirmar Destino
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Pagination */}
                                    <div className="p-4 border-t border-gray-200">
                                        <Pagination
                                            pageIndex={paginationEntregas.pageIndex}
                                            pageSize={paginationEntregas.pageSize}
                                            totalPages={paginationEntregas.totalPages}
                                            currentDataLength={ordersEntregas.length}
                                            onPageChange={onPageChangeEntregas}
                                            disabled={isLoadingEntregas}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Confirmation Modals */}
            <ConfirmationModal
                open={isRecebimentoModalOpen}
                onOpenChange={setIsRecebimentoModalOpen}
                title="Confirmar Conferência"
                description={`Você está prestes a marcar ${selectedRecebimento.length} pedido(s) como CONFERIDO. Esta ação não pode ser desfeita.`}
                confirmLabel="Confirmar Conferência"
                onConfirm={handleConfirmRecebimento}
                isLoading={isUpdatingStatus}
            />

            <ConfirmationModal
                open={isEntregasModalOpen}
                onOpenChange={setIsEntregasModalOpen}
                title="Confirmar Entrega"
                description={`Você está prestes a marcar ${selectedEntregas.length} pedido(s) como ENTREGUE AO CLIENTE. Esta ação não pode ser desfeita.`}
                confirmLabel="Confirmar Entrega"
                onConfirm={handleConfirmEntregas}
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
