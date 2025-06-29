// frontend/src/api/api.js
import axios from 'axios';

console.log("🌐 Backend URL:", import.meta.env.VITE_BACKEND_URL);

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`, // example: https://filepreviewapp.onrender.com/api
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // optional: send cookies
});

// ✅ Automatically attach token for every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('✅ Token attached:', token);
  } else {
    console.warn('⚠️ No token found in localStorage');
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;
