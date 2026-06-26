import apiClient from '../../../lib/axios';

export const updateMyShop = async (shopData) => {
    const isFormData = shopData instanceof FormData;
    const response = await apiClient.patch('/shops/me', isFormData ? shopData : { shop: shopData }, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    return response.data;
};
