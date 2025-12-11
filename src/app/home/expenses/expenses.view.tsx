"use client"

import { ExpenseCard } from "@/components/expenses/expenses-card"
import { ExpenseFormModal } from "@/components/expenses/expenses-form-modal"
import { IsLoadingCard } from "@/components/global/isloading-card"
import { NotFoundOrder } from "@/components/global/not-found-order"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pagination } from "@/components/ui/pagination"
import { formatCurrency } from "@/functions/format-functions"
import { Plus, Receipt, Search, X } from "lucide-react"
import type { Expenses } from "./expenses.interface"
import { useExpensesModel } from "./expenses.model"

type ExpensesViewProps = ReturnType<typeof useExpensesModel>

export const ExpensesView = (props: ExpensesViewProps) => {
    const {
        data,
        totalPages,
        isLoading,
        editingExpense,
        handleAddExpense,
        handleEditExpense,
        isModalOpen,
        searchTerm,
        setEditingExpense,
        setIsModalOpen,
        setSearchTerm,
        totalExpenses,
        filteredData,
        formData,
        setFormData,
        handleSaveExpense,
        handleOpenEditExpenses,
        pagination,
        setPagination,
    } = props

    if (isLoading) return <IsLoadingCard />

    const ordersData = Array.isArray(data) ? data : (data?.data || [])
    if (ordersData.length === 0 && !isLoading) return <NotFoundOrder />

    return (
        <div className="flex flex-col gap-4 pb-6">
            {/* Header fixo com busca e ações */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4 shadow-sm">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                        <div className="flex-1">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
                                Despesas
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-600">
                                Gerencie e acompanhe todas as suas despesas
                            </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <Button
                                onClick={handleAddExpense}
                                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
                                size="sm"
                            >
                                <Plus className="h-4 w-4" />
                                <span className="hidden sm:inline">Nova Despesa</span>
                                <span className="sm:hidden">Nova</span>
                            </Button>
                        </div>
                    </div>

                    {/* Barra de busca */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Pesquisar por descrição, valor, ID, data..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* Resumo */}
                    {filteredData.length > 0 && (
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 pt-2 border-t border-gray-100">
                            <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                                <span>
                                    {filteredData.length} de {ordersData.length} despesa(s)
                                </span>
                                {searchTerm && (
                                    <span className="text-gray-400">• Filtrado</span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-purple-600 font-semibold">
                                <Receipt className="h-4 w-4" />
                                <span>
                                    Total: {formatCurrency(totalExpenses)}
                                </span>
                            </div>
                        </div>
                    )}

                    {searchTerm && (
                        <div className="text-xs sm:text-sm text-gray-600">
                            {filteredData.length === 0 ? (
                                <span className="text-purple-600">Nenhuma despesa encontrada para "{searchTerm}"</span>
                            ) : (
                                <span>{filteredData.length} resultado(s) encontrado(s)</span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Lista de despesas */}
            {filteredData.length === 0 && searchTerm ? (
                <div className="text-center py-12 px-4">
                    <p className="text-gray-500 mb-4">Nenhuma despesa encontrada para "{searchTerm}"</p>
                    <Button variant="outline" onClick={() => setSearchTerm("")}>
                        Limpar filtro
                    </Button>
                </div>
            ) : (
                <>
                    <div className="flex flex-col gap-3 sm:gap-4 px-4 sm:px-6">
                        {filteredData.map((expense: Expenses) => (
                            <ExpenseCard
                                key={expense.id}
                                expense={expense}
                                onEdit={handleOpenEditExpenses}
                            />
                        ))}
                    </div>

                    {/* Paginação */}
                    {!searchTerm && pagination && (
                        <Pagination
                            pageIndex={pagination.pageIndex}
                            pageSize={pagination.pageSize}
                            totalPages={totalPages}
                            currentDataLength={filteredData.length}
                            onPageChange={(page) => setPagination((prev) => ({ ...prev, pageIndex: page }))}
                            disabled={isLoading}
                        />
                    )}
                </>
            )}

            {/* Modal de formulário */}
            <ExpenseFormModal
                handleSaveExpense={handleSaveExpense}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddExpense}
                expense={editingExpense}
                formData={formData}
                setFormData={setFormData}
                handleUpdateExpense={handleEditExpense}
            />
        </div>
    )
}
