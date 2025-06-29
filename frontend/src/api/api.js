// frontend/src/api/api.js
import axios from 'axios';

// 🔍 Log the backend URL
console.log("🌐 Backend URL:", import.meta.env.VITE_BACKEND_URL);

// Create an Axios instance
const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`, // 👈 make sure your .env is correct
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ✅ For cookies if using sessions
});

// ✅ Attach token from localStorage to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
