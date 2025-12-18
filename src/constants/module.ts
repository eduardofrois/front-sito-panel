import {
    BarChart3,
    CircleDollarSign,
    CreditCard,
    Settings,
    ShoppingCart,
    Truck
} from "lucide-react";

export const modules = [
    {
        id: 1,
        title: "Vendas",
        description: "Visualize e gerencie os pedidos realizados na plataforma.",
        icon: ShoppingCart,
        color: "bg-purple-100",
        route: "/home/orders"
    },
    {
        id: 2,
        title: "Conciliação",
        description: "Acesse informações financeiras, cobranças e pagamentos.",
        icon: CreditCard,
        color: "bg-purple-100",
        route: "/home/accounts"
    },
    {
        id: 3,
        title: "Pronta Entrega",
        description: "Gerencie os itens disponíveis para entrega imediata.",
        icon: Truck,
        color: "bg-purple-100",
        route: "/home/readytoship"
    },
    {
        id: 4,
        title: "Despesas",
        description: "Registre aqui suas despesas para ter maior controle.",
        icon: CircleDollarSign,
        color: "bg-purple-100",
        route: "/home/expenses"
    },
    {
        id: 5,
        title: "Dashboards",
        description: "Visualize dados analíticos e relatórios em tempo real.",
        icon: BarChart3,
        color: "bg-purple-100",
        route: "/home/dashboards"
    },
    {
        id: 6,
        title: "Configuração",
        description: "Personalize preferências e parâmetros do sistema.",
        icon: Settings,
        color: "bg-purple-100",
        route: "/home/settings"
    },
] as const;
