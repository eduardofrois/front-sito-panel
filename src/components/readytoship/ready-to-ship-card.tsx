"use client"

import type { Order } from "@/app/home/orders/order.interface"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { formatCurrency, formatDate } from "@/functions/format-functions"
import { CalendarDays, Package, Tag, User } from "lucide-react"

interface ReadyToShipCardProps {
    order: Order
    isSelected: boolean
    onSelect: (orderId: number, selected: boolean) => void
    showSensitiveData?: boolean
}

export const ReadyToShipCard = ({
    order,
    isSelected,
    onSelect,
    showSensitiveData = true,
}: ReadyToShipCardProps) => {
    return (
        <Card
            className={`w-full transition-all cursor-pointer ${
                isSelected
                    ? "border-2 border-purple-500 bg-purple-50/30 shadow-md"
                    : "border border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
            }`}
            onClick={() => onSelect(order.id, !isSelected)}
        >
            <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Checkbox e ícone */}
                    <div className="flex items-start gap-3 sm:gap-4">
                        <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => onSelect(order.id, checked as boolean)}
                            onClick={(e) => e.stopPropagation()}
                            className="mt-1 h-5 w-5 border-2 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                        />
                        <div className="p-2 sm:p-3 bg-purple-50 rounded-lg">
                            <Package className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                        </div>
                    </div>

                    {/* Conteúdo principal */}
                    <div className="flex-1 space-y-3 sm:space-y-4">
                        {/* Header com código e status */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <span className="font-bold text-base sm:text-lg text-gray-900">
                                    #{order.code}
                                </span>
                                <Badge
                                    variant="secondary"
                                    className="bg-purple-100 text-purple-700 border-purple-200 font-medium text-xs sm:text-sm px-2 sm:px-3 py-1"
                                >
                                    {order.status}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    <Tag className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                                    <span className="font-medium">{order.brand}</span>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    <CalendarDays className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                                    <span>{formatDate(order.date_creation_order)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Descrição */}
                        <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                {order.description}
                            </p>
                        </div>

                        {/* Grid de informações */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                            <div className="p-2 sm:p-3 bg-white border border-gray-100 rounded-lg">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                    Tamanho
                                </p>
                                <p className="text-sm sm:text-base font-medium text-gray-900">{order.size}</p>
                            </div>
                            <div className="p-2 sm:p-3 bg-white border border-gray-100 rounded-lg">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                    Quantidade
                                </p>
                                <p className="text-sm sm:text-base font-medium text-gray-900">{order.amount}</p>
                            </div>
                            <div className="p-2 sm:p-3 bg-white border border-gray-100 rounded-lg">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                    Custo
                                </p>
                                <p className="text-sm sm:text-base font-medium text-purple-800">
                                    {formatCurrency(order.cost_price)}
                                </p>
                            </div>
                            <div className="p-2 sm:p-3 bg-white border border-gray-100 rounded-lg">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                    Total
                                </p>
                                <p className="text-sm sm:text-base font-medium text-green-700">
                                    {formatCurrency(order.total_price)}
                                </p>
                            </div>
                        </div>

                        {/* Cliente atual (se houver) */}
                        {order.client_infos?.client_name && (
                            <div className="flex items-center gap-2 p-2 sm:p-3 bg-blue-50 border border-blue-100 rounded-lg">
                                <User className="h-4 w-4 text-blue-600" />
                                <span className="text-xs sm:text-sm text-blue-700">
                                    Cliente: <strong>{order.client_infos.client_name}</strong>
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

