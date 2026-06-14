import apiClient from '../../../lib/axios';

export const createProduct = async (productData) => {
    const isFormData = productData instanceof FormData;
    const payload = isFormData ? productData : { product: productData };
    const response = await apiClient.post('/products', payload, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    return response.data;
};
