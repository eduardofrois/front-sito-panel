"use client"

import { OrdersPageView } from "@/components/order/orders-page-view"
import type { useOrdersModel } from "./orders.model"

type OrdersViewProps = ReturnType<typeof useOrdersModel>

export const OrdersView = (props: OrdersViewProps) => {
  const {
    orders,
    clients,
    suppliers,
    isLoading,
    pagination,
    handlePageChange,
    handleFiltersChange,
  } = props

  return (
    <div>
      <OrdersPageView
        orders={orders}
        clients={clients}
        suppliers={suppliers}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onFiltersChange={handleFiltersChange}
      />
    </div>
  )
}
