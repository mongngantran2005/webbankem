import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function DiscountList() {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDiscounts = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/discounts");
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        setDiscounts(data.data);
      } else {
        setDiscounts([]);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách mã giảm giá:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
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
        setDiscounts((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert("❌ Xóa thất bại!");
      }
    } catch (err) {
      console.error("Lỗi khi xóa mã giảm giá:", err);
      alert("🚫 Có lỗi xảy ra khi kết nối máy chủ!");
    }
  };

  if (loading) return <p className="loading">⏳ Đang tải dữ liệu...</p>;

  return (
    <div className="discount-container">
      <div className="discount-header">
        <h2>📋 Danh Sách Mã Giảm Giá</h2>
        <Link to="/admin/discount-add" className="btn-add">
  ➕ Thêm Mã Mới
</Link>

      </div>

      {discounts.length === 0 ? (
        <div className="alert-empty">⚠️ Chưa có mã giảm giá nào.</div>
      ) : (
        <div className="table-wrapper">
          <table className="discount-table">
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
              {discounts.map((d) => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td className="code">{d.code}</td>
                  <td>{d.type === "percent" ? "Phần trăm (%)" : "Cố định (VNĐ)"}</td>
                  <td>{d.value}</td>
                  <td>{d.max_discount || "-"}</td>
                  <td>{d.min_order_amount || "-"}</td>
                  <td>{d.start_date ? d.start_date.slice(0, 10) : "-"}</td>
                  <td>{d.end_date ? d.end_date.slice(0, 10) : "-"}</td>
                  <td>
                    {d.used_count || 0}/{d.usage_limit || "∞"}
                  </td>
                  <td>
                    {d.status === 1 ? (
                      <span className="badge-active">Hoạt động</span>
                    ) : (
                      <span className="badge-inactive">Ngừng</span>
                    )}
                  </td>
                  <td>
                    <div className="actions">
                      <Link to={`/discount-edit/${d.id}`} className="btn-edit">
                        ✏️
                      </Link>
                      <button
                        onClick={() => handleDelete(d.id)}
                        className="btn-delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
