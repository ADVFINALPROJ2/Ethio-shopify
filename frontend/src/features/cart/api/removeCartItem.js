import apiClient from '../../../lib/axios';

export const removeCartItem = async (itemId, userId) => {
    const response = await apiClient.delete(`/cart/items/${itemId}`, { data: { user_id: userId } });
    return response.data;
};
