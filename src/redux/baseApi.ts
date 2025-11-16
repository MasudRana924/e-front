// src/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // your backend base URL
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json, text/plain, */*',
  },
});

// Add request interceptor for debugging and auth token
api.interceptors.request.use(
  (config) => {
    // Add auth token to requests
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      isHTML: typeof error.response?.data === 'string' && error.response?.data.includes('<html>')
    });
    
    return Promise.reject(error);
  }
);

export default api;
