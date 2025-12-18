import api from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreateSupplierPayload {
    name: string;
}

interface CreateSupplierResponse {
    id: number;
    name: string;
}

async function createSupplier(payload: CreateSupplierPayload): Promise<CreateSupplierResponse | null> {
    try {
        const response = await api.post("/suppliers", payload);

        if (!response.data.flag) {
            toast.error("Erro ao criar fornecedor", {
                description: response.data.message,
                duration: 3000,
                closeButton: true
            });
            return null;
        }

        return response.data.data;
    } catch {
        toast.error("Erro ao criar fornecedor", {
            description: "Erro inesperado",
            duration: 3000,
            closeButton: true
        });
        return null;
    }
}

export default function useMutateCreateSupplier() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createSupplier,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getAllSuppliers"] });
        }
    });
}
