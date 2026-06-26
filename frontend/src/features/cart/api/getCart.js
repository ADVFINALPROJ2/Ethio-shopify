import apiClient from '../../../lib/axios';

const getCart = async () => {
  const response = await apiClient.get('/cart');
  return response.data;
};

export default getCart;
