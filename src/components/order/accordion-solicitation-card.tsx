"use client"

import type { Order, Solicitation } from "@/app/home/orders/order.interface"
import { Status, Status_String } from "@/constants/order-status"
import { formatDate } from "@/functions/format-functions"
import { getStatusColor } from "@/functions/style-functions"
import { Calendar, Package } from "lucide-react"
import { useState, type Dispatch, type SetStateAction } from "react"
import { toast } from "sonner"
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
    type: "order" | "account"
}

export const AccordionSolicitationCard = ({
    solicitation,
    confirmedOrder,
    setConfirmedOrder,
    onUpdate,
    type
}: AccordionSolicitationCard) => {
    const [confirmedOrderCard, setConfirmedOrderCard] = useState<number[]>([]);

    const handleToggleSelect = (itemId: number) => {
        const status = solicitation.orderJoin.find((value: Order) => value.id === itemId)?.status
        if (type == "account" && status === Status_String.PendingPurchase) {
            toast.warning("Essa ação não pode ser executada.", {
                description: `O status do pedido é ${status}`,
                closeButton: true,
                duration: 5000
            })
            return;
        }
        setConfirmedOrder((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
        setConfirmedOrderCard((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
    }

    const handleSelectAll = () => {
        if (solicitation.orders?.length) {
            for (var i = 0; i < solicitation.orderJoin.length; i++) {
                const actualOrder = solicitation.orderJoin[i]
                if (actualOrder.status === Status_String.PendingPurchase) {
                    toast.warning("Essa ação não pode ser executada.", {
                        description: `O status do pedido: ${actualOrder.description} é ${actualOrder.status}`,
                        closeButton: true,
                        duration: 5000
                    })
                    return;
                }
            }

            setConfirmedOrder((prev) => [...prev, ...solicitation.orders.filter((order: number) => !prev.includes(order))])
            setConfirmedOrderCard((prev) => [...prev, ...solicitation.orders.filter((order: number) => !prev.includes(order))])
            return true;
        }
    }

    const hasOrdersToConfirm = confirmedOrderCard.length > 0

    var allConfirmed = true;

    if (type == "account") {
        allConfirmed = false;

    } else if (type == "order") {
        var value = solicitation.orderJoin?.length > 0 &&
            solicitation.orderJoin.every((item: Order) => item.status === Status_String.ConfirmSale)

        allConfirmed = value;
    }



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
                    {type == "order" && <DialogFormOrder solicitation={solicitation.id} text="Cadastrar Pedido" variant="default" />}
                    {hasOrdersToConfirm && <ConfirmOrdersDialog confirmedOrder={confirmedOrder} onUpdate={onUpdate} />}
                    {!allConfirmed && <SelectAllOrdersDialog onSelectAll={handleSelectAll} />}

                    <div className="mb-3 pt-2">
                        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Itens do Pedido ({solicitation.orderJoin?.length || 0})
                        </h4>
                    </div>

                    <div className="flex flex-col gap-3">
                        {solicitation.orderJoin?.map((item: any, index: number) => (
                            <OrderItemCard
                                type={type}
                                key={index}
                                item={item}
                                isSelected={confirmedOrder.includes(item.id)}
                                onToggleSelect={() => {
                                    if (type == "order" && item.status !== Status_String.ConfirmSale || item.status === Status_String.PendingPurchase)
                                        handleToggleSelect(item.id)
                                    else if (type == "account" && item.status === Status_String.ConfirmSale)
                                        handleToggleSelect(item.id)
                                }}
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
            <Button
                variant="outline"
                className="w-full mt-2"
                onClick={(e) => {
                    const canOpen = onSelectAll();
                    if (!canOpen) {
                        e.preventDefault();
                    }
                }}
            >
                Conferir todos os pedidos
            </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Confirmar recebimento de pedidos?</AlertDialogTitle>
                <AlertDialogDescription>
                    Ao confirmar, todos os pedidos selecionados serão marcados como <strong>"Compra Realizada"</strong>.
                    Essa ação indica que os produtos já foram recebidos e o status das solicitações será atualizado.
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
