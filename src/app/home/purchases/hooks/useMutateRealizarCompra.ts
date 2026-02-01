import api from "@/services/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

async function realizarCompra(orderIds: number[]) {
    const response = await api.patch("/orders/realizar-compra", orderIds)

    if (!response.data.flag) {
        toast.error(response.data.message || "Erro ao realizar compra")
        throw new Error(response.data.message)
    }

    return response.data
}

export default function useMutateRealizarCompra() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (orderIds: number[]) => realizarCompra(orderIds),
        mutationKey: ["realizarCompra"],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getPurchases"] })
            queryClient.invalidateQueries({ queryKey: ["getOrdersWithFilters"] })
        },
    })
}
