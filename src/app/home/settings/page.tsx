import { ChangePasswordForm } from "@/components/settings/change-password-form";
import { Settings } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex items-center space-x-4 text-white">
                <div className="p-3 bg-white/10 rounded-lg">
                    <Settings className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Configurações</h1>
                    <p className="text-purple-200">Gerencie suas preferências e segurança</p>
                </div>
            </div>

            <ChangePasswordForm />
        </div>
    )
}
