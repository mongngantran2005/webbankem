import axiosInstance from "./axios";

const apiProduct = {
  // ==================== USER API ====================
  // 📦 Lấy tất cả sản phẩm (hiển thị bên shop)
  getAll: async () => {
    const res = await axiosInstance.get("/products");
    return res.data.data;
  },

  // 🔍 Lấy sản phẩm theo ID
  getById: async (id) => {
    const res = await axiosInstance.get(`/products/${id}`);
    return res.data.data;
  },

  // 📂 Lấy sản phẩm theo danh mục
  getByCategory: async (categoryId) => {
    const res = await axiosInstance.get(`/products/category/${categoryId}`);
    return res.data.data;
  },

  // 🔎 Tìm kiếm sản phẩm theo từ khóa
  search: async (keyword) => {
    const res = await axiosInstance.get(`/products/search/${keyword}`);
    return res.data.data;
  },

  // 💸 Lấy sản phẩm giảm giá
  getSale: async () => {
    const res = await axiosInstance.get("/products/sale");
    return res.data.data;
  },

  // 🆕 Lấy sản phẩm mới
  getNew: async () => {
    const res = await axiosInstance.get("/products/new");
    return res.data.data;
  },

  // ==================== ADMIN API ====================
  admin: {
    // 📋 Lấy danh sách sản phẩm (phân trang)
    getAll: async (page = 1, perPage = 5) => {
      const res = await axiosInstance.get(
        `/products/admin/all?page=${page}&per_page=${perPage}`
      );
      return res.data; // { success, data, pagination }
    },

    // 🗑️ Lấy danh sách sản phẩm trong thùng rác
    getTrash: async (page = 1, perPage = 5) => {
      const res = await axiosInstance.get(
        `/products/admin/trash?page=${page}&per_page=${perPage}`
      );
      return res.data;
    },

    // 📜 Dropdown sản phẩm (ví dụ dùng trong form chọn)
    getDropdown: async () => {
      const res = await axiosInstance.get(`/products/admin/dropdown`);
      return res.data.data;
    },

    // ➕ Thêm mới sản phẩm
    create: async (data) => {
      const res = await axiosInstance.post(`/products/admin`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data; // { success, message, data }
    },

    // ✏️ Cập nhật sản phẩm
    update: async (id, data) => {
      const res = await axiosInstance.put(`/products/admin/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },

    // 🔄 Cập nhật trạng thái (ẩn/hiện)
status: async (id) => {
  const res = await axiosInstance.patch(`/products/admin/${id}/status`);
  return res.data;
},

    // 🗑️ Xóa mềm sản phẩm (chuyển vào thùng rác)
    // 🗑️ Xóa mềm sản phẩm (chuyển vào thùng rác)
delete: async (id) => {
  const res = await axiosInstance.delete(`/products/admin/${id}`);
  return res.data;
},


    // ♻️ Khôi phục sản phẩm đã xóa
    restore: async (id) => {
      const res = await axiosInstance.patch(`/products/admin/${id}/restore`);
      return res.data;
    },

    // ❌ Xóa vĩnh viễn
    forceDelete: async (id) => {
      const res = await axiosInstance.delete(`/products/admin/${id}/force`);
      return res.data;
    },
  },
};

export default apiProduct;
