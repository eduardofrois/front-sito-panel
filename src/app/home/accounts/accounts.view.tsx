import { AccountsPayView } from "@/components/accounts/accounts-pay-view"
import { AccountsReceive } from "@/components/accounts/accounts-receive"
import { ProntaEntregaView } from "@/components/accounts/pronta-entrega-view"
import { IsLoadingCard } from "@/components/global/isloading-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { triggerStyle } from "@/constants/style/trigger.style"
import { Package, ShoppingCart, Truck } from "lucide-react"
import { useAccountsModel } from "./accounts.model"

type AccountsViewProps = ReturnType<typeof useAccountsModel>

export const AccountsView = (props: AccountsViewProps) => {
    const {
        // Contas a Pagar data
        ordersPay,
        isLoadingOrdersPay,
        paginationPay,
        handlePageChangePay,
        handleFiltersChange,
        handleUpdateStatus,
        isUpdatingStatus,
        // Contas a Receber data
        ordersReceive,
        isLoadingReceive,
        paginationReceive,
        setPaginationReceive,
        handleFiltersChangeReceive,
        // Pronta Entrega - Recebimento data
        ordersRecebimento,
        isLoadingRecebimento,
        paginationRecebimento,
        handlePageChangeRecebimento,
        handleFiltersChangeRecebimento,
        // Pronta Entrega - Entregas data
        ordersEntregas,
        isLoadingEntregas,
        paginationEntregas,
        handlePageChangeEntregas,
        handleFiltersChangeEntregas,
        // Common data
        clients,
        suppliers,
    } = props

    const isLoading = isLoadingOrdersPay

    if (isLoading && ordersPay.length === 0 && ordersReceive.length === 0 && ordersRecebimento.length === 0) {
        return <IsLoadingCard />
    }

    return (
        <div className="pb-6">
            <Tabs defaultValue="accounts-pay" className="w-full">
                <TabsList className="grid w-full grid-cols-3 p-1 h-12 bg-white">
                    <TabsTrigger value="accounts-pay" className={triggerStyle}>
                        <ShoppingCart className="w-4 h-4" />
                        <span className="hidden sm:inline">Contas a Pagar</span>
                        <span className="sm:hidden">Pagar</span>
                    </TabsTrigger>
                    <TabsTrigger value="pronta-entrega" className={triggerStyle}>
                        <Truck className="w-4 h-4" />
                        <span className="hidden sm:inline">Pronta Entrega</span>
                        <span className="sm:hidden">Entrega</span>
                    </TabsTrigger>
                    <TabsTrigger value="accounts-receive" className={triggerStyle}>
                        <Package className="w-4 h-4" />
                        <span className="hidden sm:inline">Contas a Receber</span>
                        <span className="sm:hidden">Receber</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="accounts-pay" className="mt-0 p-4 sm:p-6">
                    <AccountsPayView
                        orders={ordersPay}
                        clients={clients}
                        suppliers={suppliers}
                        isLoading={isLoadingOrdersPay}
                        isUpdatingStatus={isUpdatingStatus}
                        pagination={paginationPay}
                        onPageChange={handlePageChangePay}
                        onFiltersChange={handleFiltersChange}
                        onUpdateStatus={handleUpdateStatus}
                    />
                </TabsContent>

                <TabsContent value="pronta-entrega" className="mt-0 p-4 sm:p-6">
                    <ProntaEntregaView
                        // Aba 1: Recebimento
                        ordersRecebimento={ordersRecebimento}
                        isLoadingRecebimento={isLoadingRecebimento}
                        paginationRecebimento={paginationRecebimento}
                        onPageChangeRecebimento={handlePageChangeRecebimento}
                        onFiltersChangeRecebimento={handleFiltersChangeRecebimento}
                        // Aba 2: Entregas
                        ordersEntregas={ordersEntregas}
                        isLoadingEntregas={isLoadingEntregas}
                        paginationEntregas={paginationEntregas}
                        onPageChangeEntregas={handlePageChangeEntregas}
                        onFiltersChangeEntregas={handleFiltersChangeEntregas}
                        // Common
                        clients={clients}
                        suppliers={suppliers}
                        isUpdatingStatus={isUpdatingStatus}
                        onUpdateStatus={handleUpdateStatus}
                    />
                </TabsContent>

                <TabsContent value="accounts-receive" className="mt-0 p-4 sm:p-6">
                    <AccountsReceive
                        isLoading={isLoadingReceive}
                        orders={ordersReceive}
                        clients={clients}
                        suppliers={suppliers}
                        pagination={paginationReceive}
                        setPagination={setPaginationReceive}
                        totalPages={paginationReceive.totalPages}
                        onFiltersChange={handleFiltersChangeReceive}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}