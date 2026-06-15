import apiClient from '../../../lib/axios';

export const getCart = async (userId) => {
    const response = await apiClient.get('/cart', { params: { user_id: userId } });
    return response.data;
};
