"use client"

import type { Client, Supplier } from "@/app/home/orders/order.interface"
import { ExpandableFilterCard } from "@/components/shared/expandable-filter-card"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useCallback, useState } from "react"

interface ReadyToShipFiltersProps {
    clients: Client[]
    suppliers: Supplier[]
    onFiltersChange: (filters: { clientId?: number; supplierId?: number }) => void
    isLoading: boolean
}

export function ReadyToShipFilters({
    clients,
    suppliers,
    onFiltersChange,
    isLoading,
}: ReadyToShipFiltersProps) {
    const [clientId, setClientId] = useState<string>("")
    const [supplierId, setSupplierId] = useState<string>("")

    const handleClientChange = useCallback((value: string) => {
        setClientId(value)
        onFiltersChange({
            clientId: value && value !== "all" ? Number(value) : undefined,
            supplierId: supplierId && supplierId !== "all" ? Number(supplierId) : undefined,
        })
    }, [supplierId, onFiltersChange])

    const handleSupplierChange = useCallback((value: string) => {
        setSupplierId(value)
        onFiltersChange({
            clientId: clientId && clientId !== "all" ? Number(clientId) : undefined,
            supplierId: value && value !== "all" ? Number(value) : undefined,
        })
    }, [clientId, onFiltersChange])

    const hasActiveFilters = Boolean(
        (clientId && clientId !== "all") ||
        (supplierId && supplierId !== "all")
    )

    return (
        <ExpandableFilterCard hasActiveFilters={hasActiveFilters}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Fornecedor */}
                <div className="space-y-2">
                    <Label htmlFor="supplier" className="text-sm font-medium text-gray-700">
                        Fornecedor
                    </Label>
                    <Select value={supplierId} onValueChange={handleSupplierChange} disabled={isLoading}>
                        <SelectTrigger id="supplier" className="w-full">
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

                {/* Cliente */}
                <div className="space-y-2">
                    <Label htmlFor="client" className="text-sm font-medium text-gray-700">
                        Cliente
                    </Label>
                    <Select value={clientId} onValueChange={handleClientChange} disabled={isLoading}>
                        <SelectTrigger id="client" className="w-full">
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
        </ExpandableFilterCard>
    )
}
