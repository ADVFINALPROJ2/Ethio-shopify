import apiClient from '../../../lib/axios';

const addToCart = async (_userId, productId, quantity = 1) => {
  const response = await apiClient.post('/cart/items', {
    product_id: productId,
    quantity: quantity
  });
  return response.data;
};

export default addToCart;
