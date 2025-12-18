"use client"

import { Status } from "@/constants/order-status"
import { useState } from "react"
import useQueryGetAllClients from "./hooks/useQueryGetAllClients"
import useQueryGetAllSuppliers from "./hooks/useQueryGetAllSuppliers"
import useQueryGetOrdersWithFilters, { type OrderFilters } from "./hooks/useQueryGetOrdersWithFilters"

// Status padrão para o módulo de vendas: Compra Pendente, Pronta Entrega, Compra Realizada
const DEFAULT_SALES_STATUSES = [Status.PendingPurchase, Status.ReadyForDelivery, Status.ConfirmSale]

export const useOrdersModel = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 20,
  })

  const [filters, setFilters] = useState<OrderFilters>({
    statuses: DEFAULT_SALES_STATUSES  // Filtro padrão
  })

  // Fetch orders with filters
  const { data: ordersData, isLoading: isLoadingOrders } = useQueryGetOrdersWithFilters({
    ...filters,
    statuses: filters.statuses ?? DEFAULT_SALES_STATUSES, // Garante que sempre tenha os status padrão
    pageNumber: pagination.pageIndex,
    pageSize: pagination.pageSize,
  })

  // Fetch clients and suppliers for filters
  const { data: clients = [], isLoading: isLoadingClients } = useQueryGetAllClients()
  const { data: suppliers = [], isLoading: isLoadingSuppliers } = useQueryGetAllSuppliers()

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, pageIndex: page }))
  }

  const handleFiltersChange = (newFilters: {
    dateStart?: string
    dateEnd?: string
    statuses?: number[]
    clientId?: number
    supplierId?: number
  }) => {
    setFilters(newFilters)
    setPagination(prev => ({ ...prev, pageIndex: 1 })) // Reset to first page on filter change
  }

  return {
    orders: ordersData?.data || [],
    clients,
    suppliers,
    isLoading: isLoadingOrders || isLoadingClients || isLoadingSuppliers,
    pagination: {
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      totalPages: ordersData?.totalPages || 0,
      totalCount: ordersData?.totalCount || 0,
    },
    handlePageChange,
    handleFiltersChange,
  }
}
