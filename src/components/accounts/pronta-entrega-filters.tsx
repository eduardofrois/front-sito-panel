"use client"

import type { Client, Supplier } from "@/app/home/orders/order.interface"
import { ExpandableFilterCard } from "@/components/shared/expandable-filter-card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Search, X } from "lucide-react"
import { useState } from "react"

interface ProntaEntregaFiltersProps {
    clients: Client[]
    suppliers: Supplier[]
    onFiltersChange: (filters: {
        clientId?: number
        supplierId?: number
    }) => void
    isLoading?: boolean
}

export function ProntaEntregaFilters({
    clients,
    suppliers,
    onFiltersChange,
    isLoading = false
}: ProntaEntregaFiltersProps) {
    const [selectedClient, setSelectedClient] = useState<string>("all")
    const [selectedSupplier, setSelectedSupplier] = useState<string>("all")

    const handleApplyFilters = () => {
        const filters: {
            clientId?: number
            supplierId?: number
        } = {}

        if (selectedClient && selectedClient !== "all") filters.clientId = parseInt(selectedClient)
        if (selectedSupplier && selectedSupplier !== "all") filters.supplierId = parseInt(selectedSupplier)

        onFiltersChange(filters)
    }

    const handleClearFilters = () => {
        setSelectedClient("all")
        setSelectedSupplier("all")
        onFiltersChange({})
    }

    const hasActiveFilters = Boolean((selectedClient && selectedClient !== "all") || (selectedSupplier && selectedSupplier !== "all"))

    return (
        <ExpandableFilterCard
            hasActiveFilters={hasActiveFilters}
            colorScheme="purple"
        >
            {/* Filters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                {/* Supplier */}
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
                            {suppliers.map((supplier) => (
                                <SelectItem key={supplier.id} value={supplier.id.toString()}>
                                    {supplier.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Client */}
                <div className="space-y-2 w-full">
                    <Label className="text-sm font-semibold text-gray-700">Cliente</Label>
                    <Select
                        value={selectedClient}
                        onValueChange={setSelectedClient}
                        disabled={isLoading}
                    >
                        <SelectTrigger className="h-11 bg-white border-gray-200 focus:border-purple-400 focus:ring-purple-400 rounded-lg w-full">
                            <SelectValue placeholder="Todos os clientes" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os clientes</SelectItem>
                            {clients.map((client) => (
                                <SelectItem key={client.id} value={client.id.toString()}>
                                    {client.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Actions */}
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
