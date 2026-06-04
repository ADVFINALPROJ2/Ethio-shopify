import apiClient from '../../../lib/axios';

export const getUsers = async () => {
    const response = await apiClient.get('/users');
    return response.data;
};
