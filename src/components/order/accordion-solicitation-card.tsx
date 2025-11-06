"use client"

import type { Solicitation } from "@/app/home/orders/order.interface"
import { Status } from "@/constants/order-status"
import { formatCurrency, formatDate } from "@/functions/format-functions"
import { getStatusColor } from "@/functions/style-functions"
import { Calendar, CheckCircle2, Clock, DollarSign, Package } from "lucide-react"
import type { Dispatch, SetStateAction } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { Button } from "../ui/button"
import { DialogFormOrder } from "./dialog-form-order"

interface AccordionSolicitationCard {
    solicitation: Solicitation
    confirmedOrder: number[]
    setConfirmedOrder: Dispatch<SetStateAction<number[]>>
    onUpdate: (orders: number[], value: number) => void
}

export const AccordionSolicitationCard = ({
    solicitation,
    confirmedOrder,
    setConfirmedOrder,
    onUpdate
}: AccordionSolicitationCard) => {
    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                <AccordionTrigger className="px-4 py-4 hover:no-underline group">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full text-left">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="flex-shrink-0">
                                <Package className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex flex-col gap-1 min-w-0">
                                <span className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                                    Pedido #{solicitation.orders}
                                </span>
                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                    <span>{formatDate(solicitation.date_solicitation)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                            <span
                                className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${getStatusColor(solicitation.status)}`}
                            >
                                {solicitation.status}
                            </span>
                        </div>
                    </div>
                </AccordionTrigger>

                <AccordionContent className="px-4 pb-4">
                    <DialogFormOrder solicitation={solicitation.id} text="Cadastrar Pedido" variant="default" />

                    {confirmedOrder.length > 0 &&
                        <Button className="w-full mt-2" onClick={() => onUpdate(confirmedOrder, Status.ConfirmSale)}>
                            Efetivar pedido(s)
                        </Button>
                    }

                    <div className="mb-3 pt-2">
                        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Itens do Pedido ({solicitation.orderJoin?.length || 0})
                        </h4>
                    </div>

                    <div className="flex flex-col gap-3">
                        {solicitation.orderJoin?.map((item: any, index: number) => {
                            const isSelected = confirmedOrder.includes(item.id)
                            const handleToggleSelect = () => {
                                setConfirmedOrder((prev) => (isSelected ? prev.filter((id) => id !== item.id) : [...prev, item.id]))
                            }
                            return (
                                <div
                                    key={index}
                                    onClick={handleToggleSelect}
                                    className={`border rounded-lg p-3 sm:p-4 transition-colors cursor-pointer ${isSelected ? "bg-purple-600 border-purple-600 text-white" : "bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-purple-600"}`}
                                >
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        <div className="sm:col-span-2 lg:col-span-1">
                                            <p className={`text-xs mb-1 font-bold ${isSelected ? "text-purple-100" : "text-gray-500"}`}>
                                                Descrição
                                            </p>
                                            <p className={`text-sm font-medium ${isSelected ? "text-white" : "text-gray-900"}`}>
                                                {item.description || "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            {item.status}
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 sm:col-span-2 lg:col-span-1">
                                            <div>
                                                <p className={`text-xs mb-1 font-bold ${isSelected ? "text-purple-100" : "text-gray-500"}`}>
                                                    Quantidade
                                                </p>
                                                <p className={`text-sm flex items-center gap-1 ${isSelected ? "text-white" : "text-gray-900"}`}>
                                                    <Package className={`w-3 h-3 ${isSelected ? "text-purple-100" : "text-gray-400"}`} />
                                                    {item.amount || 0}
                                                </p>
                                            </div>
                                            <div>
                                                <p className={`text-xs mb-1 font-bold ${isSelected ? "text-purple-100" : "text-gray-500"}`}>
                                                    Valor Total
                                                </p>
                                                <p
                                                    className={`text-sm font-semibold flex items-center gap-1 ${isSelected ? "text-white" : "text-gray-900"}`}
                                                >
                                                    <DollarSign className={`w-3 h-3 ${isSelected ? "text-purple-100" : "text-green-600"}`} />
                                                    {formatCurrency(item.total_price)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 sm:col-span-2 lg:col-span-1">
                                            <div>
                                                <p className={`text-xs mb-1 font-bold ${isSelected ? "text-purple-100" : "text-gray-500"}`}>
                                                    Conferência
                                                </p>
                                                <span
                                                    className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status_conference)}`}
                                                >
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    {item.status_conference || "Pendente"}
                                                </span>
                                            </div>
                                            <div>
                                                <p className={`text-xs mb-1 font-bold ${isSelected ? "text-purple-100" : "text-gray-500"}`}>
                                                    Data Criação
                                                </p>
                                                <p className={`text-xs flex items-center gap-1 ${isSelected ? "text-white" : "text-gray-900"}`}>
                                                    <Clock className={`w-3 h-3 ${isSelected ? "text-purple-100" : "text-gray-400"}`} />
                                                    {formatDate(item.date_creation_order)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                        {(!solicitation.orderJoin || solicitation.orderJoin.length === 0) && (
                            <div className="text-center py-8 text-gray-500">
                                <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Nenhum item encontrado</p>
                            </div>
                        )}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}
