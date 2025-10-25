import axios from "axios";

const baseURL = import.meta.env?.VITE_API_URL ?? "http://localhost:8080/v1/api";
console.log("VITE_API_URL (import.meta.env):", import.meta.env?.VITE_API_URL);
console.log("baseURL: ", baseURL);

const api = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default api;
