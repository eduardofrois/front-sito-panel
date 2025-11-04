// import api from "@/services/api";
// import { useMutation } from "@tanstack/react-query";
// import { toast } from "sonner";
// import { CreateOrderSchema } from "../../order.interface";

// async function AddOrderAndSolicitation(data: CreateOrderSchema[], solicitation: number | null) {
//     const response = await api.post(`/solicitations/add-order-and-solicitation?solicitation=${solicitation}`, data);

//     if (!response.data.flag) {
//         toast.error("Erro ao salvar solicitação no banco")
//     }

//     return response.data.data
// }

// export default function useMutationAddOrderAndSolicitation() {
//     return useMutation({
//         mutationFn: (data: CreateOrderSchema[], solicitation: number | null) => AddOrderAndSolicitation(data, solicitation),
//         mutationKey: ["AddOrderAndSolicitation"],
//         onSuccess: () => {
//             toast.success("Sucesso a cadastrar pedidos")
//         }
//     })
// }