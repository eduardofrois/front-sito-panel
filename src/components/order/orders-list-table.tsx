"use client"

import type { Order } from "@/app/home/orders/order.interface"
import { Button } from "@/components/ui/button"
import { Status_String } from "@/constants/order-status"
import { formatDate } from "@/functions/format-functions"
import { ChevronLeft, ChevronRight, Package } from "lucide-react"

interface OrdersListTableProps {
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

const getStatusStyles = (status: string) => {
    switch (status) {
        case Status_String.PendingPurchase:
            return {
                bg: "bg-yellow-50",
                border: "border-yellow-200",
                text: "text-yellow-800",
                badge: "bg-yellow-100 text-yellow-800",
            }
        case Status_String.ReadyForDelivery:
            return {
                bg: "bg-purple-50",
                border: "border-purple-200",
                text: "text-purple-800",
                badge: "bg-purple-100 text-purple-800",
            }
        case Status_String.ConfirmSale:
            return {
                bg: "bg-blue-50",
                border: "border-blue-200",
                text: "text-blue-800",
                badge: "bg-blue-100 text-blue-800",
            }
        case Status_String.PaidPurchase:
            return {
                bg: "bg-pink-50",
                border: "border-pink-200",
                text: "text-pink-800",
                badge: "bg-pink-100 text-pink-800",
            }
        case Status_String.ToCheck:
            return {
                bg: "bg-orange-50",
                border: "border-orange-200",
                text: "text-orange-800",
                badge: "bg-orange-100 text-orange-800",
            }
        case Status_String.Checked:
            return {
                bg: "bg-lime-50",
                border: "border-lime-200",
                text: "text-lime-800",
                badge: "bg-lime-100 text-lime-800",
            }
        case Status_String.DeliveredToClient:
            return {
                bg: "bg-indigo-50",
                border: "border-indigo-200",
                text: "text-indigo-800",
                badge: "bg-indigo-100 text-indigo-800",
            }
        default:
            return {
                bg: "bg-gray-50",
                border: "border-gray-200",
                text: "text-gray-800",
                badge: "bg-gray-100 text-gray-800",
            }
    }
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value)
}

export function OrdersListTable({
    orders,
    isLoading,
    pagination,
    onPageChange,
}: OrdersListTableProps) {
    if (isLoading) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-8">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    <span className="ml-3 text-gray-600">Carregando pedidos...</span>
                </div>
            </div>
        )
    }

    if (orders.length === 0) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-8">
                <div className="flex flex-col items-center justify-center text-gray-500">
                    <Package className="w-12 h-12 mb-3 text-gray-300" />
                    <p className="text-lg font-medium">Nenhum pedido encontrado</p>
                    <p className="text-sm">Tente ajustar os filtros ou adicione um novo pedido.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Mobile Card View */}
            <div className="block lg:hidden">
                <div className="divide-y divide-gray-200">
                    {orders.map((order) => {
                        const styles = getStatusStyles(order.status)
                        return (
                            <div key={order.id} className={`p-4 ${styles.bg}`}>
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${styles.badge}`}>
                                            {order.status}
                                        </span>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {formatDate(order.date_creation_order)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-gray-900">
                                            {formatCurrency(order.sale_price * order.amount)}
                                        </p>
                                        <p className="text-xs text-gray-500">Total Venda</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-xs text-gray-500">Cliente</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {order.client_infos?.client_name || "-"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-xs text-gray-500">Fornecedor</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {order.supplier_infos?.supplier_name || "-"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-xs text-gray-500">Produto</span>
                                        <span className="text-sm text-gray-900">{order.brand}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-xs text-gray-500">Código</span>
                                        <span className="text-sm font-mono text-gray-900">{order.code}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-xs text-gray-500">Quantidade</span>
                                        <span className="text-sm text-gray-900">{order.amount}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-gray-200">
                                    <div>
                                        <p className="text-xs text-gray-500">Custo</p>
                                        <p className="text-sm font-medium text-red-600">
                                            {formatCurrency(order.cost_price * order.amount)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Preço Unit.</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {formatCurrency(order.sale_price)}
                                        </p>
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
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Data
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Cliente
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Fornecedor
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Produto
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Código
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Qtd
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                P. Custo
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                P. Venda
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Total Custo
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Total Venda
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {orders.map((order) => {
                            const styles = getStatusStyles(order.status)
                            return (
                                <tr key={order.id} className={`${styles.bg} hover:opacity-90 transition-opacity`}>
                                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                                        {formatDate(order.date_creation_order)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${styles.badge}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900">
                                        {order.client_infos?.client_name || "-"}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900">
                                        {order.supplier_infos?.supplier_name || "-"}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900">
                                        {order.brand}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-mono text-gray-900">
                                        {order.code}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-center text-gray-900">
                                        {order.amount}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-right text-gray-600">
                                        {formatCurrency(order.cost_price)}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-right text-gray-900 font-medium">
                                        {formatCurrency(order.sale_price)}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-right text-red-600 font-medium">
                                        {formatCurrency(order.cost_price * order.amount)}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-right text-green-600 font-semibold">
                                        {formatCurrency(order.sale_price * order.amount)}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 border-t border-gray-200 px-4 py-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-sm text-gray-600">
                        Mostrando <span className="font-medium">{orders.length}</span> de{" "}
                        <span className="font-medium">{pagination.totalCount}</span> pedidos
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange(pagination.pageIndex - 1)}
                            disabled={pagination.pageIndex <= 1}
                            className="h-9"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Anterior
                        </Button>
                        <span className="text-sm text-gray-600 px-3">
                            Página {pagination.pageIndex} de {pagination.totalPages || 1}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange(pagination.pageIndex + 1)}
                            disabled={pagination.pageIndex >= pagination.totalPages}
                            className="h-9"
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
