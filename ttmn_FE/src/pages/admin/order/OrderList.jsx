import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch danh sách đơn hàng
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/orders/admin/all");
        if (res.data.success) {
          setOrders(res.data.orders);
        } else {
          setError(res.data.message || "Không thể tải danh sách đơn hàng.");
        }
      } catch (err) {
        console.error("❌ Lỗi khi tải đơn hàng:", err);
        setError("Không thể kết nối đến server.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // ✅ Hàm cập nhật trạng thái đơn hàng
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/orders/${orderId}/status`, {
        status: newStatus,
      });

      // Cập nhật lại state (UI)
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

  // ✅ Tính tổng tiền
  const calculateTotal = (details = []) =>
    details.reduce((sum, item) => {
      const price = item.price_buy || item.price || 0;
      const qty = item.qty || 1;
      return sum + price * qty;
    }, 0);

  // ✅ Định nghĩa trạng thái (5 loại)
  const statusOptions = [
    { value: 0, label: "🕓 Chờ xác nhận" },
    { value: 1, label: "🚚 Vận chuyển" },
    { value: 2, label: "📦 Chờ giao hàng" },
    { value: 3, label: "✅ Hoàn thành" },
    { value: 4, label: "❌ Đã hủy" },
  ];

  if (loading) return <p className="loading-state">⏳ Đang tải danh sách đơn hàng...</p>;
  if (error) return <p className="error-state">{error}</p>;

  return (
    <div className="order-list-page">
      <h1 className="page-title">🛒 Quản lý đơn hàng (Admin)</h1>

      {orders.length === 0 ? (
        <div className="empty-state">
          <p>Không có đơn hàng nào!</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="order-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Khách hàng</th>
                <th>Sản phẩm</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Ghi chú</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>

                  {/* 🧑 Thông tin khách hàng */}
                  <td>
                    <div className="customer-info">
                      <strong>{order.user?.name || "Khách lạ"}</strong>
                      <div>{order.user?.email || "Không có email"}</div>
                      <div>📞 {order.phone || "Chưa có SĐT"}</div>
                    </div>
                  </td>

                  {/* 🛍️ Danh sách sản phẩm */}
                  <td>
                    {(order.order_details || order.orderDetails)?.length > 0 ? (
                      <ul className="product-list">
                        {(order.order_details || order.orderDetails).map((detail, i) => (
                          <li key={i}>
                            {detail.product?.name || `SP #${detail.product_id}`} ×{" "}
                            {detail.qty}{" "}
                            <span className="price">
                              {Number(detail.price_buy || detail.price).toLocaleString()}₫
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <em>Không có sản phẩm</em>
                    )}
                  </td>

                  {/* 💰 Tổng tiền */}
                  <td>
                    <strong>
                      {calculateTotal(order.order_details || order.orderDetails).toLocaleString()}₫
                    </strong>
                  </td>

                  {/* 📦 Trạng thái — dropdown */}
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, Number(e.target.value))}
                      className="status-dropdown"
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* 🕓 Ngày tạo */}
                  <td>{new Date(order.created_at).toLocaleString("vi-VN")}</td>

                  {/* 📝 Ghi chú */}
                  <td>{order.note ? order.note : <em>Không có</em>}</td>

                  {/* 🔍 Thao tác */}
                  <td>
                    <Link to={`/admin/orders/${order.id}`} className="btn-view">
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

export default OrderList;
