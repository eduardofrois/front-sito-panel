"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { getCardStylesFromOrder } from "@/constants/card-state-helper"
import { getStatusColor } from "@/functions/style-functions"
import type { ReactNode } from "react"

export interface TableColumn<T> {
    key: string
    header: string
    accessor: (item: T) => ReactNode
    align?: 'left' | 'center' | 'right'
    className?: string
}

interface SharedDataTableProps<T extends { id: number; status?: string }> {
    data: T[]
    columns: TableColumn<T>[]
    showCheckbox?: boolean
    selectedIds?: number[]
    onToggleSelect?: (item: T) => void
    onSelectAll?: () => void
    isLoading?: boolean
    emptyMessage?: string
    emptySubMessage?: string
    getRowStyles?: (item: T, isSelected: boolean) => { background: string; text: string }
    canSelect?: (item: T) => boolean
}

export function SharedDataTable<T extends { id: number; status?: string }>({
    data,
    columns,
    showCheckbox = false,
    selectedIds = [],
    onToggleSelect,
    onSelectAll,
    isLoading = false,
    emptyMessage = "Nenhum item para exibir.",
    emptySubMessage = "Tente ajustar os filtros de busca.",
    getRowStyles,
    canSelect,
}: SharedDataTableProps<T>) {
    if (!data || data.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                <p className="text-lg font-medium">{emptyMessage}</p>
                {emptySubMessage && <p className="text-sm mt-1">{emptySubMessage}</p>}
            </div>
        )
    }

    const allSelected = data.length > 0 && data.every(item => selectedIds.includes(item.id))
    const someSelected = data.some(item => selectedIds.includes(item.id)) && !allSelected

    // Calculate min-width based on columns
    const minWidth = showCheckbox ? 900 + 50 : 900

    return (
        <div className="w-full overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className={`w-full text-sm text-left min-w-[${minWidth}px]`}>
                <thead className="text-xs text-gray-600 uppercase bg-gradient-to-r from-purple-50 to-blue-50 border-b sticky top-0">
                    <tr>
                        {showCheckbox && (
                            <th className="p-3 w-12 text-center">
                                {onSelectAll && (
                                    <Checkbox
                                        checked={allSelected}
                                        ref={(el) => {
                                            if (el) {
                                                (el as HTMLButtonElement).dataset.state = someSelected ? "indeterminate" : allSelected ? "checked" : "unchecked"
                                            }
                                        }}
                                        onCheckedChange={() => onSelectAll()}
                                        className="border-gray-400"
                                        disabled={isLoading}
                                    />
                                )}
                            </th>
                        )}
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className={`p-3 whitespace-nowrap ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : ''} ${column.className || ''}`}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => {
                        const isSelected = selectedIds.includes(item.id)
                        const styles = getRowStyles
                            ? getRowStyles(item, isSelected)
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            : getCardStylesFromOrder(item as any, isSelected)

                        return (
                            <tr
                                key={item.id}
                                onClick={() => showCheckbox && !isLoading && onToggleSelect?.(item)}
                                className={`
                                    border-b last:border-0 transition-colors hover:bg-opacity-90
                                    ${styles.background} ${styles.text}
                                    ${showCheckbox ? 'cursor-pointer' : ''}
                                    ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
                                `}
                            >
                                {showCheckbox && (
                                    <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center justify-center">
                                            {(!canSelect || canSelect(item)) ? (
                                                <Checkbox
                                                    checked={isSelected}
                                                    onCheckedChange={() => !isLoading && onToggleSelect?.(item)}
                                                    className={isSelected ? "border-white data-[state=checked]:bg-white data-[state=checked]:text-purple-600" : "border-gray-400"}
                                                    disabled={isLoading}
                                                />
                                            ) : (
                                                <div className="w-4 h-4" /> // Empty placeholder to maintain layout
                                            )}
                                        </div>
                                    </td>
                                )}
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className={`p-3 whitespace-nowrap ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : ''} ${column.className || ''}`}
                                    >
                                        {column.accessor(item)}
                                    </td>
                                ))}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

// Helper component for status badge
export function StatusBadge({ status }: { status: string }) {
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold border bg-white/20 ${getStatusColor(status)}`}>
            {status}
        </span>
    )
}
