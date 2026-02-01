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

    // Filters state for "Contas a Pagar" tab
    const [filtersPay, setFiltersPay] = useState<OrderFilters>({
        statuses: [Status.PendingPurchase, Status.ConfirmSale, Status.PartialPayment],
    });

    // Filters state for "Contas a Receber" tab
    const [filtersReceive, setFiltersReceive] = useState<{
        dateStart?: string
        dateEnd?: string
        clientId?: number
        supplierId?: number
    }>({});

    // Fetch clients and suppliers
    const { data: clients = [], isLoading: isLoadingClients } = useQueryGetAllClients()
    const { data: suppliers = [], isLoading: isLoadingSuppliers } = useQueryGetAllSuppliers()

    // Fetch orders for "Contas a Pagar" with filters
    const { data: ordersPayData, isLoading: isLoadingOrdersPay } = useQueryGetOrdersWithFilters({
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
            filters.statuses = [Status.PendingPurchase, Status.ConfirmSale, Status.PartialPayment];
        }

        setFiltersPay(filters);
        // Reset to first page when filters change
        setPaginationPay(prev => ({ ...prev, pageIndex: 1 }));
    }, []);

    // Handle status update
    const handleUpdateStatus = useCallback(async (orderIds: number[], newStatus: number) => {
        await updateStatus({ orders: orderIds, value: newStatus });
        await queryClient.invalidateQueries({ queryKey: ["getOrdersWithFilters"] });
        await queryClient.invalidateQueries({ queryKey: ["getPendingPaidOrders"] });
    }, [updateStatus, queryClient]);

    // Handle page change for "Contas a Pagar"
    const handlePageChangePay = useCallback((page: number) => {
        setPaginationPay(prev => ({ ...prev, pageIndex: page }));
    }, []);

    // Handle page change for "Contas a Receber"
    const handlePageChangeReceive = useCallback((page: number) => {
        setPaginationReceive(prev => ({ ...prev, pageIndex: page }));
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

        clients,
        suppliers,
        isLoadingClients,
        isLoadingSuppliers,
    }
}