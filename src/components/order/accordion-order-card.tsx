"use client"

import type { Order, Solicitation } from "@/app/home/orders/order.interface"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getCardStylesFromOrder } from "@/constants/card-state-helper"
import { Status_String } from "@/constants/order-status"
import { returnDateInStatus } from "@/functions/format-functions"
import { Check, Eye, EyeOff } from "lucide-react"
import type React from "react"
import type { Dispatch, SetStateAction } from "react"
import { ButtonReadyToSend } from "./button-ready-to-send"

interface AccordionOrderCardProps {
  solicitations: Solicitation
  order: Order
  index: number
  handleSelectOrder: Dispatch<SetStateAction<number[]>>
  confirmedOrder: number[]
  onUpdate: (orders: number[], value: number) => void
  showAllSensitiveInfo: boolean
  toggleFieldVisibility: (orderId: number, fieldName: string) => void
  isFieldVisible: (orderId: number, fieldName: string) => boolean
  shouldShowField: (orderId: number, fieldName: string) => boolean
}

export const AccordionOrderCard = ({
  order,
  index,
  handleSelectOrder,
  confirmedOrder,
  onUpdate,
  showAllSensitiveInfo,
  toggleFieldVisibility,
  isFieldVisible,
  shouldShowField,
  solicitations
}: AccordionOrderCardProps) => {
  const profit = order.sale_price - order.cost_price
  const profitMargin = ((profit / order.sale_price) * 100).toFixed(1)
  const totalValue = order.sale_price * order.amount

  console.log("solicitation dentro do componente", solicitations)

  const isSelected = confirmedOrder.includes(order.id)
  const cardStyles = getCardStylesFromOrder(order, isSelected)

  const handleCheckboxChange = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (isSelected) {
      handleSelectOrder((prev) => prev?.filter((selectedOrder) => selectedOrder !== order.id) ?? [])
    } else {
      handleSelectOrder((prev) => [...(prev ?? []), order.id])
    }
  }

  const renderSensitiveField = (fieldName: string, icon: React.ElementType, label: string, value: string) => {
    const Icon = icon
    const shouldShow = showAllSensitiveInfo || shouldShowField(order.id, fieldName)
    const isIndividuallyVisible = isFieldVisible(order.id, fieldName)

    return (
      <div key={label} className="flex items-center gap-3 min-w-0">
        <Icon className={`w-4 h-4 flex-shrink-0 ${isSelected ? "text-white" : "text-purple-600"}`} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between mb-1">
            <p
              className={`text-xs font-medium uppercase tracking-wide ${isSelected ? "text-white/70" : "text-gray-500"}`}
            >
              {label}
            </p>
            <Button
              variant="ghost"
              size="sm"
              className={`h-6 w-6 p-0 ${isSelected ? "hover:bg-white/10" : "hover:bg-gray-100"}`}
              onClick={(e) => {
                e.stopPropagation()
                toggleFieldVisibility(order.id, fieldName)
              }}
            >
              {isIndividuallyVisible ? (
                <EyeOff className={`w-3 h-3 ${isSelected ? "text-white/70" : "text-gray-500"}`} />
              ) : (
                <Eye className={`w-3 h-3 ${isSelected ? "text-white/70" : "text-gray-500"}`} />
              )}
            </Button>
          </div>
          <p className={`font-semibold truncate ${isSelected ? "text-white" : "text-black"}`}>
            {shouldShow ? value : "••••••••"}
          </p>
        </div>
      </div>
    )
  }

  const renderSensitiveFinancialData = (label: string, value: number, fieldName: string) => {
    const shouldShow = shouldShowField(order.id, fieldName)
    const isIndividuallyVisible = isFieldVisible(order.id, fieldName)

    return (
      <div
        className={`text-center p-3 sm:p-4 rounded-lg border ${isSelected ? "bg-white/5 border-white/20" : "bg-white border-gray-200"}`}
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          <p className={`text-xs font-medium ${isSelected ? "text-white/70" : "text-gray-500"}`}>{label}</p>
          <Button
            variant="ghost"
            size="sm"
            className={`h-4 w-4 p-0 ${isSelected ? "hover:bg-white/10" : "hover:bg-gray-100"}`}
            onClick={(e) => {
              e.stopPropagation()
              toggleFieldVisibility(order.id, fieldName)
            }}
          >
            {isIndividuallyVisible ? (
              <EyeOff className={`w-3 h-3 ${isSelected ? "text-white/70" : "text-gray-500"}`} />
            ) : (
              <Eye className={`w-3 h-3 ${isSelected ? "text-white/70" : "text-gray-500"}`} />
            )}
          </Button>
        </div>
        <p className={`font-bold text-sm sm:text-base ${isSelected ? "text-white" : "text-black"}`}>
          {shouldShow ? `R$ ${value.toFixed(2)}` : "R$ ••••"}
        </p>
      </div>
    )
  }

  return (
    <Card
      className={`border-2 transition-colors duration-200 ${cardStyles.background} ${cardStyles.border} ${cardStyles.text} ${cardStyles.hover}`}
    >
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value={`order-${index}`} className="border-none">
          <AccordionTrigger className="hover:no-underline p-3 sm:p-4 md:p-6">
            <div className="flex items-center justify-between w-full gap-2 sm:gap-3 md:gap-4 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0 flex-1">
                {solicitations.orderJoin[0].status === Status_String.PendingPurchase && (
                  <div
                    className="flex items-center cursor-pointer p-1.5 sm:p-2 rounded-lg hover:bg-black/10 flex-shrink-0 touch-manipulation"
                    onClick={handleCheckboxChange}
                  >
                    <div
                      className={`w-6 h-6 sm:w-7 sm:h-7 rounded border-2 flex items-center justify-center transition-colors min-w-[24px] min-h-[24px] ${isSelected ? "bg-white border-white" : "bg-transparent border-gray-300 hover:border-purple-600"
                        }`}
                    >
                      {isSelected && <Check className={`w-4 h-4 sm:w-5 sm:h-5 ${isSelected ? "text-purple-600" : "text-gray-600"}`} />}
                    </div>
                  </div>
                )}

                <div className="flex flex-col text-left gap-1 min-w-0 flex-1">
                  <h3 className={`text-sm sm:text-base md:text-lg font-bold truncate ${isSelected ? "text-white" : "text-black"}`}>
                    Pedido {solicitations.id}
                  </h3>
                  <p className={`text-xs sm:text-sm truncate ${isSelected ? "text-white/80" : "text-gray-600"}`}>
                    {solicitations.date_solicitation}
                  </p>
                  <Badge variant={isSelected ? "secondary" : "outline"} className="w-fit text-xs mt-0.5">
                    {solicitations.status}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-2 md:gap-4 flex-shrink-0">
                <div className="text-right sm:text-left">
                  <p
                    className={`text-sm sm:text-base md:text-lg font-bold break-words ${isSelected ? "text-white" : "text-black"}`}
                  >
                    {shouldShowField(order.id, "totalValue") ? `R$ ${totalValue.toFixed(2)}` : "R$ ••••••"}
                  </p>
                  <p className={`text-xs sm:text-sm ${isSelected ? "text-white/80" : "text-gray-600"}`}>
                    {order.amount} {order.amount === 1 ? "item" : "itens"}
                  </p>
                </div>
              </div>
            </div>
          </AccordionTrigger>

          <AccordionContent className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
            <div className="space-y-3 sm:space-y-4 md:space-y-6 pt-3 sm:pt-4">
              <div className="block sm:hidden">
                <div className={`text-s, ${isSelected ? "text-white/80" : "text-black"}`}>
                  Última atulização: {returnDateInStatus(order)}
                </div>
              </div>

              <div className="my-4 sm:my-6">
                <h4 className="font-semibold mb-2 text-xs sm:text-sm">Linha do Tempo do Pedido</h4>
                <ul className="text-xs sm:text-sm text-gray-600 space-y-1.5 sm:space-y-2 pl-2 sm:pl-3 border-l-2 border-purple-200">
                  <li className="break-words"><span className="font-semibold">Criado:</span> {order.date_creation_order ? new Date(order.date_creation_order).toLocaleString() : '-'}</li>
                  <li className="break-words"><span className="font-semibold">Compra Realizada:</span> {order.date_order ? new Date(order.date_order).toLocaleString() : '-'}</li>
                  <li className="break-words"><span className="font-semibold">Compra Quitada:</span> {order.date_purchase_order ? new Date(order.date_purchase_order).toLocaleString() : '-'}</li>
                  <li className="break-words"><span className="font-semibold">Conferido:</span> {order.date_conference ? new Date(order.date_conference).toLocaleString() : '-'}</li>
                </ul>
              </div>

              <div className="bg-red-200">
                <p>
                  quantidade de produtos nesse pedido: {0}
                </p>
                {solicitations &&
                  <CardContent>
                    teste
                  </CardContent>
                }
              </div>
              <div className="flex flex-col gap-2 sm:gap-3 mt-4">
                {order.status === Status_String.ConfirmSale && (
                  <Button
                    variant="secondary"
                    className="w-full min-h-[44px] text-sm sm:text-base py-2.5 sm:py-3"
                    onClick={() => onUpdate([order.id], 5)} // Status.PaidPurchase = 5
                  >
                    Marcar como Quitada
                  </Button>
                )}
                {order.status === Status_String.PaidPurchase && (
                  <Button
                    variant="outline"
                    className="w-full min-h-[44px] text-sm sm:text-base py-2.5 sm:py-3"
                    onClick={() => onUpdate([order.id], 7)} // Status.ToCheck = 7
                  >
                    Marcar como "A Conferir"
                  </Button>
                )}
                {order.status_conference === Status_String.ToCheck && (
                  <Button
                    variant="outline"
                    className="w-full min-h-[44px] text-sm sm:text-base py-2.5 sm:py-3"
                    onClick={() => onUpdate([order.id], 8)} // Status.Checked = 8
                  >
                    Marcar como Conferido
                  </Button>
                )}
                {order.status !== Status_String.ReadyForDelivery && (
                  <Button
                    variant="destructive"
                    className="w-full min-h-[44px] text-sm sm:text-base py-2.5 sm:py-3"
                    onClick={() => onUpdate([order.id], 3)} // Status.ReadyForDelivery = 3
                  >
                    Marcar como Pronta Entrega
                  </Button>
                )}
                {order.status === Status_String.PaidPurchase && <ButtonReadyToSend order={order} onUpdate={onUpdate} />}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  )
}
