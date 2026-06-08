import apiClient from '../../../lib/axios';

export const createProduct = async (productData) => {
    const isFormData = productData instanceof FormData;
    const response = await apiClient.post('/products', productData, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    return response.data;
};
