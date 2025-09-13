import axios from "axios";

const api = axios.create({
  baseURL: "https://car-service-data-u0r9.onrender.com/v1/api",
  timeout: 5000,
  headers: {
    "Application-Type": "applicaton/json",
    Accept: "application/json",
  },
});

export default api;
