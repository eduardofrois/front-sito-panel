"use client"

import type { Order } from "@/app/home/orders/order.interface"
import { Status_String } from "@/constants/order-status"
import { formatDate } from "@/functions/format-functions"
import { ColumnDef } from "@tanstack/react-table"

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value)
}

const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
        [Status_String.PendingPurchase]: "bg-yellow-100 text-yellow-800 border-yellow-200",
        [Status_String.ReadyForDelivery]: "bg-purple-100 text-purple-800 border-purple-200",
        [Status_String.ConfirmSale]: "bg-blue-100 text-blue-800 border-blue-200",
        [Status_String.PaidPurchase]: "bg-pink-100 text-pink-800 border-pink-200",
        [Status_String.ToCheck]: "bg-orange-100 text-orange-800 border-orange-200",
        [Status_String.Checked]: "bg-lime-100 text-lime-800 border-lime-200",
        [Status_String.DeliveredToClient]: "bg-indigo-100 text-indigo-800 border-indigo-200",
    }

    return styles[status] || "bg-gray-100 text-gray-800 border-gray-200"
}

export const ordersColumns: ColumnDef<Order>[] = [
    {
        accessorKey: "date_creation_order",
        header: "DATA",
        cell: ({ row }) => (
            <span className="text-sm whitespace-nowrap">
                {formatDate(row.getValue("date_creation_order"))}
            </span>
        ),
    },
    {
        accessorKey: "status",
        header: "STATUS",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(status)}`}>
                    {status}
                </span>
            )
        },
    },
    {
        accessorKey: "client_infos",
        header: "CLIENTE",
        cell: ({ row }) => {
            const clientInfos = row.original.client_infos
            return (
                <span className="text-sm font-medium">
                    {clientInfos?.client_name || "-"}
                </span>
            )
        },
    },
    {
        accessorKey: "supplier_infos",
        header: "FORNECEDOR",
        cell: ({ row }) => {
            const supplierInfos = row.original.supplier_infos
            return (
                <span className="text-sm">
                    {supplierInfos?.supplier_name || "-"}
                </span>
            )
        },
    },
    {
        accessorKey: "brand",
        header: "PRODUTO",
        cell: ({ row }) => (
            <span className="text-sm">{row.getValue("brand")}</span>
        ),
    },
    {
        accessorKey: "code",
        header: "CÓDIGO",
        cell: ({ row }) => (
            <span className="text-sm font-mono">{row.getValue("code")}</span>
        ),
    },
    {
        accessorKey: "amount",
        header: () => <div className="text-center">QTD</div>,
        cell: ({ row }) => (
            <div className="text-center text-sm font-medium">
                {row.getValue("amount")}
            </div>
        ),
    },
    {
        accessorKey: "cost_price",
        header: () => <div className="text-right">P. CUSTO</div>,
        cell: ({ row }) => (
            <div className="text-right text-sm text-gray-600">
                {formatCurrency(row.getValue("cost_price"))}
            </div>
        ),
    },
    {
        accessorKey: "sale_price",
        header: () => <div className="text-right">P. VENDA</div>,
        cell: ({ row }) => (
            <div className="text-right text-sm font-medium">
                {formatCurrency(row.getValue("sale_price"))}
            </div>
        ),
    },
    {
        id: "total_cost",
        header: () => <div className="text-right">TOTAL CUSTO</div>,
        cell: ({ row }) => {
            const costPrice = row.original.cost_price
            const amount = row.original.amount
            return (
                <div className="text-right text-sm font-medium text-red-600">
                    {formatCurrency(costPrice * amount)}
                </div>
            )
        },
    },
    {
        id: "total_sale",
        header: () => <div className="text-right">TOTAL VENDA</div>,
        cell: ({ row }) => {
            const salePrice = row.original.sale_price
            const amount = row.original.amount
            return (
                <div className="text-right text-sm font-semibold text-green-600">
                    {formatCurrency(salePrice * amount)}
                </div>
            )
        },
    },
]
