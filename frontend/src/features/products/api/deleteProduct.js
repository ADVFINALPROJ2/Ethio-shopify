import apiClient from '../../../lib/axios';

export const deleteProduct = async (id) => {
    await apiClient.delete(`/products/${id}`);
};
