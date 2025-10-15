import axiosInstance from "./axios";

const apiBrand = {
  // ==================== USER API ====================
  getAll: () => axiosInstance.get("/brands"),
  getById: (id) => axiosInstance.get(`/brands/${id}`),
  getByCategory: (categoryId) =>
    axiosInstance.get(`/categories/${categoryId}/brands`),

  // ==================== ADMIN API ====================
  admin: {
    getAll: () => axiosInstance.get("/brands/admin/all"),
    getDropdown: () => axiosInstance.get("/brands/admin/dropdown"),
    getTrash: () => axiosInstance.get("/brands/admin/trash"),
    create: (data) =>
      axiosInstance.post("/brands/admin", data, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    update: (id, data) =>
      axiosInstance.put(`/brands/admin/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    updateStatus: (id) => axiosInstance.patch(`/brands/admin/${id}/status`),
    delete: (id) => axiosInstance.delete(`/brands/admin/${id}`),
    restore: (id) => axiosInstance.patch(`/brands/admin/${id}/restore`),
    forceDelete: (id) => axiosInstance.delete(`/brands/admin/${id}/force`),
  },
};

export default apiBrand;
