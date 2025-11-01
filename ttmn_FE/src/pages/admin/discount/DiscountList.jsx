import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function VoucherList() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVouchers = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/discounts");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setVouchers(data.data);
      } else {
        setVouchers([]);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách mã giảm giá:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa mã này không?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/discounts/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        alert("🗑️ Xóa mã giảm giá thành công!");
        setVouchers((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert("❌ Xóa thất bại!");
      }
    } catch (err) {
      alert("🚫 Có lỗi xảy ra khi kết nối máy chủ!");
    }
  };

  if (loading)
    return <p className="voucher-loading">⏳ Đang tải dữ liệu...</p>;

  return (
    <div className="voucher-container">
      <div className="voucher-header">
        <h2>🎫 Danh Sách Mã Giảm Giá</h2>
        <Link to="/admin/discount-add" className="btn-add-voucher">
          ➕ Thêm Mã Mới
        </Link>
      </div>

      {vouchers.length === 0 ? (
        <div className="voucher-empty">⚠️ Chưa có mã giảm giá nào.</div>
      ) : (
        <div className="voucher-table-wrapper">
          <table className="voucher-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Mã</th>
                <th>Loại</th>
                <th>Giá trị</th>
                <th>Giảm tối đa</th>
                <th>Đơn tối thiểu</th>
                <th>Bắt đầu</th>
                <th>Kết thúc</th>
                <th>Dùng / Giới hạn</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map((v) => {
                const today = new Date();
                const start = v.start_date ? new Date(v.start_date) : null;
                const end = v.end_date ? new Date(v.end_date) : null;

                let statusClass = "status-default";
                let statusText = "Không xác định";

                if (v.status === 0) {
                  statusClass = "status-inactive";
                  statusText = "Ngừng hoạt động";
                } else if (end && end < today) {
                  statusClass = "status-expired";
                  statusText = "Hết hạn";
                } else if (start && start > today) {
                  statusClass = "status-upcoming";
                  statusText = "Chưa hiệu lực";
                } else {
                  statusClass = "status-active";
                  statusText = "Hoạt động";
                }

                return (
                  <tr key={v.id}>
                    <td>{v.id}</td>
                    <td className="voucher-code">{v.code}</td>
                    <td>{v.type === "percent" ? "Phần trăm (%)" : "Cố định (VNĐ)"}</td>
                    <td>{v.value}</td>
                    <td>{v.max_discount || "-"}</td>
                    <td>{v.min_order_amount || "-"}</td>
                    <td>{v.start_date ? v.start_date.slice(0, 10) : "-"}</td>
                    <td>{v.end_date ? v.end_date.slice(0, 10) : "-"}</td>
                    <td>{v.used_count || 0}/{v.usage_limit || "∞"}</td>
                    <td>
                      <span className={`voucher-status ${statusClass}`}>
                        {statusText}
                      </span>
                    </td>
                    <td>
                      <div className="voucher-actions">
                        <Link to={`/admin/discount-edit/${v.id}`} className="btn-edit">
  ✏️
</Link>

                        <button
                          onClick={() => handleDelete(v.id)}
                          className="btn-delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
