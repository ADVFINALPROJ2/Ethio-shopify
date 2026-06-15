import apiClient from '../../../lib/axios';

export const addToCart = async (userId, productId, quantity = 1) => {
    const response = await apiClient.post('/cart/items', { user_id: userId, product_id: productId, quantity });
    return response.data;
};
