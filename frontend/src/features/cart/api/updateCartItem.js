import apiClient from '../../../lib/axios';

const updateCartItem = async (userId, itemId, quantity) => {
  const response = await apiClient.patch(`/cart/items/${itemId}`, {
    user_id: userId,
    quantity: quantity
  });
  return response.data;
};

export default updateCartItem;
