import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Order } from "../order.interface";

export interface OrderFilters {
    dateStart?: string;
    dateEnd?: string;
    statuses?: number[];
    clientId?: number;
    supplierId?: number;
    pageNumber?: number;
    pageSize?: number;
}

interface PaginatedOrdersResponse {
    data: Order[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}

async function getOrdersWithFilters(filters: OrderFilters): Promise<PaginatedOrdersResponse> {
    try {
        const params = new URLSearchParams();

        if (filters.dateStart) params.append('dateStart', filters.dateStart);
        if (filters.dateEnd) params.append('dateEnd', filters.dateEnd);
        if (filters.statuses && filters.statuses.length > 0) {
            filters.statuses.forEach(s => params.append('statuses', s.toString()));
        }
        if (filters.clientId) params.append('clientId', filters.clientId.toString());
        if (filters.supplierId) params.append('supplierId', filters.supplierId.toString());
        params.append('pageNumber', (filters.pageNumber ?? 1).toString());
        params.append('pageSize', (filters.pageSize ?? 10).toString());

        const response = await api.get(`/orders/filter?${params.toString()}`);

        if (!response.data.flag) {
            return {
                data: [],
                totalCount: 0,
                pageNumber: filters.pageNumber ?? 1,
                pageSize: filters.pageSize ?? 10,
                totalPages: 0
            };
        }

        return {
            data: response.data.data || [],
            totalCount: response.data.totalCount || 0,
            pageNumber: response.data.pageNumber || filters.pageNumber || 1,
            pageSize: response.data.pageSize || filters.pageSize || 10,
            totalPages: response.data.totalPages || 0
        };
    } catch {
        toast.error("Erro ao buscar pedidos", {
            duration: 3000,
            closeButton: true
        });
        return {
            data: [],
            totalCount: 0,
            pageNumber: filters.pageNumber ?? 1,
            pageSize: filters.pageSize ?? 10,
            totalPages: 0
        };
    }
}

export default function useQueryGetOrdersWithFilters(filters: OrderFilters) {
    return useQuery({
        queryKey: ["getOrdersWithFilters", filters],
        queryFn: () => getOrdersWithFilters(filters)
    });
}
