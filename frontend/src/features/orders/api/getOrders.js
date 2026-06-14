import apiClient from '../../../lib/axios';

export const getOrders = async () => {
    const response = await apiClient.get('/orders');
    return response.data;
};
