import { Status_String } from "@/constants/order-status"

type CardState = "DEFAULT" | "SELECTED" | "CONFIRMED" | "CONFIRMED_AND_SELECTED"

export const getCardState = (item: any, isSelected: boolean, type: "order" | "account"): CardState => {
    const isConfirmSale = item.status === Status_String.ConfirmSale

    if (type == "order") {
        if (isConfirmSale) return "CONFIRMED"
        if (isSelected) return "SELECTED"
    }

    if (type == "account") {
        if (isConfirmSale && isSelected) return "CONFIRMED_AND_SELECTED"
        if (isConfirmSale) return "CONFIRMED"
    }

    return "DEFAULT"
}
