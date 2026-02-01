"use client"

import { useCallback, useState } from "react"
import { toast } from "sonner"
import useQueryGetAllSuppliers from "../orders/hooks/useQueryGetAllSuppliers"
import useMutateRealizarCompra from "./hooks/useMutateRealizarCompra"
import useQueryGetPurchases from "./hooks/useQueryGetPurchases"
import type { PurchaseFilters, PurchaseLine } from "./purchases.interface"

export const usePurchasesModel = () => {
    const [pagination, setPagination] = useState({
        pageIndex: 1,
        pageSize: 20,
    })
    const [filters, setFilters] = useState<PurchaseFilters>({})
    const [selectedLineKeysForRealizarCompra, setSelectedLineKeysForRealizarCompra] = useState<string[]>([])

    const { data: purchasesData, isLoading: isLoadingPurchases } = useQueryGetPurchases({
        ...filters,
        pageNumber: pagination.pageIndex,
        pageSize: pagination.pageSize,
    })

    const { data: suppliers = [], isLoading: isLoadingSuppliers } = useQueryGetAllSuppliers()
    const { mutateAsync: realizarCompra, isPending: isPendingRealizarCompra } = useMutateRealizarCompra()

    const handlePageChange = (page: number) => {
        setPagination((prev) => ({ ...prev, pageIndex: page }))
    }

    const handleFiltersChange = (newFilters: {
        productSearch?: string
        supplierId?: number
        statusCompra?: string
        statusPagamento?: string
    }) => {
        setFilters(newFilters)
        setPagination((prev) => ({ ...prev, pageIndex: 1 }))
    }

    const handleToggleRealizarCompra = useCallback((line: PurchaseLine & { id: number }) => {
        setSelectedLineKeysForRealizarCompra((prev) =>
            prev.includes(line.line_key) ? prev.filter((k) => k !== line.line_key) : [...prev, line.line_key]
        )
    }, [])

    const handleRealizarCompra = useCallback(async () => {
        if (selectedLineKeysForRealizarCompra.length === 0) return
        const purchases = purchasesData?.data ?? []
        const orderIds = purchases
            .filter((p) => selectedLineKeysForRealizarCompra.includes(p.line_key))
            .flatMap((p) => p.order_ids ?? [])
        if (orderIds.length === 0) return
        await realizarCompra(orderIds)
        setSelectedLineKeysForRealizarCompra([])
        toast.success("Compra realizada", { description: "Pedidos atualizados para Compra Realizada e enviados para conferência." })
    }, [selectedLineKeysForRealizarCompra, purchasesData?.data, realizarCompra])

    return {
        purchases: purchasesData?.data ?? [],
        suppliers,
        isLoading: isLoadingPurchases || isLoadingSuppliers,
        pagination: {
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize,
            totalPages: purchasesData?.totalPages ?? 0,
            totalCount: purchasesData?.totalCount ?? 0,
        },
        handlePageChange,
        handleFiltersChange,
        selectedLineKeysForRealizarCompra,
        handleToggleRealizarCompra,
        handleRealizarCompra,
        isPendingRealizarCompra,
    }
}
