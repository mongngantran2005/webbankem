import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Checkout() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [discountValue, setDiscountValue] = useState(0);
  const [discountCode, setDiscountCode] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const getCartKey = (user) => (user ? `cart_${user.id}` : "cart_guest");

  // 🟩 Load dữ liệu khi vào trang
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    // Nếu đến từ "Mua ngay"
    if (location.state?.product) {
      const { product } = location.state;
      setCart([{ ...product, qty: 1 }]);
    } else {
      // Nếu đến từ giỏ hàng
      const key = getCartKey(storedUser);
      const storedCart = JSON.parse(localStorage.getItem(key)) || [];
      setCart(storedCart);
    }

    // ✅ Nhận thông tin giảm giá từ Cart
if (location.state?.selectedDiscount) {
  const discountData = location.state.selectedDiscount.discount;
  setDiscountCode(discountData.code);
  setDiscountValue(location.state.discountValue || 0);
}


  }, [location.state]);

  // 💰 Tính tổng tiền
  const subtotal = cart.reduce(
    (sum, item) => sum + item.qty * (item.price_sale || item.price_root),
    0
  );
  const shippingFee = 30000;
  const total = Math.max(subtotal + shippingFee - discountValue, 0);

  // 🧮 Cập nhật số lượng
  const updateQuantity = (id, newQty) => {
    setCart((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, newQty) } : item
      );

      // Nếu không phải “mua ngay” thì lưu lại giỏ hàng
      if (!location.state?.product) {
        const key = getCartKey(user);
        localStorage.setItem(key, JSON.stringify(updated));
        window.dispatchEvent(new Event("storage"));
      }

      return updated;
    });
  };

  // 🧾 Xử lý thanh toán
  const handleCheckout = async () => {
    if (!user) {
      alert("🔒 Vui lòng đăng nhập để thanh toán!");
      navigate("/login");
      return;
    }
    if (!address || !phone) {
      alert("⚠️ Vui lòng nhập đầy đủ thông tin giao hàng!");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          user_id: user.id,
          address,
          phone,
          note,
          total,
          discount_code: discountCode,
          discount_value: discountValue,
          items: cart,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.invalid_items?.length > 0) {
          const msg = data.invalid_items
            .map(
              (p) =>
                `❌ ${p.name}: chỉ còn ${p.stock} sản phẩm, bạn đặt ${p.requested}.`
            )
            .join("\n");
          alert("⚠️ " + data.message + "\n\n" + msg);
        } else {
          alert("❌ " + (data.message || "Thanh toán thất bại!"));
        }
        return;
      }

      if (data.success) {
        alert("🎉 Đặt hàng thành công! Đơn hàng đang được xử lý.");

        // Nếu là từ giỏ hàng thì xoá giỏ
        if (!location.state?.product) {
          const key = getCartKey(user);
          localStorage.removeItem(key);
          window.dispatchEvent(new Event("storage"));
        }

        navigate("/");
      } else {
        alert("❌ Thanh toán thất bại, vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
      alert("🚫 Có lỗi xảy ra khi gửi đơn hàng!");
    }
  };

  // 🛒 Nếu giỏ hàng trống
  if (cart.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h4>🛒 Giỏ hàng trống</h4>
        <a href="/" className="btn btn-outline-primary mt-3">
          Mua sắm ngay
        </a>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h3 className="text-center mb-4 fw-bold">Thông Tin Giao Hàng</h3>

      {/* Form thông tin */}
      <div className="row mb-5">
        <div className="col-md-6 mb-3">
          <label className="form-label fw-semibold">Họ tên:</label>
          <input
            type="text"
            className="form-control"
            value={user?.name || ""}
            disabled
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label fw-semibold">Số điện thoại:</label>
          <input
            type="text"
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Nhập số điện thoại"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label fw-semibold">Địa chỉ:</label>
          <input
            type="text"
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Nhập địa chỉ giao hàng"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label fw-semibold">Ghi chú:</label>
          <textarea
            className="form-control"
            rows="1"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ghi chú thêm (nếu có)..."
          ></textarea>
        </div>
      </div>

      {/* Bảng sản phẩm */}
      <h4 className="text-center mb-3">🛒 Chi tiết sản phẩm</h4>
      <div className="table-responsive">
        <table className="table table-bordered align-middle text-center">
          <thead className="table-light">
            <tr>
              <th>STT</th>
              <th>Hình ảnh</th>
              <th>Sản phẩm</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
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
                <td>{item.name}</td>
                <td>
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
                      value={item.qty}
                      min="1"
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tổng cộng */}
      <div className="card mt-3 mb-4">
        <div className="card-body">
          <p>Tạm tính: {subtotal.toLocaleString("vi-VN")}₫</p>
          <p>Phí vận chuyển: {shippingFee.toLocaleString("vi-VN")}₫</p>
          {discountCode && (
            <p className="text-success">
              Giảm ({discountCode}): −{discountValue.toLocaleString("vi-VN")}₫
            </p>
          )}
          <hr />
          <h5>
            Tổng thanh toán:{" "}
            <span className="text-danger fw-bold">
              {total.toLocaleString("vi-VN")}₫
            </span>
          </h5>
        </div>
      </div>

      {/* Nút xác nhận */}
      <div className="text-center">
        <button className="btn btn-success px-5 py-2" onClick={handleCheckout}>
          ✅ Xác nhận đặt hàng
        </button>
      </div>
    </div>
  );
}

export default Checkout;
