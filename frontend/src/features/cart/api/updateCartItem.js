import apiClient from '../../../lib/axios';

export const updateCartItem = async (itemId, userId, quantity) => {
    const response = await apiClient.patch(`/cart/items/${itemId}`, { user_id: userId, quantity });
    return response.data;
};
