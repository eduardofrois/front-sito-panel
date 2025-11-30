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
            await api.post("/user/logout")
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }

        // Deletar cookies usando cookies-next
        deleteCookie("UN");
        deleteCookie("UID");
        deleteCookie("accessToken");
        deleteCookie("UP");
        deleteCookie("UU");

        // Deletar cookies usando js-cookie (para garantir que todos sejam removidos)
        Cookies.remove("UN");
        Cookies.remove("UID");
        Cookies.remove("accessToken");
        Cookies.remove("UP");
        Cookies.remove("UU");

        router.push("/");
    }

    return {
        currentDate,
        exitFunction,
        router,
        decodedCookie
    }
}