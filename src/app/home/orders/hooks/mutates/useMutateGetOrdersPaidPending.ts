import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface PaginationWithFiltersInterface {
    pageNumber: number;
    pageSize: number;
    dateStart?: string;
    dateEnd?: string;
    clientId?: number;
    supplierId?: number;
}

async function getPendingPaid(params: PaginationWithFiltersInterface) {
    const { pageNumber, pageSize, dateStart, dateEnd, clientId, supplierId } = params;

    const queryParams = new URLSearchParams();
    queryParams.append('pageNumber', pageNumber.toString());
    queryParams.append('pageSize', pageSize.toString());

    if (dateStart) queryParams.append('dateStart', dateStart);
    if (dateEnd) queryParams.append('dateEnd', dateEnd);
    if (clientId) queryParams.append('clientId', clientId.toString());
    if (supplierId) queryParams.append('supplierId', supplierId.toString());

    const response = await api.get(`/orders/pending?${queryParams.toString()}`);

    if (!response.data.flag) {
        toast.error(response.data.message)
        return {
            data: [],
            totalCount: 0,
            pageNumber: 1,
            pageSize: 10,
            totalPages: 0
        }
    }

    return {
        data: response.data.data || [],
        totalCount: response.data.totalCount || 0,
        pageNumber: response.data.pageNumber || pageNumber,
        pageSize: response.data.pageSize || pageSize,
        totalPages: response.data.totalPages || 0
    }
}

export default function useQueryGetPendingPaid(params: PaginationWithFiltersInterface) {
    return useQuery({
        queryKey: ["getPendingPaidOrders", params.pageNumber, params.pageSize, params.dateStart, params.dateEnd, params.clientId, params.supplierId],
        queryFn: () => getPendingPaid(params)
    })
}