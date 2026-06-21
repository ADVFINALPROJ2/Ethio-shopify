import apiClient from '../../../lib/axios';

export const getDashboardStats = async () => {
    const response = await apiClient.get('/dashboard/stats');
    return response.data;
};
