import axios from "axios";

const baseURL =
  import.meta?.env?.VITE_API_URL || "http://localhost:8080/v1/api";

const api = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    "Application-Type": "applicaton/json",
    Accept: "application/json",
  },
});

export default api;
