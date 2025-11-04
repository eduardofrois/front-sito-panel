import { ToastMessages } from "@/constants/toast-message";
import api from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface iProps {
    orders: number[], value: number
}

async function UpdateStatusOrder({ orders, value }: iProps) {
    const response = await api.put(`/orders?value=${value}`, orders);

    if (!response.data.flag) {
        toast.error(response.data.message)
    }

    return response.data.data
}

export default function useMutationUpdateStatusOrder() {
    return useMutation({
        mutationFn: ({ orders, value }: iProps) => UpdateStatusOrder({ orders: orders, value: value }),
        mutationKey: ["UpdateStatusOrder"],
        onSuccess: () => {
            toast.success(ToastMessages.updateSuccess)
        }
    })
}