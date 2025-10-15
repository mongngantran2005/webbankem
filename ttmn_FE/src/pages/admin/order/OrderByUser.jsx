import React, { useEffect, useState } from "react";
import axiosInstance from "../../../api/axios";
import { useParams, Link } from "react-router-dom";

const OrderByUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Lấy danh sách đơn hàng theo người dùng
  const fetchOrdersByUser = async () => {
    try {
      const res = await axiosInstance.get(`/orders/user/${id}`);
      if (res.data.success) {
        setUser(res.data.user);
        setOrders(res.data.orders);
      } else {
        setError(res.data.message || "Không thể tải đơn hàng của người dùng.");
      }
    } catch (err) {
      console.error("❌ Lỗi khi tải đơn hàng của người dùng:", err);
      setError("Không thể kết nối đến server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersByUser();
  }, [id]);

  // ✅ Tính tổng tiền
  const calculateTotal = (details = []) =>
    details.reduce((total, item) => {
      const price = item.price_buy || item.price || 0;
      const qty = item.qty || 1;
      return total + price * qty;
    }, 0);

  // ✅ Các trạng thái đơn hàng (đồng bộ với OrderList)
  const statusOptions = [
    { value: 0, label: "🕓 Chờ xác nhận" },
    { value: 1, label: "🚚 Vận chuyển" },
    { value: 2, label: "📦 Chờ giao hàng" },
    { value: 3, label: "✅ Hoàn thành" },
    { value: 4, label: "❌ Đã hủy" },
  ];

  // ✅ Cập nhật trạng thái đơn hàng
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axiosInstance.put(`/orders/${orderId}/status`, {
        status: newStatus,
      });

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      alert("✅ Cập nhật trạng thái thành công!");
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật trạng thái:", err);
      alert("Không thể cập nhật trạng thái.");
    }
  };

  if (loading) return <p className="loading-state">⏳ Đang tải dữ liệu...</p>;
  if (error) return <p className="error-state">{error}</p>;
  if (!user)
    return (
      <p className="error-state">
        Không tìm thấy người dùng hoặc chưa có đơn hàng.
      </p>
    );

  return (
    <div className="order-by-user-container">
      {/* 🔙 Quay lại */}
      <Link to="/admin/user-list" className="back-link">
        ← Quay lại danh sách người dùng
      </Link>

      {/* 🧑‍💼 Thông tin người dùng */}
      <h1 className="main-title">🧑‍💼 Đơn hàng của {user.name}</h1>

      <div className="user-info-card">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Điện thoại:</strong> {user.phone || "Chưa cập nhật"}</p>
        <p><strong>Địa chỉ:</strong> {user.address || "Chưa cập nhật"}</p>
      </div>

      {/* 📦 Danh sách đơn hàng */}
      <h2 className="section-title">📦 Danh sách đơn hàng</h2>

      {orders.length === 0 ? (
        <div className="empty-state">Người dùng này chưa có đơn hàng nào.</div>
      ) : (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Mã đơn</th>
                <th>Ngày đặt</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr key={order.id}>
                  <td>{i + 1}</td>
                  <td className="font-semibold text-gray-700">#{order.id}</td>
                  <td>{new Date(order.created_at).toLocaleString("vi-VN")}</td>
                  <td className="price">
                    {calculateTotal(order.order_details).toLocaleString("vi-VN")}₫
                  </td>

                  {/* 📝 Dropdown trạng thái */}
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, Number(e.target.value))
                      }
                      className="status-dropdown"
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* 🔍 Link chi tiết */}
                  <td>
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="detail-link"
                    >
                      🔍 Xem chi tiết
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderByUser;
