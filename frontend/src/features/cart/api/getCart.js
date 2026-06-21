import apiClient from '../../../lib/axios';

const getCart = async (userId) => {
  const response = await apiClient.get('/cart', {
    params: { user_id: userId }
  });
  return response.data;
};

export default getCart;
