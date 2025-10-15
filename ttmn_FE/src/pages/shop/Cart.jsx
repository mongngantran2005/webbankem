import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // 🧠 Lấy key giỏ hàng theo user đăng nhập (để mỗi user có giỏ riêng)
  const getCartKey = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? `cart_${user.id}` : "cart_guest";
  };

  // ✅ Load giỏ hàng khi mở trang hoặc có thay đổi localStorage
  useEffect(() => {
    const loadCart = () => {
      const key = getCartKey();
      const storedCart = JSON.parse(localStorage.getItem(key)) || [];
      setCartItems(storedCart);
    };

    loadCart();

    // Lắng nghe thay đổi giữa các tab
    window.addEventListener("storage", loadCart);
    return () => window.removeEventListener("storage", loadCart);
  }, []);

  // ✅ Lưu giỏ hàng vào localStorage
  const saveCart = (updatedCart) => {
    const key = getCartKey();
    localStorage.setItem(key, JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    window.dispatchEvent(new Event("storage"));
  };

  // ✅ Cập nhật số lượng sản phẩm
  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, qty: newQty } : item
    );
    saveCart(updated);
  };

  // ✅ Xóa 1 sản phẩm
  const handleRemove = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    saveCart(updated);
  };

  // ✅ Xóa toàn bộ giỏ hàng
  const handleClearCart = () => {
    if (window.confirm("🗑️ Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng không?")) {
      const key = getCartKey();
      localStorage.removeItem(key);
      setCartItems([]);
      window.dispatchEvent(new Event("storage"));
    }
  };

  // ✅ Tính tổng tiền
  const total = cartItems.reduce(
    (sum, item) => sum + item.qty * (item.price_sale || item.price_root),
    0
  );

  // ✅ Nếu giỏ hàng trống
  if (cartItems.length === 0)
    return (
      <div className="container py-5 text-center">
        <h4>🛒 Giỏ hàng trống</h4>
        <Link to="/" className="btn btn-outline-primary mt-3">
          Quay lại mua hàng
        </Link>
      </div>
    );

  // ✅ Giao diện chính
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Giỏ hàng của bạn</h3>
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={handleClearCart}
        >
          <i className="fas fa-trash-alt me-1"></i> Xóa toàn bộ giỏ hàng
        </button>
      </div>

      <div className="table-responsive">
        <table className="table align-middle text-center">
          <thead className="table-light">
            <tr>
              <th>Hình ảnh</th>
              <th>Sản phẩm</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Tổng</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id}>
                <td>
                  <img
                    src={`http://127.0.0.1:8000/uploads/products/${item.thumbnail}`}
                    alt={item.name}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "6px",
                    }}
                  />
                </td>
                <td className="fw-semibold">{item.name}</td>
                <td className="text-danger fw-semibold">
                  {(item.price_sale || item.price_root).toLocaleString("vi-VN")}₫
                </td>
                <td>
                  <div className="d-flex justify-content-center align-items-center">
                    <button
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() => updateQuantity(item.id, item.qty - 1)}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      className="form-control text-center"
                      style={{ width: "70px" }}
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value) || 1)
                      }
                    />
                    <button
                      className="btn btn-sm btn-outline-secondary ms-2"
                      onClick={() => updateQuantity(item.id, item.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="fw-semibold">
                  {(item.qty * (item.price_sale || item.price_root)).toLocaleString(
                    "vi-VN"
                  )}
                  ₫
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleRemove(item.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Tổng cộng và nút thanh toán */}
      <div className="text-end mt-4">
        <h5>
          Tổng cộng:{" "}
          <span className="text-danger fw-bold">
            {total.toLocaleString("vi-VN")}₫
          </span>
        </h5>
        <button
          className="btn btn-success mt-2 px-4"
          onClick={() => {
            const token = localStorage.getItem("token");
            if (!token) {
              alert("🔒 Vui lòng đăng nhập trước khi thanh toán!");
              navigate("/login");
            } else {
              localStorage.setItem("last_cart_key", getCartKey());
              navigate("/checkout");
            }
          }}
        >
          Thanh toán
        </button>
      </div>
    </div>
  );
}

export default Cart;
