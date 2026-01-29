"use client"

import type { Client, Order, Supplier } from "@/app/home/orders/order.interface"
import { IsLoadingCard } from "@/components/global/isloading-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Info } from "lucide-react"
import { DialogFormOrder } from "./dialog-form-order"
import { OrdersFilters } from "./orders-filters"
import { OrdersTable } from "./orders-table"

interface OrdersPageViewProps {
    orders: Order[]
    clients: Client[]
    suppliers: Supplier[]
    isLoading: boolean
    pagination: {
        pageIndex: number
        pageSize: number
        totalPages: number
        totalCount: number
    }
    onPageChange: (page: number) => void
    onFiltersChange: (filters: {
        dateStart?: string
        dateEnd?: string
        statuses?: number[]
        clientId?: number
        supplierId?: number
    }) => void
}

export const OrdersPageView = ({
    orders,
    clients,
    suppliers,
    isLoading,
    pagination,
    onPageChange,
    onFiltersChange,
}: OrdersPageViewProps) => {


    if (isLoading && orders.length === 0) return <IsLoadingCard />

    // Calculate totals
    const totalItems = orders.reduce((total, order) => total + order.amount, 0)
    const totalCost = orders.reduce((total, order) => total + order.cost_price * order.amount, 0)
    const totalRevenue = orders.reduce((total, order) => total + order.sale_price * order.amount, 0)
    const totalProfit = totalRevenue - totalCost

    return (
        <div className="space-y-4 px-2 sm:px-0">
            {/* Header with Summary */}
            <div className="bg-white rounded-xl border border-purple-100 shadow-sm p-4 sm:p-6">
                {/* Status Legend */}
                <div className="mb-4 p-3 sm:p-4 bg-white/80 backdrop-blur rounded-lg border border-purple-100 shadow-sm">
                    <div className="flex items-start gap-2 mb-3">
                        <Info className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <h3 className="text-xs sm:text-sm font-semibold text-gray-900">Legenda de Status</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <StatusLegendItem color="bg-yellow-400" label="Compra Pendente" />
                        <StatusLegendItem color="bg-purple-400" label="Pronta Entrega" />
                        <StatusLegendItem color="bg-blue-400" label="Compra Realizada" />
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
                            Lista de Pedidos ({pagination.totalCount})
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-600">Gerencie seus pedidos de forma detalhada</p>
                    </div>
                    <div className="text-right bg-white/80 backdrop-blur rounded-lg px-4 py-2 border border-purple-100">
                        <p className="text-xs text-gray-500">Total Geral</p>
                        <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            R$ {totalRevenue.toFixed(2)}
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <StatCard label="Total de Itens" value={totalItems.toString()} color="purple" />
                    <StatCard label="Custo Total" value={`R$ ${totalCost.toFixed(2)}`} color="red" />
                    <StatCard label="Receita Total" value={`R$ ${totalRevenue.toFixed(2)}`} color="green" />
                    <StatCard label="Lucro Total" value={`R$ ${totalProfit.toFixed(2)}`} color="blue" />
                </div>
            </div>

            {/* Add Order Button */}
            <div className="w-full">
                <DialogFormOrder solicitation={null} text="+ Adicionar Novo Pedido" variant="outline" />
            </div>

            {/* Filters */}
            <OrdersFilters
                clients={clients}
                suppliers={suppliers}
                onFiltersChange={onFiltersChange}
                isLoading={isLoading}
            />

            {/* Orders Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <OrdersTable
                    orders={orders}
                />

                {/* Pagination */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <p className="text-sm text-gray-600">
                            Mostrando <span className="font-semibold text-gray-900">{orders.length}</span> de{" "}
                            <span className="font-semibold text-gray-900">{pagination.totalCount}</span> pedidos
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange(pagination.pageIndex - 1)}
                                disabled={pagination.pageIndex <= 1}
                                className="h-9 px-3"
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" />
                                Anterior
                            </Button>
                            <div className="flex items-center gap-1 px-3">
                                <span className="text-sm font-medium text-gray-900">{pagination.pageIndex}</span>
                                <span className="text-sm text-gray-500">de</span>
                                <span className="text-sm font-medium text-gray-900">{pagination.totalPages || 1}</span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange(pagination.pageIndex + 1)}
                                disabled={pagination.pageIndex >= pagination.totalPages}
                                className="h-9 px-3"
                            >
                                Próxima
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const StatusLegendItem = ({ color, label }: { color: string; label: string }) => (
    <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${color} shadow-sm`}></div>
        <span className="text-xs text-gray-700 font-medium">{label}</span>
    </div>
)

const StatCard = ({ label, value, color }: { label: string; value: string; color: "purple" | "red" | "green" | "blue" }) => {
    const colorStyles = {
        purple: "text-purple-600",
        red: "text-red-600",
        green: "text-green-600",
        blue: "text-blue-600",
    }

    return (
        <div className="bg-white/80 backdrop-blur rounded-lg p-3 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs text-gray-500 font-medium">{label}</p>
            <p className={`text-lg font-bold ${colorStyles[color]}`}>{value}</p>
        </div>
    )
}
