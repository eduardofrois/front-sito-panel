import { Solicitation } from "@/app/home/orders/order.interface"
import { formatCurrency, formatDate } from "@/functions/format-functions"
import { getStatusColor } from "@/functions/style-functions"
import { Calendar, CheckCircle2, Clock, DollarSign, Package } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { DialogFormOrder } from "./dialog-form-order"

interface AccordionSolicitationCard {
    solicitation: Solicitation
}

export const AccordionSolicitationCard = ({ solicitation }: AccordionSolicitationCard) => {

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

                    <div className="mb-3 pt-2">
                        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Itens do Pedido ({solicitation.orderJoin?.length || 0})
                        </h4>
                    </div>

                    <div className="flex flex-col gap-3">
                        {solicitation.orderJoin?.map((item: any, index: number) => (
                            <div key={index} className="border rounded-lg p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    <div className="sm:col-span-2 lg:col-span-1">
                                        <p className="text-xs text-gray-500 mb-1 font-bold">Descrição</p>
                                        <p className="text-sm text-gray-900 font-medium">{item.description || "N/A"}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 sm:col-span-2 lg:col-span-1">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1 font-bold">Quantidade</p>
                                            <p className="text-sm text-gray-900 flex items-center gap-1">
                                                <Package className="w-3 h-3 text-gray-400" />
                                                {item.amount || 0}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1 font-bold">Valor Total</p>
                                            <p className="text-sm text-gray-900 font-semibold flex items-center gap-1">
                                                <DollarSign className="w-3 h-3 text-green-600" />
                                                {formatCurrency(item.total_price)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 sm:col-span-2 lg:col-span-1">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1 font-bold">Conferência</p>
                                            <span
                                                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status_conference)}`}
                                            >
                                                <CheckCircle2 className="w-3 h-3" />
                                                {item.status_conference || "Pendente"}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1 font-bold">Data Criação</p>
                                            <p className="text-xs text-gray-900 flex items-center gap-1">
                                                <Clock className="w-3 h-3 text-gray-400" />
                                                {formatDate(item.date_creation_order)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

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
