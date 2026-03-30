// CONNECTION WITH BACKEND API - CONNEXIÓN CON LA API DEL BACKEND

import axios from "axios";
import { timeString } from "../utils/formats.utils";

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

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error(
        "Unauthorized - Token may be expired or invalid. Redirecting to login.",
        error,
      );
      console.error("Token activated at: ", timeString);
      // Token expired or invalid, redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("vehicleId");
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

export default api;
