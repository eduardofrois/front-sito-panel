"use client"

import { ChevronDown, ChevronUp, Filter } from "lucide-react"
import { ReactNode, useState } from "react"

interface ExpandableFilterCardProps {
    children: ReactNode
    title?: string
    subtitle?: string
    hasActiveFilters?: boolean
    defaultExpanded?: boolean
    colorScheme?: "purple" | "green" | "blue"
}

const colorSchemes = {
    purple: {
        border: "border-purple-100",
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
        badge: "bg-purple-100 text-purple-700",
        chevronBg: "bg-purple-50",
        chevronColor: "text-purple-600",
        divider: "border-purple-100",
    },
    green: {
        border: "border-green-100",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        badge: "bg-green-100 text-green-700",
        chevronBg: "bg-green-50",
        chevronColor: "text-green-600",
        divider: "border-green-100",
    },
    blue: {
        border: "border-blue-100",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        badge: "bg-blue-100 text-blue-700",
        chevronBg: "bg-blue-50",
        chevronColor: "text-blue-600",
        divider: "border-blue-100",
    },
}

export function ExpandableFilterCard({
    children,
    title = "Filtros de Pesquisa",
    subtitle,
    hasActiveFilters = false,
    defaultExpanded = true,
    colorScheme = "purple",
}: ExpandableFilterCardProps) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded)
    const colors = colorSchemes[colorScheme]

    const dynamicSubtitle = subtitle || `Clique para ${isExpanded ? 'ocultar' : 'exibir'} os filtros`

    return (
        <div className={`w-full bg-white rounded-xl border ${colors.border} shadow-sm p-4 sm:p-6`}>
            {/* Header - Clicável para expandir/colapsar */}
            <div
                className="flex items-center justify-between cursor-pointer select-none"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${colors.iconBg} flex items-center justify-center`}>
                        <Filter className={`w-5 h-5 ${colors.iconColor}`} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">{title}</h3>
                        <p className="text-xs text-gray-500">{dynamicSubtitle}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {hasActiveFilters && (
                        <span className={`${colors.badge} text-xs font-semibold px-3 py-1 rounded-full animate-pulse`}>
                            Filtros Ativos
                        </span>
                    )}
                    <div className={`w-8 h-8 rounded-lg ${colors.chevronBg} flex items-center justify-center transition-transform duration-200`}>
                        {isExpanded ? (
                            <ChevronUp className={`w-5 h-5 ${colors.chevronColor}`} />
                        ) : (
                            <ChevronDown className={`w-5 h-5 ${colors.chevronColor}`} />
                        )}
                    </div>
                </div>
            </div>

            {/* Conteúdo expansível */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'
                }`}>
                {children}
            </div>
        </div>
    )
}
