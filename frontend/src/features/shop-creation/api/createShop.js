import apiClient from '../../../lib/axios';

export const createShop = async (shopData) => {
    const response = await apiClient.post('/shops', shopData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};
