"use client"

import { ShoppingView } from "../../../components/order/shopping.view"
import type { useOrdersModel } from "./orders.model"

type OrdersViewProps = ReturnType<typeof useOrdersModel>

export const OrdersView = (props: OrdersViewProps) => {
  const {
    onSubmit,
    form,
    addToList,
    valuesForm,
    isPending,
    data,
    isLoading,
    confirmedOrder,
    setConfirmedOrder,
    onUpdate,
    showAllSensitiveInfo,
    setShowAllSensitiveInfo,
    toggleFieldVisibility,
    isFieldVisible,
    shouldShowField,
    isLoadingSolicitations, solicitations,
    pagination, setPagination
  } = props

  return (
    <div>
      <ShoppingView
        data={data}
        solicitations={solicitations}
        isLoading={isLoading}
        isLoadingSolicitations={isLoadingSolicitations}
        confirmedOrder={confirmedOrder}
        setConfirmedOrder={setConfirmedOrder}
        onUpdate={onUpdate}
        showAllSensitiveInfo={showAllSensitiveInfo}
        setShowAllSensitiveInfo={setShowAllSensitiveInfo}
        toggleFieldVisibility={toggleFieldVisibility}
        isFieldVisible={isFieldVisible}
        shouldShowField={shouldShowField}
        pagination={pagination}
        setPagination={setPagination}
      />
    </div>
  )
}
