import { useOrdersModel } from "@/app/home/orders/orders.model"
import { X } from "lucide-react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"

interface iProps {
    solicitation: number
}

export function DialogFormOrder({ solicitation }: iProps) {
    const { form, onSubmit, isPending, valuesForm, setValuesForm } = useOrdersModel()

    function addToList() {
        const data = form.getValues()
        setValuesForm((prev) => [...prev, data])
        form.reset()
    }

    function removeFromList(index: number) {
        setValuesForm((prev) => prev.filter((_, i) => i !== index))
    }

    return (
        <Dialog>
            <form className="h-full">
                <DialogTrigger asChild>
                    <Button className="w-full">Cadastrar Pedidos</Button>
                </DialogTrigger>

                <DialogContent className="max-h-[90vh] w-full max-w-4xl flex flex-col gap-0 p-0">
                    <DialogHeader className="px-6 pt-6 pb-4 border-b">
                        <DialogTitle className="text-xl">
                            {valuesForm.length === 0 ? "Novo Pedido" : "Adicionar Outro Pedido"}
                        </DialogTitle>
                        <DialogDescription>Preencha as informações do produto para adicionar à lista</DialogDescription>
                    </DialogHeader>

                    <div className="overflow-y-auto flex-1 px-6 py-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Formulário */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Dados do Produto</h3>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(addToList)} className="space-y-4">
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

                                        <div className="flex gap-2 pt-4">
                                            <Button
                                                type="submit"
                                                className="flex-1 h-9 text-sm bg-purple-600 hover:bg-purple-700"
                                                disabled={form.formState.isSubmitting}
                                            >
                                                Adicionar à lista
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="flex-1 h-9 text-sm bg-transparent"
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
                                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
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
                                                        <p className="text-purple-600 font-bold">R$ {Number(order.sale_price * valuesForm.length).toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="border-t px-6 py-4 bg-gray-50 flex gap-2">
                        {valuesForm.length > 0 && (
                            <div className="flex-1 flex items-center text-sm">
                                <span className="text-gray-600">
                                    Total:{" "}
                                    <span className="font-bold text-purple-600 text-lg">
                                        R$ {valuesForm.reduce((sum, order) => sum + Number(order.sale_price * valuesForm.length || 0), 0).toFixed(2)}
                                    </span>
                                </span>
                            </div>
                        )}
                        <Button
                            type="button"
                            variant="outline"
                            className="h-9 bg-transparent"
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
                                className="h-9 bg-green-600 hover:bg-green-700"
                                onClick={onSubmit}
                                disabled={isPending}
                            >
                                {isPending
                                    ? "Salvando..."
                                    : `Salvar ${valuesForm.length} ${valuesForm.length === 1 ? "Pedido" : "Pedidos"}`}
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </form>
        </Dialog>
    )
}
