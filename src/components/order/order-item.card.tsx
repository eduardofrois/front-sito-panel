"use client"
import { CARD_STATES } from "@/constants/card-colors"
import { getCardState } from "@/constants/card-state-helper"
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
    const cardState = getCardState(item, isSelected, type)
    const stateConfig = CARD_STATES[cardState]

    return (
        <div
            onClick={onToggleSelect}
            className={`
        group relative rounded-xl overflow-hidden cursor-pointer
        transition-all duration-300 ease-out
        shadow-sm hover:shadow-lg border
        ${stateConfig.background} ${stateConfig.border} ${stateConfig.text}
      `}
        >
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${stateConfig.accentBorder || stateConfig.border}`} />

            <div className="p-4 sm:p-5 pl-4 space-y-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold tracking-wide ${stateConfig.label} mb-1`}>DESCRIÇÃO</p>
                        <p className="text-sm sm:text-base font-semibold text-pretty break-words line-clamp-2 group-hover:underline">
                            {item.description || "N/A"}
                        </p>
                    </div>
                    <ChevronRight className="w-5 h-5 mt-1 opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 border-t border-current border-opacity-10">
                    <CardDataItem
                        icon={DollarSign}
                        label="Valor"
                        value={formatCurrency(item.total_price)}
                        highlight
                        stateConfig={stateConfig}
                    />
                    <CardDataItem icon={Package} label="Quantidade" value={`${item.amount || 0} un`} stateConfig={stateConfig} />
                    <CardDataItem
                        icon={Calendar}
                        label="Data"
                        value={formatDate(item.date_creation_order)}
                        stateConfig={stateConfig}
                    />
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
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

const CardDataItem = ({ icon: Icon, label, value, highlight, stateConfig }: any) => (
    <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
            <Icon className={`w-3.5 h-3.5 opacity-70 ${stateConfig.icon || ""}`} />
            <p className={`text-xs font-medium opacity-70 ${stateConfig.label}`}>{label}</p>
        </div>
        <p className={`text-sm font-semibold ${highlight ? "text-base" : ""}`}>{value}</p>
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
