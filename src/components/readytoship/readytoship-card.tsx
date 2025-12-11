"use client"

import type { Order } from "@/app/home/orders/order.interface"
import type { formSchema } from "@/app/home/readytoship/readytoship.interface"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatCurrency, formatDate } from "@/functions/format-functions"
import { CalendarDays, DollarSign, Package, Tag, User } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"
import type z from "zod"

interface iProps {
    order: Order
    form: UseFormReturn<z.infer<typeof formSchema>>
    onSubmit: (values: z.infer<typeof formSchema>, order_code: number, totalValue: number) => void
}

export const ReadyToShipCard = ({ order, form, onSubmit }: iProps) => {
    const totalValue = form.watch("sale_price") * order.amount

    return (
        <Card className="w-full shadow-sm border-0 bg-white">
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value={`order-${order.id}`} className="border-none">
                    <AccordionTrigger className="hover:no-underline p-1 sm:p-2">
                        <CardHeader className="flex-row items-center justify-between pb-3 w-full">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                                        <Package className="h-4 w-4 text-purple-600" />
                                    </div>
                                    <span className="font-semibold text-gray-900">#{order.code}</span>
                                </div>
                                <Badge
                                    variant="secondary"
                                    className="bg-orange-50 text-orange-700 border-orange-200 font-medium px-3 py-1"
                                >
                                    {order.status}
                                </Badge>
                            </div>

                            <div className="flex items-center space-x-6 text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                    <Tag className="h-4 w-4 text-gray-400" />
                                    <span className="font-medium">{order.brand}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <CalendarDays className="h-4 w-4 text-gray-400" />
                                    <span>{formatDate(order.date_creation_order)}</span>
                                </div>
                            </div>
                        </CardHeader>
                    </AccordionTrigger>

                    <AccordionContent>
                        <CardContent className="pt-0">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                                        <Package className="h-5 w-5 text-gray-600" />
                                        <h3 className="font-semibold text-lg text-gray-900">Detalhes do Produto</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="p-4 bg-gray-50/50 rounded-lg">
                                            <Label className="text-sm font-semibold text-gray-700 mb-2 block">Descrição</Label>
                                            <p className="text-sm text-gray-600 leading-relaxed">{order.description}</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-3 bg-white border border-gray-100 rounded-lg">
                                                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tamanho</Label>
                                                <p className="text-sm font-medium text-gray-900 mt-1">{order.size}</p>
                                            </div>
                                            <div className="p-3 bg-white border border-gray-100 rounded-lg">
                                                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                                    Quantidade
                                                </Label>
                                                <p className="text-sm font-medium text-gray-900 mt-1">{order.amount}</p>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-purple-50/50 border border-purple-100 rounded-lg">
                                            <Label className="text-sm font-semibold text-purple-700 mb-2 block">Preço de Custo</Label>
                                            <p className="text-lg font-bold text-purple-800">
                                                {formatCurrency(order.cost_price)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                                        <User className="h-5 w-5 text-gray-600" />
                                        <h3 className="font-semibold text-lg text-gray-900">Finalizar Venda</h3>
                                    </div>

                                    <Form {...form}>
                                        <form
                                            onSubmit={form.handleSubmit((values) => onSubmit(values, order.id, totalValue))}
                                            className="space-y-6"
                                        >
                                            <FormField
                                                control={form.control}
                                                name="client"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-semibold text-gray-700">Cliente</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Nome do cliente"
                                                                className="bg-white border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription className="text-xs text-gray-500">
                                                            Digite o nome do cliente para esta venda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <div className="flex flex-row gap-4 justify-between w-full">
                                                <FormField
                                                    control={form.control}
                                                    name="sale_price"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-sm font-semibold text-gray-700 flex items-center space-x-1">
                                                                <DollarSign className="h-4 w-4 text-green-600" />
                                                                <span>Preço de Venda</span>
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    step="0.01"
                                                                    min="0.1"
                                                                    placeholder="0.00"
                                                                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500/20 w-full"
                                                                    {...field}
                                                                    onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <div className="flex flex-col gap-2">
                                                    <Label className="text-sm font-semibold text-gray-700 flex items-center space-x-1">
                                                        <DollarSign className="h-4 w-4 text-green-600" />
                                                        <span>Total da Venda</span>
                                                    </Label>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        disabled
                                                        value={totalValue}
                                                        className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500/20"
                                                    />
                                                </div>
                                            </div>

                                            <Button
                                                type="submit"
                                                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg transition-colors"
                                            >
                                                Confirmar Venda
                                            </Button>
                                        </form>
                                    </Form>
                                </div>
                            </div>
                        </CardContent>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </Card>
    )
}
