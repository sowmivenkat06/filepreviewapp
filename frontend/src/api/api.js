// frontend/src/api/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`, // dynamically uses env URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // optional: include cookies if needed for auth
});

export default apiClient;
