import axios, { AxiosInstance, AxiosResponse } from "axios";
import Cookies from 'js-cookie';

// Função para obter o token atualizado
const getAuthToken = () => Cookies.get("accessToken");

const api: AxiosInstance = axios.create({
    baseURL: process.env.API_URL,
    withCredentials: true,
    timeout: 90000,
});

// Interceptor de requisição para adicionar o token dinamicamente
api.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        // Validar que o token é uma string válida e não vazia antes de enviar
        if (token && typeof token === 'string' && token.trim().length > 0) {
            // Validar formato JWT básico (deve ter pelo menos 2 pontos)
            const tokenParts = token.split('.');
            if (tokenParts.length >= 3) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de resposta para tratamento de erros
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Limpar cookies em caso de 401
            Cookies.remove("accessToken");
            Cookies.remove("UN");
            Cookies.remove("UID");
            Cookies.remove("UP");
            Cookies.remove("UU");
            // Redirecionar para a página de login (client-side)
            if (typeof window !== 'undefined') {
                window.location.href = "/";
            }
        }

        if (error.response === "Necessario informar o endereço da visita") {
            return error.response as AxiosResponse;
        }

        return Promise.reject(error.response);
    }
);

export default api;