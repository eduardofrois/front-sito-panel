export interface PurchaseLine {
    line_key: string
    supplier_id: number
    supplier_name: string
    code: string
    brand: string
    description: string
    size: string
    total_amount: number
    cost_price: number
    total_cost: number
    total_paid: number
    status_compra: string
    status_pagamento: string
    order_ids: number[]
}

export interface PurchaseFilters {
    productSearch?: string
    supplierId?: number
    statusCompra?: string
    statusPagamento?: string
    pageNumber?: number
    pageSize?: number
}

export interface UpdatePurchasePaymentDto {
    supplier_id: number
    code: string
    brand: string
    size: string
    paid_amount: number
}
