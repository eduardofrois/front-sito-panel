"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import type z from "zod"
import type { CreateOrderSchema, orderSchema } from "../../app/home/orders/order.interface"
import { OrderCard } from "./order-card"

interface iProps {
    form: UseFormReturn<z.infer<typeof orderSchema>>
    onSubmit: () => void
    addToList: () => void
    isPending: boolean
}

export const SalesForm = ({ form, onSubmit, addToList, isPending }: iProps) => {
    const [ordersList, setOrdersList] = useState<CreateOrderSchema[]>([])

    return (
        <Card className="border-0 shadow-none bg-transparent">
            <CardContent className="p-0">
                {ordersList.length > 0 && (
                    <div className="space-y-4 mb-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">Pedidos Adicionados ({ordersList.length})</h2>
                        </div>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {ordersList.map((order, index) => (
                                <OrderCard key={index} order={order} index={index} />
                            ))}
                        </div>
                    </div>
                )}

                <Card className="border border-gray-200 shadow-sm">
                    <CardContent className="p-6">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                {ordersList.length === 0 ? "Novo Pedido" : "Adicionar Outro Pedido"}
                            </h2>
                            <p className="text-gray-600">Preencha as informações do produto</p>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(addToList)} className="space-y-6">
                                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="client"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-medium">Cliente</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Nome do cliente"
                                                        className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="brand"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-medium">Marca</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Marca do produto"
                                                        className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="code"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-medium">Código</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Código do produto"
                                                        className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="size"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-medium">Tamanho</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Tamanho"
                                                        className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 font-medium">Descrição</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Descrição do produto"
                                                    className="min-h-[100px] border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="amount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-medium">Quantidade</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        placeholder="1"
                                                        className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="cost_price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-medium">Preço de Custo</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        min="0.01"
                                                        placeholder="0,00"
                                                        className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="sale_price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-medium">Preço de Venda</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        min="0.01"
                                                        placeholder="0,00"
                                                        className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="total_price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-medium">Preço Total</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        min="0.01"
                                                        readOnly
                                                        placeholder="0,00"
                                                        className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500 bg-gray-50"
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                </FormControl>
                                                <p className="text-sm text-gray-600">Este campo não é editável</p>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex w-full gap-2 pt-6 border-t border-gray-200">
                                    <div className="grid grid-cols-2 gap-2 w-full">
                                        <Button
                                            type="submit"
                                            className="h-11 w-full bg-purple-600 hover:bg-purple-700 text-white font-medium"
                                            disabled={form.formState.isSubmitting}
                                        >
                                            Adicionar na lista
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="h-11 w-full border-gray-300 bg-transparent"
                                            onClick={() => form.reset()}
                                        >
                                            Cancelar
                                        </Button>
                                    </div>
                                </div>

                                {ordersList.length > 0 && (
                                    <div className="pt-4 border-t border-gray-200">
                                        <Button type="button" className="h-11 w-full text-white" onClick={onSubmit} disabled={isPending}>
                                            {isPending
                                                ? "Salvando..."
                                                : `Salvar Venda (${ordersList.length} ${ordersList.length === 1 ? "item" : "itens"})`}
                                        </Button>
                                    </div>
                                )}
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    )
}
