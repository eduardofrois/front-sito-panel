"use client"

import type { Order } from "@/app/home/orders/order.interface"
import { Button } from "@/components/ui/button"
import { Status_String } from "@/constants/order-status"
import { formatDate } from "@/functions/format-functions"
import { ChevronLeft, ChevronRight, Package } from "lucide-react"

interface OrdersDataTableProps {
    orders: Order[]
    isLoading: boolean
    pagination: {
        pageIndex: number
        pageSize: number
        totalPages: number
        totalCount: number
    }
    onPageChange: (page: number) => void
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value)
}

const getStatusStyles = (status: string) => {
    switch (status) {
        case Status_String.PendingPurchase:
            return { badge: "bg-yellow-100 text-yellow-800 border-yellow-300", row: "bg-yellow-50/50" }
        case Status_String.ReadyForDelivery:
            return { badge: "bg-purple-100 text-purple-800 border-purple-300", row: "bg-purple-50/50" }
        case Status_String.ConfirmSale:
            return { badge: "bg-blue-100 text-blue-800 border-blue-300", row: "bg-blue-50/50" }
        case Status_String.PaidPurchase:
            return { badge: "bg-pink-100 text-pink-800 border-pink-300", row: "bg-pink-50/50" }
        case Status_String.ToCheck:
            return { badge: "bg-orange-100 text-orange-800 border-orange-300", row: "bg-orange-50/50" }
        case Status_String.Checked:
            return { badge: "bg-lime-100 text-lime-800 border-lime-300", row: "bg-lime-50/50" }
        case Status_String.DeliveredToClient:
            return { badge: "bg-indigo-100 text-indigo-800 border-indigo-300", row: "bg-indigo-50/50" }
        default:
            return { badge: "bg-gray-100 text-gray-800 border-gray-300", row: "bg-gray-50/50" }
    }
}

export function OrdersDataTable({
    orders,
    isLoading,
    pagination,
    onPageChange,
}: OrdersDataTableProps) {

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                <div className="flex flex-col items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-200 border-t-purple-600"></div>
                    <span className="text-gray-600 font-medium">Carregando pedidos...</span>
                </div>
            </div>
        )
    }

    if (orders.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12">
                <div className="flex flex-col items-center justify-center text-gray-500 gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-semibold text-gray-700">Nenhum pedido encontrado</p>
                        <p className="text-sm text-gray-500 mt-1">Tente ajustar os filtros ou adicione um novo pedido.</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Mobile Card View */}
            <div className="block lg:hidden">
                <div className="divide-y divide-gray-100">
                    {orders.map((order) => {
                        const styles = getStatusStyles(order.status)
                        return (
                            <div key={order.id} className={`p-4 ${styles.row} hover:bg-opacity-80 transition-colors`}>
                                {/* Header Row */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex flex-col gap-1">
                                        <span className={`inline-flex w-fit items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${styles.badge}`}>
                                            {order.status}
                                        </span>
                                        <span className="text-xs text-gray-500 mt-1">
                                            {formatDate(order.date_creation_order)}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-green-600">
                                            {formatCurrency(order.sale_price * order.amount)}
                                        </p>
                                        <p className="text-xs text-gray-500">Total Venda</p>
                                    </div>
                                </div>

                                {/* Info Grid */}
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="bg-white/60 rounded-lg p-2">
                                        <p className="text-xs text-gray-500 font-medium">Cliente</p>
                                        <p className="font-semibold text-gray-900 truncate">
                                            {order.client_infos?.client_name || "-"}
                                        </p>
                                    </div>
                                    <div className="bg-white/60 rounded-lg p-2">
                                        <p className="text-xs text-gray-500 font-medium">Fornecedor</p>
                                        <p className="font-semibold text-gray-900 truncate">
                                            {order.supplier_infos?.supplier_name || "-"}
                                        </p>
                                    </div>
                                    <div className="bg-white/60 rounded-lg p-2">
                                        <p className="text-xs text-gray-500 font-medium">Produto</p>
                                        <p className="font-medium text-gray-900 truncate">{order.brand}</p>
                                    </div>
                                    <div className="bg-white/60 rounded-lg p-2">
                                        <p className="text-xs text-gray-500 font-medium">Código</p>
                                        <p className="font-mono text-gray-900">{order.code}</p>
                                    </div>
                                </div>

                                {/* Price Row */}
                                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-200/50">
                                    <div className="text-center bg-white/60 rounded-lg py-2">
                                        <p className="text-xs text-gray-500">Qtd</p>
                                        <p className="font-bold text-gray-900">{order.amount}</p>
                                    </div>
                                    <div className="text-center bg-white/60 rounded-lg py-2">
                                        <p className="text-xs text-gray-500">Custo Unit.</p>
                                        <p className="font-medium text-gray-700 text-sm">{formatCurrency(order.cost_price)}</p>
                                    </div>
                                    <div className="text-center bg-white/60 rounded-lg py-2">
                                        <p className="text-xs text-gray-500">Total Custo</p>
                                        <p className="font-semibold text-red-600 text-sm">{formatCurrency(order.cost_price * order.amount)}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
                            <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Data</th>
                            <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Cliente</th>
                            <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Fornecedor</th>
                            <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Produto</th>
                            <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Código</th>
                            <th className="px-4 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Qtd</th>
                            <th className="px-4 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">P. Custo</th>
                            <th className="px-4 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">P. Venda</th>
                            <th className="px-4 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Total Custo</th>
                            <th className="px-4 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Total Venda</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.map((order, index) => {
                            const styles = getStatusStyles(order.status)
                            return (
                                <tr
                                    key={order.id}
                                    className={`${styles.row} hover:bg-opacity-80 transition-all duration-150 ${index % 2 === 0 ? '' : 'bg-opacity-30'}`}
                                >
                                    <td className="px-4 py-3.5 text-sm text-gray-700 whitespace-nowrap font-medium">
                                        {formatDate(order.date_creation_order)}
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${styles.badge}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-sm font-semibold text-gray-900">
                                        {order.client_infos?.client_name || "-"}
                                    </td>
                                    <td className="px-4 py-3.5 text-sm text-gray-700">
                                        {order.supplier_infos?.supplier_name || "-"}
                                    </td>
                                    <td className="px-4 py-3.5 text-sm text-gray-700">
                                        {order.brand}
                                    </td>
                                    <td className="px-4 py-3.5 text-sm font-mono text-gray-600">
                                        {order.code}
                                    </td>
                                    <td className="px-4 py-3.5 text-sm text-center font-bold text-gray-900">
                                        {order.amount}
                                    </td>
                                    <td className="px-4 py-3.5 text-sm text-right text-gray-600">
                                        {formatCurrency(order.cost_price)}
                                    </td>
                                    <td className="px-4 py-3.5 text-sm text-right font-semibold text-gray-900">
                                        {formatCurrency(order.sale_price)}
                                    </td>
                                    <td className="px-4 py-3.5 text-sm text-right font-semibold text-red-600">
                                        {formatCurrency(order.cost_price * order.amount)}
                                    </td>
                                    <td className="px-4 py-3.5 text-sm text-right font-bold text-green-600">
                                        {formatCurrency(order.sale_price * order.amount)}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 border-t border-gray-200 px-4 py-4">
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
                            className="h-9 px-3 border-gray-300 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-colors"
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
                            className="h-9 px-3 border-gray-300 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-colors"
                        >
                            Próxima
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
