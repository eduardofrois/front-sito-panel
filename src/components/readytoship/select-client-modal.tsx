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
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Clients } from "@/app/home/accounts/accounts.interface"
import { Solicitation } from "@/app/home/orders/order.interface"
import { CheckCircle2, Package, Plus, User } from "lucide-react"
import { useState } from "react"

interface SelectClientModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    clients: Clients[]
    solicitations: Solicitation[]
    selectedOrdersCount: number
    onConfirm: (clientId: number | null, solicitationId: number | null) => Promise<void>
    isLoading?: boolean
}

export const SelectClientModal = ({
    open,
    onOpenChange,
    clients,
    solicitations,
    selectedOrdersCount,
    onConfirm,
    isLoading = false,
}: SelectClientModalProps) => {
    const [selectedClient, setSelectedClient] = useState<string>("")
    const [selectedSolicitation, setSelectedSolicitation] = useState<string>("")
    const [mode, setMode] = useState<"new" | "existing">("new")

    const handleConfirm = async () => {
        const clientId = selectedClient ? Number(selectedClient) : null
        const solicitationId = mode === "existing" && selectedSolicitation ? Number(selectedSolicitation) : null

        await onConfirm(clientId, solicitationId)
        
        // Reset form
        setSelectedClient("")
        setSelectedSolicitation("")
        setMode("new")
        onOpenChange(false)
    }

    const handleCancel = () => {
        setSelectedClient("")
        setSelectedSolicitation("")
        setMode("new")
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Package className="h-5 w-5 text-purple-600" />
                        Anexar Pedidos à Solicitação
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-600 pt-2">
                        Você selecionou <strong>{selectedOrdersCount}</strong> pedido(s) para anexar.
                        Escolha como deseja proceder:
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Modo de seleção */}
                    <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-700">
                            Escolha uma opção:
                        </Label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setMode("new")
                                    setSelectedSolicitation("")
                                }}
                                className={`p-4 rounded-lg border-2 transition-all ${
                                    mode === "new"
                                        ? "border-purple-500 bg-purple-50"
                                        : "border-gray-200 bg-white hover:border-gray-300"
                                }`}
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <Plus className={`h-5 w-5 ${mode === "new" ? "text-purple-600" : "text-gray-400"}`} />
                                    <span className={`text-sm font-medium ${mode === "new" ? "text-purple-700" : "text-gray-600"}`}>
                                        Nova Solicitação
                                    </span>
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setMode("existing")
                                    setSelectedClient("")
                                }}
                                className={`p-4 rounded-lg border-2 transition-all ${
                                    mode === "existing"
                                        ? "border-purple-500 bg-purple-50"
                                        : "border-gray-200 bg-white hover:border-gray-300"
                                }`}
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <CheckCircle2 className={`h-5 w-5 ${mode === "existing" ? "text-purple-600" : "text-gray-400"}`} />
                                    <span className={`text-sm font-medium ${mode === "existing" ? "text-purple-700" : "text-gray-600"}`}>
                                        Solicitação Existente
                                    </span>
                                </div>
                            </button>
                        </div>
                    </div>

                    <Separator />

                    {/* Seleção de Cliente (apenas para nova solicitação) */}
                    {mode === "new" && (
                        <div className="space-y-2">
                            <Label htmlFor="client" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-500" />
                                Cliente
                            </Label>
                            <Select value={selectedClient} onValueChange={setSelectedClient}>
                                <SelectTrigger id="client" className="w-full">
                                    <SelectValue placeholder="Selecione um cliente" />
                                </SelectTrigger>
                                <SelectContent>
                                    {clients.length === 0 ? (
                                        <div className="p-4 text-center text-sm text-gray-500">
                                            Nenhum cliente encontrado
                                        </div>
                                    ) : (
                                        clients.map((client) => (
                                            <SelectItem key={client.id} value={client.id.toString()}>
                                                {client.name}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-gray-500">
                                Uma nova solicitação será criada para este cliente
                            </p>
                        </div>
                    )}

                    {/* Seleção de Solicitação Existente */}
                    {mode === "existing" && (
                        <div className="space-y-2">
                            <Label htmlFor="solicitation" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Package className="h-4 w-4 text-gray-500" />
                                Solicitação
                            </Label>
                            <Select value={selectedSolicitation} onValueChange={setSelectedSolicitation}>
                                <SelectTrigger id="solicitation" className="w-full">
                                    <SelectValue placeholder="Selecione uma solicitação" />
                                </SelectTrigger>
                                <SelectContent>
                                    {solicitations.length === 0 ? (
                                        <div className="p-4 text-center text-sm text-gray-500">
                                            Nenhuma solicitação encontrada
                                        </div>
                                    ) : (
                                        solicitations.map((solicitation) => (
                                            <SelectItem key={solicitation.id} value={solicitation.id.toString()}>
                                                Solicitação #{solicitation.id} - {solicitation.orderJoin?.length || 0} pedido(s)
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-gray-500">
                                Os pedidos serão anexados à solicitação selecionada
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="w-full sm:w-auto"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        onClick={handleConfirm}
                        disabled={
                            isLoading ||
                            (mode === "new" && !selectedClient) ||
                            (mode === "existing" && !selectedSolicitation)
                        }
                        className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700"
                    >
                        {isLoading ? "Processando..." : "Confirmar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

