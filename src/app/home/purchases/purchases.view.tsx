"use client"

import { PurchasesPageView } from "@/components/purchases/purchases-page-view"
import type { usePurchasesModel } from "./purchases.model"

type PurchasesViewProps = ReturnType<typeof usePurchasesModel>

export const PurchasesView = (props: PurchasesViewProps) => {
    const {
        purchases,
        suppliers,
        isLoading,
        pagination,
        handlePageChange,
        handleFiltersChange,
        selectedLineKeysForRealizarCompra,
        handleToggleRealizarCompra,
        handleRealizarCompra,
        isPendingRealizarCompra,
    } = props

    return (
        <PurchasesPageView
            purchases={purchases}
            suppliers={suppliers}
            isLoading={isLoading}
            pagination={pagination}
            onPageChange={handlePageChange}
            onFiltersChange={handleFiltersChange}
            selectedLineKeysForRealizarCompra={selectedLineKeysForRealizarCompra}
            onToggleRealizarCompra={handleToggleRealizarCompra}
            onRealizarCompra={handleRealizarCompra}
            isPendingRealizarCompra={isPendingRealizarCompra}
        />
    )
}
