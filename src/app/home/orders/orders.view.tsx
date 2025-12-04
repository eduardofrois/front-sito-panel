"use client"

import { ShoppingView } from "../../../components/order/shopping.view"
import type { useOrdersModel } from "./orders.model"

type OrdersViewProps = ReturnType<typeof useOrdersModel>

export const OrdersView = (props: OrdersViewProps) => {
  const {
    data,
    isLoading,
    confirmedOrder,
    setConfirmedOrder,
    onUpdate,
    isLoadingSolicitations, solicitations,
    pagination, setPagination
  } = props

  return (
    <div>
      <ShoppingView
        data={data?.data || data || []}
        solicitations={solicitations}
        isLoading={isLoading}
        isLoadingSolicitations={isLoadingSolicitations}
        confirmedOrder={confirmedOrder}
        setConfirmedOrder={setConfirmedOrder}
        onUpdate={onUpdate}
        pagination={pagination}
        setPagination={setPagination}
      />
    </div>
  )
}
