"use client"

import type { PurchaseLine } from "@/app/home/purchases/purchases.interface"
import { Status_String } from "@/constants/order-status"
import { SharedDataTable, StatusBadge, type TableColumn } from "@/components/shared/shared-data-table"
import { Checkbox } from "@/components/ui/checkbox"
import { formatCurrency } from "@/functions/format-functions"
import { getPurchaseLineCardStyles } from "@/functions/style-functions"
import { useMemo } from "react"

export type PurchaseLineWithId = PurchaseLine & { id: number }

interface PurchasesTableProps {
    data: PurchaseLineWithId[]
    showCheckbox?: boolean
    selectedIds?: number[]
    onToggleSelect?: (item: PurchaseLineWithId) => void
    onSelectAll?: () => void
    isLoading?: boolean
    canSelect?: (item: PurchaseLineWithId) => boolean
    selectedLineKeysForRealizarCompra?: string[]
    onToggleRealizarCompra?: (item: PurchaseLineWithId) => void
    isPendingRealizarCompra?: boolean
}

export function PurchasesTable({
    data,
    showCheckbox = false,
    selectedIds = [],
    onToggleSelect,
    onSelectAll,
    isLoading = false,
    canSelect,
    selectedLineKeysForRealizarCompra = [],
    onToggleRealizarCompra,
    isPendingRealizarCompra = false,
}: PurchasesTableProps) {
    const showRealizarCompraColumn = Boolean(onToggleRealizarCompra)
    const columns: TableColumn<PurchaseLineWithId>[] = useMemo(
        () => [
            ...(showRealizarCompraColumn
                ? [
                      {
                          key: "realizar_compra",
                          header: "Realizar compra",
                          accessor: (item: PurchaseLineWithId) =>
                              item.status_compra === Status_String.PendingPurchase ? (
                                  <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
                                      <Checkbox
                                          checked={selectedLineKeysForRealizarCompra.includes(item.line_key)}
                                          onCheckedChange={() => onToggleRealizarCompra?.(item)}
                                          disabled={isPendingRealizarCompra}
                                          className="border-gray-400"
                                      />
                                  </div>
                              ) : (
                                  <span className="text-gray-400">—</span>
                              ),
                          align: "center" as const,
                          className: "w-24",
                      },
                  ]
                : []),
            {
                key: "supplier",
                header: "Fornecedor",
                accessor: (item) => item.supplier_name,
                className: "font-semibold",
            },
            {
                key: "product",
                header: "Produto",
                accessor: (item) => item.brand || "-",
            },
            {
                key: "code",
                header: "Código",
                accessor: (item) => item.code,
                className: "font-mono text-xs",
            },
            {
                key: "size",
                header: "Tamanho",
                accessor: (item) => item.size || "-",
            },
            {
                key: "total_amount",
                header: "Qtd",
                accessor: (item) => item.total_amount,
                align: "center",
                className: "font-bold",
            },
            {
                key: "cost_price",
                header: "P. Custo",
                accessor: (item) => formatCurrency(item.cost_price),
                align: "right",
                className: "text-gray-600",
            },
            {
                key: "total_cost",
                header: "Total Custo",
                accessor: (item) => (
                    <span className="font-semibold text-red-600">
                        {formatCurrency(item.total_cost)}
                    </span>
                ),
                align: "right",
            },
            {
                key: "total_paid",
                header: "Pago",
                accessor: (item) => formatCurrency(item.total_paid),
                align: "right",
                className: "text-gray-600",
            },
            {
                key: "status_compra",
                header: "Status compra",
                accessor: (item) => <StatusBadge status={item.status_compra} />,
            },
            {
                key: "status_pagamento",
                header: "Status pagamento",
                accessor: (item) => <StatusBadge status={item.status_pagamento} />,
            },
        ],
        [showRealizarCompraColumn, selectedLineKeysForRealizarCompra, onToggleRealizarCompra, isPendingRealizarCompra]
    )

    const getRowStyles = useMemo(
        () => (item: PurchaseLineWithId, isSelected: boolean) =>
            getPurchaseLineCardStyles(item.status_pagamento, isSelected),
        []
    )

    return (
        <SharedDataTable<PurchaseLineWithId>
            data={data}
            columns={columns}
            showCheckbox={showCheckbox}
            selectedIds={selectedIds}
            onToggleSelect={onToggleSelect}
            onSelectAll={onSelectAll}
            isLoading={isLoading}
            emptyMessage="Nenhuma compra para exibir."
            emptySubMessage="Ajuste os filtros ou verifique as vendas."
            getRowStyles={getRowStyles}
            canSelect={canSelect}
        />
    )
}
