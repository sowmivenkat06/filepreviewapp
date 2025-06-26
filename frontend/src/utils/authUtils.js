// Check if token exists
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};
