import apiClient from '../../../lib/axios';

export const getProducts = async () => {
    const response = await apiClient.get('/products');
    return response.data;
};
