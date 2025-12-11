import { Status } from "@/constants/order-status"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import useMutationAddOrdersToSolicitation from "../orders/hooks/mutates/useMutateAddOrdersToSolicitation"
import useQueryGetOrdersByStatus from "../orders/hooks/useQueryGetOrdersByStatus"
import useQueryGetAllSolicitations from "../orders/hooks/useQueryGetAllSolicitations"
import useQueryGetClients from "../accounts/hooks/useQueryGetClients"

export const useReadyToShipModel = () => {
    const [pagination, setPagination] = useState({
        pageIndex: 1,
        pageSize: 10,
    });
    
    const [selectedOrders, setSelectedOrders] = useState<number[]>([])

    const { data, isLoading } = useQueryGetOrdersByStatus(Status.ReadyForDelivery, {
        pageNumber: pagination.pageIndex,
        pageSize: pagination.pageSize
    })
    
    const { data: clients, isLoading: isLoadingClients } = useQueryGetClients()
    const { data: solicitations, isLoading: isLoadingSolicitations } = useQueryGetAllSolicitations({
        pageNumber: 1,
        pageSize: 100 // Buscar todas as solicitações para seleção
    })
    
    const { mutateAsync: addOrdersToSolicitation, isPending: isPendingAddOrders } = useMutationAddOrdersToSolicitation()

    const queryClient = useQueryClient();

    async function handleAttachOrders(clientId: number | null, solicitationId: number | null) {
        if (selectedOrders.length === 0) {
            return;
        }

        await addOrdersToSolicitation({
            orders: selectedOrders,
            existingSolicitation: solicitationId
        });

        // Se não há solicitation, criar nova com o cliente
        if (!solicitationId && clientId) {
            // O backend cria automaticamente uma nova solicitation
            // Aqui apenas invalidamos as queries
        }

        setSelectedOrders([])
        
        await queryClient.invalidateQueries({
            queryKey: ["getOrdersByStatus"],
        })
        await queryClient.invalidateQueries({
            queryKey: ["getAllSolicitations"],
        })
    }

    const ordersData = Array.isArray(data) ? data : (data?.data || [])

    return {
        data: ordersData,
        totalPages: Array.isArray(data) ? undefined : data?.totalPages,
        isLoading,
        clients,
        isLoadingClients,
        solicitations: Array.isArray(solicitations) ? solicitations : (solicitations?.data || []),
        isLoadingSolicitations,
        selectedOrders,
        setSelectedOrders,
        handleAttachOrders,
        isPendingAddOrders,
        pagination,
        setPagination,
    }
}