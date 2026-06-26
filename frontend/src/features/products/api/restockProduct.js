import apiClient from '../../../lib/axios';

export const restockProduct = async (id, quantity) => {
  const response = await apiClient.post(`/products/${id}/restock`, { quantity });
  return response.data;
};
