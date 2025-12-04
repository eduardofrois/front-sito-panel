export enum Status {
    PendingPurchase = 1,
    SaleToRecive = 2,
    ReadyForDelivery = 3,
    ConfirmSale = 4,
    PaidPurchase = 5,
    MoreThenOne = 6,
    ToCheck = 7,
    Checked = 8,
    PartialPayment = 9,
    FullyPaid = 10,
}

export enum Status_String {
    PendingPurchase = "Compra Pendente",
    SaleToRecive = "Venda a Receber",
    ReadyForDelivery = "Pronta a Entrega",
    ConfirmSale = "Compra Realizada",
    PaidPurchase = "Compra Quitada",
    ToCheck = "A Conferir",
    Checked = "Conferido",
    PartialPayment = "Pagamento Parcial",
    FullyPaid = "Pagamento Quitado"
}
