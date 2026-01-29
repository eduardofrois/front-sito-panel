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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/functions/format-functions"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { useEffect, useState } from "react"

interface PaymentModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (amount: number) => Promise<void>
    orderInfo: {
        id: number
        code: string
        description: string
        totalPrice: number
        paidPrice: number
        pendingAmount: number
    } | null
    isProcessing?: boolean
}

export function PaymentModal({
    isOpen,
    onClose,
    onConfirm,
    orderInfo,
    isProcessing = false,
}: PaymentModalProps) {
    const [paymentAmount, setPaymentAmount] = useState<string>("")
    const [error, setError] = useState<string>("")

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setPaymentAmount("")
            setError("")
        }
    }, [isOpen])

    const handleAmountChange = (value: string) => {
        setPaymentAmount(value)
        setError("")

        const numValue = parseFloat(value)
        if (isNaN(numValue) || numValue <= 0) {
            setError("Valor deve ser maior que zero")
        } else if (orderInfo && numValue > orderInfo.pendingAmount) {
            setError(`Valor máximo é ${formatCurrency(orderInfo.pendingAmount)}`)
        }
    }

    const handleConfirm = async () => {
        const numValue = parseFloat(paymentAmount)

        if (isNaN(numValue) || numValue <= 0) {
            setError("Valor deve ser maior que zero")
            return
        }

        if (orderInfo && numValue > orderInfo.pendingAmount) {
            setError(`Valor máximo é ${formatCurrency(orderInfo.pendingAmount)}`)
            return
        }

        await onConfirm(numValue)
    }

    const handleQuickFill = () => {
        if (orderInfo) {
            setPaymentAmount(orderInfo.pendingAmount.toFixed(2))
            setError("")
        }
    }

    if (!orderInfo) return null

    const numValue = parseFloat(paymentAmount) || 0
    const newPaidAmount = orderInfo.paidPrice + numValue
    const newPendingAmount = Math.max(0, orderInfo.pendingAmount - numValue)
    const willBeFullyPaid = newPendingAmount <= 0 && numValue > 0

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-purple-600" />
                        Registrar Pagamento
                    </DialogTitle>
                    <DialogDescription>
                        Informe o valor pago para o pedido #{orderInfo.code}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Order Info */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Pedido:</span> #{orderInfo.code}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                            <span className="font-medium">Descrição:</span> {orderInfo.description || "Sem descrição"}
                        </p>
                    </div>

                    <Separator />

                    {/* Payment Values */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-xs text-gray-500">Valor Total</p>
                            <p className="text-sm font-semibold text-gray-900">
                                {formatCurrency(orderInfo.totalPrice)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Já Pago</p>
                            <p className="text-sm font-semibold text-green-600">
                                {formatCurrency(orderInfo.paidPrice)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Pendente</p>
                            <p className="text-sm font-bold text-red-600">
                                {formatCurrency(orderInfo.pendingAmount)}
                            </p>
                        </div>
                    </div>

                    <Separator />

                    {/* Payment Input */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="payment-amount">Valor a Receber</Label>
                            <Button
                                type="button"
                                variant="link"
                                size="sm"
                                className="text-purple-600 h-auto p-0"
                                onClick={handleQuickFill}
                            >
                                Preencher valor total
                            </Button>
                        </div>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                            <Input
                                id="payment-amount"
                                type="number"
                                step="0.01"
                                min="0"
                                max={orderInfo.pendingAmount}
                                placeholder="0,00"
                                value={paymentAmount}
                                onChange={(e) => handleAmountChange(e.target.value)}
                                className="pl-10"
                                disabled={isProcessing}
                            />
                        </div>
                        {error && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {error}
                            </p>
                        )}
                    </div>

                    {/* Preview of new values */}
                    {numValue > 0 && !error && (
                        <div className="bg-purple-50 rounded-lg p-4 space-y-2 border border-purple-200">
                            <p className="text-xs font-medium text-purple-700">Após este pagamento:</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-purple-600">Novo valor pago</p>
                                    <p className="text-sm font-semibold text-green-600">
                                        {formatCurrency(newPaidAmount)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-purple-600">Novo saldo pendente</p>
                                    <p className={`text-sm font-semibold ${willBeFullyPaid ? 'text-green-600' : 'text-orange-600'}`}>
                                        {formatCurrency(newPendingAmount)}
                                    </p>
                                </div>
                            </div>
                            {willBeFullyPaid && (
                                <p className="text-xs text-green-600 font-medium flex items-center gap-1 mt-2">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Este pedido será marcado como totalmente pago
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isProcessing}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isProcessing || !!error || !paymentAmount}
                        className="bg-purple-600 hover:bg-purple-700"
                    >
                        {isProcessing ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Processando...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" />
                                Confirmar Pagamento
                            </span>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
