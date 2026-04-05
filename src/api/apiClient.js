// api/apiClient.js
import axios from "axios";
import { logout } from "../slices/loginSlice";
import store from "../store";

const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE ||
    "https://cloudflareprj-production.up.railway.app", // ✅ /api 붙이지 마세요
});

apiClient.interceptors.request.use((config) => {
  const state = store.getState();
  const token =
    state?.login?.token ||
    JSON.parse(localStorage.getItem("electric_login") || "{}")?.token;

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      store.dispatch(logout());
    }
    return Promise.reject(err);
  },
);

export default apiClient;
