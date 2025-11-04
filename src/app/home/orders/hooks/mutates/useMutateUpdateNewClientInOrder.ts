import { ToastMessages } from "@/constants/toast-message";
import api from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface iProps {
    dto: {
        order_id: number
        client: string
        sale_price: number
        total_price: number
    }
}

async function UpdateNewClientInOrder({ dto }: iProps) {
    const response = await api.patch(`/orders/new-client-order`, dto);

    if (!response.data.flag) {
        toast.error(response.data.message)
    }

    return response.data.data
}

export default function useMutationUpdateNewClientInOrder() {
    return useMutation({
        mutationFn: ({ dto }: iProps) => UpdateNewClientInOrder({ dto }),
        mutationKey: ["UpdateNewClientInOrder"],
        onSuccess: () => {
            toast.success(ToastMessages.updateSuccess)
        }
    })
}