import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/users");
      setUsers(res.data.users);
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách người dùng:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrdersByUser = async (userId, userName) => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/orders/user/${userId}`);
      setOrders(res.data.orders);
      setSelectedUser(userName);
    } catch (err) {
      console.error("❌ Lỗi khi tải đơn hàng:", err);
    }
  };

  const renderOrderStatus = (status) => {
    switch (status) {
      case 0:
        return <span className="status-badge status-pending">Chờ xử lý</span>;
      case 1:
        return <span className="status-badge status-completed">Đã duyệt</span>;
      case 2:
        return <span className="status-badge status-cancelled">Đã hủy</span>;
      default:
        return <span className="status-badge status-pending">Không xác định</span>;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p className="loading-state">Đang tải danh sách người dùng...</p>;

  return (
    <div className="user-list-container">
      <h2 className="page-title">👥 Danh sách người dùng</h2>

      <div className="user-table-container">
        {users.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👤</div>
            <p>Không có người dùng nào</p>
          </div>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Tên</th>
                <th>Email</th>
                <th>Điện thoại</th>
                <th>Địa chỉ</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => (
                <tr key={u.id}>
                  <td>{index + 1}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone || "Chưa cập nhật"}</td>
                  <td>{u.address || "Chưa cập nhật"}</td>
                  <td>{u.roles}</td>
                  <td>
                    {u.status === 1 ? (
                      <span className="status-active">✅ Hoạt động</span>
                    ) : (
                      <span className="status-inactive">⛔ Tạm khóa</span>
                    )}
                  </td>
                  <td>
                    <Link
  to={`/admin/order-user/${u.id}`}
  className="text-blue-600 underline"
>
  Xem Đơn hàng
</Link>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Danh sách đơn hàng của user được chọn */}
      {selectedUser && (
        <div className="orders-section">
          <h3 className="orders-title">
            🛒 Đơn hàng của: <span className="selected-user">{selectedUser}</span>
          </h3>

          {orders.length === 0 ? (
            <p className="no-orders">Người dùng này chưa có đơn hàng nào.</p>
          ) : (
            <div className="user-table-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Sản phẩm</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                    <th>Ngày tạo</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>
                        <ul className="product-list">
                          {order.details &&
                            order.details.map((d) => (
                              <li key={d.id} className="product-item">
                                <span className="product-name">
                                  {d.product?.name || `Sản phẩm #${d.product_id}`}
                                </span>
                                <span className="product-qty">× {d.qty}</span>
                              </li>
                            ))}
                        </ul>
                      </td>
                      <td>
                        {order.details
                          ? order.details
                              .reduce((sum, d) => sum + (d.amount || 0), 0)
                              .toLocaleString() + "₫"
                          : "0₫"}
                      </td>
                      <td>{renderOrderStatus(order.status)}</td>
                      <td>
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString("vi-VN")
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserList;
