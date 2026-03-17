// CONNECTION WITH BACKEND API - CONNEXIÓN CON LA API DEL BACKEND

import axios from "axios";

const baseURL = import.meta.env?.VITE_API_URL ?? "http://localhost:8080/v1/api";

const api = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor to add the token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
