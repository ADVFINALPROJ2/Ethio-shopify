import apiClient from '../../../lib/axios';

const removeCartItem = async (userId, itemId) => {
  const response = await apiClient.delete(`/cart/items/${itemId}`, {
    data: { user_id: userId }
  });
  return response.data;
};

export default removeCartItem;
