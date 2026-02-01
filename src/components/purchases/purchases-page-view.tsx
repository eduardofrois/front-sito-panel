"use client"

import type { Supplier } from "@/app/home/orders/order.interface"
import { IsLoadingCard } from "@/components/global/isloading-card"
import { NotFoundOrder } from "@/components/global/not-found-order"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useCallback, useMemo } from "react"
import { toast } from "sonner"
import type { PurchaseLine, UpdatePurchasePaymentDto } from "@/app/home/purchases/purchases.interface"
import useMutateUpdatePurchasePayment from "@/app/home/purchases/hooks/useMutateUpdatePurchasePayment"
import { PurchasesFilters } from "./purchases-filters"
import { PurchasesTable, type PurchaseLineWithId } from "./purchases-table"

interface PurchasesPageViewProps {
    purchases: PurchaseLine[]
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
        productSearch?: string
        supplierId?: number
        statusCompra?: string
        statusPagamento?: string
    }) => void
    selectedLineKeysForRealizarCompra?: string[]
    onToggleRealizarCompra?: (item: PurchaseLineWithId) => void
    onRealizarCompra?: () => void
    isPendingRealizarCompra?: boolean
}

export function PurchasesPageView({
    purchases,
    suppliers,
    isLoading,
    pagination,
    onPageChange,
    onFiltersChange,
    selectedLineKeysForRealizarCompra = [],
    onToggleRealizarCompra,
    onRealizarCompra,
    isPendingRealizarCompra = false,
}: PurchasesPageViewProps) {
    const { mutateAsync: updatePayment, isPending } = useMutateUpdatePurchasePayment()

    const dataWithId: PurchaseLineWithId[] = useMemo(
        () =>
            purchases.map((line) => ({
                ...line,
                id: line.order_ids?.[0] ?? 0,
            })),
        [purchases]
    )

    const canSelect = useCallback((item: PurchaseLineWithId) => {
        return item.status_pagamento !== "Totalmente Pago"
    }, [])

    const paidIds = useMemo(
        () =>
            dataWithId
                .filter((item) => item.status_pagamento === "Totalmente Pago")
                .map((item) => item.id),
        [dataWithId]
    )

    const handleToggleSelect = useCallback(
        async (item: PurchaseLineWithId) => {
            const pending = item.total_cost - item.total_paid
            if (pending <= 0) return
            const dto: UpdatePurchasePaymentDto = {
                supplier_id: item.supplier_id,
                code: item.code,
                brand: item.brand,
                size: item.size,
                paid_amount: pending,
            }
            try {
                await updatePayment(dto)
                toast.success("Pagamento registrado", {
                    description: `Valor de R$ ${pending.toFixed(2)} registrado para o fornecedor ${item.supplier_name}.`,
                })
            } catch {
                toast.error("Erro ao registrar pagamento")
            }
        },
        [updatePayment]
    )

    if (isLoading && purchases.length === 0) return <IsLoadingCard />

    if (!isLoading && purchases.length === 0) {
        return (
            <div className="space-y-4 px-2 sm:px-0">
                <PurchasesFilters
                    suppliers={suppliers}
                    onFiltersChange={onFiltersChange}
                    isLoading={isLoading}
                />
                <NotFoundOrder />
            </div>
        )
    }

    return (
        <div className="space-y-4 px-2 sm:px-0">
            <div className="bg-white rounded-xl border border-purple-100 shadow-sm p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
                            Compras por fornecedor ({pagination.totalCount})
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-600">
                            Produtos das vendas agrupados por fornecedor. Selecione linhas em Compra Pendente e clique em Realizar Compra. Marque para registrar pagamento.
                        </p>
                    </div>
                    {onRealizarCompra && selectedLineKeysForRealizarCompra.length > 0 && (
                        <Button
                            onClick={onRealizarCompra}
                            disabled={isPendingRealizarCompra}
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            {isPendingRealizarCompra ? "Processando…" : "Realizar Compra"}
                        </Button>
                    )}
                </div>
            </div>

            <PurchasesFilters
                suppliers={suppliers}
                onFiltersChange={onFiltersChange}
                isLoading={isLoading}
            />

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <PurchasesTable
                    data={dataWithId}
                    showCheckbox
                    selectedIds={paidIds}
                    onToggleSelect={handleToggleSelect}
                    onSelectAll={() => {}}
                    isLoading={isPending}
                    canSelect={canSelect}
                    selectedLineKeysForRealizarCompra={selectedLineKeysForRealizarCompra}
                    onToggleRealizarCompra={onToggleRealizarCompra}
                    isPendingRealizarCompra={isPendingRealizarCompra}
                />

                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <p className="text-sm text-gray-600">
                            Mostrando <span className="font-semibold text-gray-900">{purchases.length}</span> de{" "}
                            <span className="font-semibold text-gray-900">{pagination.totalCount}</span> itens
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
                                <span className="text-sm font-medium text-gray-900">
                                    {pagination.totalPages || 1}
                                </span>
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
