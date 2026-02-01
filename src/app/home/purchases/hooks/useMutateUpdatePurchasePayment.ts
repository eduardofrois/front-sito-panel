import api from "@/services/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { UpdatePurchasePaymentDto } from "../purchases.interface"

async function updatePurchasePayment(dto: UpdatePurchasePaymentDto) {
    const response = await api.patch("/purchases/update-payment", dto)

    if (!response.data.flag) {
        toast.error(response.data.message || "Erro ao atualizar pagamento")
        throw new Error(response.data.message)
    }

    return response.data
}

export default function useMutateUpdatePurchasePayment() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (dto: UpdatePurchasePaymentDto) => updatePurchasePayment(dto),
        mutationKey: ["updatePurchasePayment"],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getPurchases"] })
        },
    })
}
