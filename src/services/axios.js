import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/v1/api",
  timeout: 5000,
  headers: {
    "Application-Type": "applicaton/json",
    Accept: "application/json",
  },
});

export default api;
