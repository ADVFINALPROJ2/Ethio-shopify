import apiClient from '../../../lib/axios';

export const getProductCategories = async () => {
  const response = await apiClient.get('/product_categories');
  return response.data;
};