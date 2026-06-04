import axios from 'axios';
import { API_URL } from '../config/index';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true' // This skips the ngrok browser warning page
  }
});

export default apiClient;
