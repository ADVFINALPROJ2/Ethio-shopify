import apiClient from '../../../lib/axios';

export const getMyShop = async () => {
    const response = await apiClient.get('/shops/me');
    return response.data;
};
