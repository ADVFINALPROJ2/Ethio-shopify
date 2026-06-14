import apiClient from '../../../lib/axios';

export const getProductOrders = async (productId) => {
    const response = await apiClient.get(`/products/${productId}/orders`);
    return response.data;
};
