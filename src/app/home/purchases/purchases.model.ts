"use client"

import { useState } from "react"
import useQueryGetAllSuppliers from "../orders/hooks/useQueryGetAllSuppliers"
import useQueryGetPurchases from "./hooks/useQueryGetPurchases"
import type { PurchaseFilters } from "./purchases.interface"

export const usePurchasesModel = () => {
    const [pagination, setPagination] = useState({
        pageIndex: 1,
        pageSize: 20,
    })
    const [filters, setFilters] = useState<PurchaseFilters>({})

    const { data: purchasesData, isLoading: isLoadingPurchases } = useQueryGetPurchases({
        ...filters,
        pageNumber: pagination.pageIndex,
        pageSize: pagination.pageSize,
    })

    const { data: suppliers = [], isLoading: isLoadingSuppliers } = useQueryGetAllSuppliers()

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
    }
}
