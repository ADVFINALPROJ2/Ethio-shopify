import apiClient from '../../../lib/axios';

export const createCheckout = async (userId, payload) => {
    const response = await apiClient.post('/checkout', { ...payload, user_id: userId });
    return response.data;
};
