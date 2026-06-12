import axios from 'axios';
import { API_URL } from '../config/index';
import { getStoredAuthToken } from '../features/auth/authStorage';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true' // This skips the ngrok browser warning page
  }
});

apiClient.interceptors.request.use((config) => {
  const token = getStoredAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiClient;
