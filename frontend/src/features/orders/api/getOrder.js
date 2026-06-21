import apiClient from '../../../lib/axios';

export const getOrder = async (orderId) => {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
};
