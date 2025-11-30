import { useUser } from "@/components/global/ContextWrapper";
import { LoginService } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from 'sonner';

async function Login({
    username,
    password,
}: {
    username: string;
    password: string;
}) {
    const response = await LoginService({ username, password });

    const loginResponse = response?.data;
    console.log("===== raw response ======", response);

    console.log("Login response", loginResponse);

    if (!loginResponse?.flag) {
        console.log("Error!!");
        throw new Error(loginResponse[0]?.message);
    }

    console.log("Success!!");

    return loginResponse;
}

export function useMutateLogin() {
    const router = useRouter();
    const { setCookieLoggedUser } = useUser()

    const mutation = useMutation({
        mutationFn: Login,
        onSuccess: (data) => {
            toast.success("Login feito com sucesso", {
                description: "Tenha um bom trabalho!",
                closeButton: true,
                duration: 5000,
            });
            setCookieLoggedUser(data.data)
            
            // O accessToken é definido automaticamente pelo backend via Set-Cookie
            // quando withCredentials: true está habilitado
            // Não precisamos salvar manualmente aqui
            
            router.push("/home")
        },
        onError: (error) => {
            console.log(error);
            toast.error("Erro ao fazer login", {
                description: "Senha ou usuário incorretos",
                closeButton: true,
            });
        },
    });

    return mutation;
}
