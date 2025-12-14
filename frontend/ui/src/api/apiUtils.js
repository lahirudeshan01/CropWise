import axios from 'axios';

// Get backend URL from environment variable or use default
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://cropwise-backend-umx9.onrender.com';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add user data to headers
api.interceptors.request.use(
  (config) => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      config.headers['user-data'] = userData;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear user data and redirect to login
      localStorage.removeItem('userData');
      window.location.href = '/log';
    }
    return Promise.reject(error);
  }
);

// Export backend URL for use in other components (e.g., Socket.IO, image URLs)
export const getBackendUrl = () => BACKEND_URL;
export default api; 