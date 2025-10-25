import axios from "axios";

// ✅ Tạo instance chung
const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ✅ Tự động thêm token vào mọi request nếu có
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ======================================
// 📦 API Giảm giá
// ======================================
const apiDiscount = {
  // ✅ Lấy danh sách mã giảm giá của user
  getUserDiscounts: (userId) => axiosInstance.get(`/discounts/user/${userId}`),
};

export default apiDiscount;
