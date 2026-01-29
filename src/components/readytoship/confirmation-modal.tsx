"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AlertTriangle } from "lucide-react"

interface ConfirmationModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description: string
    confirmLabel?: string
    cancelLabel?: string
    onConfirm: () => void | Promise<void>
    isLoading?: boolean
    variant?: 'default' | 'destructive'
}

export function ConfirmationModal({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel = "Confirmar",
    cancelLabel = "Cancelar",
    onConfirm,
    isLoading = false,
    variant = 'default',
}: ConfirmationModalProps) {
    const handleConfirm = async () => {
        await onConfirm()
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                    <div className="flex items-start gap-3">
                        <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                            ${variant === 'destructive'
                                ? 'bg-red-100 text-red-600'
                                : 'bg-purple-100 text-purple-600'
                            }
                        `}>
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                            <AlertDialogTitle className="text-lg font-semibold text-gray-900">
                                {title}
                            </AlertDialogTitle>
                            <AlertDialogDescription className="mt-2 text-sm text-gray-600 whitespace-pre-line">
                                {description}
                            </AlertDialogDescription>
                        </div>
                    </div>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4">
                    <AlertDialogCancel
                        disabled={isLoading}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                        {cancelLabel}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className={`
                            ${variant === 'destructive'
                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                            }
                            disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Processando...
                            </span>
                        ) : (
                            confirmLabel
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
