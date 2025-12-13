import { Status_String } from "@/constants/order-status";

/**
 * Retorna classes CSS para badges de status baseado no status do pedido
 */
export const getStatusColor = (status: string | null | undefined): string => {
    if (!status) return "bg-gray-100 text-gray-800 border-gray-200";

    const statusColors: Record<string, string> = {
        [Status_String.PendingPurchase]: "bg-yellow-100 text-yellow-800 border-yellow-200",
        [Status_String.SaleToRecive]: "bg-cyan-100 text-cyan-800 border-cyan-200",
        [Status_String.ReadyForDelivery]: "bg-purple-100 text-purple-800 border-purple-200",
        [Status_String.ConfirmSale]: "bg-blue-100 text-blue-800 border-blue-200",
        [Status_String.PaidPurchase]: "bg-pink-100 text-pink-800 border-pink-200",
        [Status_String.ToCheck]: "bg-orange-100 text-orange-800 border-orange-200",
        [Status_String.Checked]: "bg-lime-100 text-lime-800 border-lime-200",
        [Status_String.PartialPayment]: "bg-amber-100 text-amber-800 border-amber-200",
        [Status_String.FullyPaid]: "bg-teal-100 text-teal-800 border-teal-200",
        [Status_String.DeliveredToClient]: "bg-indigo-100 text-indigo-800 border-indigo-200",
    };

    return statusColors[status] || "bg-gray-100 text-gray-800 border-gray-200";
};

/**
 * Retorna classes CSS completas para o card baseado no status e substatus do pedido
 * Considera também se está selecionado
 */
export const getOrderCardStyles = (
    order: { status: string; status_conference?: string | null },
    isSelected: boolean = false
): {
    background: string;
    border: string;
    text: string;
    accentBorder: string;
    hover: string;
} => {
    // Se selecionado, sempre usa cor de seleção (independente do status)
    if (isSelected) {
        return {
            background: "bg-purple-600",
            border: "border-purple-600",
            text: "text-white",
            accentBorder: "bg-purple-700",
            hover: "hover:bg-purple-700",
        };
    }

    // Mapeamento de cores baseado no status principal e substatus
    const { status, status_conference } = order;

    // Compra Pendente - Amarelo (aguardando ação)
    if (status === Status_String.PendingPurchase) {
        return {
            background: "bg-yellow-50",
            border: "border-yellow-200",
            text: "text-yellow-900",
            accentBorder: "bg-yellow-400",
            hover: "hover:bg-yellow-100 hover:border-yellow-300",
        };
    }

    // Compra Realizada - Azul (processando)
    if (status === Status_String.ConfirmSale) {
        return {
            background: "bg-blue-50",
            border: "border-blue-200",
            text: "text-blue-900",
            accentBorder: "bg-blue-400",
            hover: "hover:bg-blue-100 hover:border-blue-300",
        };
    }

    // Pagamento Parcial - Âmbar (pagamento em andamento)
    if (status === Status_String.PartialPayment) {
        return {
            background: "bg-amber-50",
            border: "border-amber-200",
            text: "text-amber-900",
            accentBorder: "bg-amber-400",
            hover: "hover:bg-amber-100 hover:border-amber-300",
        };
    }

    // Pagamento Quitado - Teal (totalmente pago)
    if (status === Status_String.FullyPaid) {
        return {
            background: "bg-teal-50",
            border: "border-teal-200",
            text: "text-teal-900",
            accentBorder: "bg-teal-400",
            hover: "hover:bg-teal-100 hover:border-teal-300",
        };
    }

    // Compra Quitada - Verde (pago, mas pode ter conferência pendente)
    if (status === Status_String.PaidPurchase) {
        // Se tem conferência pendente (A Conferir) - Laranja
        if (status_conference === Status_String.ToCheck) {
            return {
                background: "bg-orange-50",
                border: "border-orange-200",
                text: "text-orange-900",
                accentBorder: "bg-orange-400",
                hover: "hover:bg-orange-100 hover:border-orange-300",
            };
        }
        // Se já foi conferido - Verde esmeralda
        if (status_conference === Status_String.Checked) {
            return {
                background: "bg-lime-50",
                border: "border-lime-200",
                text: "text-lime-900",
                accentBorder: "bg-lime-400",
                hover: "hover:bg-lime-100 hover:border-lime-300",
            };
        }
        // Quitado mas sem conferência definida ainda - Verde padrão
        return {
            background: "bg-pink-50",
            border: "border-pink-200",
            text: "text-pink-900",
            accentBorder: "bg-pink-400",
            hover: "hover:bg-pink-100 hover:border-pink-300",
        };
    }

    // Pronta a Entrega - Roxo (estoque)
    if (status === Status_String.ReadyForDelivery) {
        return {
            background: "bg-purple-50",
            border: "border-purple-200",
            text: "text-purple-900",
            accentBorder: "bg-purple-400",
            hover: "hover:bg-purple-100 hover:border-purple-300",
        };
    }

    // Venda a Receber - Azul claro
    if (status === Status_String.SaleToRecive) {
        return {
            background: "bg-cyan-50",
            border: "border-cyan-200",
            text: "text-cyan-900",
            accentBorder: "bg-cyan-400",
            hover: "hover:bg-cyan-100 hover:border-cyan-300",
        };
    }

    // Entregue ao Cliente - Cinza (finalizado/arquivado)
    if (status === Status_String.DeliveredToClient) {
        return {
            background: "bg-indigo-50",
            border: "border-indigo-200",
            text: "text-indigo-900",
            accentBorder: "bg-indigo-400",
            hover: "hover:bg-indigo-100 hover:border-indigo-300",
        };
    }

    // Default - Cinza (status desconhecido ou não mapeado)
    return {
        background: "bg-white",
        border: "border-gray-200",
        text: "text-gray-900",
        accentBorder: "bg-gray-300",
        hover: "hover:bg-gray-50 hover:border-gray-300",
    };
};

export const getCardStyles = (isPaidPurchase: boolean, isSelected: boolean) => {
    if (isPaidPurchase) {
        if (isSelected) {
            return "bg-rose-600 text-white border-rose-700 shadow-lg"
        }
        return "bg-rose-50 hover:bg-rose-100 border-rose-200"
    } else {
        if (isSelected) {
            return "bg-purple-600 text-white border-purple-700 shadow-lg"
        }
        return "bg-white hover:bg-gray-50 border-gray-200"
    }
}

export const getIconColor = (isPaidPurchase: boolean, isSelected: boolean) => {
    if (isPaidPurchase) {
        return isSelected ? "text-white" : "text-rose-600"
    }
    return isSelected ? "text-white" : "text-purple-600"
}

export const getLabelColor = (isPaidPurchase: boolean, isSelected: boolean) => {
    if (isPaidPurchase) {
        return isSelected ? "text-white" : "text-rose-600"
    }
    return isSelected ? "text-white" : "text-purple-600"
}

export const getTextColor = (isPaidPurchase: boolean, isSelected: boolean) => {
    return isSelected ? "text-white" : "text-black"
}

export const getSeparatorColor = (isPaidPurchase: boolean, isSelected: boolean) => {
    if (isPaidPurchase) {
        return isSelected ? "bg-white/30" : "bg-rose-200"
    }
    return isSelected ? "bg-white/30" : ""
}