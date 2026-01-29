"use client"

import { EntregasView } from "@/components/readytoship/entregas-view"
import { RecebimentoView } from "@/components/readytoship/recebimento-view"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { triggerStyle } from "@/constants/style/trigger.style"
import { Package, Truck } from "lucide-react"
import type { useReadyToShipModel } from "./readytoship.model"

type ReadyToShipViewProps = ReturnType<typeof useReadyToShipModel>

export const ReadyToShipView = (props: ReadyToShipViewProps) => {
    const {
        // Aba 1: Recebimento
        ordersRecebimento,
        isLoadingRecebimento,
        paginationRecebimento,
        handlePageChangeRecebimento,
        handleFiltersChangeRecebimento,
        selectedRecebimento,
        setSelectedRecebimento,
        handleConfirmRecebimento,

        // Aba 2: Entregas
        ordersEntregas,
        isLoadingEntregas,
        paginationEntregas,
        handlePageChangeEntregas,
        handleFiltersChangeEntregas,
        selectedEntregas,
        toggleEntregaSelection,
        getEntregaAction,
        handleConfirmEntregas,

        // Common
        clients,
        suppliers,
        isUpdatingStatus,
    } = props

    return (
        <div className="pb-6">
            <Tabs defaultValue="recebimento" className="w-full">
                <TabsList className="grid w-full grid-cols-2 p-1 h-12 bg-white rounded-lg shadow-sm border border-gray-200">
                    <TabsTrigger value="recebimento" className={triggerStyle}>
                        <Package className="w-4 h-4" />
                        <span className="hidden sm:inline">Recebimento de Mercadoria</span>
                        <span className="sm:hidden">Recebimento</span>
                    </TabsTrigger>
                    <TabsTrigger value="entregas" className={triggerStyle}>
                        <Truck className="w-4 h-4" />
                        <span className="hidden sm:inline">Entregas</span>
                        <span className="sm:hidden">Entregas</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="recebimento" className="mt-4">
                    <RecebimentoView
                        orders={ordersRecebimento}
                        clients={clients}
                        suppliers={suppliers}
                        isLoading={isLoadingRecebimento}
                        isUpdatingStatus={isUpdatingStatus}
                        pagination={paginationRecebimento}
                        onPageChange={handlePageChangeRecebimento}
                        onFiltersChange={handleFiltersChangeRecebimento}
                        selectedOrders={selectedRecebimento}
                        setSelectedOrders={setSelectedRecebimento}
                        onConfirm={handleConfirmRecebimento}
                    />
                </TabsContent>

                <TabsContent value="entregas" className="mt-4">
                    <EntregasView
                        orders={ordersEntregas}
                        clients={clients}
                        suppliers={suppliers}
                        isLoading={isLoadingEntregas}
                        isUpdatingStatus={isUpdatingStatus}
                        pagination={paginationEntregas}
                        onPageChange={handlePageChangeEntregas}
                        onFiltersChange={handleFiltersChangeEntregas}
                        selectedEntregas={selectedEntregas}
                        toggleEntregaSelection={toggleEntregaSelection}
                        getEntregaAction={getEntregaAction}
                        onConfirm={handleConfirmEntregas}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}
