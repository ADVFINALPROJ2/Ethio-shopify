import apiClient from '../../../lib/axios';

export const createUser = async (userData) => {
    const response = await apiClient.post('/users', { user: userData });
    return response.data;
};
