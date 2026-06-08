import apiClient from '../../../lib/axios';

export const updateProduct = async (id, productData) => {
    const response = await apiClient.patch(`/products/${id}`, { product: productData });
    return response.data;
};
