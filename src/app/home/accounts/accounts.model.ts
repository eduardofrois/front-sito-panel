import { Status } from "@/constants/order-status"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import useQueryGetPendingPaid from "../orders/hooks/mutates/useMutateGetOrdersPaidPending"
import useMutationUpdateStatusOrder from "../orders/hooks/mutates/useMutateUpdateStatusOrder"
import useQueryGetOrdersByStatus from "../orders/hooks/useQueryGetOrdersByStatus"
import { Order } from "../orders/order.interface"
import useMutateUpdatePaidPrice from "./hooks/useMutateUpdatePaidPrice"
import useQueryGetClients from "./hooks/useQueryGetClients"

export const useAccountsModel = () => {
    const { data, isLoading } = useQueryGetOrdersByStatus(Status.MoreThenOne)
    const { data: clients, isLoading: isLoadingClients } = useQueryGetClients()
    const { data: ordersPending, isLoading: isLoadingPending } = useQueryGetPendingPaid()
    const { mutateAsync } = useMutationUpdateStatusOrder();
    const { mutateAsync: update, isPending } = useMutateUpdatePaidPrice();

    const [selectedOrders, setSelectedOrders] = useState<number[]>([])
    const [firstSelectedOrder, setFirstSelectedOrder] = useState<Order | null>(null)

    const queryClient = useQueryClient();

    function totalValueToPay(codes: number[], data: Order[]) {
        return data
            .filter(order => codes.includes(order.id))
            .reduce((total, order) => total + (order.cost_price ?? 0), 0);
    }

    async function onUpdate(orders: number[], value: number) {
        await mutateAsync({ orders: orders, value: value })
        setSelectedOrders([])
        queryClient.invalidateQueries({
            queryKey: ["getOrdersByStatus"],
            exact: true
        })
    }

    async function updatePaidPrice(dto: { order_id: number, paid_price: number }[]) {
        await update(dto)
        queryClient.invalidateQueries({
            queryKey: ["getAllOrders"],
            exact: true
        })
    }

    const handleCardClick = (isSelected: boolean, order: Order) => {
        setFirstSelectedOrder(order)
        setSelectedOrders((prev: number[]) => {
            if (isSelected) {
                return prev.filter((id) => id !== order.id)
            }

            else {
                if (prev.length === 0)
                    return [...prev, order.id]

                // Se já há cards selecionados, verifica se o status é compatível
                const firstSelectedOrder = data?.find((o: Order) => o.id === prev[0])
                setFirstSelectedOrder(firstSelectedOrder)
                if (firstSelectedOrder && firstSelectedOrder.status === order.status) {
                    return [...prev, order.id]
                }

                return prev
            }
        })
    }

    const canSelectCard = (order: Order): boolean => {
        if (selectedOrders.length === 0) return true

        const firstSelectedOrder = data?.find((o: Order) => o.id === selectedOrders[0])
        return firstSelectedOrder ? firstSelectedOrder.status === order.status : false
    }

    return {
        data, isLoading,
        setSelectedOrders, selectedOrders,
        totalValueToPay,
        onUpdate,
        handleCardClick,
        canSelectCard,
        firstSelectedOrder,
        clients, isLoadingClients,
        ordersPending, isLoadingPending,
        isPending, updatePaidPrice
    }
}