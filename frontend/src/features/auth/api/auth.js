import apiClient from '../../../lib/axios';

export const authenticateWithTelegram = async (initData) => {
  const response = await apiClient.post('/auth/telegram', { initData });
  return response.data;
};

export const getAuthenticatedUser = async () => {
  const response = await apiClient.get('/me');
  return response.data;
};
