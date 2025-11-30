import { ToastMessages } from "@/constants/toast-message";
import api from "@/services/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface PaginationInterface {
    pageNumber: number;
    pageSize: number;
}

async function getPendingPaid(pageNumber: number, pageSize: number) {
    const response = await api.get(`/orders/pending?pageNumber=${pageNumber}&pageSize=${pageSize}`);

    if (!response.data.flag) {
        toast.error(response.data.message)
    }

    return response.data.data
}

export default function useQueryGetPendingPaid({ pageNumber, pageSize }: PaginationInterface) {
     return useQuery({
            queryKey: ["getPendingPaidOrders", pageNumber, pageSize],
            queryFn: () => getPendingPaid(pageNumber, pageSize)
        })
}