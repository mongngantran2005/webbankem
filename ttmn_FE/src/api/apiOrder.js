import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/orders";

const apiOrder = {
  // 🧾 Gửi đơn hàng mới
  create: (data) => {
    const token = localStorage.getItem("token");
    return axios.post(API_URL, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // 📋 Lấy danh sách tất cả đơn hàng
  getAll: () => {
    const token = localStorage.getItem("token");
    return axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // 🔍 Lấy chi tiết 1 đơn hàng theo ID
  getById: (id) => {
    const token = localStorage.getItem("token");
    return axios.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default apiOrder;
