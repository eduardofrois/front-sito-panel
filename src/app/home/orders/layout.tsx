"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, ShoppingBag } from "lucide-react"
import Link from "next/link"
import type React from "react"

interface OrdersLayoutProps {
    children: React.ReactNode
}

const OrdersLayout = ({ children }: OrdersLayoutProps) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-sky-50">
            <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Link href="/home">
                                <Button variant="ghost" size="sm" className="rounded-full">
                                    <ArrowLeft className="w-4 h-4" />
                                </Button>
                            </Link>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <ShoppingBag className="w-4 h-4 text-purple-600" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-semibold text-gray-900">Gerência de pedidos</h1>
                                    <p className="text-sm text-gray-500">Gerencie suas vendas</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
                <main>{children}</main>
            </div>
        </div>
    )
}

export default OrdersLayout
