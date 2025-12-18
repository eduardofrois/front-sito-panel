import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export interface Supplier {
    id: number;
    name: string;
}

async function getAllSuppliers(): Promise<Supplier[]> {
    try {
        const response = await api.get("/suppliers");

        if (!response.data.flag) {
            return [];
        }

        return response.data.data || [];
    } catch {
        return [];
    }
}

export default function useQueryGetAllSuppliers() {
    return useQuery({
        queryKey: ["getAllSuppliers"],
        queryFn: getAllSuppliers
    });
}
