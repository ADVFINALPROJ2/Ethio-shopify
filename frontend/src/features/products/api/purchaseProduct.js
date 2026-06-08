import apiClient from '../../../lib/axios';

export const purchaseProduct = async (id, quantity = 1) => {
    const response = await apiClient.post(`/products/${id}/purchase`, { quantity });
    return response.data;
};
