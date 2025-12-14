import axios from "axios";

const api = axios.create({
  baseURL: "https://84kmwvvs-5000.inc1.devtunnels.ms",
  headers: {
    "Content-Type": "application/json",
  },
});

// Auto attach token (safe)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
