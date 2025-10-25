import axios from "axios";

// ======================================
// ⚙️ CẤU HÌNH API NGƯỜI DÙNG
// ======================================
const apiUser = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // 👈 Gọi đến Laravel backend
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ======================================
// 🔑 CÁC HÀM XỬ LÝ USER AUTH
// ======================================

// 🟢 Đăng ký tài khoản
export const register = async (data) => {
  const res = await apiUser.post("/register", data);
  return res.data;
};

// 🟢 Đăng nhập
export const login = async (data) => {
  const res = await apiUser.post("/login", data);
  return res.data;
};

// 🔴 Đăng xuất
export const logout = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    await apiUser.post(
      "/logout",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  }
  // Xóa thông tin người dùng + token
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  // Khi đăng xuất => xóa giỏ hàng user đó
  clearCart();
};

// ======================================
// 🛒 QUẢN LÝ GIỎ HÀNG THEO USER
// ======================================

// 🔹 Lấy key giỏ hàng theo user hiện tại
export const getCartKey = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? `cart_${user.id}` : "cart_guest";
};

// 🔹 Lấy giỏ hàng của user
export const getCart = () => {
  const key = getCartKey();
  return JSON.parse(localStorage.getItem(key)) || [];
};

// 🔹 Lưu giỏ hàng của user
export const saveCart = (cart) => {
  const key = getCartKey();
  localStorage.setItem(key, JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated")); // giúp Header cập nhật lại
};

// 🔹 Xóa giỏ hàng của user (khi đăng xuất)
export const clearCart = () => {
  const key = getCartKey();
  localStorage.removeItem(key);
  window.dispatchEvent(new Event("cartUpdated"));
};

// ======================================
// 📦 EXPORT
// ======================================



export default apiUser;
