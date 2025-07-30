import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:3000',
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

export default api; 