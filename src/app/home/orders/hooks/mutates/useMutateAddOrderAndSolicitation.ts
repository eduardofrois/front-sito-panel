import api from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { CreateOrderSchema } from "../../order.interface";

interface AddOrderAndSolicitationParams {
    data: CreateOrderSchema[];
    solicitation: number | null;
}

async function AddOrderAndSolicitation({ data, solicitation }: AddOrderAndSolicitationParams) {
    const url = solicitation ? `/solicitations/add-order-and-solicitation?solicitation=${solicitation}` : `/solicitations/add-order-and-solicitation`

    const response = await api.post(url, data);

    if (!response.data.flag) {
        toast.error("Erro ao salvar solicitação no banco");
    }

    return response.data.data;
}

export default function useMutationAddOrderAndSolicitation() {
    return useMutation({
        mutationKey: ["AddOrderAndSolicitation"],
        mutationFn: AddOrderAndSolicitation,
        onSuccess: () => {
            toast.success("Sucesso ao cadastrar pedidos");
        },
    });
}
