import api from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreateClientPayload {
    name: string;
}

interface CreateClientResponse {
    id: number;
    name: string;
}

async function createClient(payload: CreateClientPayload): Promise<CreateClientResponse | null> {
    try {
        const response = await api.post("/general/clients", payload);

        if (!response.data.flag) {
            toast.error("Erro ao criar cliente", {
                description: response.data.message,
                duration: 3000,
                closeButton: true
            });
            return null;
        }

        return response.data.data;
    } catch {
        toast.error("Erro ao criar cliente", {
            description: "Erro inesperado",
            duration: 3000,
            closeButton: true
        });
        return null;
    }
}

export default function useMutateCreateClient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createClient,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getAllClients"] });
        }
    });
}
