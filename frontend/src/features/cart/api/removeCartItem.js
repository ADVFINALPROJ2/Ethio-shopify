import apiClient from '../../../lib/axios';

const removeCartItem = async (_userId, itemId) => {
  const response = await apiClient.delete(`/cart/items/${itemId}`);
  return response.data;
};

export default removeCartItem;
