"use client"
import { getCardStylesFromOrder } from "@/constants/card-state-helper"
import { formatCurrency, formatDate } from "@/functions/format-functions"
import { getStatusColor } from "@/functions/style-functions"
import { Calendar, CheckCircle2, ChevronRight, DollarSign, Package } from "lucide-react"

interface OrderItemCardProps {
    item: any
    isSelected: boolean
    onToggleSelect: () => void
    type: "order" | "account"
}

export const OrderItemCard = ({ item, isSelected, onToggleSelect, type }: OrderItemCardProps) => {
    const cardStyles = getCardStylesFromOrder(item, isSelected)

    return (
        <div
            onClick={onToggleSelect}
            className={`
        group relative rounded-lg sm:rounded-xl overflow-hidden cursor-pointer touch-manipulation
        transition-all duration-300 ease-out
        shadow-sm hover:shadow-lg border-2
        ${cardStyles.background} ${cardStyles.border} ${cardStyles.text} ${cardStyles.hover}
      `}
        >
            <div className={`absolute left-0 top-0 bottom-0 w-1 sm:w-1.5 ${cardStyles.accentBorder}`} />

            <div className="p-3 sm:p-4 md:p-5 pl-3 sm:pl-4 md:pl-5 space-y-3 sm:space-y-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold tracking-wide ${isSelected ? "text-white/70" : "text-gray-500"} mb-1`}>
                            DESCRIÇÃO
                        </p>
                        <p className={`text-sm sm:text-base font-semibold text-pretty break-words line-clamp-2 group-hover:underline ${isSelected ? "text-white" : "text-gray-900"}`}>
                            {item.description || "N/A"}
                        </p>
                    </div>
                    <ChevronRight className={`w-5 h-5 mt-1 opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0 ${isSelected ? "text-white" : "text-gray-400"}`} />
                </div>

                <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 pt-2 sm:pt-3 border-t ${isSelected ? "border-white/20" : "border-gray-200"}`}>
                    <CardDataItem
                        icon={DollarSign}
                        label="Valor"
                        value={formatCurrency(item.total_price)}
                        highlight
                        isSelected={isSelected}
                    />
                    <CardDataItem icon={Package} label="Quantidade" value={`${item.amount || 0} un`} isSelected={isSelected} />
                    <CardDataItem
                        icon={Calendar}
                        label="Data"
                        value={formatDate(item.date_creation_order)}
                        isSelected={isSelected}
                    />
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-3 pt-2 sm:pt-3">
                    <StatusBadge label="Status" value={item.status} colorClass={getStatusColor(item.status)} />
                    <StatusBadge
                        label="Conferência"
                        value={item.status_conference || "Pendente"}
                        colorClass={getStatusColor(item.status_conference)}
                    />
                </div>
            </div>
        </div>
    )
}

const CardDataItem = ({ icon: Icon, label, value, highlight, isSelected }: any) => (
    <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
            <Icon className={`w-3.5 h-3.5 opacity-70 ${isSelected ? "text-white/70" : "text-gray-600"}`} />
            <p className={`text-xs font-medium opacity-70 ${isSelected ? "text-white/70" : "text-gray-500"}`}>{label}</p>
        </div>
        <p className={`text-sm font-semibold ${highlight ? "text-base" : ""} ${isSelected ? "text-white" : "text-gray-900"}`}>
            {value}
        </p>
    </div>
)

const StatusBadge = ({ label, value, colorClass }: any) => (
    <div
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-opacity-10"
        style={{ backgroundColor: `var(--badge-bg)` }}
    >
        <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
        <div className="flex items-center gap-1 min-w-0">
            <span className="text-xs font-medium opacity-75">{label}:</span>
            <span className={`text-xs font-semibold truncate ${colorClass}`}>{value}</span>
        </div>
    </div>
)
