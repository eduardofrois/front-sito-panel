"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { formatCurrency } from "@/functions/format-functions"
import { CheckCircle2, ShoppingCart, X } from "lucide-react"

interface PurchaseConfirmModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => Promise<void>
    orderInfo: {
        id: number
        supplier: string
        description: string
        amount: number
        costPrice: number
        totalCost: number
    } | null
    isProcessing?: boolean
}

export function PurchaseConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    orderInfo,
    isProcessing = false,
}: PurchaseConfirmModalProps) {
    if (!orderInfo) return null

    const handleConfirm = async () => {
        await onConfirm()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5 text-purple-600" />
                        Confirmar Compra
                    </DialogTitle>
                    <DialogDescription>
                        Deseja confirmar que esta compra foi realizada?
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Order Info */}
                    <div className="bg-purple-50 rounded-lg p-4 space-y-3 border border-purple-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs text-purple-600 font-medium">Fornecedor</p>
                                <p className="text-sm font-semibold text-gray-900">
                                    {orderInfo.supplier || "Não informado"}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-purple-600 font-medium">Quantidade</p>
                                <p className="text-sm font-bold text-gray-900">
                                    {orderInfo.amount}
                                </p>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs text-purple-600 font-medium">Descrição</p>
                            <p className="text-sm text-gray-700 truncate">
                                {orderInfo.description || "Sem descrição"}
                            </p>
                        </div>

                        <div className="pt-2 border-t border-purple-200">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-purple-700">Valor Unitário:</span>
                                <span className="text-sm font-medium">{formatCurrency(orderInfo.costPrice)}</span>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                                <span className="text-sm font-semibold text-purple-700">Valor Total:</span>
                                <span className="text-lg font-bold text-purple-900">
                                    {formatCurrency(orderInfo.totalCost)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Warning */}
                    <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                        <p className="text-xs text-yellow-700">
                            Ao confirmar, o status do pedido será alterado para <strong>COMPRA REALIZADA</strong>.
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isProcessing}
                    >
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isProcessing}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        {isProcessing ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Confirmando...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" />
                                Confirmar Compra
                            </span>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
