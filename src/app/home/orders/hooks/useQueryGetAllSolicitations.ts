import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface PaginationInterface {
    pageNumber: number;
    pageSize: number;
}

async function getAllSolicitations(pageNumber: number, pageSize: number) {
    const response = await api.get(
        `/solicitations/solicitation-with-orders?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );

    if (!response.data.flag) {
        toast.error("Erro ao buscar solicitações", {
            description: response.data.message,
            duration: 5000,
            closeButton: true,
        });
        return [];
    }

    return response.data.data;
}

export default function useQueryGetAllSolicitations({ pageNumber, pageSize }: PaginationInterface) {
    return useQuery({
        queryKey: ["getAllSolicitations", pageNumber, pageSize],
        queryFn: () => getAllSolicitations(pageNumber, pageSize),
    });
}
