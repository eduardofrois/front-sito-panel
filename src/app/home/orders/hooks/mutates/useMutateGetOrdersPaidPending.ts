import { ToastMessages } from "@/constants/toast-message";
import api from "@/services/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

async function getPendingPaid() {
    const response = await api.get("/orders/pending");

    if (!response.data.flag) {
        toast.error(response.data.message)
    }

    return response.data.data
}

export default function useQueryGetPendingPaid() {
     return useQuery({
            queryKey: ["getAllOrders"],
            queryFn: getPendingPaid
        })
}