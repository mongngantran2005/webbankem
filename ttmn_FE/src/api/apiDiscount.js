// src/api/apiDiscount.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ✅ Tự động thêm token (nếu có)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const apiDiscount = {
  // 🟢 Lấy tất cả mã giảm giá (cho admin)
  getAll: async () => {
    const res = await axiosInstance.get("/discounts");
    return res.data.data;
  },

  // 🟢 Lấy chi tiết mã giảm giá theo ID
getById: async (id) => {
  const res = await axiosInstance.get(`/discounts/${id}`);
  return res.data.data;
},

  // 🟢 Thêm mã giảm giá
  create: async (payload) => {
    const res = await axiosInstance.post("/discounts", payload);
    return res.data.data;
  },

  // 🟢 Cập nhật mã giảm giá
  update: async (id, payload) => {
    const res = await axiosInstance.put(`/discounts/${id}`, payload);
    return res.data.data;
  },

  // 🟢 Xóa mã giảm giá
  delete: async (id) => {
    const res = await axiosInstance.delete(`/discounts/${id}`);
    return res.data;
  },

  // 🟢 Lấy mã giảm giá đang hoạt động (hiển thị Home)
  getActive: async () => {
    const res = await axiosInstance.get("/discounts/active");
    return res.data.data;
  },

  // 🟢 Kiểm tra mã giảm giá người dùng nhập
  apply: async (code) => {
    const res = await axiosInstance.post("/discounts/apply", { code });
    return res.data;
  },

  // 🟢 Lấy danh sách mã giảm giá theo user
  getUserDiscounts: async (userId) => {
    const res = await axiosInstance.get(`/discounts/user/${userId}`);
    return res.data.data;
  },
};

export default apiDiscount;
