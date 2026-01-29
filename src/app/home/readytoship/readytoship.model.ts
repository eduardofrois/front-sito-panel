"use client"

import { Status } from "@/constants/order-status"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import useQueryGetClients from "../accounts/hooks/useQueryGetClients"
import useMutationUpdateStatusOrder from "../orders/hooks/mutates/useMutateUpdateStatusOrder"
import useQueryGetAllSuppliers from "../orders/hooks/useQueryGetAllSuppliers"
import useQueryGetOrdersWithFilters from "../orders/hooks/useQueryGetOrdersWithFilters"

export const useReadyToShipModel = () => {
    // Pagination for Aba 1 (Recebimento)
    const [paginationRecebimento, setPaginationRecebimento] = useState({
        pageIndex: 1,
        pageSize: 10,
    })

    // Pagination for Aba 2 (Entregas)
    const [paginationEntregas, setPaginationEntregas] = useState({
        pageIndex: 1,
        pageSize: 10,
    })

    // Filters for Aba 1 (Recebimento)
    const [filtersRecebimento, setFiltersRecebimento] = useState<{
        clientId?: number
        supplierId?: number
    }>({})

    // Filters for Aba 2 (Entregas)
    const [filtersEntregas, setFiltersEntregas] = useState<{
        clientId?: number
        supplierId?: number
    }>({})

    // Selection state for both tabs
    const [selectedRecebimento, setSelectedRecebimento] = useState<number[]>([])
    const [selectedEntregas, setSelectedEntregas] = useState<{
        orderId: number
        action: 'entregar' | 'pronta_entrega'
    }[]>([])

    // Query for Aba 1: Orders with status COMPRA REALIZADA (ConfirmSale = 4)
    const { data: dataRecebimento, isLoading: isLoadingRecebimento } = useQueryGetOrdersWithFilters({
        pageNumber: paginationRecebimento.pageIndex,
        pageSize: paginationRecebimento.pageSize,
        statuses: [Status.ConfirmSale],
        clientId: filtersRecebimento.clientId,
        supplierId: filtersRecebimento.supplierId,
    })

    // Query for Aba 2: Orders with status CONFERIDO, PRONTA ENTREGA, ENTREGUE
    const { data: dataEntregas, isLoading: isLoadingEntregas } = useQueryGetOrdersWithFilters({
        pageNumber: paginationEntregas.pageIndex,
        pageSize: paginationEntregas.pageSize,
        statuses: [Status.Checked, Status.ReadyForDelivery, Status.DeliveredToClient],
        clientId: filtersEntregas.clientId,
        supplierId: filtersEntregas.supplierId,
    })

    // Get clients and suppliers for filters
    const { data: clients } = useQueryGetClients()
    const { data: suppliers } = useQueryGetAllSuppliers()

    // Mutation for status update
    const { mutateAsync: updateStatus, isPending: isUpdatingStatus } = useMutationUpdateStatusOrder()
    const queryClient = useQueryClient()

    // Handle filter changes for Aba 1
    const handleFiltersChangeRecebimento = (filters: { clientId?: number; supplierId?: number }) => {
        setFiltersRecebimento(filters)
        setPaginationRecebimento(prev => ({ ...prev, pageIndex: 1 }))
    }

    // Handle filter changes for Aba 2
    const handleFiltersChangeEntregas = (filters: { clientId?: number; supplierId?: number }) => {
        setFiltersEntregas(filters)
        setPaginationEntregas(prev => ({ ...prev, pageIndex: 1 }))
    }

    // Handle page change for Aba 1
    const handlePageChangeRecebimento = (page: number) => {
        setPaginationRecebimento(prev => ({ ...prev, pageIndex: page }))
    }

    // Handle page change for Aba 2
    const handlePageChangeEntregas = (page: number) => {
        setPaginationEntregas(prev => ({ ...prev, pageIndex: page }))
    }

    // Confirm conferência (Aba 1) - Change status from ConfirmSale to Checked
    const handleConfirmRecebimento = async () => {
        if (selectedRecebimento.length === 0) return

        try {
            // Use the correct API format: orders array + value (status number)
            await updateStatus({
                orders: selectedRecebimento,
                value: Status.Checked
            })

            setSelectedRecebimento([])

            await queryClient.invalidateQueries({
                queryKey: ["getOrdersWithFilters"],
            })
        } catch (error) {
            console.error("Erro ao confirmar recebimento:", error)
            throw error
        }
    }

    // Confirm entregas (Aba 2) - Change status based on selected action
    const handleConfirmEntregas = async () => {
        if (selectedEntregas.length === 0) return

        try {
            // Group by action to make fewer API calls
            const entregasOrders = selectedEntregas
                .filter(s => s.action === 'entregar')
                .map(s => s.orderId)

            const prontaEntregaOrders = selectedEntregas
                .filter(s => s.action === 'pronta_entrega')
                .map(s => s.orderId)

            // Update orders marked as "Entregar"
            if (entregasOrders.length > 0) {
                await updateStatus({
                    orders: entregasOrders,
                    value: Status.DeliveredToClient
                })
            }

            // Update orders marked as "Pronta Entrega"
            if (prontaEntregaOrders.length > 0) {
                await updateStatus({
                    orders: prontaEntregaOrders,
                    value: Status.ReadyForDelivery
                })
            }

            setSelectedEntregas([])

            await queryClient.invalidateQueries({
                queryKey: ["getOrdersWithFilters"],
            })
        } catch (error) {
            console.error("Erro ao confirmar entregas:", error)
            throw error
        }
    }

    // Toggle selection for entregas (radio-like behavior per row)
    const toggleEntregaSelection = (orderId: number, action: 'entregar' | 'pronta_entrega') => {
        setSelectedEntregas(prev => {
            const existingIndex = prev.findIndex(item => item.orderId === orderId)

            if (existingIndex !== -1) {
                // If same action, remove selection
                if (prev[existingIndex].action === action) {
                    return prev.filter(item => item.orderId !== orderId)
                }
                // If different action, update it
                return prev.map(item =>
                    item.orderId === orderId ? { ...item, action } : item
                )
            }

            // Add new selection
            return [...prev, { orderId, action }]
        })
    }

    // Get selected action for a specific order in entregas
    const getEntregaAction = (orderId: number): 'entregar' | 'pronta_entrega' | null => {
        const item = selectedEntregas.find(s => s.orderId === orderId)
        return item?.action || null
    }

    // Parse response data
    const ordersRecebimento = Array.isArray(dataRecebimento)
        ? dataRecebimento
        : (dataRecebimento?.data || [])

    const ordersEntregas = Array.isArray(dataEntregas)
        ? dataEntregas
        : (dataEntregas?.data || [])

    return {
        // Aba 1: Recebimento
        ordersRecebimento,
        isLoadingRecebimento,
        paginationRecebimento: {
            ...paginationRecebimento,
            totalPages: Array.isArray(dataRecebimento) ? 1 : (dataRecebimento?.totalPages || 1),
            totalCount: Array.isArray(dataRecebimento) ? dataRecebimento.length : (dataRecebimento?.totalCount || 0),
        },
        handlePageChangeRecebimento,
        handleFiltersChangeRecebimento,
        selectedRecebimento,
        setSelectedRecebimento,
        handleConfirmRecebimento,

        // Aba 2: Entregas
        ordersEntregas,
        isLoadingEntregas,
        paginationEntregas: {
            ...paginationEntregas,
            totalPages: Array.isArray(dataEntregas) ? 1 : (dataEntregas?.totalPages || 1),
            totalCount: Array.isArray(dataEntregas) ? dataEntregas.length : (dataEntregas?.totalCount || 0),
        },
        handlePageChangeEntregas,
        handleFiltersChangeEntregas,
        selectedEntregas,
        toggleEntregaSelection,
        getEntregaAction,
        handleConfirmEntregas,

        // Common
        clients: clients || [],
        suppliers: suppliers || [],
        isUpdatingStatus,
    }
}