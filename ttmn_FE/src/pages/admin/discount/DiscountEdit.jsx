import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiDiscount from "../../../api/apiDiscount";

function DiscountEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [discount, setDiscount] = useState({
    code: "",
    type: "percent",
    value: "",
    status: 1,
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    const fetchDiscount = async () => {
      try {
        setLoading(true);
        const res = await apiDiscount.getById(id);
        setDiscount(res);
      } catch (err) {
        setError("Không thể tải mã giảm giá");
      } finally {
        setLoading(false);
      }
    };
    fetchDiscount();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDiscount((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await apiDiscount.update(id, discount);
      alert("✅ Cập nhật mã giảm giá thành công!");
      navigate("/admin/discount-list");
    } catch (err) {
      console.error(err);
      setError("❌ Không thể cập nhật mã giảm giá. Vui lòng kiểm tra dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="discount-edit-container">
      <h2 className="discount-edit-title">📝 Cập nhật mã giảm giá</h2>

      {error && <div className="discount-edit-error">{error}</div>}

      {loading ? (
        <div className="loading-text">Đang tải dữ liệu...</div>
      ) : (
        <form onSubmit={handleSubmit} className="discount-edit-form">
          <div>
            <label>Mã giảm giá</label>
            <input
              type="text"
              name="code"
              value={discount.code}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Loại</label>
            <select name="type" value={discount.type} onChange={handleChange}>
              <option value="percent">Phần trăm (%)</option>
              <option value="fixed">Giảm tiền cố định (VNĐ)</option>
            </select>
          </div>

          <div>
            <label>Giá trị</label>
            <input
              type="number"
              name="value"
              value={discount.value}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div>
            <label>Trạng thái</label>
            <select
              name="status"
              value={discount.status}
              onChange={handleChange}
            >
              <option value="1">Kích hoạt</option>
              <option value="0">Tạm dừng</option>
            </select>
          </div>

          <div className="date-group">
            <div>
              <label>Ngày bắt đầu</label>
              <input
                type="date"
                name="start_date"
                value={discount.start_date || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Ngày kết thúc</label>
              <input
                type="date"
                name="end_date"
                value={discount.end_date || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="discount-edit-actions">
            <button
              type="button"
              onClick={() => navigate("/admin/discount-list")}
              className="btn-cancel"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-save"
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default DiscountEdit;
