import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export interface Client {
    id: number;
    name: string;
}

async function getAllClients(): Promise<Client[]> {
    try {
        const response = await api.get("/general/clients");

        if (!response.data.flag) {
            return [];
        }

        return response.data.data || [];
    } catch {
        return [];
    }
}

export default function useQueryGetAllClients() {
    return useQuery({
        queryKey: ["getAllClients"],
        queryFn: getAllClients
    });
}
