import { Status_String } from "@/constants/order-status"

type CardState = "DEFAULT" | "SELECTED" | "CONFIRMED" | "CONFIRMED_AND_SELECTED"

export const getCardState = (item: any, isSelected: boolean): CardState => {
    const isConfirmSale = item.status === Status_String.ConfirmSale

    if (isConfirmSale && isSelected) return "CONFIRMED_AND_SELECTED"
    if (isConfirmSale) return "CONFIRMED"
    if (isSelected) return "SELECTED"
    return "DEFAULT"
}
