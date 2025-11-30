import { useOrdersModel } from "@/app/home/orders/orders.model"
import { useQueryClient } from "@tanstack/react-query"
import { X } from "lucide-react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"

interface iProps {
    solicitation: number | null
    text: string
    variant: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined
}

export function DialogFormOrder({ solicitation, text, variant }: iProps) {
    const { form, onSubmit, isPending, valuesForm, setValuesForm, addOrderAndSolicitation, isPendingAddOrderAndSolicitation } = useOrdersModel()
    const queryClient = useQueryClient();

    function addToList() {
        const data = form.getValues()
        setValuesForm((prev) => [...prev, data])
        form.reset()
    }

    function removeFromList(index?: number) {
        index ? setValuesForm((prev) => prev.filter((_, i) => i !== index)) : setValuesForm([])
    }

    function formSubmit() {
        addOrderAndSolicitation({ data: valuesForm, solicitation })
        removeFromList()
        queryClient.invalidateQueries({ queryKey: ['getAllSolicitations'], exact: false })
    }

    return (
        <Dialog>
            <form className="h-full">
                <DialogTrigger asChild>
                    <Button className="w-full" variant={variant}>{text}</Button>
                </DialogTrigger>

                <DialogContent className="w-full max-w-4xl flex flex-col gap-0 p-0 h-auto max-h-[calc(100vh-1rem)] sm:max-h-[90vh]">
                    <DialogHeader className="px-3 sm:px-4 md:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b flex-shrink-0">
                        <DialogTitle className="text-lg sm:text-xl">
                            {valuesForm.length === 0 ? "Novo Pedido" : "Adicionar Outro Pedido"}
                        </DialogTitle>
                        <DialogDescription className="text-xs sm:text-sm">Preencha as informações do produto para adicionar à lista</DialogDescription>
                    </DialogHeader>

                    <div className="overflow-y-auto flex-1 min-h-0 px-3 sm:px-4 md:px-6 py-4 sm:py-6 overscroll-contain">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Dados do Produto</h3>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(formSubmit)} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            <FormField
                                                control={form.control}
                                                name="client"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs font-semibold text-gray-600">Cliente</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Nome" className="h-9 text-sm" {...field} />
                                                        </FormControl>
                                                        <FormMessage className="text-xs" />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="brand"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs font-semibold text-gray-600">Marca</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Marca" className="h-9 text-sm" {...field} />
                                                        </FormControl>
                                                        <FormMessage className="text-xs" />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
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
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-semibold text-gray-600">Descrição</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Descrição do produto"
                                                            className="min-h-20 text-sm resize-none"
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
                                                        <FormLabel className="text-xs font-semibold text-gray-600">Qtd.</FormLabel>
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
                                                        <FormLabel className="text-xs font-semibold text-gray-600">Preço Custo</FormLabel>
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
                                                        <FormLabel className="text-xs font-semibold text-gray-600">Preço Venda</FormLabel>
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

                                        <FormField
                                            control={form.control}
                                            name="total_price"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-semibold text-gray-600">Preço Total</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            min="0.01"
                                                            readOnly
                                                            placeholder="0,00"
                                                            className="h-9 text-sm bg-gray-100 cursor-not-allowed"
                                                            {...field}
                                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <p className="text-xs text-gray-500 mt-1">Calculado automaticamente</p>
                                                    <FormMessage className="text-xs" />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                                            <Button
                                                type="button"
                                                className="flex-1 min-h-[44px] text-sm sm:text-base bg-purple-600 hover:bg-purple-700"
                                                disabled={form.formState.isSubmitting}
                                                onClick={() => addToList()}
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
                                                        <p className="text-gray-500 font-medium">Marca</p>
                                                        <p className="text-gray-900 font-semibold">{order.brand}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500 font-medium">Código</p>
                                                        <p className="text-gray-900 font-mono">{order.code}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500 font-medium">Tamanho</p>
                                                        <p className="text-gray-900 font-semibold">{order.size}</p>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <p className="text-gray-500 font-medium">Descrição</p>
                                                        <p className="text-gray-900 line-clamp-2">{order.description}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500 font-medium">Quantidade</p>
                                                        <p className="text-gray-900 font-semibold">{order.amount}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500 font-medium">Total</p>
                                                        <p className="text-purple-600 font-bold">R$ {Number(order.sale_price * order.amount).toFixed(2)}</p>
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
                                        R$ {valuesForm.reduce((sum, order) => sum + Number(order.sale_price * order.amount || 0), 0).toFixed(2)}
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
                                }}
                            >
                                Cancelar Tudo
                            </Button>
                            {valuesForm.length > 0 && (
                                <Button
                                    type="button"
                                    className="flex-1 sm:flex-none min-h-[44px] text-sm sm:text-base bg-green-600 hover:bg-green-700"
                                    disabled={isPendingAddOrderAndSolicitation}
                                    onClick={() => formSubmit()}
                                >
                                    {isPendingAddOrderAndSolicitation
                                        ? "Salvando..."
                                        : `Salvar ${valuesForm.length} ${valuesForm.length === 1 ? "Pedido" : "Pedidos"}`}
                                </Button>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </form>
        </Dialog>
    )
}
