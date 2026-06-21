import apiClient from '../../../lib/axios';

export const getProduct = async (productId) => {
    const response = await apiClient.get(`/products/${productId}`);
    return response.data;
};
