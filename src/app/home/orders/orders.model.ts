"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import type z from "zod"
import useMutationAddOrderAndSolicitation from "./hooks/mutates/useMutateAddOrderAndSolicitation"
import useMutationCreateOrder from "./hooks/mutates/useMutateCreateOrder"
import useMutationUpdateStatusOrder from "./hooks/mutates/useMutateUpdateStatusOrder"
import useQueryGetAllOrders from "./hooks/useQueryGetAllOrders"
import useQueryGetAllSolicitations from "./hooks/useQueryGetAllSolicitations"
import { type CreateOrderSchema, orderSchema } from "./order.interface"

export const useOrdersModel = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const { data, isLoading } = useQueryGetAllOrders()
  const { data: solicitations, isLoading: isLoadingSolicitations, refetch: refetchSolicitation } = useQueryGetAllSolicitations({ pageNumber: pagination.pageIndex, pageSize: pagination.pageSize });
  const { mutateAsync, isPending } = useMutationCreateOrder()
  const { mutateAsync: updateStautsOrderAync, isPending: isPendingUpdateStatusOrder } = useMutationUpdateStatusOrder()
  const { mutateAsync: addOrderAndSolicitation, isPending: isPendingAddOrderAndSolicitation } = useMutationAddOrderAndSolicitation();

  const [valuesForm, setValuesForm] = useState<CreateOrderSchema[]>([])
  const [confirmedOrder, setConfirmedOrder] = useState<number[]>([])

  const [showAllSensitiveInfo, setShowAllSensitiveInfo] = useState(false)
  const [fieldVisibility, setFieldVisibility] = useState<Record<string, Record<string, boolean>>>({})

  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      client: "",
      brand: "",
      code: "",
      description: "",
      size: "",
      amount: 0,
      cost_price: 0,
      sale_price: 0,
      total_price: 0,
    },
  })

  async function onSubmit() {
    await mutateAsync(valuesForm)
    form.reset()
    setValuesForm([])
    queryClient.invalidateQueries({
      queryKey: ["getAllOrders"],
      exact: true,
    })
  }

  async function onUpdate(orders: number[], value: number) {
    await updateStautsOrderAync({ orders: orders, value: value })
    setConfirmedOrder([])
    queryClient.invalidateQueries({
      queryKey: ["getAllSolicitations"],
      exact: false,
    })
  }

  function addToList() {
    const data = form.getValues()
    setValuesForm((prev) => [...prev, data])
    form.reset()
  }

  const toggleFieldVisibility = (orderId: number, fieldName: string) => {
    setFieldVisibility((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [fieldName]: !prev[orderId]?.[fieldName],
      },
    }))
  }

  const isFieldVisible = (orderId: number, fieldName: string) => {
    return fieldVisibility[orderId]?.[fieldName] || false
  }

  const shouldShowField = (orderId: number, fieldName: string) => {
    return showAllSensitiveInfo || isFieldVisible(orderId, fieldName)
  }

  form.setValue("total_price", (form.watch("sale_price") ?? 0) * (form.watch("amount") ?? 1))

  useEffect(() => {
    refetchSolicitation()
  }, [setPagination])

  return {
    form,
    onSubmit,
    mutateAsync,
    isPending,
    valuesForm,
    setValuesForm,
    addToList,
    data,
    isLoading,
    confirmedOrder,
    setConfirmedOrder,
    isPendingUpdateStatusOrder,
    onUpdate,
    showAllSensitiveInfo,
    setShowAllSensitiveInfo,
    toggleFieldVisibility,
    isFieldVisible,
    shouldShowField,
    solicitations, isLoadingSolicitations,
    addOrderAndSolicitation, isPendingAddOrderAndSolicitation,
    pagination, setPagination
  }
}
