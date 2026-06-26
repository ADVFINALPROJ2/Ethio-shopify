import apiClient from '../../../lib/axios';

export const getStorefrontProduct = async (slug, productId) => {
  const response = await apiClient.get(`/shops/${slug}/products/${productId}`);
  return response.data;
};
