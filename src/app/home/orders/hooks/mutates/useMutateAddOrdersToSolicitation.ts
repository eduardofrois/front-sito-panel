import api from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface AddOrdersToSolicitationParams {
    orders: number[];
    existingSolicitation?: number | null;
}

async function addOrdersToSolicitation({ orders, existingSolicitation }: AddOrdersToSolicitationParams) {
    const response = await api.post("/solicitations/add-in-solicitation", {
        orders,
        existingSolicitation: existingSolicitation ?? null
    });

    if (!response.data.flag) {
        toast.error("Erro ao anexar pedidos à solicitação", {
            description: response.data.message,
            duration: 5000,
            closeButton: true
        });
        throw new Error(response.data.message);
    }

    return response.data.data;
}

export default function useMutationAddOrdersToSolicitation() {
    return useMutation({
        mutationKey: ["AddOrdersToSolicitation"],
        mutationFn: addOrdersToSolicitation,
        onSuccess: () => {
            toast.success("Pedidos anexados com sucesso!");
        },
    });
}

