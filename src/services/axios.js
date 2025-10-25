import axios from "axios";

const baseURL = import.meta?.env?.VITE_API_URL;
console.log("baseURL: ", baseURL);
const api = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    "Application-Type": "applicaton/json",
    Accept: "application/json",
  },
});

export default api;
