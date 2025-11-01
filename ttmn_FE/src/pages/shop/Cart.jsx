import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiDiscount from "../../api/apiDiscount";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [userDiscounts, setUserDiscounts] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const navigate = useNavigate();
  // ✅ Hàm xử lý đường dẫn ảnh an toàn
const getImageUrl = (thumbnail) => {
  if (!thumbnail) return "http://127.0.0.1:8000/images/placeholder.jpg";
  if (thumbnail.startsWith("http")) return thumbnail;
  if (thumbnail.startsWith("/uploads/")) return `http://127.0.0.1:8000${thumbnail}`;
  return `http://127.0.0.1:8000/uploads/products/${thumbnail}`;
};


  // ✅ Lấy key giỏ hàng theo user
  const getCartKey = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? `cart_${user.id}` : "cart_guest";
  };

  // ✅ Load giỏ hàng
  useEffect(() => {
    const key = getCartKey();
    const stored = JSON.parse(localStorage.getItem(key)) || [];
    setCartItems(stored);
  }, []);

  // ✅ Lưu giỏ hàng
  const saveCart = (updated) => {
    const key = getCartKey();
    localStorage.setItem(key, JSON.stringify(updated));
    setCartItems(updated);
  };
  

  // ✅ Cập nhật số lượng
  const updateQuantity = (id, qty) => {
    if (qty < 1) return;
    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, qty } : item
    );
    saveCart(updated);
  };

  // ✅ Xóa 1 sản phẩm
  const handleRemove = (id) => {
    const updated = cartItems.filter((i) => i.id !== id);
    saveCart(updated);
  };

  // ✅ Xóa toàn bộ
  const handleClearCart = () => {
    if (window.confirm("🗑️ Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng không?")) {
      const key = getCartKey();
      localStorage.removeItem(key);
      setCartItems([]);
    }
  };

  // ✅ Lấy danh sách mã giảm giá của user
useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  apiDiscount
    .getUserDiscounts(user.id)
    .then((res) => {
      console.log("✅ Kết quả API getUserDiscounts:", res);

      // ✅ Kiểm tra cấu trúc dữ liệu trước khi truy cập
const discounts = res;
      if (Array.isArray(discounts)) {
        setUserDiscounts(discounts);
      } else {
        console.warn("⚠️ API không trả về dạng { data: [...] }");
        setUserDiscounts([]);
      }
    })
    .catch((err) => {
      console.error("❌ Lỗi khi lấy mã giảm giá:", err);
      setUserDiscounts([]); // Đảm bảo không crash FE
      if (err.response?.status === 401) {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        navigate("/login");
      }
    });
}, []);


  // ✅ Áp dụng mã giảm giá
  const applyDiscount = (discount) => {
    setSelectedDiscount(discount);
    alert(`✅ Đã áp dụng mã: ${discount.discount.code}`);
  };

  // ✅ Tính tạm tính
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.qty * (item.price_sale || item.price_root),
    0
  );

  // ✅ Tính giảm giá (đã fix giới hạn giảm tối đa)
  const discountValue = selectedDiscount
    ? (() => {
        const d = selectedDiscount.discount;
        if (!d) return 0;

        const minOrder = parseFloat(d.min_order_amount) || 0;
        if (subtotal < minOrder) return 0;

        const maxDiscount = parseFloat(d.max_discount) || 0;

        if (d.type === "percent") {
          const percentValue = (subtotal * d.value) / 100;
          return maxDiscount > 0
            ? Math.min(percentValue, maxDiscount)
            : percentValue;
        }

        if (d.type === "fixed") {
          const fixedValue = parseFloat(d.value) || 0;
          return maxDiscount > 0
            ? Math.min(fixedValue, maxDiscount)
            : fixedValue;
        }

        return 0;
      })()
    : 0;

  // ✅ Tổng cộng
  const total = Math.max(subtotal - discountValue, 0);

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
    <div className="container mt-4 cart-container">
      <div className="row">
        {/* ---------------- GIỎ HÀNG ---------------- */}
        <div className="col-lg-8">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>Giỏ hàng của bạn</h3>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={handleClearCart}
            >
              <i className="fas fa-trash-alt me-1"></i> Xóa toàn bộ
            </button>
          </div>

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
  src={getImageUrl(item.thumbnail)}
  alt={item.name}
  className="cart-img"
  style={{
    width: "60px",
    height: "60px",
    objectFit: "cover",
    borderRadius: "6px",
  }}
  onError={(e) => {
    e.target.src = "http://127.0.0.1:8000/images/placeholder.jpg";
  }}
/>

                  </td>
                  <td>{item.name}</td>
                  <td className="text-danger fw-bold">
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
                  <td>
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

          <div className="text-end mt-4">
            <h5>
              Tạm tính:{" "}
              <span className="text-danger fw-bold">
                {subtotal.toLocaleString("vi-VN")}₫
              </span>
            </h5>

            {selectedDiscount && (
              <h6 className="text-success">
                Giảm ({selectedDiscount.discount.code}): −
                {discountValue.toLocaleString("vi-VN")}₫
              </h6>
            )}

            <h4>
              Tổng cộng:{" "}
              <span className="text-danger fw-bold">
                {total.toLocaleString("vi-VN")}₫
              </span>
            </h4>

            {/* ✅ Cập nhật navigate với state */}
            <button
              className="btn btn-success mt-3 px-4"
              onClick={() => {
                const token = localStorage.getItem("token");
                if (!token) {
                  alert("🔒 Vui lòng đăng nhập trước khi thanh toán!");
                  navigate("/login");
                } else {
                  localStorage.setItem("last_cart_key", getCartKey());
                  navigate("/checkout", {
                    state: {
                      subtotal,
                      discountValue,
                      selectedDiscount,
                      total,
                      cartItems,
                    },
                  });
                }
              }}
            >
              Thanh toán
            </button>
          </div>
        </div>

        {/* ---------------- MÃ GIẢM GIÁ ---------------- */}
        <div className="col-lg-4">
          <div className="discount-sidebar p-3 shadow-sm rounded bg-white">
            <h5 className="fw-bold mb-3 text-center text-danger">
              🎟️ Mã giảm giá của bạn
            </h5>

            {userDiscounts.length > 0 ? (
              userDiscounts
                .filter((ud) => ud.discount)
                .map((ud) => {
                  const d = ud.discount;
                  const isUpcoming =
                    d.start_date && new Date(d.start_date) > new Date();
                  const isActive =
                    !isUpcoming &&
                    (!d.end_date || new Date(d.end_date) >= new Date());
                  const isSelected =
                    selectedDiscount?.discount?.code === d.code;

                  return (
                    <div
                      key={ud.id}
                      className={`discount-card d-flex mb-3 ${
                        isUpcoming ? "discount-upcoming" : ""
                      }`}
                    >
                      <div className="flex-grow-1 px-3 py-2 border-end">
                        <div className="fw-bold text-danger mb-1">
                          {d.type === "percent"
                            ? `Giảm ${d.value}%`
                            : `Giảm ${Number(d.value).toLocaleString("vi-VN")}₫`}
                        </div>
                        <div className="small text-muted">
                          Đơn tối thiểu:{" "}
                          {d.min_order_amount
                            ? `${Number(
                                d.min_order_amount
                              ).toLocaleString("vi-VN")}₫`
                            : "-"}
                        </div>
                        {d.max_discount_value && (
                          <div className="small text-muted">
                            Giảm tối đa:{" "}
                            {Number(d.max_discount_value).toLocaleString("vi-VN")}₫
                          </div>
                        )}
                        <div className="small text-secondary">
                          Hiệu lực:{" "}
                          {d.start_date ? d.start_date.slice(0, 10) : "Không"} →{" "}
                          {d.end_date ? d.end_date.slice(0, 10) : "Không"}
                        </div>
                      </div>

                      <div className="p-2 d-flex flex-column align-items-center justify-content-center bg-light">
                        <button
                          className={`btn btn-sm px-3 fw-bold ${
                            isSelected
                              ? "btn-success disabled"
                              : !isActive
                              ? "btn-secondary disabled"
                              : "btn-danger"
                          }`}
                          onClick={() => {
                            if (isActive && !isSelected) {
                              applyDiscount(ud);
                            }
                          }}
                        >
                          {isUpcoming
                            ? "Chưa hiệu lực"
                            : isSelected
                            ? "Đang dùng ✅"
                            : "Dùng"}
                        </button>
                        <div className="small mt-1 fw-bold text-uppercase text-secondary">
                          {d.code}
                        </div>
                      </div>
                    </div>
                  );
                })
            ) : (
              <p className="text-center text-muted">
                Bạn chưa lưu mã giảm giá nào.
              </p>
            )}
          </div>

          {/* 🎨 CSS */}
          <style>{`
            .discount-sidebar {
              max-height: 80vh;
              overflow-y: auto;
            }
            .discount-sidebar::-webkit-scrollbar {
              width: 6px;
            }
            .discount-sidebar::-webkit-scrollbar-thumb {
              background-color: #f15b5b55;
              border-radius: 3px;
            }
            .discount-card {
              background: #fff5f5;
              border: 1px dashed #f15b5b;
              border-radius: 10px;
              overflow: hidden;
              transition: all 0.2s ease;
            }
            .discount-card:hover {
              transform: scale(1.02);
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .discount-upcoming {
              opacity: 0.6;
              filter: grayscale(0.6);
              pointer-events: none;
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}

export default Cart;
