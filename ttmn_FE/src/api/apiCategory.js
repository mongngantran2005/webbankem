import axiosInstance from './axios';

const apiCategory = {
  // ==================== USER API ====================
  getAll: () => axiosInstance.get('/categories'),
  getById: (id) => axiosInstance.get(`/categories/${id}`),
  getBrandsByCategory: (id) => axiosInstance.get(`/categories/${id}/brands`),

  // ==================== ADMIN API ====================
  admin: {
    getAll: () => axiosInstance.get('/categories/admin/all'),
    getTrash: () => axiosInstance.get('/categories/admin/trash'),
    getDropdown: () => axiosInstance.get('/categories/admin/dropdown'),

    create: (data) =>
      axiosInstance.post('/categories/admin', data),

    update: (id, data) =>
  axiosInstance.post(`/categories/admin/${id}?_method=PUT`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }),


    updateStatus: (id) => axiosInstance.patch(`/categories/admin/${id}/status`),
    delete: (id) => axiosInstance.delete(`/categories/admin/${id}`),
    restore: (id) => axiosInstance.patch(`/categories/admin/${id}/restore`),
    forceDelete: (id) => axiosInstance.delete(`/categories/admin/${id}/force`),
  },
};

export default apiCategory;
