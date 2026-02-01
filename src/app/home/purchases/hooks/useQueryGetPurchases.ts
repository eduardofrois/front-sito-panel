import api from "@/services/api"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import type { PurchaseFilters } from "../purchases.interface"
import type { PurchaseLine } from "../purchases.interface"

interface PaginatedPurchasesResponse {
    data: PurchaseLine[]
    totalCount: number
    pageNumber: number
    pageSize: number
    totalPages: number
}

async function getPurchasesWithFilters(
    filters: PurchaseFilters
): Promise<PaginatedPurchasesResponse> {
    try {
        const params = new URLSearchParams()
        if (filters.productSearch) params.append("productSearch", filters.productSearch)
        if (filters.supplierId != null) params.append("supplierId", filters.supplierId.toString())
        if (filters.statusCompra) params.append("statusCompra", filters.statusCompra)
        if (filters.statusPagamento) params.append("statusPagamento", filters.statusPagamento)
        params.append("pageNumber", (filters.pageNumber ?? 1).toString())
        params.append("pageSize", (filters.pageSize ?? 10).toString())

        const response = await api.get(`/purchases/filter?${params.toString()}`)

        if (!response.data.flag) {
            return {
                data: [],
                totalCount: 0,
                pageNumber: filters.pageNumber ?? 1,
                pageSize: filters.pageSize ?? 10,
                totalPages: 0,
            }
        }

        return {
            data: response.data.data || [],
            totalCount: response.data.totalCount || 0,
            pageNumber: response.data.pageNumber || filters.pageNumber || 1,
            pageSize: response.data.pageSize || filters.pageSize || 10,
            totalPages: response.data.totalPages || 0,
        }
    } catch {
        toast.error("Erro ao buscar compras", {
            duration: 3000,
            closeButton: true,
        })
        return {
            data: [],
            totalCount: 0,
            pageNumber: filters.pageNumber ?? 1,
            pageSize: filters.pageSize ?? 10,
            totalPages: 0,
        }
    }
}

export default function useQueryGetPurchases(filters: PurchaseFilters) {
    return useQuery({
        queryKey: ["getPurchases", filters],
        queryFn: () => getPurchasesWithFilters(filters),
    })
}
