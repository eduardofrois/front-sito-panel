"use client"

import useMutateUpdatePaidPrice, { UpdatePaidPriceDto } from "@/app/home/accounts/hooks/useMutateUpdatePaidPrice"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Pagination } from "@/components/ui/pagination"
import { Separator } from "@/components/ui/separator"
import { formatCurrency, formatDate } from "@/functions/format-functions"
import { getOrderCardStyles } from "@/functions/style-functions"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { CalendarDays, CheckCircle2, Package, User, X } from "lucide-react"
import { useMemo, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { IsLoadingCard } from "../global/isloading-card"

interface iProps {
  isLoading: boolean
  orders: any[]
  pagination: { pageIndex: number; pageSize: number }
  setPagination: React.Dispatch<React.SetStateAction<{ pageIndex: number; pageSize: number }>>
  totalPages?: number
}

const paymentSchema = z.object({
  payments: z.record(
    z.string(),
    z.object({
      amount: z
        .string()
        .min(1, "Valor é obrigatório")
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Valor deve ser um número positivo"),
    }),
  ),
})

type PaymentFormData = z.infer<typeof paymentSchema>

export const AccountsReceive = ({ isLoading, orders, pagination, setPagination, totalPages }: iProps) => {
  const [selectedOrders, setSelectedOrders] = useState<Set<number>>(new Set())

  const queryClient = useQueryClient()
  const { mutateAsync: updatePaidPrice, isPending } = useMutateUpdatePaidPrice()

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      payments: {},
    },
  })

  const calculatePendingAmount = (order: any) => {
    const paidPrice = Number(order.price_paid ?? 0)
    const totalPrice = Number(order.total_price ?? 0)
    return Math.max(0, totalPrice - paidPrice) // Garante que não seja negativo
  }

  const toggleOrderSelection = (orderId: number) => {
    const newSelected = new Set(selectedOrders)
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId)
    } else {
      newSelected.add(orderId)
    }
    setSelectedOrders(newSelected)
  }

  const totalPendingAmount = useMemo(() => {
    return orders.reduce((sum, order) => sum + calculatePendingAmount(order), 0)
  }, [orders])

  const watchedPayments = useWatch({
    control: form.control,
    name: "payments",
  })

  const totalSelectedAmount = useMemo(() => {
    return Object.entries(watchedPayments || {}).reduce((sum, [orderId, payment]) => {
      const amount = Number((payment as any)?.amount || 0)
      return sum + amount
    }, 0)
  }, [watchedPayments])

  const onSubmit = async (data: PaymentFormData) => {
    const payments: UpdatePaidPriceDto[] = Object.entries(data.payments).map(([orderId, payment]) => ({
      order_id: Number(orderId),
      paid_price: Number(payment.amount),
    }))

    try {
      await updatePaidPrice(payments)

      toast.success("Pagamentos processados", {
        description: `${payments.length} pagamento(s) foram registrados com sucesso.`,
      })

      await queryClient.invalidateQueries({
        queryKey: ["getPendingPaidOrders"],
      })

      form.reset()
      setSelectedOrders(new Set())
    } catch (err) {
      toast.error("Erro ao processar pagamentos")
    }
  }

  if (isLoading) return <IsLoadingCard />

  const getPaymentProgress = (order: any, previewAmount?: number) => {
    const currentPaidPrice = Number(order.price_paid ?? 0)
    const totalPrice = Number(order.total_price ?? 0)

    if (totalPrice === 0) return 0

    // Se houver um valor de prévia (quando o usuário está digitando), adiciona ao valor atual
    const paidPrice = previewAmount ? currentPaidPrice + Number(previewAmount) : currentPaidPrice

    // Garante que o valor pago não exceda o total
    const adjustedPaidPrice = Math.min(paidPrice, totalPrice)

    const progress = (adjustedPaidPrice / totalPrice) * 100
    return Math.min(100, Math.max(0, progress))
  }

  return (
    <div className="space-y-4">
      {/* Botão de processar pagamento no topo */}
      {selectedOrders.size > 0 && (
        <Card className="border-purple-200 bg-purple-50 shadow-sm sticky top-0 z-10">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <Badge variant="default" className="bg-purple-600 text-white text-xs sm:text-sm px-2 sm:px-2.5 py-1">
                  {selectedOrders.size}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-purple-900 truncate">
                    {selectedOrders.size === 1 ? "Pedido selecionado" : "Pedidos selecionados"}
                  </p>
                  <p className="text-xs text-purple-700">
                    Total: <span className="font-semibold text-purple-900">
                      {formatCurrency(totalSelectedAmount)}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedOrders(new Set())
                    form.reset()
                  }}
                  className="w-full sm:w-auto"
                >
                  <X className="h-4 w-4 mr-1.5" />
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  form="payment-form"
                  disabled={isPending || totalSelectedAmount <= 0}
                  size="sm"
                  className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isPending ? (
                    <>
                      <div className="h-3.5 w-3.5 mr-1.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-1.5" />
                      Processar Pagamentos
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma conta pendente</h3>
            <p className="text-muted-foreground text-center">Todos os pedidos foram pagos integralmente.</p>
          </CardContent>
        </Card>
      ) : (
        <Form {...form}>
          <form id="payment-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid gap-3">
              {orders.map((order) => {
                const pendingAmount = calculatePendingAmount(order)
                const isSelected = selectedOrders.has(order.id)

                // Obtém o valor digitado no formulário para mostrar prévia na barra de progresso
                // O watchedPayments usa order.id como string (chave do objeto)
                const paymentData = watchedPayments?.[String(order.id)] as { amount?: string } | undefined
                const previewAmount = isSelected && paymentData?.amount
                  ? Number(paymentData.amount) || 0
                  : 0

                const progress = getPaymentProgress(order, previewAmount)
                const isFullyPaid = pendingAmount <= 0
                const cardStyles = getOrderCardStyles(order, isSelected)

                return (
                  <Card
                    key={order.id}
                    className={`transition-all duration-150 cursor-pointer border-l-4 ${cardStyles.border} ${cardStyles.background} ${cardStyles.hover} ${isSelected ? "shadow-md" : "shadow-sm"} ${isFullyPaid ? "opacity-60" : ""}`}
                    onClick={() => toggleOrderSelection(order.id)}
                  >
                    <CardContent className="p-3 sm:p-4">
                      <div className="space-y-3">
                        {/* Informações principais */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-1.5">
                              <Package className={`h-3.5 w-3.5 flex-shrink-0 ${isSelected ? "text-white/80" : cardStyles.text}`} />
                              <span className={`font-semibold text-sm ${cardStyles.text}`}>#{order.code}</span>
                            </div>
                            {isFullyPaid && (
                              <Badge variant="default" className="bg-green-100 text-green-800 border-green-200 text-xs h-5">
                                <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                                Pago
                              </Badge>
                            )}
                            {isSelected && (
                              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs h-5">
                                Selecionado
                              </Badge>
                            )}
                          </div>

                          <div className={`space-y-1.5 text-xs ${isSelected ? "text-white/80" : "text-muted-foreground"}`}>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <User className={`h-3 w-3 flex-shrink-0 ${isSelected ? "text-white/70" : "text-muted-foreground"}`} />
                              <span className={`truncate ${isSelected ? "text-white/90" : ""}`}>{order?.clientJoin?.name || order?.client_infos?.client_name || "Cliente não informado"}</span>
                            </div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <CalendarDays className={`h-3 w-3 flex-shrink-0 ${isSelected ? "text-white/70" : "text-muted-foreground"}`} />
                              <span>{formatDate(order.date_creation_order)}</span>
                            </div>
                            <div className={isSelected ? "text-white/80" : ""}>
                              {order.description || "Sem descrição"} • {order.size} • Qtd: {order.amount}
                            </div>
                          </div>

                          {/* Barra de progresso compacta */}
                          {!isFullyPaid && (
                            <div className="flex items-center gap-2">
                              <div className={`flex-1 rounded-full h-1.5 overflow-hidden ${isSelected ? "bg-white/20" : "bg-muted"}`}>
                                <div
                                  className={`h-full transition-all duration-300 ${isSelected ? "bg-white/60" : "bg-green-500"}`}
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <span className={`text-xs min-w-[35px] text-right ${isSelected ? "text-white/80" : "text-muted-foreground"}`}>{Math.round(progress)}%</span>
                            </div>
                          )}
                        </div>

                        {/* Valores - empilhados em mobile, lado a lado em desktop */}
                        <div className={`grid grid-cols-3 gap-2 sm:gap-4 sm:flex sm:items-center sm:justify-end border-t pt-3 ${isSelected ? "border-white/20" : "border-border"}`}>
                          <div className="text-center sm:text-right space-y-0.5">
                            <p className={`text-[10px] sm:text-xs ${isSelected ? "text-white/70" : "text-muted-foreground"}`}>Total</p>
                            <p className={`font-semibold text-xs sm:text-sm break-words ${cardStyles.text}`}>{formatCurrency(order.total_price ?? 0)}</p>
                          </div>
                          <Separator orientation="vertical" className={`h-8 hidden sm:block ${isSelected ? "bg-white/20" : ""}`} />
                          <div className="text-center sm:text-right space-y-0.5">
                            <p className={`text-[10px] sm:text-xs ${isSelected ? "text-white/70" : "text-muted-foreground"}`}>Pago</p>
                            <p className={`font-semibold text-xs sm:text-sm break-words ${isSelected ? "text-white" : "text-green-600"}`}>{formatCurrency(order.price_paid ?? 0)}</p>
                          </div>
                          <Separator orientation="vertical" className={`h-8 hidden sm:block ${isSelected ? "bg-white/20" : ""}`} />
                          <div className="text-center sm:text-right space-y-0.5">
                            <p className={`text-[10px] sm:text-xs ${isSelected ? "text-white/70" : "text-muted-foreground"}`}>Pendente</p>
                            <p className={`font-bold text-sm sm:text-base break-words ${isSelected ? "text-white" : "text-destructive"}`}>{formatCurrency(pendingAmount)}</p>
                          </div>
                        </div>

                        {/* Campo de input quando selecionado */}
                        {isSelected && (
                          <div className={`border-t pt-3 mt-2 ${isSelected ? "border-white/20" : "border-border"}`}>
                            <FormField
                              control={form.control}
                              name={`payments.${order.id}.amount`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className={`text-xs mb-1.5 block ${isSelected ? "text-white/90" : "text-muted-foreground"}`}>
                                    Valor a receber
                                  </FormLabel>
                                  <div className="space-y-1.5">
                                    <FormControl>
                                      <div className="relative">
                                        <span className={`absolute left-2.5 top-1/2 -translate-y-1/2 text-sm font-medium ${isSelected ? "text-white/70" : "text-muted-foreground"}`}>R$</span>
                                        <Input
                                          type="number"
                                          step="0.01"
                                          min="0"
                                          placeholder="0,00"
                                          {...field}
                                          onClick={(e) => e.stopPropagation()}
                                          onChange={(e) => {
                                            const value = Number(e.target.value)
                                            if (value > pendingAmount) {
                                              field.onChange(pendingAmount.toString())
                                              toast.warning("Valor máximo excedido", {
                                                description: `O valor máximo é ${formatCurrency(pendingAmount)}`,
                                              })
                                            } else if (value < 0) {
                                              field.onChange("0")
                                            } else {
                                              field.onChange(e.target.value)
                                            }
                                            e.stopPropagation()
                                          }}
                                          className={`pl-8 h-9 sm:h-10 text-sm font-semibold ${isSelected ? "bg-white/10 border-white/20 text-white placeholder:text-white/50" : ""}`}
                                        />
                                      </div>
                                    </FormControl>
                                    <FormDescription className={`text-xs ${isSelected ? "text-white/70" : ""}`}>
                                      Máximo disponível: <span className={`font-semibold ${isSelected ? "text-white" : "text-primary"}`}>{formatCurrency(pendingAmount)}</span>
                                    </FormDescription>
                                  </div>
                                  <FormMessage className="text-xs" />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </form>
        </Form>
      )}

      {/* Controles de paginação */}
      {!isLoading && orders.length > 0 && (
        <Pagination
          pageIndex={pagination.pageIndex}
          pageSize={pagination.pageSize}
          totalPages={totalPages}
          onPageChange={(page: number) => setPagination(prev => ({ ...prev, pageIndex: page }))}
          disabled={isLoading}
        />
      )}
    </div>
  )
}
