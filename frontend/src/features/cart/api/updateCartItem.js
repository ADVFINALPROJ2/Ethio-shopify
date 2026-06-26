import apiClient from '../../../lib/axios';

const updateCartItem = async (_userId, itemId, quantity) => {
  const response = await apiClient.patch(`/cart/items/${itemId}`, {
    quantity: quantity
  });
  return response.data;
};

export default updateCartItem;
