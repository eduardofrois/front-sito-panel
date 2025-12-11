"use client"

import type { Order, Solicitation } from "@/app/home/orders/order.interface"
import { type Dispatch, type SetStateAction } from "react"
import { AccordionSolicitationCard } from "../order/accordion-solicitation-card"
import { Pagination } from "../ui/pagination"

interface iProps {
    data: Solicitation[]
    selectedOrders: number[]
    totalValueToPay: (codes: number[], data: Order[]) => number
    firstSelectedOrder: Order | null
    onUpdate: (orders: number[], value: number) => Promise<void>
    setSelectedOrders: Dispatch<SetStateAction<number[]>>
    handleCardClick: (isSelected: boolean, order: Order) => void
    canSelectCard: (order: Order) => boolean
    isUpdatingStatus?: boolean
    pagination?: { pageIndex: number; pageSize: number }
    setPagination?: Dispatch<SetStateAction<{ pageIndex: number; pageSize: number }>>
    totalPages?: number
    isLoading?: boolean
    confirmedOrder: number[]
    setConfirmedOrder: Dispatch<SetStateAction<number[]>>
}

export const AccountsList = ({
    data,
    selectedOrders,
    totalValueToPay,
    firstSelectedOrder,
    onUpdate,
    setSelectedOrders,
    handleCardClick,
    canSelectCard,
    isUpdatingStatus = false,
    pagination,
    setPagination,
    totalPages,
    isLoading = false,
    confirmedOrder,
    setConfirmedOrder
}: iProps) => {

    return (
        <div>
            <div className="top-0 bg-white border-b border-gray-200 px-4 py-3 mb-4 z-10">
                <p className="text-sm text-gray-700">
                    Clique nos cards em azul para selecionar os itens que deseja quitar.
                    Ao confirmar, o status será atualizado para <strong>Compra Quitada</strong>.
                </p>
            </div>

            <div className="flex flex-col gap-4">
                {data.map((solicitation: Solicitation, idx: number) => (
                    <AccordionSolicitationCard
                        key={solicitation.id ?? idx}
                        solicitation={solicitation}
                        confirmedOrder={confirmedOrder}
                        setConfirmedOrder={setConfirmedOrder}
                        onUpdate={onUpdate}
                        type="account"
                        isUpdatingStatus={isUpdatingStatus}
                    />
                ))}
            </div >

            {pagination && setPagination && (
                <Pagination
                    pageIndex={pagination.pageIndex}
                    pageSize={pagination.pageSize}
                    totalPages={totalPages}
                    currentDataLength={data.length}
                    onPageChange={(page) => setPagination(prev => ({ ...prev, pageIndex: page }))}
                    disabled={isLoading}
                />
            )}
        </div>
    )
}
