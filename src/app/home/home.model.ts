import api from "@/services/api";
import { deleteCookie, getCookie } from "cookies-next";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const useHomeModel = () => {
    const router = useRouter()
    const [decodedCookie, setDecodedCookie] = useState<string>("");

    useEffect(() => {
        async function fetchCookie() {
            const cookie = await getCookie("UN");
            setDecodedCookie(cookie ? atob(cookie as string) : "0");
        }
        fetchCookie();
    }, []);

    const currentDate = new Date().toLocaleDateString("pt-BR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    const exitFunction = async (e: any) => {
        e.preventDefault();
        try {
            await api.post("/user/logout", {}, {
                withCredentials: true
            });
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }

        // Deletar cookies usando cookies-next com as mesmas opções usadas na criação
        deleteCookie("UN", { path: "/", sameSite: "strict" });
        deleteCookie("UID", { path: "/", sameSite: "strict" });
        deleteCookie("UP", { path: "/", sameSite: "strict" });
        deleteCookie("UU", { path: "/", sameSite: "strict" });

        // Deletar cookies usando js-cookie (para garantir que todos sejam removidos)
        // O accessToken é HttpOnly e será deletado pelo backend
        Cookies.remove("UN", { path: "/", sameSite: "strict" });
        Cookies.remove("UID", { path: "/", sameSite: "strict" });
        Cookies.remove("UP", { path: "/", sameSite: "strict" });
        Cookies.remove("UU", { path: "/", sameSite: "strict" });

        // Limpar qualquer cookie que possa ter sido definido sem path específico
        Cookies.remove("UN");
        Cookies.remove("UID");
        Cookies.remove("UP");
        Cookies.remove("UU");

        // Aguardar um pouco para garantir que os cookies sejam deletados
        await new Promise(resolve => setTimeout(resolve, 100));

        router.push("/");
        // Forçar reload para garantir que o estado seja limpo
        if (typeof window !== 'undefined') {
            window.location.href = "/";
        }
    }

    return {
        currentDate,
        exitFunction,
        router,
        decodedCookie
    }
}