"use client"

import type { Solicitation } from "@/app/home/orders/order.interface"
import { Status } from "@/constants/order-status"
import { formatDate } from "@/functions/format-functions"
import { getStatusColor } from "@/functions/style-functions"
import { Calendar, Package } from "lucide-react"
import type { Dispatch, SetStateAction } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../ui/alert-dialog"
import { Button } from "../ui/button"
import { DialogFormOrder } from "./dialog-form-order"
import { OrderItemCard } from "./order-item.card"

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
    onUpdate,
}: AccordionSolicitationCard) => {
    const handleToggleSelect = (itemId: number) => {
        setConfirmedOrder((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
    }

    const handleSelectAll = () => {
        if (solicitation.orders?.length) {
            setConfirmedOrder((prev) => [...prev, ...solicitation.orders.filter((order: number) => !prev.includes(order))])
        }
    }

    const hasOrdersToConfirm = confirmedOrder.length > 0

    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                <AccordionTrigger className="px-4 py-4 hover:no-underline group">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full text-left">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <Package className="w-5 h-5 text-blue-500 flex-shrink-0" />
                            <div className="flex flex-col gap-1 min-w-0">
                                <span className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                                    Pedido #{solicitation.orders}
                                </span>
                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                    {formatDate(solicitation.date_solicitation)}
                                </div>
                            </div>
                        </div>
                        <span
                            className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${getStatusColor(solicitation.status)}`}
                        >
                            {solicitation.status}
                        </span>
                    </div>
                </AccordionTrigger>

                <AccordionContent className="px-4 pb-4">
                    <DialogFormOrder solicitation={solicitation.id} text="Cadastrar Pedido" variant="default" />

                    {hasOrdersToConfirm && <ConfirmOrdersDialog confirmedOrder={confirmedOrder} onUpdate={onUpdate} />}

                    <SelectAllOrdersDialog onSelectAll={handleSelectAll} />

                    <div className="mb-3 pt-2">
                        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Itens do Pedido ({solicitation.orderJoin?.length || 0})
                        </h4>
                    </div>

                    <div className="flex flex-col gap-3">
                        {solicitation.orderJoin?.map((item: any, index: number) => (
                            <OrderItemCard
                                key={index}
                                item={item}
                                isSelected={confirmedOrder.includes(item.id)}
                                onToggleSelect={() => handleToggleSelect(item.id)}
                            />
                        ))}

                        {(!solicitation.orderJoin || solicitation.orderJoin.length === 0) && <EmptyState />}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

const ConfirmOrdersDialog = ({ confirmedOrder, onUpdate }: any) => {

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className="w-full mt-2" variant={"outline"}>
                    Confirmar pedido(s) selecionado(s)
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar pedidos selecionados?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Ao continuar, você estará informando que o(s) pedido(s) selecionado(s) já foram recebidos. Essa ação
                        atualizará o status para <strong>"Compra Realizada"</strong>.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onUpdate(confirmedOrder, Status.ConfirmSale)}>Confirmar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

const SelectAllOrdersDialog = ({ onSelectAll }: any) => (
    <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button variant={"outline"} className="w-full mt-2" onClick={onSelectAll}>
                Conferir todos os pedidos
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Confirmar recebimento de pedidos?</AlertDialogTitle>
                <AlertDialogDescription>
                    Ao confirmar, todos os pedidos selecionados serão marcados como <strong>"Compra Realizada"</strong>. Essa ação
                    indica que os produtos já foram recebidos e o status das solicitações será atualizado.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction>Confirmar</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
)

const EmptyState = () => (
    <div className="text-center py-8 text-gray-500">
        <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Nenhum item encontrado</p>
    </div>
)
