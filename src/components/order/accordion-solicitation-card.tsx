"use client"

import type { Order, Solicitation } from "@/app/home/orders/order.interface";
import { Status, Status_String } from "@/constants/order-status";
import { formatDate } from "@/functions/format-functions";
import { getStatusColor } from "@/functions/style-functions";
import { Calendar, ChevronDown, ChevronUp, Package, Search, X } from "lucide-react";
import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { DialogFormOrder } from "./dialog-form-order";
import { OrderItemCard } from "./order-item.card";

interface AccordionSolicitationCardProps {
    solicitation: Solicitation;
    confirmedOrder: number[];
    setConfirmedOrder: Dispatch<SetStateAction<number[]>>;
    onUpdate: (orders: number[], value: number) => Promise<void>;
    type: "order" | "account";
    isUpdatingStatus?: boolean;
}

export const AccordionSolicitationCard = ({
    solicitation,
    confirmedOrder,
    setConfirmedOrder,
    onUpdate,
    type,
    isUpdatingStatus = false
}: AccordionSolicitationCardProps) => {
    const [itemsPerPage] = useState(15); // Quantidade de pedidos por página
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAll, setShowAll] = useState(false);
    // Lógica central de controle dos pedidos selecionáveis e status
    function isSelectable(order: Order) {
        if (type === "order") {
            // Não pode selecionar pedidos já em Pronta Entrega
            if (order.status === Status_String.ReadyForDelivery) return null;
            // Seleção para "Compra Realizada"
            if (order.status === Status_String.PendingPurchase) return "compra";
            // Seleção para "Conferido"
            if (order.status === Status_String.PaidPurchase && order.status_conference === Status_String.ToCheck) return "conferencia";
            // Seleção para "Pronta Entrega" (pedidos já conferidos)
            if (order.status === Status_String.PaidPurchase &&
                order.status_conference === Status_String.Checked) return "prontaEntrega";
            // Não selecionável
            return null;
        } else if (type === "account") {
            // Só pode selecionar "Compra Realizada" para quitar
            if (order.status === Status_String.ConfirmSale) return "quitar";
            return null;
        }
    }

    // Seleção individual
    function handleToggleSelect(item: Order) {
        const fluxo = isSelectable(item);
        if (!fluxo) {
            toast.warning("Seleção não permitida", {
                description: type === "order"
                    ? item.status === Status_String.ReadyForDelivery
                        ? "Pedido já está em Pronta Entrega."
                        : item.status === Status_String.PaidPurchase && item.status_conference === Status_String.Checked
                            ? "Pedido já conferido. Selecione para transformar em Pronta Entrega."
                            : "Pedido não está no status adequado para esta ação."
                    : "Apenas pedidos em 'Compra Realizada' podem ser quitados.",
                duration: 4000
            });
            return;
        }
        setConfirmedOrder(prev => prev.includes(item.id)
            ? prev.filter(id => id !== item.id)
            : [...prev, item.id]
        );
    }

    // Seleção em massa (considera apenas pedidos filtrados/visíveis)
    function handleSelectAll() {
        if (!filteredOrders.length) return;
        let selecionaveis: number[] = [];
        if (type === "order") {
            selecionaveis = filteredOrders
                .filter(order =>
                    order.status === Status_String.PendingPurchase ||
                    (order.status === Status_String.PaidPurchase && order.status_conference === Status_String.ToCheck) ||
                    (order.status === Status_String.PaidPurchase && order.status_conference === Status_String.Checked)
                )
                .map(order => order.id);
        } else if (type === "account") {
            selecionaveis = filteredOrders.filter(order => order.status === Status_String.ConfirmSale).map(order => order.id);
        }
        if (!selecionaveis.length) {
            toast.warning("Não há pedidos selecionáveis nos resultados atuais.");
            return false;
        }
        // Adiciona aos já selecionados (não substitui)
        setConfirmedOrder(prev => {
            const combined = [...new Set([...prev, ...selecionaveis])];
            return combined;
        });
        return true;
    }

    // Ação de confirmação depende do módulo
    async function handleConfirm() {
        if (!confirmedOrder.length) {
            toast.warning("Selecione ao menos um pedido.");
            return;
        }

        try {
            // PEDIDOS: se selecionando 'compra', muda para Realizada; se 'conferencia', muda substatus para Conferido; se 'prontaEntrega', muda para Pronta Entrega
            // CONTAS: quita
            if (type === "order") {
                const selectedOrders = solicitation.orderJoin?.filter(order => confirmedOrder.includes(order.id)) || [];

                // Verifica se TODOS são para Pronta Entrega (já conferidos)
                const isProntaEntrega = selectedOrders.every(order =>
                    order.status === Status_String.PaidPurchase &&
                    order.status_conference === Status_String.Checked
                );

                // Verifica se TODOS são para Conferência (quitados mas não conferidos)
                const isConferencia = selectedOrders.every(order =>
                    order.status === Status_String.PaidPurchase &&
                    order.status_conference === Status_String.ToCheck
                );

                if (isProntaEntrega) {
                    await onUpdate(confirmedOrder, Status.ReadyForDelivery); // Transforma em Pronta Entrega
                } else if (isConferencia) {
                    await onUpdate(confirmedOrder, Status.Checked); // Confirma conferência
                } else {
                    await onUpdate(confirmedOrder, Status.ConfirmSale); // Confirma compra
                }
            } else if (type === "account") {
                await onUpdate(confirmedOrder, Status.PaidPurchase);  // Quita
            }
            setConfirmedOrder([]);
        } catch (error) {
            console.error("Erro ao processar pagamento:", error);
            toast.error("Erro ao processar pagamento. Tente novamente.");
        }
    }

    // Filtro e paginação dos pedidos
    const filteredOrders = useMemo(() => {
        if (!solicitation.orderJoin?.length) return [];

        let filtered = solicitation.orderJoin;

        // Aplicar filtro de busca
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim();
            filtered = filtered.filter((order: Order) => {
                return (
                    order.code?.toLowerCase().includes(searchLower) ||
                    order.description?.toLowerCase().includes(searchLower) ||
                    order.brand?.toLowerCase().includes(searchLower) ||
                    order.size?.toLowerCase().includes(searchLower) ||
                    order.status?.toLowerCase().includes(searchLower) ||
                    order.status_conference?.toLowerCase().includes(searchLower) ||
                    order.client_infos?.client_name?.toLowerCase().includes(searchLower) ||
                    order.id?.toString().includes(searchLower)
                );
            });
        }

        return filtered;
    }, [solicitation.orderJoin, searchTerm]);

    // Pedidos paginados
    const paginatedOrders = useMemo(() => {
        if (showAll) return filteredOrders;
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredOrders, currentPage, itemsPerPage, showAll]);

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const hasMoreItems = filteredOrders.length > itemsPerPage && !showAll;
    const showingCount = showAll ? filteredOrders.length : Math.min(currentPage * itemsPerPage, filteredOrders.length);

    // Resetar página quando busca mudar
    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
        setShowAll(false);
    };

    // Dialogs/contextos
    const hasAnySelectable = solicitation.orderJoin?.some(isSelectable);
    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                <AccordionTrigger className="px-3 sm:px-4 py-3 sm:py-4 hover:no-underline group">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 w-full text-left">
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            <Package className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 flex-shrink-0" />
                            <div className="flex flex-col gap-1 min-w-0">
                                <span className="font-semibold text-gray-900 text-sm sm:text-base truncate">Pedido #{solicitation.id}</span>
                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                    {formatDate(solicitation.date_solicitation)}
                                </div>
                            </div>
                        </div>
                        <span
                            className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${getStatusColor(solicitation.status)} flex-shrink-0`}
                        >{solicitation.status}</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="px-3 sm:px-4 pb-3 sm:pb-4">
                    {type === "order" && <DialogFormOrder solicitation={solicitation.id} text="Cadastrar Pedido" variant="default" />}
                    {/* Seleção em massa & confirmação */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3 sm:mt-4 mb-3 sm:mb-4">
                        {hasAnySelectable && (
                            <Button
                                variant="outline"
                                onClick={handleSelectAll}
                                className="w-full sm:w-auto min-h-[44px] text-sm sm:text-base py-2.5 sm:py-3"
                            >
                                Selecionar todos válidos
                            </Button>
                        )}
                        {confirmedOrder.length > 0 && (() => {
                            const selectedOrders = solicitation.orderJoin?.filter((order: Order) => confirmedOrder.includes(order.id)) || [];

                            // Determina qual será o próximo status baseado nos pedidos selecionados
                            const getNextStatus = () => {
                                if (type === "account") {
                                    // No módulo Contas: Compra Realizada → Compra Quitada
                                    return {
                                        text: "Marcar como Compra Quitada",
                                        status: Status_String.PaidPurchase,
                                        color: "bg-green-600 hover:bg-green-700"
                                    };
                                }

                                // No módulo Pedidos: verifica o status atual dos selecionados
                                const isProntaEntrega = selectedOrders.every(order =>
                                    order.status === Status_String.PaidPurchase &&
                                    order.status_conference === Status_String.Checked
                                );

                                const isConferencia = selectedOrders.every(order =>
                                    order.status === Status_String.PaidPurchase &&
                                    order.status_conference === Status_String.ToCheck
                                );

                                const isCompraPendente = selectedOrders.every(order =>
                                    order.status === Status_String.PendingPurchase
                                );

                                if (isProntaEntrega) {
                                    return {
                                        text: "Marcar como Pronta a Entrega",
                                        status: Status_String.ReadyForDelivery,
                                        color: "bg-purple-600 hover:bg-purple-700"
                                    };
                                }

                                if (isConferencia) {
                                    return {
                                        text: "Marcar como Conferido",
                                        status: Status_String.Checked,
                                        color: "bg-emerald-600 hover:bg-emerald-700"
                                    };
                                }

                                if (isCompraPendente) {
                                    return {
                                        text: "Marcar como Compra Realizada",
                                        status: Status_String.ConfirmSale,
                                        color: "bg-blue-600 hover:bg-blue-700"
                                    };
                                }

                                // Caso misto ou não identificado
                                return {
                                    text: "Confirmar seleção",
                                    status: null,
                                    color: ""
                                };
                            };

                            const nextStatus = getNextStatus();

                            return (
                                <>
                                    <Button
                                        variant="default"
                                        onClick={handleConfirm}
                                        disabled={isUpdatingStatus}
                                        className={`w-full sm:w-auto min-h-[44px] text-sm sm:text-base py-2.5 sm:py-3 ${nextStatus.color || ""}`}
                                    >
                                        {isUpdatingStatus ? (
                                            <>
                                                <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Processando...
                                            </>
                                        ) : (
                                            <>
                                                {nextStatus.text} ({confirmedOrder.length})
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setConfirmedOrder([])}
                                        className="w-full sm:w-auto min-h-[44px] text-sm sm:text-base py-2.5 sm:py-3 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                                    >
                                        Desmarcar todos
                                    </Button>
                                </>
                            );
                        })()}
                    </div>
                    <div className="mb-3 sm:mb-4 pt-2 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                            <h4 className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Package className="w-4 h-4 flex-shrink-0" />
                                Itens do Pedido ({solicitation.orderJoin?.length || 0})
                                {searchTerm && ` - ${filteredOrders.length} encontrado${filteredOrders.length !== 1 ? "s" : ""}`}
                            </h4>
                            {solicitation.orderJoin && solicitation.orderJoin.length > 10 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowAll(!showAll)}
                                    className="text-xs h-8 px-2"
                                >
                                    {showAll ? (
                                        <>
                                            <ChevronUp className="w-3 h-3 mr-1" />
                                            Mostrar menos
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown className="w-3 h-3 mr-1" />
                                            Ver todos
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>

                        {/* Busca dentro da solicitação */}
                        {solicitation.orderJoin && solicitation.orderJoin.length > 5 && (
                            <div className="relative">
                                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    type="text"
                                    placeholder="Buscar pedidos nesta solicitação..."
                                    value={searchTerm}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="pl-8 pr-8 h-9 text-sm"
                                />
                                {searchTerm && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleSearchChange("")}
                                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                                    >
                                        <X className="w-3 h-3" />
                                    </Button>
                                )}
                            </div>
                        )}

                        {/* Informação de paginação */}
                        {filteredOrders.length > 0 && filteredOrders.length > itemsPerPage && !showAll && (
                            <div className="text-xs text-gray-500 flex items-center justify-between">
                                <span>
                                    Mostrando {showingCount} de {filteredOrders.length} pedidos
                                </span>
                                <span>
                                    Página {currentPage} de {totalPages}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-2 sm:gap-3">
                        {paginatedOrders.length > 0 ? (
                            <>
                                {paginatedOrders.map((item: Order) => (
                                    <OrderItemCard
                                        key={item.id}
                                        type={type}
                                        item={item}
                                        isSelected={confirmedOrder.includes(item.id)}
                                        onToggleSelect={() => handleToggleSelect(item)}
                                    />
                                ))}

                                {/* Controles de paginação */}
                                {hasMoreItems && !showAll && (
                                    <div className="flex items-center justify-center gap-2 pt-2 border-t">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            disabled={currentPage === 1}
                                            className="min-h-[36px] text-xs"
                                        >
                                            Anterior
                                        </Button>
                                        <span className="text-xs text-gray-600 px-2">
                                            {currentPage} / {totalPages}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                            disabled={currentPage === totalPages}
                                            className="min-h-[36px] text-xs"
                                        >
                                            Próxima
                                        </Button>
                                        {filteredOrders.length > itemsPerPage && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setShowAll(true)}
                                                className="min-h-[36px] text-xs ml-2"
                                            >
                                                Ver todos ({filteredOrders.length})
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </>
                        ) : (
                            <EmptyState searchTerm={searchTerm} onClearSearch={() => handleSearchChange("")} />
                        )}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};

const EmptyState = ({ searchTerm, onClearSearch }: { searchTerm?: string; onClearSearch?: () => void }) => (
    <div className="text-center py-8 text-gray-500">
        <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p className="text-sm mb-2">
            {searchTerm ? "Nenhum pedido encontrado para esta busca" : "Nenhum item encontrado"}
        </p>
        {searchTerm && onClearSearch && (
            <Button variant="outline" size="sm" onClick={onClearSearch} className="mt-2">
                Limpar busca
            </Button>
        )}
    </div>
);
