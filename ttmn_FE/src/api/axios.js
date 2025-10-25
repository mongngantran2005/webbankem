import axios from "axios";
import API_BASE_URL from "./config";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 🟢 Tự động gắn token cho mỗi request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Token lấy sau khi đăng nhập
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
