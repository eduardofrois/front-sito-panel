"use client"

import { Expenses } from "@/app/home/expenses/expenses.interface"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency, formatDate } from "@/functions/format-functions"
import { Calendar, Clock, DollarSign, Edit, FileText, Receipt } from "lucide-react"

interface ExpenseCardProps {
    expense: Expenses
    onEdit: (expense: Expenses) => void
}

export const ExpenseCard = ({ expense, onEdit }: ExpenseCardProps) => {
    const getStatus = () => {
        if (expense.payment_date) return "paid"
        if (expense.processed_at) return "processed"
        return "pending"
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "paid":
                return "bg-green-100 text-green-800 border-green-200"
            case "processed":
                return "bg-blue-100 text-blue-800 border-blue-200"
            case "pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "paid":
                return "Pago"
            case "processed":
                return "Processado"
            case "pending":
                return "Pendente"
            default:
                return "Desconhecido"
        }
    }

    const status = getStatus()

    return (
        <Card className="w-full transition-all hover:shadow-md border border-gray-200 bg-white">
            <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Ícone e informações principais */}
                    <div className="flex items-start gap-3 sm:gap-4 flex-1">
                        <div className="p-2 sm:p-3 bg-purple-50 rounded-lg shrink-0">
                            <Receipt className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                        </div>

                        <div className="flex-1 min-w-0">
                            {/* Header com descrição e status */}
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FileText className="h-4 w-4 text-gray-500 shrink-0" />
                                        <h3 className="font-semibold text-base sm:text-lg text-gray-900 truncate">
                                            {expense.description}
                                        </h3>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                                            <span>{formatDate(expense.expense_date)}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                                            <span className="hidden sm:inline">Criado: </span>
                                            <span>{formatDate(expense.performed_at)}</span>
                                        </div>
                                    </div>
                                </div>
                                <Badge className={`${getStatusColor(status)} shrink-0 text-xs sm:text-sm px-2 sm:px-3 py-1`}>
                                    {getStatusLabel(status)}
                                </Badge>
                            </div>

                            {/* Valor e ID */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                                    <div>
                                        <p className="text-xs text-gray-500 mb-0.5">Valor</p>
                                        <p className="font-bold text-lg sm:text-xl text-purple-600">
                                            {formatCurrency(expense.price)}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-xs sm:text-sm text-gray-500">
                                    <span className="font-medium">ID:</span> #{expense.id}
                                </div>
                            </div>

                            {/* Informações adicionais */}
                            {(expense.processed_at || expense.payment_date) && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 pt-3 border-t border-gray-100">
                                    {expense.processed_at && (
                                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                                            <div>
                                                <span className="font-medium">Processado:</span>{" "}
                                                <span>{formatDate(expense.processed_at)}</span>
                                            </div>
                                        </div>
                                    )}
                                    {expense.payment_date && (
                                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                                            <div>
                                                <span className="font-medium">Pagamento:</span>{" "}
                                                <span>{formatDate(expense.payment_date)}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Botão de editar */}
                    <div className="flex items-start sm:items-center justify-end sm:justify-start">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(expense)}
                            className="h-9 w-9 sm:h-10 sm:w-10 p-0 shrink-0 hover:bg-purple-50 hover:border-purple-300"
                        >
                            <Edit className="h-4 w-4 text-purple-600" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
