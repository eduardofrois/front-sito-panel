import { Status_String } from "@/constants/order-status";

/**
 * Retorna classes CSS para badges de status baseado no status do pedido
 */
export const getStatusColor = (status: string | null | undefined): string => {
    if (!status) return "bg-gray-100 text-gray-800 border-gray-200";
    
    const statusColors: Record<string, string> = {
        [Status_String.PendingPurchase]: "bg-yellow-100 text-yellow-800 border-yellow-200",
        [Status_String.SaleToRecive]: "bg-blue-100 text-blue-800 border-blue-200",
        [Status_String.ReadyForDelivery]: "bg-purple-100 text-purple-800 border-purple-200",
        [Status_String.ConfirmSale]: "bg-blue-100 text-blue-800 border-blue-200",
        [Status_String.PaidPurchase]: "bg-green-100 text-green-800 border-green-200",
        [Status_String.ToCheck]: "bg-orange-100 text-orange-800 border-orange-200",
        [Status_String.Checked]: "bg-emerald-100 text-emerald-800 border-emerald-200",
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
                background: "bg-emerald-50",
                border: "border-emerald-200",
                text: "text-emerald-900",
                accentBorder: "bg-emerald-400",
                hover: "hover:bg-emerald-100 hover:border-emerald-300",
            };
        }
        // Quitado mas sem conferência definida ainda - Verde padrão
        return {
            background: "bg-green-50",
            border: "border-green-200",
            text: "text-green-900",
            accentBorder: "bg-green-400",
            hover: "hover:bg-green-100 hover:border-green-300",
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