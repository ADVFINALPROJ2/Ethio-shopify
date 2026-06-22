import apiClient from '../../../lib/axios';

const checkoutCart = async (userId) => {
  const response = await apiClient.post('/cart/checkout', {
    user_id: userId
  });
  return response.data;
};

export default checkoutCart;
