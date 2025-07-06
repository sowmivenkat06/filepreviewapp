// src/utils/authUtils.js
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};
