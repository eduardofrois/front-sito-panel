"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { DollarSign, ShoppingCart, TrendingDown, TrendingUp, Users } from "lucide-react"
import { useMemo } from "react"
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from "recharts"
import useQueryGetClients from "../accounts/hooks/useQueryGetClients"
import useQueryGetAllOrders from "../orders/hooks/useQueryGetAllOrders"
import type { Order } from "../orders/order.interface"

function processOrdersData(orders: Order[]) {
    if (!orders || orders.length === 0)
        return {
            monthlyData: [],
            statusData: [],
            totalRevenue: 0,
            totalProfit: 0,
            totalOrders: 0,
            averageOrderValue: 0,
            profitMargin: 0,
        }

    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

    // Monthly aggregation
    const monthlyMap = new Map<string, { vendas: number; custos: number; pedidos: number; lucro: number }>()

    // Status aggregation
    const statusMap = new Map<string, number>()

    let totalRevenue = 0
    let totalCosts = 0
    const totalOrders = orders.length

    orders.forEach((order: Order) => {
        // Use the most appropriate date field
        const dateStr = order.date_order || order.date_creation_order
        if (!dateStr) return

        const date = new Date(dateStr)
        const monthIndex = date.getMonth()
        const monthName = months[monthIndex]

        // Calculate values
        const revenue = order.paid_price || order.sale_price || order.total_price
        const cost = order.cost_price * order.amount
        const profit = revenue - cost

        // Monthly data
        if (!monthlyMap.has(monthName)) {
            monthlyMap.set(monthName, { vendas: 0, custos: 0, pedidos: 0, lucro: 0 })
        }
        const monthData = monthlyMap.get(monthName)!
        monthData.vendas += revenue
        monthData.custos += cost
        monthData.pedidos += 1
        monthData.lucro += profit

        // Status data
        const status = order.status || "Indefinido"
        statusMap.set(status, (statusMap.get(status) || 0) + 1)

        // Totals
        totalRevenue += revenue
        totalCosts += cost
    })

    const monthlyData = Array.from(monthlyMap.entries()).map(([month, data]) => ({
        month,
        ...data,
    }))

    const statusData = Array.from(statusMap.entries()).map(([status, count]) => ({
        name: status,
        value: count,
        percentage: ((count / totalOrders) * 100).toFixed(1),
    }))

    const totalProfit = totalRevenue - totalCosts
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0

    return {
        monthlyData,
        statusData,
        totalRevenue,
        totalProfit,
        totalOrders,
        averageOrderValue,
        profitMargin,
    }
}

const chartConfig = {
    vendas: {
        label: "Vendas",
        color: "hsl(var(--chart-1))",
    },
    custos: {
        label: "Custos",
        color: "hsl(var(--chart-2))",
    },
    lucro: {
        label: "Lucro",
        color: "hsl(var(--chart-3))",
    },
    pedidos: {
        label: "Pedidos",
        color: "hsl(var(--chart-4))",
    },
} satisfies ChartConfig

const statusColors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
]

export default function Page() {
    const { data: clients, isLoading: isLoadingClients } = useQueryGetClients()
    const { data: ordersData, isLoading: isLoadingOrders } = useQueryGetAllOrders()

    const orders = Array.isArray(ordersData) ? ordersData : (ordersData?.data || [])

    const processedData = useMemo(() => {
        return processOrdersData(orders)
    }, [orders])

    if (isLoadingClients || isLoadingOrders) {
        return (
            <div className="min-h-screen bg-white">
                <div className="container mx-auto p-4 sm:p-6">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-lg">Carregando dashboard...</div>
                    </div>
                </div>
            </div>
        )
    }

    const { monthlyData, statusData, totalRevenue, totalProfit, totalOrders, averageOrderValue, profitMargin } =
        processedData

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto p-4 sm:p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-balance">Dashboard de Vendas</h1>
                        <p className="text-muted-foreground">Acompanhe o desempenho do seu negócio</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Última atualização: {new Date().toLocaleDateString("pt-BR")}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalRevenue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </div>
                            <p className="text-xs text-muted-foreground">Margem: {profitMargin.toFixed(1)}%</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Lucro Total</CardTitle>
                            {totalProfit >= 0 ? (
                                <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : (
                                <TrendingDown className="h-4 w-4 text-red-600" />
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${totalProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                                {totalProfit.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </div>
                            <p className="text-xs text-muted-foreground">{totalProfit >= 0 ? "Lucro positivo" : "Prejuízo"}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalOrders}</div>
                            <p className="text-xs text-muted-foreground">
                                Ticket médio: {averageOrderValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{clients?.length || 0}</div>
                            <p className="text-xs text-muted-foreground">Clientes ativos</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Revenue vs Costs Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Vendas vs Custos por Mês</CardTitle>
                            <CardDescription>Comparação mensal de receitas e custos</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {monthlyData.length === 0 ? (
                                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                                    Sem dados disponíveis
                                </div>
                            ) : (
                                <ChartContainer config={chartConfig}>
                                    <BarChart data={monthlyData} height={300}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <ChartTooltip
                                            content={<ChartTooltipContent />}
                                            formatter={(value: number) => [
                                                value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
                                                "",
                                            ]}
                                        />
                                        <Bar dataKey="vendas" fill="var(--color-chart-1)" name="Vendas" />
                                        <Bar dataKey="custos" fill="var(--color-chart-2)" name="Custos" />
                                    </BarChart>
                                </ChartContainer>
                            )}
                        </CardContent>
                    </Card>

                    {/* Profit Trend Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Evolução do Lucro</CardTitle>
                            <CardDescription>Tendência de lucro mensal</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {monthlyData.length === 0 ? (
                                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                                    Sem dados disponíveis
                                </div>
                            ) : (
                                <ChartContainer config={chartConfig}>
                                    <LineChart data={monthlyData} height={300}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <ChartTooltip
                                            content={<ChartTooltipContent />}
                                            formatter={(value: number) => [
                                                value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
                                                "Lucro",
                                            ]}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="lucro"
                                            stroke="var(--color-chart-3)"
                                            strokeWidth={3}
                                            dot={{ fill: "var(--color-chart-3)", strokeWidth: 2, r: 4 }}
                                        />
                                    </LineChart>
                                </ChartContainer>
                            )}
                        </CardContent>
                    </Card>

                    {/* Order Status Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Status dos Pedidos</CardTitle>
                            <CardDescription>Distribuição por status</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {statusData.length === 0 ? (
                                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                                    Sem dados disponíveis
                                </div>
                            ) : (
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={statusData}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                dataKey="value"
                                                label={({ name, percentage }) => `${name}: ${percentage}%`}
                                            >
                                                {statusData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={statusColors[index % statusColors.length]} />
                                                ))}
                                            </Pie>
                                            <ChartTooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Monthly Orders Count */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Volume de Pedidos</CardTitle>
                            <CardDescription>Quantidade de pedidos por mês</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {monthlyData.length === 0 ? (
                                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                                    Sem dados disponíveis
                                </div>
                            ) : (
                                <ChartContainer config={chartConfig}>
                                    <BarChart data={monthlyData} height={300}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <ChartTooltip content={<ChartTooltipContent />} formatter={(value: number) => [value, "Pedidos"]} />
                                        <Bar dataKey="pedidos" fill="var(--color-chart-4)" name="Pedidos" />
                                    </BarChart>
                                </ChartContainer>
                            )}
                        </CardContent>
                    </Card>

                    {/* Total Clients Radial Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Total de Clientes</CardTitle>
                            <CardDescription>Quantidade total de clientes cadastrados</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] flex items-center justify-center">
                                <div className="relative">
                                    <ResponsiveContainer width={200} height={200}>
                                        <PieChart>
                                            <Pie
                                                data={[{ name: "Clientes", value: clients?.length || 0 }]}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                startAngle={90}
                                                endAngle={450}
                                                dataKey="value"
                                                fill="hsl(var(--chart-1))"
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold">{clients?.length || 0}</div>
                                            <div className="text-sm text-muted-foreground">Clientes</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
