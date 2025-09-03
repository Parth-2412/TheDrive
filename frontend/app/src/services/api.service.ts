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

export const aiNodeInstance = axios.create({
  baseURL: import.meta.env.VITE_AI_NODE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});




export default axiosInstance;
