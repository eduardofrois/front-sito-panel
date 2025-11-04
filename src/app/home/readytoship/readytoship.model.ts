import { Status } from "@/constants/order-status"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import z from "zod"
import useMutationUpdateNewClientInOrder from "../orders/hooks/mutates/useMutateUpdateNewClientInOrder"
import useQueryGetOrdersByStatus from "../orders/hooks/useQueryGetOrdersByStatus"
import { formSchema } from "./readytoship.interface"

export const useReadyToShipModel = () => {
    const { data, isLoading } = useQueryGetOrdersByStatus(Status.ReadyForDelivery)
    const { mutateAsync, isPending } = useMutationUpdateNewClientInOrder()

    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            client: "",
            sale_price: 0
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>, order_id: number, totalValue: number) {
        const dto = {
            order_id: order_id,
            client: values.client,
            sale_price: values.sale_price,
            total_price: totalValue
        }
        mutateAsync({ dto });
        await queryClient.invalidateQueries({
            queryKey: ["getOrdersByStatus"],
            exact: true,
        })
    }

    return {
        data, isLoading,
        form,
        onSubmit,
    }
}