// Token management
export const TOKEN_KEY = 'authToken';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

// Authentication state management
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    // Get expiry from token if it exists (assuming JWT)
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp) {
      return payload.exp * 1000 > Date.now();
    }
    return true;
  } catch (error) {
    console.error('Error parsing token:', error);
    return false;
  }
};

// Redirect helper
export const redirectToLogin = () => {
  window.location.href = '/login';
};

// Authentication error handler
export const handleAuthError = (error) => {
  if (error.message.includes('token')) {
    removeToken();
    redirectToLogin();
  }
  throw error;
};