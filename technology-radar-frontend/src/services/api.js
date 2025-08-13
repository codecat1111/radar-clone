import axios from "axios";
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error("API Response Error:", error.response?.data || error.message);

    if (error.response?.status === 404) {
      throw new Error("Resource not found");
    }

    if (error.response?.status >= 500) {
      throw new Error("Server error. Please try again later.");
    }

    throw new Error(error.response?.data?.error || "An error occurred");
  }
);

export default api;
