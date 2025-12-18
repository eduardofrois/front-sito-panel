"use client"

import useQueryGetAllClients from "@/app/home/orders/hooks/useQueryGetAllClients"
import useQueryGetAllSuppliers from "@/app/home/orders/hooks/useQueryGetAllSuppliers"
import api from "@/services/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { X } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"

const orderSchema = z.object({
    client: z.string().min(2, "Cliente é obrigatório"),
    supplier: z.string().min(1, "Fornecedor é obrigatório"),
    brand: z.string().optional().default(""),
    code: z.string().optional().default(""),
    description: z.string().min(1, "Descrição é obrigatória"),
    size: z.string().optional().default(""),
    amount: z.number().min(1, "Quantidade mínima é 1"),
    cost_price: z.number().min(0.01, "Preço de custo é obrigatório"),
    sale_price: z.number().min(0.01, "Preço de venda é obrigatório"),
    total_price: z.number().optional().default(0),
})

type OrderFormData = z.infer<typeof orderSchema>

interface iProps {
    solicitation: number | null
    text: string
    variant: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined
}

export function DialogFormOrder({ text, variant }: iProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [valuesForm, setValuesForm] = useState<OrderFormData[]>([])
    const queryClient = useQueryClient()

    const { data: suppliers = [] } = useQueryGetAllSuppliers()
    const { data: clients = [] } = useQueryGetAllClients()

    const form = useForm<OrderFormData>({
        resolver: zodResolver(orderSchema),
        defaultValues: {
            client: "",
            supplier: "",
            brand: "",
            code: "",
            description: "",
            size: "",
            amount: 1,
            cost_price: 0,
            sale_price: 0,
            total_price: 0,
        },
    })

    // Watch for price changes to auto-calculate total
    const amount = form.watch("amount")
    const salePrice = form.watch("sale_price")
    form.setValue("total_price", (salePrice ?? 0) * (amount ?? 1))

    const createOrdersMutation = useMutation({
        mutationFn: async (orders: OrderFormData[]) => {
            const response = await api.post("/orders", orders.map(o => ({
                client: o.client,
                supplier: o.supplier,
                brand: o.brand,
                code: o.code,
                description: o.description,
                size: o.size,
                amount: o.amount,
                cost_price: o.cost_price,
                sale_price: o.sale_price,
                date_creation_order: new Date().toISOString(),
            })))
            if (!response.data.flag) {
                throw new Error(response.data.message)
            }
            return response.data
        },
        onSuccess: () => {
            toast.success("Pedidos salvos com sucesso!")
            queryClient.invalidateQueries({ queryKey: ["getOrdersWithFilters"] })
            queryClient.invalidateQueries({ queryKey: ["getAllSuppliers"] })
            queryClient.invalidateQueries({ queryKey: ["getAllClients"] })
            setValuesForm([])
            form.reset()
            setIsOpen(false)
        },
        onError: () => {
            toast.error("Erro ao salvar pedidos")
        }
    })

    function addToList() {
        const data = form.getValues()
        const result = orderSchema.safeParse(data)
        if (!result.success) {
            toast.error("Preencha todos os campos obrigatórios")
            return
        }
        setValuesForm((prev) => [...prev, data])
        form.reset({
            ...form.getValues(),
            brand: "",
            code: "",
            description: "",
            size: "",
            amount: 1,
            cost_price: 0,
            sale_price: 0,
            total_price: 0,
        })
    }

    function removeFromList(index: number) {
        setValuesForm((prev) => prev.filter((_, i) => i !== index))
    }

    function formSubmit() {
        if (valuesForm.length === 0) {
            toast.error("Adicione pelo menos um pedido")
            return
        }
        createOrdersMutation.mutate(valuesForm)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="w-full" variant={variant}>{text}</Button>
            </DialogTrigger>

            <DialogContent className="w-full max-w-4xl flex flex-col gap-0 p-0 h-auto max-h-[calc(100vh-1rem)] sm:max-h-[90vh]">
                <DialogHeader className="px-3 sm:px-4 md:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b flex-shrink-0">
                    <DialogTitle className="text-lg sm:text-xl">
                        {valuesForm.length === 0 ? "Novo Pedido" : "Adicionar Outro Pedido"}
                    </DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm">
                        Preencha as informações do produto para adicionar à lista
                    </DialogDescription>
                </DialogHeader>

                <div className="overflow-y-auto flex-1 min-h-0 px-3 sm:px-4 md:px-6 py-4 sm:py-6 overscroll-contain">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Dados do Produto</h3>
                            <Form {...form}>
                                <form className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <FormField
                                            control={form.control}
                                            name="client"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-semibold text-gray-600">Cliente <span className="text-red-500">*</span></FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Digite ou selecione o cliente"
                                                            className="h-9 text-sm"
                                                            list="clients-list"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <datalist id="clients-list">
                                                        {clients.map((client, index) => (
                                                            <option key={`client-${client.id}-${index}`} value={client.name} />
                                                        ))}
                                                    </datalist>
                                                    <FormMessage className="text-xs" />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="supplier"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-semibold text-gray-600">Fornecedor <span className="text-red-500">*</span></FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Digite ou selecione o fornecedor"
                                                            className="h-9 text-sm"
                                                            list="suppliers-list"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <datalist id="suppliers-list">
                                                        {suppliers.map((supplier, index) => (
                                                            <option key={`supplier-${supplier.id}-${index}`} value={supplier.name} />
                                                        ))}
                                                    </datalist>
                                                    <FormMessage className="text-xs" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <FormField
                                            control={form.control}
                                            name="brand"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-semibold text-gray-600">Marca/Produto</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Marca" className="h-9 text-sm" {...field} />
                                                    </FormControl>
                                                    <FormMessage className="text-xs" />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="code"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-semibold text-gray-600">Código</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Código" className="h-9 text-sm" {...field} />
                                                    </FormControl>
                                                    <FormMessage className="text-xs" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="size"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-semibold text-gray-600">Tamanho</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Tamanho" className="h-9 text-sm" {...field} />
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-semibold text-gray-600">Descrição <span className="text-red-500">*</span></FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Descrição do produto"
                                                        className="min-h-16 text-sm resize-none"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-3 gap-3">
                                        <FormField
                                            control={form.control}
                                            name="amount"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-semibold text-gray-600">Qtd. <span className="text-red-500">*</span></FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            placeholder="1"
                                                            className="h-9 text-sm"
                                                            {...field}
                                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-xs" />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="cost_price"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-semibold text-gray-600">P. Custo <span className="text-red-500">*</span></FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            min="0.01"
                                                            placeholder="0,00"
                                                            className="h-9 text-sm"
                                                            {...field}
                                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-xs" />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="sale_price"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-semibold text-gray-600">P. Venda <span className="text-red-500">*</span></FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            min="0.01"
                                                            placeholder="0,00"
                                                            className="h-9 text-sm"
                                                            {...field}
                                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-xs" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                                        <Button
                                            type="button"
                                            className="flex-1 min-h-[44px] text-sm sm:text-base bg-purple-600 hover:bg-purple-700"
                                            onClick={addToList}
                                        >
                                            Adicionar à lista
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="flex-1 min-h-[44px] text-sm sm:text-base bg-transparent"
                                            onClick={() => form.reset()}
                                        >
                                            Limpar
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                                Pedidos ({valuesForm.length})
                            </h3>
                            {valuesForm.length === 0 ? (
                                <div className="flex items-center justify-center h-64 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                                    <p className="text-gray-500 text-sm">Nenhum pedido adicionado ainda</p>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-[300px] sm:max-h-96 overflow-y-auto pr-2 overscroll-contain">
                                    {valuesForm.map((order, index) => (
                                        <div
                                            key={index}
                                            className="relative bg-white border border-gray-200 rounded-lg p-4 hover:border-purple-300 hover:shadow-sm transition-all"
                                        >
                                            <button
                                                type="button"
                                                onClick={() => removeFromList(index)}
                                                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors p-1"
                                                title="Remover pedido"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>

                                            <div className="grid grid-cols-2 gap-2 text-xs pr-6">
                                                <div>
                                                    <p className="text-gray-500 font-medium">Cliente</p>
                                                    <p className="text-gray-900 font-semibold">{order.client}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 font-medium">Fornecedor</p>
                                                    <p className="text-gray-900 font-semibold">{order.supplier}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 font-medium">Produto</p>
                                                    <p className="text-gray-900 font-semibold">{order.brand}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 font-medium">Código</p>
                                                    <p className="text-gray-900 font-mono">{order.code}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 font-medium">Quantidade</p>
                                                    <p className="text-gray-900 font-semibold">{order.amount}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 font-medium">Total</p>
                                                    <p className="text-purple-600 font-bold">R$ {(order.sale_price * order.amount).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="border-t px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-gray-50 flex flex-col sm:flex-row gap-2 sm:gap-3 flex-shrink-0">
                    {valuesForm.length > 0 && (
                        <div className="flex-1 flex items-center text-xs sm:text-sm">
                            <span className="text-gray-600">
                                Total:{" "}
                                <span className="font-bold text-purple-600 text-base sm:text-lg">
                                    R$ {valuesForm.reduce((sum, order) => sum + (order.sale_price * order.amount), 0).toFixed(2)}
                                </span>
                            </span>
                        </div>
                    )}
                    <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1 sm:flex-none min-h-[44px] text-sm sm:text-base bg-transparent"
                            onClick={() => {
                                setValuesForm([])
                                form.reset()
                                setIsOpen(false)
                            }}
                        >
                            Cancelar
                        </Button>
                        {valuesForm.length > 0 && (
                            <Button
                                type="button"
                                className="flex-1 sm:flex-none min-h-[44px] text-sm sm:text-base bg-green-600 hover:bg-green-700"
                                disabled={createOrdersMutation.isPending}
                                onClick={formSubmit}
                            >
                                {createOrdersMutation.isPending
                                    ? "Salvando..."
                                    : `Salvar ${valuesForm.length} ${valuesForm.length === 1 ? "Pedido" : "Pedidos"}`}
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
