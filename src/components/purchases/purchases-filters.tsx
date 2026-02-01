"use client"

import type { Supplier } from "@/app/home/orders/order.interface"
import { ExpandableFilterCard } from "@/components/shared/expandable-filter-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { PurchaseStatusCompra, PurchaseStatusPagamento } from "@/constants/purchase-status"
import { Search, X } from "lucide-react"
import { useState } from "react"

interface PurchasesFiltersProps {
    suppliers: Supplier[]
    onFiltersChange: (filters: {
        productSearch?: string
        supplierId?: number
        statusCompra?: string
        statusPagamento?: string
    }) => void
    isLoading?: boolean
}

const STATUS_COMPRA_OPTIONS = [
    { value: PurchaseStatusCompra.Pending, label: PurchaseStatusCompra.Pending },
    { value: PurchaseStatusCompra.Done, label: PurchaseStatusCompra.Done },
]

const STATUS_PAGAMENTO_OPTIONS = [
    { value: PurchaseStatusPagamento.Pending, label: PurchaseStatusPagamento.Pending },
    { value: PurchaseStatusPagamento.Partial, label: PurchaseStatusPagamento.Partial },
    { value: PurchaseStatusPagamento.Full, label: PurchaseStatusPagamento.Full },
]

export function PurchasesFilters({
    suppliers,
    onFiltersChange,
    isLoading = false,
}: PurchasesFiltersProps) {
    const [productSearch, setProductSearch] = useState("")
    const [selectedSupplier, setSelectedSupplier] = useState<string>("all")
    const [selectedStatusCompra, setSelectedStatusCompra] = useState<string>("all")
    const [selectedStatusPagamento, setSelectedStatusPagamento] = useState<string>("all")

    const handleApplyFilters = () => {
        const filters: {
            productSearch?: string
            supplierId?: number
            statusCompra?: string
            statusPagamento?: string
        } = {}
        if (productSearch.trim()) filters.productSearch = productSearch.trim()
        if (selectedSupplier !== "all") filters.supplierId = parseInt(selectedSupplier)
        if (selectedStatusCompra !== "all") filters.statusCompra = selectedStatusCompra
        if (selectedStatusPagamento !== "all") filters.statusPagamento = selectedStatusPagamento
        onFiltersChange(filters)
    }

    const handleClearFilters = () => {
        setProductSearch("")
        setSelectedSupplier("all")
        setSelectedStatusCompra("all")
        setSelectedStatusPagamento("all")
        onFiltersChange({})
    }

    const hasActiveFilters = !!(
        productSearch.trim() ||
        (selectedSupplier !== "all") ||
        (selectedStatusCompra !== "all") ||
        (selectedStatusPagamento !== "all")
    )

    return (
        <ExpandableFilterCard hasActiveFilters={hasActiveFilters} colorScheme="purple">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                <div className="space-y-2 w-full">
                    <Label className="text-sm font-semibold text-gray-700">Produto</Label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                        <Input
                            placeholder="Código, marca, descrição..."
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                            className="pl-10 h-11 bg-white border-gray-200 focus:border-purple-400 focus:ring-purple-400 rounded-lg w-full"
                            disabled={isLoading}
                        />
                    </div>
                </div>
                <div className="space-y-2 w-full">
                    <Label className="text-sm font-semibold text-gray-700">Fornecedor</Label>
                    <Select
                        value={selectedSupplier}
                        onValueChange={setSelectedSupplier}
                        disabled={isLoading}
                    >
                        <SelectTrigger className="h-11 bg-white border-gray-200 focus:border-purple-400 focus:ring-purple-400 rounded-lg w-full">
                            <SelectValue placeholder="Todos os fornecedores" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os fornecedores</SelectItem>
                            {suppliers.map((s) => (
                                <SelectItem key={s.id} value={s.id.toString()}>
                                    {s.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2 w-full">
                    <Label className="text-sm font-semibold text-gray-700">Status da compra</Label>
                    <Select
                        value={selectedStatusCompra}
                        onValueChange={setSelectedStatusCompra}
                        disabled={isLoading}
                    >
                        <SelectTrigger className="h-11 bg-white border-gray-200 focus:border-purple-400 focus:ring-purple-400 rounded-lg w-full">
                            <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            {STATUS_COMPRA_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2 w-full">
                    <Label className="text-sm font-semibold text-gray-700">Status do pagamento</Label>
                    <Select
                        value={selectedStatusPagamento}
                        onValueChange={setSelectedStatusPagamento}
                        disabled={isLoading}
                    >
                        <SelectTrigger className="h-11 bg-white border-gray-200 focus:border-purple-400 focus:ring-purple-400 rounded-lg w-full">
                            <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            {STATUS_PAGAMENTO_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-purple-100">
                <Button
                    onClick={handleApplyFilters}
                    disabled={isLoading}
                    variant={"default"}
                    className="w-full sm:w-auto"
                >
                    <Search className="w-4 h-4 mr-2" />
                    Aplicar Filtros
                </Button>
                {hasActiveFilters && (
                    <Button
                        variant="outline"
                        onClick={handleClearFilters}
                        disabled={isLoading}
                        className="flex-1 sm:flex-none h-11 px-6 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-semibold rounded-lg transition-all"
                    >
                        <X className="w-4 h-4 mr-2" />
                        Limpar Filtros
                    </Button>
                )}
            </div>
        </ExpandableFilterCard>
    )
}
