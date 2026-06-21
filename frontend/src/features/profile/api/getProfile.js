import apiClient from '../../../lib/axios';

export const getProfile = async () => {
    const response = await apiClient.get('/me');
    return response.data.user;
};
