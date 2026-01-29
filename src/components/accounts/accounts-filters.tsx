"use client"

import type { Client, Supplier } from "@/app/home/orders/order.interface"
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
import { Status, Status_String } from "@/constants/order-status"
import { Calendar, Search, X } from "lucide-react"
import { useState } from "react"

interface AccountsFiltersProps {
    clients: Client[]
    suppliers: Supplier[]
    onFiltersChange: (filters: {
        dateStart?: string
        dateEnd?: string
        statuses?: number[]
        clientId?: number
        supplierId?: number
    }) => void
    isLoading?: boolean
}

// Status disponíveis no módulo de contas a pagar
const STATUS_OPTIONS = [
    { value: Status.PendingPurchase, label: Status_String.PendingPurchase },
    { value: Status.ConfirmSale, label: Status_String.ConfirmSale },
]

export function AccountsFilters({
    clients,
    suppliers,
    onFiltersChange,
    isLoading = false
}: AccountsFiltersProps) {
    const [dateStart, setDateStart] = useState("")
    const [dateEnd, setDateEnd] = useState("")
    const [selectedStatus, setSelectedStatus] = useState<string>("all")
    const [selectedClient, setSelectedClient] = useState<string>("all")
    const [selectedSupplier, setSelectedSupplier] = useState<string>("all")

    const handleApplyFilters = () => {
        const filters: {
            dateStart?: string
            dateEnd?: string
            statuses?: number[]
            clientId?: number
            supplierId?: number
        } = {}

        if (dateStart) filters.dateStart = dateStart
        if (dateEnd) filters.dateEnd = dateEnd
        if (selectedStatus && selectedStatus !== "all") filters.statuses = [parseInt(selectedStatus)]
        if (selectedClient && selectedClient !== "all") filters.clientId = parseInt(selectedClient)
        if (selectedSupplier && selectedSupplier !== "all") filters.supplierId = parseInt(selectedSupplier)

        onFiltersChange(filters)
    }

    const handleClearFilters = () => {
        setDateStart("")
        setDateEnd("")
        setSelectedStatus("all")
        setSelectedClient("all")
        setSelectedSupplier("all")
        onFiltersChange({})
    }

    const hasActiveFilters = dateStart || dateEnd || (selectedStatus && selectedStatus !== "all") || (selectedClient && selectedClient !== "all") || (selectedSupplier && selectedSupplier !== "all")

    return (
        <ExpandableFilterCard
            hasActiveFilters={hasActiveFilters}
            colorScheme="purple"
        >
            {/* Filters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
                {/* Date Start */}
                <div className="space-y-2 w-full">
                    <Label htmlFor="dateStart" className="text-sm font-semibold text-gray-700">
                        Data Inicial
                    </Label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                        <Input
                            id="dateStart"
                            type="date"
                            value={dateStart}
                            onChange={(e) => setDateStart(e.target.value)}
                            className="pl-10 h-11 bg-white border-gray-200 focus:border-purple-400 focus:ring-purple-400 rounded-lg w-full"
                            disabled={isLoading}
                        />
                    </div>
                </div>

                {/* Date End */}
                <div className="space-y-2 w-full">
                    <Label htmlFor="dateEnd" className="text-sm font-semibold text-gray-700">
                        Data Final
                    </Label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                        <Input
                            id="dateEnd"
                            type="date"
                            value={dateEnd}
                            onChange={(e) => setDateEnd(e.target.value)}
                            className="pl-10 h-11 bg-white border-gray-200 focus:border-purple-400 focus:ring-purple-400 rounded-lg w-full"
                            disabled={isLoading}
                        />
                    </div>
                </div>

                {/* Status */}
                <div className="space-y-2 w-full">
                    <Label className="text-sm font-semibold text-gray-700">Status</Label>
                    <Select
                        value={selectedStatus}
                        onValueChange={setSelectedStatus}
                        disabled={isLoading}
                    >
                        <SelectTrigger className="h-11 bg-white border-gray-200 focus:border-purple-400 focus:ring-purple-400 rounded-lg w-full">
                            <SelectValue placeholder="Todos os status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os status</SelectItem>
                            {STATUS_OPTIONS.map((status) => (
                                <SelectItem key={status.value} value={status.value.toString()}>
                                    {status.label}
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
