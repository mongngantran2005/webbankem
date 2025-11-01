// src/api/apiBanner.js
import axiosInstance from "./axios";

const apiBanner = {
  // 🔹 Lấy tất cả banner cho admin
  getAllAdmin: () => axiosInstance.get("/banners/admin/all"),

  // 🔹 Lấy banner slideshow cho trang chính
  getSlideshow: () => axiosInstance.get("/banners/slideshow"),

  // 🔹 Lấy banner popup cho trang chính
  getPopup: () => axiosInstance.get("/banners/popup"),

  // 🔹 Thêm mới banner
  create: (data) =>
    axiosInstance.post("/banners/admin", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // 🔹 Cập nhật banner
  update: (id, data) =>
    axiosInstance.post(`/banners/admin/${id}?_method=PUT`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // 🔹 Xóa banner
  delete: (id) => axiosInstance.delete(`/banners/admin/${id}`),
};

export default apiBanner;
