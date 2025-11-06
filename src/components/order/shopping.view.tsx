"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Eye, EyeOff, Search } from "lucide-react"
import type { Dispatch, SetStateAction } from "react"
import { useMemo, useState } from "react"
import type { Order, Solicitation } from "../../app/home/orders/order.interface"
import { IsLoadingCard } from "../global/isloading-card"
import { NotFoundOrder } from "../global/not-found-order"
import { Button } from "../ui/button"
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
  onUpdate: (orders: number[], value: number) => void
  showAllSensitiveInfo: boolean
  setShowAllSensitiveInfo: (show: boolean) => void
  toggleFieldVisibility: (orderId: number, fieldName: string) => void
  isFieldVisible: (orderId: number, fieldName: string) => boolean
  shouldShowField: (orderId: number, fieldName: string) => boolean
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
  showAllSensitiveInfo,
  setShowAllSensitiveInfo,
  toggleFieldVisibility,
  isFieldVisible,
  shouldShowField,
  isLoadingSolicitations,
  pagination, setPagination
}: iProps) => {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data

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

  if (data.length === 0) return <NotFoundOrder />

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-purple-200 p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {showAllSensitiveInfo ? (
              <Eye className="w-5 h-5 text-purple-600" />
            ) : (
              <EyeOff className="w-5 h-5 text-gray-400" />
            )}
            <Label htmlFor="show-sensitive" className="text-sm font-medium">
              Mostrar todas as informações sensíveis
            </Label>
            <Switch id="show-sensitive" checked={showAllSensitiveInfo} onCheckedChange={setShowAllSensitiveInfo} />
          </div>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Filtrar pedidos por qualquer informação (código, descrição, cliente, status, etc.)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          {searchTerm && (
            <p className="text-xs text-gray-500 mt-1">
              {filteredData.length} de {data.length} pedidos encontrados
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="pr-4">
            <h2 className="text-xl font-semibold text-purple-900">
              Lista de Pedidos ({filteredData.length}
              {searchTerm && ` de ${data.length}`})
            </h2>
            <p className="text-sm text-gray-600 mt-1">Gerencie seus pedidos de forma detalhada</p>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-600">Total Geral</p>
            <p className="text-2xl font-bold text-purple-600 whitespace-nowrap">
              {showAllSensitiveInfo
                ? `R$ ${filteredData.reduce((total, order) => total + order.sale_price * order.amount, 0).toFixed(2)}`
                : "R$ ••••••••"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-xs text-gray-500">Total de Itens</p>
            <p className="font-semibold text-gray-900">
              {filteredData.reduce((total, order) => total + order.amount, 0)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Custo Total</p>
            <p className="font-semibold text-red-600">
              {showAllSensitiveInfo
                ? `R$ ${filteredData.reduce((total, order) => total + order.cost_price * order.amount, 0).toFixed(2)}`
                : "R$ ••••••"}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Receita Total</p>
            <p className="font-semibold text-green-600">
              {showAllSensitiveInfo
                ? `R$ ${filteredData.reduce((total, order) => total + order.sale_price * order.amount, 0).toFixed(2)}`
                : "R$ ••••••"}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Lucro Total</p>
            <p className="font-semibold text-blue-600">
              {showAllSensitiveInfo
                ? `R$ ${filteredData.reduce((total, order) => total + (order.sale_price - order.cost_price) * order.amount, 0).toFixed(2)}`
                : "R$ ••••••"}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full">
        {/* <Button className="w-full" onClick={() => onUpdate(confirmedOrder, Status.ConfirmSale)}>
          Efetivar pedido(s)
        </Button> */}

        <DialogFormOrder solicitation={null} text="Adicionar solicitação" variant={"outline"} />

      </div>


      <div className="flex flex-col gap-4">
        {solicitations.map((solicitation: Solicitation, idx: number) => (
          <AccordionSolicitationCard
            key={solicitation.id ?? idx}
            solicitation={solicitation}
            confirmedOrder={confirmedOrder}
            setConfirmedOrder={setConfirmedOrder}
            onUpdate={onUpdate}
          />
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 mt-6">
        <Button
          variant="outline"
          disabled={pagination.pageIndex <= 1}
          onClick={() =>
            setPagination(prev => ({
              ...prev,
              pageIndex: Math.max(prev.pageIndex - 1, 1),
            }))
          }
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-purple-200 rounded-lg hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Voltar
        </Button>

        <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-50 transition-all">
          Página {pagination.pageIndex}
        </div>

        <Button
          variant="outline"
          onClick={() =>
            setPagination(prev => ({
              ...prev,
              pageIndex: prev.pageIndex + 1,
            }))
          }
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-purple-200 rounded-lg hover:bg-purple-50 transition-all"
        >
          Próxima
        </Button>
      </div>


      {
        filteredData.length > 0 && (
          <div className="bg-white rounded-lg border border-purple-200 p-4 mt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {filteredData.length} {filteredData.length === 1 ? "pedido" : "pedidos"}
                {searchTerm
                  ? ` encontrado${filteredData.length === 1 ? "" : "s"}`
                  : ` carregado${filteredData.length === 1 ? "" : "s"}`}
                {searchTerm && ` de ${data.length} total`}
              </div>
            </div>
          </div>
        )
      }
    </div >
  )
}
