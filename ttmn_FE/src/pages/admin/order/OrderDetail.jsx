import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../../api/axios";

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  // ✅ Fetch dữ liệu chi tiết đơn hàng
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axiosInstance.get(`/orders/${id}`);
        if (res.data.success) {
          setOrder(res.data.order);
        } else {
          setError(res.data.message || "Không thể tải chi tiết đơn hàng.");
        }
      } catch (err) {
        console.error("❌ Lỗi khi tải chi tiết đơn hàng:", err);
        setError("Không thể kết nối đến server.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // ✅ Danh sách trạng thái
  const statusOptions = [
    { value: 0, label: "🕓 Chờ xác nhận" },
    { value: 1, label: "🚚 Vận chuyển" },
    { value: 2, label: "📦 Chờ giao hàng" },
    { value: 3, label: "✅ Hoàn thành" },
    { value: 4, label: "❌ Đã hủy" },
  ];

  // ✅ Cập nhật trạng thái
  const handleStatusChange = async (newStatus) => {
    if (!order) return;
    if (newStatus === order.status) return;

    if (!window.confirm("Xác nhận thay đổi trạng thái đơn hàng này?")) return;

    try {
      setUpdating(true);
      await axiosInstance.put(`/orders/${order.id}/status`, { status: newStatus });
      setOrder((prev) => ({ ...prev, status: newStatus }));
      alert("✅ Cập nhật trạng thái thành công!");
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật trạng thái:", err);
      alert("Không thể cập nhật trạng thái.");
    } finally {
      setUpdating(false);
    }
  };

  // ✅ Tính tổng tiền
  const calculateTotal = (details = []) =>
    details.reduce((total, item) => total + item.price_buy * item.qty, 0);

  if (loading)
    return <p className="loading-text">⏳ Đang tải chi tiết đơn hàng...</p>;
  if (error)
    return <p className="error-text">{error}</p>;
  if (!order)
    return <p className="no-data-text">Không tìm thấy dữ liệu đơn hàng.</p>;

  return (
    <div className="order-detail-container">
      {/* Header */}
      <div className="order-detail-header">
        <h1 className="order-detail-title">
          🧾 Chi tiết đơn hàng <span className="order-id">#{order.id}</span>
        </h1>
        <Link to="/admin/order-list" className="back-link">
          ← Quay lại danh sách
        </Link>
      </div>

      {/* Thông tin khách hàng */}
      <section className="section customer-info">
        <h2 className="section-title">👤 Thông tin khách hàng</h2>
        <div>
          <p><strong>Tên:</strong> {order.user?.name || "Không rõ"}</p>
          <p><strong>Email:</strong> {order.user?.email || "Không có"}</p>
          <p><strong>Điện thoại:</strong> {order.phone}</p>
          <p><strong>Địa chỉ:</strong> {order.address}</p>
          {order.note && <p><strong>Ghi chú:</strong> {order.note}</p>}
        </div>
      </section>

      {/* Thông tin đơn hàng */}
      <section className="section order-info">
        <h2 className="section-title">📦 Thông tin đơn hàng</h2>
        <div>
          <p>
            <strong>Trạng thái: </strong>
            <select
              value={order.status}
              disabled={updating}
              onChange={(e) => handleStatusChange(Number(e.target.value))}
              className="status-dropdown"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </p>
          <p>
            <strong>Ngày đặt:</strong>{" "}
            {new Date(order.created_at).toLocaleString("vi-VN")}
          </p>
        </div>
      </section>

      {/* Sản phẩm trong đơn */}
      <section className="section">
        <h2 className="section-title">🛍️ Sản phẩm trong đơn</h2>
        {order.order_details?.length > 0 ? (
          <div className="table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th className="text-center">#</th>
                  <th className="text-center">Ảnh</th>
                  <th className="text-left">Tên sản phẩm</th>
                  <th className="text-right">Giá</th>
                  <th className="text-right">Số lượng</th>
                  <th className="text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.order_details.map((detail, index) => (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td className="text-center">
                      {detail.product?.image_url ? (
                        <img
                          src={detail.product.image_url}
                          alt={detail.product?.name}
                          className="product-image"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : (
                        <div className="image-placeholder">No Image</div>
                      )}
                    </td>
                    <td className="text-left">
                      {detail.product?.name || `SP #${detail.product_id}`}
                    </td>
                    <td className="text-right price-cell">
                      {Number(detail.price_buy).toLocaleString()}₫
                    </td>
                    <td className="text-right">{detail.qty}</td>
                    <td className="text-right price-cell">
                      {(detail.price_buy * detail.qty).toLocaleString()}₫
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-data-text">Không có sản phẩm trong đơn hàng.</p>
        )}
      </section>

      {/* Tổng tiền */}
      <section className="order-total">
        <h3>
          Tổng cộng:{" "}
          <span className="total-amount">
            {calculateTotal(order.order_details).toLocaleString()}₫
          </span>
        </h3>
      </section>
    </div>
  );
};

export default OrderDetail;
