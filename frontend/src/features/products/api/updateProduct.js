import apiClient from '../../../lib/axios';

export const updateProduct = async (id, productData) => {
    const isFormData = productData instanceof FormData;
    const response = await apiClient.patch(`/products/${id}`, isFormData ? productData : { product: productData });
    return response.data;
};
