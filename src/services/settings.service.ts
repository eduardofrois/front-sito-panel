import api from "./api";

export interface ChangePasswordDto {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export async function ChangePasswordService(data: ChangePasswordDto) {
    try {
        const response = await api.post(`/settings/change-password`, data, {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        });

        return response.data;
    } catch (err) {
        console.error(err);
        const error = err as { response?: { data?: { message?: string } } };
        return {
            flag: false,
            message: error.response?.data?.message || "Erro ao alterar senha"
        };
    }
}
