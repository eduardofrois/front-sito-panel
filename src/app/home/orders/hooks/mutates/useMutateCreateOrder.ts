import api from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { CreateOrderSchema } from "../../order.interface";

async function CreateOrder(data: CreateOrderSchema[]) {
    const response = await api.post("/orders", data);

    if (!response.data.flag) {
        toast.error("Erro ao salvar pedidos no banco")
    }

    return response.data.data
}

export default function useMutationCreateOrder() {
    return useMutation({
        mutationFn: (data: CreateOrderSchema[]) => CreateOrder(data),
        mutationKey: ["CreateOrder"],
        onSuccess: () => {
            toast.success("Sucesso a cadastrar pedidos")
        }
    })
}