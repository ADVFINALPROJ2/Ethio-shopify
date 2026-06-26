import apiClient from '../../../lib/axios';

export const createProduct = async (productData, config = {}) => {
    const isFormData = productData instanceof FormData;
    const payload = isFormData ? productData : { product: productData };
    const response = await apiClient.post('/products', payload, {
        ...config,
        headers: {
            ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : {}),
            ...(config.headers || {})
        }
    });
    return response.data;
};
