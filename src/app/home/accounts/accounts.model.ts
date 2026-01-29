import { Status } from "@/constants/order-status"
import { useQueryClient } from "@tanstack/react-query"
import { useCallback, useState } from "react"
import useQueryGetPendingPaid from "../orders/hooks/mutates/useMutateGetOrdersPaidPending"
import useMutationUpdateStatusOrder from "../orders/hooks/mutates/useMutateUpdateStatusOrder"
import useQueryGetAllClients from "../orders/hooks/useQueryGetAllClients"
import useQueryGetAllSuppliers from "../orders/hooks/useQueryGetAllSuppliers"
import useQueryGetOrdersWithFilters, { type OrderFilters } from "../orders/hooks/useQueryGetOrdersWithFilters"

export const useAccountsModel = () => {
    // Pagination state for "Contas a Pagar" tab
    const [paginationPay, setPaginationPay] = useState({
        pageIndex: 1,
        pageSize: 10,
    });

    // Pagination state for "Contas a Receber" tab  
    const [paginationReceive, setPaginationReceive] = useState({
        pageIndex: 1,
        pageSize: 10,
    });

    // Pagination state for "Pronta Entrega - Recebimento" tab
    const [paginationRecebimento, setPaginationRecebimento] = useState({
        pageIndex: 1,
        pageSize: 10,
    });

    // Pagination state for "Pronta Entrega - Entregas" tab
    const [paginationEntregas, setPaginationEntregas] = useState({
        pageIndex: 1,
        pageSize: 10,
    });

    // Filters state for "Contas a Pagar" tab
    const [filtersPay, setFiltersPay] = useState<OrderFilters>({
        statuses: [Status.PendingPurchase, Status.ConfirmSale], // Default: Compra Pendente and Compra Realizada
    });

    // Filters state for "Contas a Receber" tab
    const [filtersReceive, setFiltersReceive] = useState<{
        dateStart?: string
        dateEnd?: string
        clientId?: number
        supplierId?: number
    }>({});

    // Filters state for "Pronta Entrega - Recebimento" tab
    const [filtersRecebimento, setFiltersRecebimento] = useState<OrderFilters>({
        statuses: [Status.ConfirmSale], // Only ConfirmSale (COMPRA REALIZADA)
    });

    // Filters state for "Pronta Entrega - Entregas" tab
    const [filtersEntregas, setFiltersEntregas] = useState<OrderFilters>({
        statuses: [Status.ReadyForDelivery, Status.DeliveredToClient], // Only PRONTA ENTREGA and ENTREGUE
    });

    // Fetch clients and suppliers
    const { data: clients = [], isLoading: isLoadingClients } = useQueryGetAllClients()
    const { data: suppliers = [], isLoading: isLoadingSuppliers } = useQueryGetAllSuppliers()

    // Fetch orders for "Contas a Pagar" with filters
    const { data: ordersPayData, isLoading: isLoadingOrdersPay, refetch: refetchOrdersPay } = useQueryGetOrdersWithFilters({
        ...filtersPay,
        pageNumber: paginationPay.pageIndex,
        pageSize: paginationPay.pageSize,
    });

    // Fetch orders for "Contas a Receber" (pending payment)
    const { data: ordersReceive, isLoading: isLoadingReceive } = useQueryGetPendingPaid({
        pageNumber: paginationReceive.pageIndex,
        pageSize: paginationReceive.pageSize,
        ...filtersReceive,
    });

    // Fetch orders for "Pronta Entrega - Recebimento" (ConfirmSale status only)
    const { data: ordersRecebimentoData, isLoading: isLoadingRecebimento, refetch: refetchRecebimento } = useQueryGetOrdersWithFilters({
        ...filtersRecebimento,
        pageNumber: paginationRecebimento.pageIndex,
        pageSize: paginationRecebimento.pageSize,
    });

    // Fetch orders for "Pronta Entrega - Entregas" (Checked, ReadyForDelivery, DeliveredToClient)
    const { data: ordersEntregasData, isLoading: isLoadingEntregas, refetch: refetchEntregas } = useQueryGetOrdersWithFilters({
        ...filtersEntregas,
        pageNumber: paginationEntregas.pageIndex,
        pageSize: paginationEntregas.pageSize,
    });

    // Status update mutation
    const { mutateAsync: updateStatus, isPending: isUpdatingStatus } = useMutationUpdateStatusOrder();
    const queryClient = useQueryClient();

    // Handle filter changes for "Contas a Pagar"
    const handleFiltersChange = useCallback((newFilters: {
        dateStart?: string
        dateEnd?: string
        statuses?: number[]
        clientId?: number
        supplierId?: number
    }) => {
        const filters: OrderFilters = { ...newFilters };

        // If no status filter is provided, use default statuses
        if (!filters.statuses || filters.statuses.length === 0) {
            filters.statuses = [Status.PendingPurchase, Status.ConfirmSale];
        }

        setFiltersPay(filters);
        // Reset to first page when filters change
        setPaginationPay(prev => ({ ...prev, pageIndex: 1 }));
    }, []);

    // Handle status update
    const handleUpdateStatus = useCallback(async (orderIds: number[], newStatus: number) => {
        await updateStatus({ orders: orderIds, value: newStatus });

        // Invalidate queries to refresh data
        await queryClient.invalidateQueries({ queryKey: ["getOrdersWithFilters"] });
        await queryClient.invalidateQueries({ queryKey: ["getPendingPaidOrders"] });
        await refetchOrdersPay();
        await refetchRecebimento();
        await refetchEntregas();
    }, [updateStatus, queryClient, refetchOrdersPay, refetchRecebimento, refetchEntregas]);

    // Handle page change for "Contas a Pagar"
    const handlePageChangePay = useCallback((page: number) => {
        setPaginationPay(prev => ({ ...prev, pageIndex: page }));
    }, []);

    // Handle page change for "Contas a Receber"
    const handlePageChangeReceive = useCallback((page: number) => {
        setPaginationReceive(prev => ({ ...prev, pageIndex: page }));
    }, []);

    // Handle page change for "Pronta Entrega - Recebimento"
    const handlePageChangeRecebimento = useCallback((page: number) => {
        setPaginationRecebimento(prev => ({ ...prev, pageIndex: page }));
    }, []);

    // Handle page change for "Pronta Entrega - Entregas"
    const handlePageChangeEntregas = useCallback((page: number) => {
        setPaginationEntregas(prev => ({ ...prev, pageIndex: page }));
    }, []);

    // Handle filter changes for "Contas a Receber"
    const handleFiltersChangeReceive = useCallback((newFilters: {
        dateStart?: string
        dateEnd?: string
        clientId?: number
        supplierId?: number
    }) => {
        setFiltersReceive(newFilters);
        // Reset to first page when filters change
        setPaginationReceive(prev => ({ ...prev, pageIndex: 1 }));
    }, []);

    // Handle filter changes for "Pronta Entrega - Recebimento"
    const handleFiltersChangeRecebimento = useCallback((newFilters: {
        clientId?: number
        supplierId?: number
    }) => {
        setFiltersRecebimento({
            ...newFilters,
            statuses: [Status.ConfirmSale], // Always filter by ConfirmSale
        });
        // Reset to first page when filters change
        setPaginationRecebimento(prev => ({ ...prev, pageIndex: 1 }));
    }, []);

    // Handle filter changes for "Pronta Entrega - Entregas"
    const handleFiltersChangeEntregas = useCallback((newFilters: {
        clientId?: number
        supplierId?: number
    }) => {
        setFiltersEntregas({
            ...newFilters,
            statuses: [Status.ReadyForDelivery, Status.DeliveredToClient], // Only PRONTA ENTREGA and ENTREGUE
        });
        // Reset to first page when filters change
        setPaginationEntregas(prev => ({ ...prev, pageIndex: 1 }));
    }, []);

    return {
        // Data for "Contas a Pagar"
        ordersPay: ordersPayData?.data || [],
        isLoadingOrdersPay,
        paginationPay: {
            pageIndex: paginationPay.pageIndex,
            pageSize: paginationPay.pageSize,
            totalPages: ordersPayData?.totalPages,
            totalCount: ordersPayData?.totalCount,
        },
        handlePageChangePay,
        handleFiltersChange,
        handleUpdateStatus,
        isUpdatingStatus,

        // Data for "Contas a Receber"
        ordersReceive: Array.isArray(ordersReceive) ? ordersReceive : (ordersReceive?.data || []),
        isLoadingReceive,
        paginationReceive: {
            pageIndex: paginationReceive.pageIndex,
            pageSize: paginationReceive.pageSize,
            totalPages: Array.isArray(ordersReceive) ? undefined : ordersReceive?.totalPages,
        },
        setPaginationReceive,
        handlePageChangeReceive,
        handleFiltersChangeReceive,

        // Data for "Pronta Entrega - Recebimento"
        ordersRecebimento: ordersRecebimentoData?.data || [],
        isLoadingRecebimento,
        paginationRecebimento: {
            pageIndex: paginationRecebimento.pageIndex,
            pageSize: paginationRecebimento.pageSize,
            totalPages: ordersRecebimentoData?.totalPages,
            totalCount: ordersRecebimentoData?.totalCount,
        },
        handlePageChangeRecebimento,
        handleFiltersChangeRecebimento,

        // Data for "Pronta Entrega - Entregas"
        ordersEntregas: ordersEntregasData?.data || [],
        isLoadingEntregas,
        paginationEntregas: {
            pageIndex: paginationEntregas.pageIndex,
            pageSize: paginationEntregas.pageSize,
            totalPages: ordersEntregasData?.totalPages,
            totalCount: ordersEntregasData?.totalCount,
        },
        handlePageChangeEntregas,
        handleFiltersChangeEntregas,

        // Common data
        clients,
        suppliers,
        isLoadingClients,
        isLoadingSuppliers,
    }
}