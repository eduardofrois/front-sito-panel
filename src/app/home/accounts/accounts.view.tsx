import { AccountsList } from "@/components/accounts/accounts-list"
import { AccountsReceive } from "@/components/accounts/accounts-receive"
import { IsLoadingCard } from "@/components/global/isloading-card"
import { NotFoundOrder } from "@/components/global/not-found-order"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { triggerStyle } from "@/constants/style/trigger.style"
import { Package, ShoppingCart } from "lucide-react"
import { useAccountsModel } from "./accounts.model"

type AccountsViewProps = ReturnType<typeof useAccountsModel>

export const AccountsView = (props: AccountsViewProps) => {
    const { data, isLoading, selectedOrders, setSelectedOrders, totalValueToPay, onUpdate, handleCardClick, canSelectCard, firstSelectedOrder, isLoadingPending,
        ordersPending, isLoadingSolicitations, solicitations, isUpdatingStatus, paginationPending, setPaginationPending } = props

    if (isLoadingSolicitations) return <IsLoadingCard />

    if (solicitations.length === 0) return <NotFoundOrder />

    return (
        <div className="pb-6">
            <Tabs defaultValue="accounts-list" className="w-full">
                <TabsList className="grid w-full grid-cols-2 p-1 h-12 bg-white">
                    <TabsTrigger value="accounts-list" className={triggerStyle}>
                        <ShoppingCart className="w-4 h-4" />
                        <span className="hidden sm:inline">Contas a Pagar</span>
                        <span className="sm:hidden">Contas a Pagar</span>
                    </TabsTrigger>
                    <TabsTrigger value="accounts-receive" className={triggerStyle}>
                        <Package className="w-4 h-4" />
                        <span className="hidden sm:inline">Contas a Receber</span>
                        <span className="sm:hidden">Contas a Receber</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="accounts-list" className="mt-0 p-4 sm:p-6">
                    <AccountsList
                        canSelectCard={canSelectCard}
                        data={data}
                        firstSelectedOrder={firstSelectedOrder}
                        handleCardClick={handleCardClick}
                        onUpdate={onUpdate}
                        selectedOrders={selectedOrders}
                        setSelectedOrders={setSelectedOrders}
                        totalValueToPay={totalValueToPay}
                        isUpdatingStatus={isUpdatingStatus}
                    />
                </TabsContent>

                <TabsContent value="accounts-receive" className="mt-0 p-4 sm:p-6">
                    <AccountsReceive
                        isLoadingPending={isLoadingPending}
                        orders={ordersPending || []}
                        pagination={paginationPending}
                        setPagination={setPaginationPending}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}