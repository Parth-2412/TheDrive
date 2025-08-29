import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL

// Base URL for the API

// Create an Axios instance with default configurations
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add request/response interceptors if needed
axiosInstance.interceptors.request.use(
  (config) => {
    // Attach token to each request if available
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  response => response, // Directly return successful responses.
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark the request as retried to avoid infinite loops.
      try {
        const refreshToken = localStorage.getItem('refresh_token'); // Retrieve the stored refresh token.
        // Make a request to your auth server to refresh the token.
        const response = await axiosInstance.post(`/api/auth/token/refresh`, {
          refreshToken,
        });
        const { access_token, refresh_token: newRefreshToken } = response.data;
        // Store the new access and refresh tokens.
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', newRefreshToken);
        // Update the authorization header with the new access token.
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        return axiosInstance(originalRequest); // Retry the original request with the new access token.
      } catch (refreshError) {
        // Handle refresh token errors by clearing stored tokens and redirecting to the login page.
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error); // For all other errors, return the error as is.
  }
);
export default axiosInstance;
