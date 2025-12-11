import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface PaginationInterface {
    pageNumber: number;
    pageSize: number;
}

async function getAllOrders(pageNumber: number, pageSize: number) {
    const response = await api.get(`/orders?pageNumber=${pageNumber}&pageSize=${pageSize}`);

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

export default function useQueryGetAllOrders(pagination?: PaginationInterface) {
    const pageNumber = pagination?.pageNumber ?? 1
    const pageSize = pagination?.pageSize ?? 10

    return useQuery({
        queryKey: ["getAllOrders", pageNumber, pageSize],
        queryFn: () => getAllOrders(pageNumber, pageSize)
    })
}