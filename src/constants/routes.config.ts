const routers = [
    { path: "/", isPublic: true, whenAuthenticated: "redirect" },
    { path: "/home", isPublic: false, whenAuthenticated: "next" },
    { path: "/home/orders", isPublic: false, whenAuthenticated: "next" },
    { path: "/home/purchases", isPublic: false, whenAuthenticated: "next" },
    { path: "/orders", isPublic: false, whenAuthenticated: "next" },
    { path: "/purchases", isPublic: false, whenAuthenticated: "next" },
    { path: "/ready-to-ship", isPublic: false, whenAuthenticated: "next" },
    { path: "/accounts", isPublic: false, whenAuthenticated: "next" },
    { path: "/dashboards", isPublic: false, whenAuthenticated: "next" },
    { path: "/expenses", isPublic: false, whenAuthenticated: "next" },
    { path: "/settings", isPublic: false, whenAuthenticated: "next" },
] as const;

export default routers;
