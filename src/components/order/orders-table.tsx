"use client"

import { SharedDataTable, StatusBadge, type TableColumn } from "@/components/shared/shared-data-table"
import { formatCurrency, formatDate } from "@/functions/format-functions"
import { useMemo } from "react"
import type { Order } from "../../app/home/orders/order.interface"

interface OrdersTableProps {
    orders: Order[]
}

export function OrdersTable({ orders }: OrdersTableProps) {
    // Define columns for Orders module
    const columns: TableColumn<Order>[] = useMemo(() => [
        {
            key: 'date',
            header: 'Data',
            accessor: (order) => formatDate(order.date_creation_order),
            className: 'font-medium',
        },
        {
            key: 'status',
            header: 'Status',
            accessor: (order) => <StatusBadge status={order.status} />,
        },
        {
            key: 'client',
            header: 'Cliente',
            accessor: (order) => order.client_infos?.client_name || "-",
            className: 'font-semibold',
        },
        {
            key: 'supplier',
            header: 'Fornecedor',
            accessor: (order) => order.supplier_infos?.supplier_name || "-",
        },
        {
            key: 'product',
            header: 'Produto',
            accessor: (order) => order.brand || "-",
        },
        {
            key: 'code',
            header: 'Código',
            accessor: (order) => order.code || "-",
            className: 'font-mono text-xs',
        },
        {
            key: 'amount',
            header: 'Qtd',
            accessor: (order) => order.amount,
            align: 'center' as const,
            className: 'font-bold',
        },
        {
            key: 'cost_price',
            header: 'P. Custo',
            accessor: (order) => formatCurrency(order.cost_price),
            align: 'right' as const,
            className: 'text-gray-600',
        },
        {
            key: 'sale_price',
            header: 'P. Venda',
            accessor: (order) => formatCurrency(order.sale_price),
            align: 'right' as const,
            className: 'font-medium',
        },
        {
            key: 'total_cost',
            header: 'Total Custo',
            accessor: (order) => (
                <span className="font-semibold text-red-600">
                    {formatCurrency(order.cost_price * order.amount)}
                </span>
            ),
            align: 'right' as const,
        },
        {
            key: 'total_sale',
            header: 'Total Venda',
            accessor: (order) => (
                <span className="font-bold text-green-600">
                    {formatCurrency(order.sale_price * order.amount)}
                </span>
            ),
            align: 'right' as const,
        },
    ], [])

    return (
        <SharedDataTable
            data={orders}
            columns={columns}
            showCheckbox={false}
            emptyMessage="Nenhum pedido para exibir."
        />
    )
}
