"use client"

import type { Order } from "@/app/home/orders/order.interface"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Status_String } from "@/constants/order-status"
import { getCardStylesFromOrder } from "@/constants/card-state-helper"
import { formatCurrency, formatDate } from "@/functions/format-functions"
import { getStatusColor } from "@/functions/style-functions"
import { Calendar, Check, CheckCircle, Package, ShoppingCart, Tag, User } from "lucide-react"

interface iProps {
    order: Order
    selectedOrders: number[]
    handleCardClick: (isSelected: boolean, order: Order) => void
    canSelectCard?: (order: Order) => boolean
    idx: number
}

export const PurchaseCard = ({ order, selectedOrders, handleCardClick, canSelectCard, idx }: iProps) => {
    const isSelected = selectedOrders.includes(order.id)
    const isPaidPurchase = order.status === Status_String.PaidPurchase
    const isSelectable = canSelectCard ? canSelectCard(order) : true
    const cardStyles = getCardStylesFromOrder(order, isSelected)

    return (
        <Card
            className={`
                w-full max-w-md cursor-pointer
                transition-colors ease-in-out duration-400
                ${cardStyles.background} ${cardStyles.border} ${cardStyles.text} ${cardStyles.hover}
                ${!isSelectable && !isSelected ? "opacity-50 cursor-not-allowed" : ""} 
            `}
            onClick={() => {
                if (isSelectable || isSelected) {
                    handleCardClick(isSelected, order)
                }
            }}
        >
            <CardHeader className="pb-3">
                <div className="flex flex-col items-start justify-between">
                    <div className="flex items-center gap-2">
                        {isPaidPurchase ? (
                            <CheckCircle className={`w-5 h-5 ${isSelected ? "text-white" : cardStyles.text}`} />
                        ) : (
                            <ShoppingCart className={`w-5 h-5 ${isSelected ? "text-white" : cardStyles.text}`} />
                        )}
                        <span className={`font-semibold text-lg ${isSelected ? "text-white" : cardStyles.text}`}>
                            Pedido #{idx}
                        </span>
                        {isPaidPurchase && <Badge className="bg-green-500 text-white text-xs">PAGO</Badge>}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge className={`${getStatusColor(order.status)} font-medium`}>{order.status} </Badge>
                        {order.status_conference ? (
                            <Badge className={`${getStatusColor(order.status_conference)} font-medium`}>
                                {`${order.status_conference}`}
                            </Badge>
                        ) : null}
                        {order.date_conference ? (
                            <Badge className="bg-gray-100 text-gray-800 border-gray-200 font-medium">
                                {new Date(order.date_conference).toLocaleDateString()}
                            </Badge>
                        ) : null}
                        {isSelected && (
                            <div className="bg-white rounded-full p-1">
                                <Check className={`w-4 h-4 ${isSelected ? "text-purple-600" : "text-gray-600"}`} />
                            </div>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                    <User className={`w-4 h-4 ${isSelected ? "text-white/80" : "text-gray-600"}`} />
                    <span className={`text-sm ${isSelected ? "text-white/80" : "text-gray-500"}`}>Cliente:</span>
                    <span className={`font-medium ${isSelected ? "text-white" : cardStyles.text}`}>
                        {order.client_infos?.client_name}
                    </span>
                </div>

                <Separator className={isSelected ? "bg-white/20" : "bg-gray-200"} />

                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Package className={`w-4 h-4 ${isSelected ? "text-white/80" : "text-gray-600"}`} />
                        <span className={`font-medium ${isSelected ? "text-white" : cardStyles.text}`}>Produto</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <span className={isSelected ? "text-white/80" : "text-gray-500"}>Marca:</span>
                            <p className={`font-medium ${isSelected ? "text-white" : cardStyles.text}`}>{order.brand}</p>
                        </div>
                        <div>
                            <span className={isSelected ? "text-white/80" : "text-gray-500"}>Código:</span>
                            <p className={`font-medium ${isSelected ? "text-white" : cardStyles.text}`}>{order.code}</p>
                        </div>
                        <div>
                            <span className={isSelected ? "text-white/80" : "text-gray-500"}>Tamanho:</span>
                            <p className={`font-medium ${isSelected ? "text-white" : cardStyles.text}`}>{order.size}</p>
                        </div>
                        <div>
                            <span className={isSelected ? "text-white/80" : "text-gray-500"}>Quantidade:</span>
                            <p className={`font-medium ${isSelected ? "text-white" : cardStyles.text}`}>{order.amount}</p>
                        </div>
                    </div>
                    {order.description && (
                        <div>
                            <span className={`text-sm ${isSelected ? "text-white/80" : "text-gray-500"}`}>Descrição:</span>
                            <p className={`text-sm font-medium mt-1 ${isSelected ? "text-white" : cardStyles.text}`}>
                                {order.description}
                            </p>
                        </div>
                    )}
                </div>

                <Separator className={isSelected ? "bg-white/20" : "bg-gray-200"} />

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Tag className={`w-4 h-4 ${isSelected ? "text-white/80" : "text-gray-600"}`} />
                        <span className={`text-sm ${isSelected ? "text-white/80" : "text-gray-500"}`}>
                            {isPaidPurchase ? "Preço Pago:" : "Preço Custo:"}
                        </span>
                    </div>
                    <span className={`font-bold text-lg ${isSelected ? "text-white" : cardStyles.text}`}>
                        {formatCurrency(order.cost_price)}
                    </span>
                </div>

                <Separator className={isSelected ? "bg-white/20" : "bg-gray-200"} />

                <div className="flex items-center gap-2">
                    <Calendar className={`w-4 h-4 ${isSelected ? "text-white/80" : "text-gray-600"}`} />
                    {order.status === Status_String.ConfirmSale || 
                     order.status === Status_String.PartialPayment || 
                     order.status === Status_String.FullyPaid ? (
                        <>
                            <span className={`text-sm ${isSelected ? "text-white/80" : "text-gray-500"}`}>Data da Compra:</span>
                            <span className={`font-medium ${isSelected ? "text-white" : cardStyles.text}`}>
                                {formatDate(order.date_order)}
                            </span>
                        </>
                    ) : (
                        <>
                            <span className={`text-sm ${isSelected ? "text-white/80" : "text-gray-500"}`}>Data de Pagamento:</span>
                            <span className={`font-medium ${isSelected ? "text-white" : cardStyles.text}`}>
                                {formatDate(order.date_purchase_order)}
                            </span>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
