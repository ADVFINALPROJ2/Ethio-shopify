import apiClient from '../../../lib/axios';

export const getBuyerOrders = async () => {
  const response = await apiClient.get('/buyer/orders');
  return response.data;
};
