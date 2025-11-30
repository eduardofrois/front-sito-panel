import { Status_String } from "@/constants/order-status"
import { getOrderCardStyles } from "@/functions/style-functions"

type CardState = "DEFAULT" | "SELECTED" | "CONFIRMED" | "CONFIRMED_AND_SELECTED"

/**
 * Retorna o estado do card baseado no status do pedido e se está selecionado
 * Mantido para compatibilidade, mas agora usa a lógica unificada de cores
 */
export const getCardState = (item: any, isSelected: boolean, type: "order" | "account"): CardState => {
    // Se selecionado, sempre retorna SELECTED (a cor será aplicada pela função getOrderCardStyles)
    if (isSelected) {
        return "SELECTED"
    }

    const isConfirmSale = item.status === Status_String.ConfirmSale

    if (type == "order") {
        if (isConfirmSale) return "CONFIRMED"
    }

    if (type == "account") {
        if (isConfirmSale) return "CONFIRMED"
    }

    return "DEFAULT"
}

/**
 * Retorna as classes CSS diretamente baseadas no status do pedido
 * Esta é a função principal que deve ser usada nos componentes
 */
export const getCardStylesFromOrder = (order: any, isSelected: boolean = false) => {
    return getOrderCardStyles(order, isSelected)
}
