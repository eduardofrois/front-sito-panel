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
        return <div className="text-center py-4 text-gray-500">Nenhum pedido para exibir.</div>
    }

    return (
        <div className="w-full overflow-x-auto rounded-md border">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                    <tr>
                        <th className="p-3 w-10 text-center">
                            #
                        </th>
                        <th className="p-3 min-w-[200px]">Descrição</th>
                        <th className="p-3 whitespace-nowrap">Qtd</th>
                        <th className="p-3 whitespace-nowrap">Valor</th>
                        <th className="p-3 whitespace-nowrap">Data</th>
                        <th className="p-3 whitespace-nowrap">Status</th>
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
                                    <div
                                        className="flex items-center justify-center p-1"
                                    >
                                        <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={() => onToggleSelect(order)}
                                            className={isSelected ? "border-white data-[state=checked]:bg-white data-[state=checked]:text-purple-600" : ""}
                                        />
                                    </div>
                                </td>
                                <td className="p-3 font-medium">
                                    <span className="line-clamp-2" title={order.description}>
                                        {order.description || "Sem descrição"}
                                    </span>
                                    <div className="text-xs opacity-70 mt-1">
                                        Pedido #{order.id} | {order.code || "S/ Cód"}
                                    </div>
                                </td>
                                <td className="p-3 whitespace-nowrap">
                                    {order.amount} {order.amount === 1 ? "un" : "uns"}
                                </td>
                                <td className="p-3 whitespace-nowrap font-semibold">
                                    {formatCurrency(order.total_price)}
                                </td>
                                <td className="p-3 whitespace-nowrap">
                                    {formatDate(order.date_creation_order)}
                                </td>
                                <td className="p-3 whitespace-nowrap">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border bg-white/20 ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                    {order.status_conference && (
                                        <div className="mt-1 text-xs opacity-80">
                                            Conf: {order.status_conference}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
