"use client"

import { usePurchasesModel } from "./purchases.model"
import { PurchasesView } from "./purchases.view"

export default function Page() {
    const methods = usePurchasesModel()
    return <PurchasesView {...methods} />
}
