"use client"

import { IsLoadingCard } from "@/components/global/isloading-card"
import { NotFoundOrder } from "@/components/global/not-found-order"
import { ReadyToShipCard } from "@/components/readytoship/ready-to-ship-card"
import { SelectClientModal } from "@/components/readytoship/select-client-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pagination } from "@/components/ui/pagination"
import { Eye, EyeOff, Package, Search, X } from "lucide-react"
import { useMemo, useState } from "react"
import type { Order } from "../orders/order.interface"
import type { useReadyToShipModel } from "./readytoship.model"

type ReadyToShipViewProps = ReturnType<typeof useReadyToShipModel>

export const ReadyToShipView = (props: ReadyToShipViewProps) => {
    const {
        data,
        totalPages,
        isLoading,
        clients,
        solicitations,
        selectedOrders,
        setSelectedOrders,
        handleAttachOrders,
        isPendingAddOrders,
        pagination,
        setPagination,
    } = props

    const [searchTerm, setSearchTerm] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)

    const filteredData = useMemo(() => {
        if (!searchTerm.trim()) return data

        const searchLower = searchTerm.toLowerCase()
        return data.filter((order: Order) => {
            return (
                order.code.toString().toLowerCase().includes(searchLower) ||
                order.description.toLowerCase().includes(searchLower) ||
                order.size.toLowerCase().includes(searchLower) ||
                order.brand.toLowerCase().includes(searchLower) ||
                order.status.toLowerCase().includes(searchLower) ||
                order.client_infos?.client_name?.toLowerCase().includes(searchLower) ||
                order.cost_price.toString().includes(searchLower) ||
                order.sale_price.toString().includes(searchLower) ||
                order.total_price.toString().includes(searchLower) ||
                order.amount.toString().includes(searchLower)
            )
        })
    }, [data, searchTerm])

    const handleSelectOrder = (orderId: number, selected: boolean) => {
        if (selected) {
            setSelectedOrders((prev) => [...prev, orderId])
        } else {
            setSelectedOrders((prev) => prev.filter((id) => id !== orderId))
        }
    }

    const handleSelectAll = () => {
        if (selectedOrders.length === filteredData.length) {
            setSelectedOrders([])
        } else {
            setSelectedOrders(filteredData.map((order: Order) => order.id))
        }
    }

    const handleClearSelection = () => {
        setSelectedOrders([])
    }

    if (isLoading) return <IsLoadingCard />

    const ordersData = Array.isArray(data) ? data : (data?.data || [])
    if (ordersData.length === 0 && !isLoading) return <NotFoundOrder />

    return (
        <div className="flex flex-col gap-4 pb-6">
            {/* Header com busca e ações */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4 shadow-sm">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                        <div className="flex-1">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
                                Pedidos Prontos para Entrega
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-600">
                                Selecione os pedidos e anexe a um cliente ou solicitação
                            </p>
                        </div>

                    </div>

                    {/* Barra de busca */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Pesquisar por código, descrição, cliente, marca..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* Controles de seleção */}
                    {filteredData.length > 0 && (
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 pt-2 border-t border-gray-100">
                            <div className="flex items-center gap-2 sm:gap-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleSelectAll}
                                    className="text-xs sm:text-sm"
                                >
                                    {selectedOrders.length === filteredData.length
                                        ? "Desmarcar todos"
                                        : "Selecionar todos"}
                                </Button>
                                {selectedOrders.length > 0 && (
                                    <>
                                        <span className="text-sm text-gray-600">
                                            {selectedOrders.length} selecionado(s)
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleClearSelection}
                                            className="text-xs sm:text-sm text-red-600 hover:text-red-700"
                                        >
                                            Limpar
                                        </Button>
                                    </>
                                )}
                            </div>

                            {selectedOrders.length > 0 && (
                                <Button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                                    size="sm"
                                >
                                    <Package className="h-4 w-4" />
                                    <span>Anexar {selectedOrders.length} pedido(s)</span>
                                </Button>
                            )}
                        </div>
                    )}

                    {searchTerm && (
                        <div className="text-xs sm:text-sm text-gray-600">
                            {filteredData.length} de {ordersData.length} pedido(s) encontrado(s)
                        </div>
                    )}
                </div>
            </div>

            {/* Lista de pedidos */}
            {filteredData.length === 0 && searchTerm ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">Nenhum pedido encontrado para "{searchTerm}"</p>
                    <Button variant="outline" onClick={() => setSearchTerm("")}>
                        Limpar filtro
                    </Button>
                </div>
            ) : (
                <>
                    <div className="flex flex-col gap-3 sm:gap-4 px-4 sm:px-6">
                        {filteredData.map((item: Order) => (
                            <ReadyToShipCard
                                key={item.id}
                                order={item}
                                isSelected={selectedOrders.includes(item.id)}
                                onSelect={handleSelectOrder}
                            />
                        ))}
                    </div>

                    {/* Paginação */}
                    {pagination && (
                        <Pagination
                            pageIndex={pagination.pageIndex}
                            pageSize={pagination.pageSize}
                            totalPages={totalPages}
                            currentDataLength={filteredData.length}
                            onPageChange={(page) => setPagination((prev) => ({ ...prev, pageIndex: page }))}
                            disabled={isLoading}
                        />
                    )}
                </>
            )}

            {/* Modal de seleção */}
            <SelectClientModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                clients={clients || []}
                solicitations={solicitations || []}
                selectedOrdersCount={selectedOrders.length}
                onConfirm={handleAttachOrders}
                isLoading={isPendingAddOrders}
            />
        </div>
    )
}
