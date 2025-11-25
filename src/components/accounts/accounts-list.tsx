"use client"

import { useAccountsModel } from "@/app/home/accounts/accounts.model"
import type { Order, Solicitation } from "@/app/home/orders/order.interface"
import { type Dispatch, type SetStateAction, useMemo, useState } from "react"
import { AccordionSolicitationCard } from "../order/accordion-solicitation-card"

interface iProps {
    data: Order[]
    selectedOrders: number[]
    totalValueToPay: (codes: number[], data: Order[]) => number
    firstSelectedOrder: Order | null
    onUpdate: (orders: number[], value: number) => Promise<void>
    setSelectedOrders: Dispatch<SetStateAction<number[]>>
    handleCardClick: (isSelected: boolean, order: Order) => void
    canSelectCard: (order: Order) => boolean
}

export const AccountsList = ({
    data,
    selectedOrders,
    totalValueToPay,
    firstSelectedOrder,
    onUpdate,
    setSelectedOrders,
    handleCardClick,
    canSelectCard
}: iProps) => {
    const { solicitations, isLoadingSolicitations, refetchSolicitation, confirmedOrder, setConfirmedOrder } = useAccountsModel()

    const [searchTerm, setSearchTerm] = useState("")

    // Filter logic that searches through all Order fields
    const filteredData = useMemo(() => {
        if (!searchTerm.trim()) return data

        const searchLower = searchTerm.toLowerCase().trim()

        return data.filter((order) => {
            // Search in all string and number fields
            const searchableFields = [
                order.id?.toString(),
                order.code,
                order.description,
                order.size,
                order.amount?.toString(),
                order.cost_price?.toString(),
                order.sale_price?.toString(),
                order.total_price?.toString(),
                order.status,
                order.date_creation_order,
                order.tenant_id?.toString(),
                order.brand,
                order.date_order,
                order.date_purchase_order,
                order.client_infos?.client_id?.toString(),
                order.client_infos?.client_name,
                order.status_conference,
                order.date_conference,
                order.paid_price?.toString(),
            ]

            return searchableFields.some((field) => field?.toLowerCase().includes(searchLower))
        })
    }, [data, searchTerm])

    const clearSearch = () => {
        setSearchTerm("")
    }

    return (
        <>
            {/* <div className="top-0 bg-white border-b border-gray-200 px-4 py-3 mb-4 z-10">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Pedidos de Compra</h2>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {filteredData.length} {filteredData.length === 1 ? "pedido" : "pedidos"}
                            {searchTerm && filteredData.length !== data.length && (
                                <span className="text-xs ml-1">de {data.length}</span>
                            )}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Search className="text-gray-400 w-4 h-4" />
                        <Input
                            type="text"
                            placeholder="Filtrar por código, descrição, cliente, status..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearSearch}
                                className="h-8 w-8 p-0 hover:bg-gray-100"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </div> */}

            <div className="top-0 bg-white border-b border-gray-200 px-4 py-3 mb-4 z-10">
                <p className="text-sm text-gray-700">
                    Clique nos cards em azul para selecionar os itens que deseja quitar.
                    Ao confirmar, o status será atualizado para <strong>Compra Quitada</strong>.
                </p>
            </div>

            <div className="flex flex-col gap-4">
                {solicitations.map((solicitation: Solicitation, idx: number) => (
                    <AccordionSolicitationCard
                        key={solicitation.id ?? idx}
                        solicitation={solicitation}
                        confirmedOrder={confirmedOrder}
                        setConfirmedOrder={setConfirmedOrder}
                        onUpdate={onUpdate}
                        type="account"
                    />
                ))}
            </div >

            <div className="mt-8 px-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-xs text-gray-500">
                        {searchTerm ? (
                            <>
                                Mostrando {filteredData.length} de {solicitations.order.length} pedidos
                            </>
                        ) : (
                            <>Mostrando todos os {solicitations.length} pedidos</>
                        )}
                    </p>
                </div>
            </div>
        </>
    )
}
