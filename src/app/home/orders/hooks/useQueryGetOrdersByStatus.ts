import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface PaginationInterface {
    pageNumber: number;
    pageSize: number;
}

async function getOrdersByStatus(status: number, pageNumber: number, pageSize: number) {
    const response = await api.get(`/orders/${status}?pageNumber=${pageNumber}&pageSize=${pageSize}`)

    if (!response.data.flag) {
        toast.error("Erro ao buscar pedidos", {
            description: response.data.message,
            duration: 5000,
            closeButton: true
        })
        return {
            data: [],
            totalCount: 0,
            pageNumber: 1,
            pageSize: 10,
            totalPages: 0
        }
    }

    return {
        data: response.data.data || [],
        totalCount: response.data.totalCount || 0,
        pageNumber: response.data.pageNumber || pageNumber,
        pageSize: response.data.pageSize || pageSize,
        totalPages: response.data.totalPages || 0
    }
}

export default function useQueryGetOrdersByStatus(status: number, { pageNumber, pageSize }: PaginationInterface) {
    return useQuery({
        queryKey: ["getOrdersByStatus", status, pageNumber, pageSize],
        queryFn: () => getOrdersByStatus(status, pageNumber, pageSize),
        enabled: !!status
    })
}