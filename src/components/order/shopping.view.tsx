"use client"

import { Input } from "@/components/ui/input"
import { Info, Search } from "lucide-react"
import type { Dispatch, SetStateAction } from "react"
import { useMemo, useState } from "react"
import type { Order, Solicitation } from "../../app/home/orders/order.interface"
import { IsLoadingCard } from "../global/isloading-card"
import { NotFoundOrder } from "../global/not-found-order"
import { Button } from "../ui/button"
import { Pagination } from "../ui/pagination"
import { AccordionSolicitationCard } from "./accordion-solicitation-card"
import { DialogFormOrder } from "./dialog-form-order"

interface iProps {
  data: Order[]
  solicitations: Solicitation[]
  isLoading: boolean
  isLoadingSolicitations: boolean
  onEditOrder?: (order: Order, index: number) => void
  onDeleteOrder?: (index: number) => void
  confirmedOrder: number[]
  setConfirmedOrder: Dispatch<SetStateAction<number[]>>
  onUpdate: (orders: number[], value: number) => Promise<void>
  pagination: { pageIndex: number; pageSize: number };
  setPagination: Dispatch<SetStateAction<{ pageIndex: number; pageSize: number }>>
}

export const ShoppingView = ({
  data,
  solicitations,
  isLoading,
  confirmedOrder,
  setConfirmedOrder,
  onUpdate,
  isLoadingSolicitations,
  pagination, setPagination
}: iProps) => {
  const [searchTerm, setSearchTerm] = useState("")

  // Normaliza os dados para lidar com formato paginado ou array simples
  const ordersData: Order[] = Array.isArray(data) ? data : ((data as any)?.data || [])
  const solicitationsData: Solicitation[] = Array.isArray(solicitations) ? solicitations : ((solicitations as any)?.data || [])
  const solicitationsTotalPages: number | undefined = Array.isArray(solicitations) ? undefined : (solicitations as any)?.totalPages

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return ordersData

    const searchLower = searchTerm.toLowerCase().trim()

    return data.filter((order) => {
      // Search in basic fields
      const basicFields = [
        order.code,
        order.description,
        order.size,
        order.status,
        order.brand,
        order.status_conference,
        order.client_infos.client_name,
      ].some((field) => field?.toString().toLowerCase().includes(searchLower))

      // Search in numeric fields (converted to string)
      const numericFields = [
        order.id,
        order.amount,
        order.cost_price,
        order.sale_price,
        order.total_price,
        order.tenant_id,
        order.client_infos.client_id,
        order.paid_price,
      ].some((field) => field?.toString().includes(searchLower))

      // Search in date fields
      const dateFields = [
        order.date_creation_order,
        order.date_order,
        order.date_purchase_order,
        order.date_conference,
      ].some((field) => field?.toString().toLowerCase().includes(searchLower))

      return basicFields || numericFields || dateFields
    })
  }, [data, searchTerm])

  if (isLoading || isLoadingSolicitations) return <IsLoadingCard />

  if (ordersData.length === 0) return <NotFoundOrder />

  return (
    <div className="space-y-3 sm:space-y-4 px-2 sm:px-0">
      <div className="bg-white rounded-lg border border-purple-200 p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
        {/* Legenda de Cores dos Status */}
        <div className="mb-4 p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
          <div className="flex items-start gap-2 mb-3">
            <Info className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900">Legenda de Status dos Pedidos</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
            <StatusLegendItem
              bgColor="bg-yellow-50"
              borderColor="border-yellow-200"
              textColor="text-yellow-900"
              accentColor="bg-yellow-400"
              status="Compra Pendente"
              description="Aguardando compra"
            />
            <StatusLegendItem
              bgColor="bg-blue-50"
              borderColor="border-blue-200"
              textColor="text-blue-900"
              accentColor="bg-blue-400"
              status="Compra Realizada"
              description="Produto recebido"
            />
            <StatusLegendItem
              bgColor="bg-pink-50"
              borderColor="border-pink-200"
              textColor="text-pink-900"
              accentColor="bg-pink-400"
              status="Compra Quitada"
              description="Pagamento efetuado"
            />
            <StatusLegendItem
              bgColor="bg-orange-50"
              borderColor="border-orange-200"
              textColor="text-orange-900"
              accentColor="bg-orange-400"
              status="A Conferir"
              description="Aguardando conferência"
            />
            <StatusLegendItem
              bgColor="bg-lime-50"
              borderColor="border-lime-200"
              textColor="text-lime-900"
              accentColor="bg-lime-400"
              status="Conferido"
              description="Pedido conferido"
            />
            <StatusLegendItem
              bgColor="bg-purple-50"
              borderColor="border-purple-200"
              textColor="text-purple-900"
              accentColor="bg-purple-400"
              status="Pronta a Entrega"
              description="Em estoque"
            />
            <StatusLegendItem
              bgColor="bg-indigo-50"
              borderColor="border-indigo-200"
              textColor="text-indigo-900"
              accentColor="bg-indigo-400"
              status="Entregue ao Cliente"
              description="Finalizado"
            />
          </div>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <Input
              type="text"
              placeholder="Filtrar pedidos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 sm:pl-10 w-full h-11 sm:h-12 text-sm sm:text-base"
            />
          </div>
          {searchTerm && (
            <p className="text-xs text-gray-500 mt-2">
              {filteredData.length} de {ordersData.length} pedidos encontrados
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-semibold text-purple-900 truncate">
              Lista de Pedidos ({filteredData.length}
              {searchTerm && ` de ${ordersData.length}`})
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Gerencie seus pedidos de forma detalhada</p>
          </div>

          <div className="text-left sm:text-right flex-shrink-0">
            <p className="text-xs sm:text-sm text-gray-600">Total Geral</p>
            <p className="text-xl sm:text-2xl font-bold text-purple-600 break-words">
              R$ {filteredData.reduce((total, order) => total + order.sale_price * order.amount, 0).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-xs text-gray-500">Total de Itens</p>
            <p className="font-semibold text-gray-900">
              {filteredData.reduce((total: number, order: Order) => total + order.amount, 0)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Custo Total</p>
            <p className="font-semibold text-red-600">
              R$ {filteredData.reduce((total: number, order: Order) => total + order.cost_price * order.amount, 0).toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Receita Total</p>
            <p className="font-semibold text-green-600">
              R$ {filteredData.reduce((total, order) => total + order.sale_price * order.amount, 0).toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Lucro Total</p>
            <p className="font-semibold text-blue-600">
              R$ {filteredData.reduce((total: number, order: Order) => total + (order.sale_price - order.cost_price) * order.amount, 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full px-2 sm:px-0 space-y-2 sm:space-y-3">
        <DialogFormOrder solicitation={null} text="Adicionar solicitação" variant={"outline"} />
        {confirmedOrder.length > 0 && (
          <Button
            variant="outline"
            onClick={() => setConfirmedOrder([])}
            className="w-full min-h-[44px] text-sm sm:text-base py-2.5 sm:py-3 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
          >
            Desmarcar todos ({confirmedOrder.length} selecionado{confirmedOrder.length !== 1 ? "s" : ""})
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:gap-4 px-2 sm:px-0">
        {solicitationsData.map((solicitation: Solicitation, idx: number) => (
          <AccordionSolicitationCard
            type="order"
            key={solicitation.id ?? idx}
            solicitation={solicitation}
            confirmedOrder={confirmedOrder}
            setConfirmedOrder={setConfirmedOrder}
            onUpdate={onUpdate}
          />
        ))}
      </div>

      <Pagination
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        totalPages={solicitationsTotalPages}
        currentDataLength={solicitationsData.length}
        onPageChange={(page) => setPagination(prev => ({ ...prev, pageIndex: page }))}
        disabled={isLoadingSolicitations}
      />


      {
        filteredData.length > 0 && (
          <div className="bg-white rounded-lg border border-purple-200 p-3 sm:p-4 mt-4 sm:mt-6 mx-2 sm:mx-0">
            <div className="flex items-center justify-between">
              <div className="text-xs sm:text-sm text-gray-600">
                {filteredData.length} {filteredData.length === 1 ? "pedido" : "pedidos"}
                {searchTerm
                  ? ` encontrado${filteredData.length === 1 ? "" : "s"}`
                  : ` carregado${filteredData.length === 1 ? "" : "s"}`}
                {searchTerm && ` de ${ordersData.length} total`}
              </div>
            </div>
          </div>
        )
      }
    </div >
  )
}

// Componente de Legenda de Status
const StatusLegendItem = ({
  bgColor,
  borderColor,
  textColor,
  accentColor,
  status,
  description
}: {
  bgColor: string
  borderColor: string
  textColor: string
  accentColor: string
  status: string
  description?: string
}) => {
  return (
    <div className={`flex items-start gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-lg border-2 ${bgColor} ${borderColor} ${textColor}`}>
      <div className="flex flex-col items-center gap-1 flex-shrink-0 mt-0.5">
        <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded ${accentColor} border-2 ${borderColor}`} />
        <div className={`w-1 h-4 sm:h-6 ${accentColor} rounded`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-xs sm:text-sm leading-tight">{status}</p>
        {description && (
          <p className="text-xs opacity-75 mt-0.5 leading-tight">{description}</p>
        )}
      </div>
    </div>
  )
}
