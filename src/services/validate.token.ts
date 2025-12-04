import { cookies } from "next/headers";

export default async function ValidateToken({ token }: { token?: { value: string } }) {
    const cookie = await cookies();

    if (!token?.value) {
        return false;
    }

    try {
        const res = await fetch(`${process.env.API_URL}user/validateToken?token=${token.value}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            cache: "no-store",
        });

        if (!res.ok) {
            // Se a requisição falhar, considerar token inválido
            cookie.delete("accessToken");
            cookie.delete("UID");
            cookie.delete("UP");
            cookie.delete("UU");
            cookie.delete("UN");
            return false;
        }

        const data = await res.json();

        if (!data.flag) {
            // Deletar todos os cookies relacionados à autenticação
            cookie.delete("accessToken");
            cookie.delete("UID");
            cookie.delete("UP");
            cookie.delete("UU");
            cookie.delete("UN");
        }

        return data.flag;
    } catch (error) {
        console.error("Erro ao validar token:", error);
        // Em caso de erro, deletar cookies e considerar inválido
        cookie.delete("accessToken");
        cookie.delete("UID");
        cookie.delete("UP");
        cookie.delete("UU");
        cookie.delete("UN");
        return false;
    }
}