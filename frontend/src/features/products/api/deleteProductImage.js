import apiClient from '../../../lib/axios';

export const deleteProductImage = async (productId, imageId) => {
  const response = await apiClient.delete(`/products/${productId}/images/${imageId}`);
  return response.data;
};
