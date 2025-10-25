import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";

const Account = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Lấy thông tin user từ localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);

      // Nếu avatar chỉ là tên file thì thêm đường dẫn đầy đủ
      if (parsedUser.avatar && !parsedUser.avatar.startsWith("http")) {
        parsedUser.avatar = `http://127.0.0.1:8000/storage/${parsedUser.avatar}`;
      }

      setUser(parsedUser);
    } else {
      navigate("/login");
    }
    setLoading(false);
  }, [navigate]);

  // ✅ Lấy danh sách đơn hàng của user
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;
      try {
        const res = await axiosInstance.get(`/orders/user/${user.id}`);
        if (res.data.success && Array.isArray(res.data.orders)) {
          const formattedOrders = res.data.orders.map((order) => ({
            ...order,
            items:
              order.order_details?.map((detail) => ({
                id: detail.id,
                productId: detail.product?.id,
                name: detail.product?.name,
                thumbnail: detail.product?.thumbnail,
                price: detail.price_buy,
                quantity: detail.qty,
              })) || [],
          }));

          setOrders(formattedOrders);
          setFilteredOrders(formattedOrders);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error("❌ Lỗi khi tải đơn hàng:", err);
      }
    };
    fetchOrders();
  }, [user]);

  // ✅ Các trạng thái đơn hàng
  const tabs = [
    { key: "all", label: "Tất cả" },
    { key: 0, label: "Chờ xác nhận" },
    { key: 1, label: "Vận chuyển" },
    { key: 2, label: "Chờ giao hàng" },
    { key: 3, label: "Hoàn thành" },
    { key: 4, label: "Đã hủy" },
    { key: 5, label: "Trả hàng / Hoàn tiền" },
  ];

  // ✅ Lọc đơn hàng theo trạng thái
  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    if (tabKey === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((order) => order.status === tabKey));
    }
  };

  if (loading) return <p className="text-center mt-4">⏳ Đang tải dữ liệu...</p>;
  if (!user) return <p className="text-center mt-4">Không tìm thấy thông tin người dùng.</p>;

  return (
    <div className="account-page container py-5">
      {/* 🧍 Hồ sơ người dùng */}
      <div className="profile-section mb-4 d-flex align-items-center gap-3">
        <div
          className="avatar-circle d-flex align-items-center justify-content-center bg-secondary text-white"
          style={{ width: "70px", height: "70px", borderRadius: "50%", overflow: "hidden" }}
        >
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="avatar"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/70x70?text=No+Img";
              }}
            />
          ) : (
            <span style={{ fontSize: "28px" }}>{user.name?.charAt(0).toUpperCase()}</span>
          )}
        </div>

        <div>
          <h4 className="mb-1">{user.name}</h4>
          <p className="text-muted mb-1">{user.email}</p>
          <Link to="/edit-account" className="btn btn-outline-primary btn-sm">
            ✏️ Sửa Hồ Sơ
          </Link>
        </div>
      </div>

      {/* 🧾 Tabs trạng thái đơn hàng */}
      <div className="order-tabs mb-3 d-flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`btn btn-sm ${
              activeTab === tab.key ? "btn-primary" : "btn-outline-secondary"
            }`}
            onClick={() => handleTabChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 📦 Danh sách đơn hàng */}
      <div className="orders-list">
        {filteredOrders.length === 0 ? (
          <p className="text-center">Không có đơn hàng nào.</p>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="order-card border rounded p-3 mb-4 shadow-sm">
              <div className="order-header d-flex justify-content-between align-items-center">
                <span>
                  <strong>Mã đơn:</strong> #{order.id}
                </span>
                <span className="order-status fw-bold text-primary">
                  {
                    [
                      "🕓 Chờ xác nhận",
                      "🚚 Vận chuyển",
                      "📦 Chờ giao hàng",
                      "✅ Hoàn thành",
                      "❌ Đã hủy",
                      "↩️ Trả hàng / Hoàn tiền",
                    ][order.status]
                  }
                </span>
              </div>

              {/* Danh sách sản phẩm trong đơn */}
              <div className="table-responsive mt-2">
                <table className="table align-middle text-center">
                  <thead className="table-light">
                    <tr>
                      <th>Hình ảnh</th>
                      <th>Sản phẩm</th>
                      <th>Giá</th>
                      <th>Số lượng</th>
                      <th>Tổng</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.length > 0 ? (
                      order.items.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <img
                              src={
                                item.thumbnail
                                  ? `http://127.0.0.1:8000/uploads/products/${item.thumbnail}`
                                  : "https://via.placeholder.com/60x60?text=No+Img"
                              }
                              alt={item.name}
                              style={{
                                width: "60px",
                                height: "60px",
                                objectFit: "cover",
                                borderRadius: "6px",
                              }}
                              onError={(e) =>
                                (e.target.src =
                                  "https://via.placeholder.com/60x60?text=No+Img")
                              }
                            />
                          </td>
                          <td>{item.name}</td>
                          <td className="text-danger fw-semibold">
                            {item.price?.toLocaleString("vi-VN")}₫
                          </td>
                          <td>{item.quantity}</td>
                          <td>
                            {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                          </td>
                          <td>
                            {order.status === 3 && (
                              <Link
                                to={`/product-detail/${item.productId}`}
                                className="btn btn-sm btn-outline-success"
                              >
                                Đánh giá
                              </Link>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6">Không có sản phẩm trong đơn này</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Tổng tiền */}
              <div className="order-footer d-flex justify-content-between align-items-center mt-2">
                <p className="mb-0">
                  <strong>Tổng cộng:</strong>{" "}
                  <span className="text-danger fw-bold">
                    {order.total?.toLocaleString("vi-VN")}₫
                  </span>
                </p>
                <Link to={`/orders/${order.id}`} className="btn btn-sm btn-outline-primary">
                  Xem chi tiết
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Account;
