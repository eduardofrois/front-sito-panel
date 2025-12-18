"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { getCardStylesFromOrder } from "@/constants/card-state-helper"
import { formatCurrency, formatDate } from "@/functions/format-functions"
import { getStatusColor } from "@/functions/style-functions"
import type { Order } from "../../app/home/orders/order.interface"

interface OrdersTableProps {
    orders: Order[]
    selectedOrders: number[]
    onToggleSelect: (order: Order) => void
    type: "order" | "account"
}

export function OrdersTable({ orders, selectedOrders, onToggleSelect, type }: OrdersTableProps) {
    if (!orders || orders.length === 0) {
        return <div className="text-center py-8 text-gray-500">Nenhum pedido para exibir.</div>
    }

    return (
        <div className="w-full overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="w-full text-sm text-left min-w-[1000px]">
                <thead className="text-xs text-gray-600 uppercase bg-gradient-to-r from-purple-50 to-blue-50 border-b sticky top-0">
                    <tr>
                        <th className="p-3 w-10 text-center">#</th>
                        <th className="p-3 whitespace-nowrap">Data</th>
                        <th className="p-3 whitespace-nowrap">Status</th>
                        <th className="p-3 whitespace-nowrap">Cliente</th>
                        <th className="p-3 whitespace-nowrap">Fornecedor</th>
                        <th className="p-3 whitespace-nowrap">Produto</th>
                        <th className="p-3 whitespace-nowrap">Código</th>
                        <th className="p-3 text-center whitespace-nowrap">Qtd</th>
                        <th className="p-3 text-right whitespace-nowrap">P. Custo</th>
                        <th className="p-3 text-right whitespace-nowrap">P. Venda</th>
                        <th className="p-3 text-right whitespace-nowrap">Total Custo</th>
                        <th className="p-3 text-right whitespace-nowrap">Total Venda</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => {
                        const isSelected = selectedOrders.includes(order.id)
                        const styles = getCardStylesFromOrder(order, isSelected)

                        return (
                            <tr
                                key={order.id}
                                onClick={() => onToggleSelect(order)}
                                className={`
                                    border-b last:border-0 cursor-pointer transition-colors hover:bg-opacity-90
                                    ${styles.background} ${styles.text} 
                                `}
                            >
                                <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex items-center justify-center p-1">
                                        <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={() => onToggleSelect(order)}
                                            className={isSelected ? "border-white data-[state=checked]:bg-white data-[state=checked]:text-purple-600" : ""}
                                        />
                                    </div>
                                </td>
                                <td className="p-3 whitespace-nowrap font-medium">
                                    {formatDate(order.date_creation_order)}
                                </td>
                                <td className="p-3 whitespace-nowrap">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border bg-white/20 ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-3 whitespace-nowrap font-semibold">
                                    {order.client_infos?.client_name || "-"}
                                </td>
                                <td className="p-3 whitespace-nowrap">
                                    {order.supplier_infos?.supplier_name || "-"}
                                </td>
                                <td className="p-3 whitespace-nowrap">
                                    {order.brand || "-"}
                                </td>
                                <td className="p-3 whitespace-nowrap font-mono text-xs">
                                    {order.code || "-"}
                                </td>
                                <td className="p-3 text-center font-bold">
                                    {order.amount}
                                </td>
                                <td className="p-3 text-right text-gray-600">
                                    {formatCurrency(order.cost_price)}
                                </td>
                                <td className="p-3 text-right font-medium">
                                    {formatCurrency(order.sale_price)}
                                </td>
                                <td className="p-3 text-right font-semibold text-red-600">
                                    {formatCurrency(order.cost_price * order.amount)}
                                </td>
                                <td className="p-3 text-right font-bold text-green-600">
                                    {formatCurrency(order.sale_price * order.amount)}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
