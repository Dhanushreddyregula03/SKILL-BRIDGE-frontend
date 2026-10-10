import axios from 'axios';

const api = axios.create({
  baseURL: 'https://skill-bridge-backend-3-p4fz.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('skillbridge_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or invalid
      // localStorage.removeItem('skillbridge_token');
      // localStorage.removeItem('skillbridge_user');
    }
    return Promise.reject(error);
  }
);

export default api;
