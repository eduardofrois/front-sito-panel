import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

async function getAllSolicitations() {
    const response = await api.get("/solicitations/solicitation-with-orders");

    if (!response.data.flag) {
        toast.error("Erro ao buscars solicitações", {
            description: response.data.message,
            duration: 5000,
            closeButton: true
        })
        return []
    }

    return response.data.data;
}

export default function useQueryGetAllSolicitations() {
    return useQuery({
        queryKey: ["getAllSolicitations"],
        queryFn: getAllSolicitations
    })
}