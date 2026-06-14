import apiClient from '../../../lib/axios';

export const updateProfile = async (profileData) => {
    const isFormData = profileData instanceof FormData;
    const payload = isFormData ? profileData : { user: profileData };
    const response = await apiClient.patch('/me', payload, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    return response.data.user;
};
