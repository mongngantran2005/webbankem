import { useState } from "react";

export default function DiscountAdd() {
  const [form, setForm] = useState({
    code: "",
    type: "percent",
    value: "",
    min_order_amount: "",
    max_discount: "",
    start_date: "",
    end_date: "",
    usage_limit: "",
    status: 1,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log("📦 Kết quả:", data);

      if (data.success) {
        setMessage("✅ Thêm mã giảm giá thành công!");
        setForm({
          code: "",
          type: "percent",
          value: "",
          min_order_amount: "",
          max_discount: "",
          start_date: "",
          end_date: "",
          usage_limit: "",
          status: 1,
        });
      } else {
        setMessage("❌ Lỗi: " + (data.message || "Không thể tạo mã!"));
      }
    } catch (error) {
      console.error("Lỗi gửi form:", error);
      setMessage("🚫 Có lỗi xảy ra khi kết nối máy chủ!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="discount-add-container">
      <h3 className="discount-add-title">➕ Thêm Mã Giảm Giá</h3>

      <form onSubmit={handleSubmit} className="discount-add-card">
        <div className="discount-form-group">
          <label className="discount-form-label">Mã giảm giá:</label>
          <input
            type="text"
            className="discount-form-control"
            name="code"
            value={form.code}
            onChange={handleChange}
            required
            placeholder="VD: SALE50"
          />
        </div>

        <div className="discount-form-row">
          <div className="discount-form-col">
            <div className="discount-form-group">
              <label className="discount-form-label">Loại:</label>
              <select
                className="discount-form-select"
                name="type"
                value={form.type}
                onChange={handleChange}
              >
                <option value="percent">Phần trăm (%)</option>
                <option value="fixed">Cố định (VNĐ)</option>
              </select>
            </div>
          </div>
          <div className="discount-form-col">
            <div className="discount-form-group">
              <label className="discount-form-label">Giá trị:</label>
              <input
                type="number"
                className="discount-form-control"
                name="value"
                value={form.value}
                onChange={handleChange}
                required
                placeholder="VD: 10 (10%) hoặc 50000 (VNĐ)"
              />
            </div>
          </div>
        </div>

        <div className="discount-form-row">
          <div className="discount-form-col">
            <div className="discount-form-group">
              <label className="discount-form-label">Đơn hàng tối thiểu:</label>
              <input
                type="number"
                className="discount-form-control"
                name="min_order_amount"
                value={form.min_order_amount}
                onChange={handleChange}
                placeholder="VD: 200000"
              />
            </div>
          </div>
          <div className="discount-form-col">
            <div className="discount-form-group">
              <label className="discount-form-label">Giảm tối đa:</label>
              <input
                type="number"
                className="discount-form-control"
                name="max_discount"
                value={form.max_discount}
                onChange={handleChange}
                placeholder="VD: 100000"
              />
            </div>
          </div>
        </div>

        <div className="discount-form-row">
          <div className="discount-form-col">
            <div className="discount-form-group">
              <label className="discount-form-label">Ngày bắt đầu:</label>
              <input
                type="date"
                className="discount-form-control"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="discount-form-col">
            <div className="discount-form-group">
              <label className="discount-form-label">Ngày kết thúc:</label>
              <input
                type="date"
                className="discount-form-control"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="discount-form-row">
          <div className="discount-form-col">
            <div className="discount-form-group">
              <label className="discount-form-label">Giới hạn sử dụng:</label>
              <input
                type="number"
                className="discount-form-control"
                name="usage_limit"
                value={form.usage_limit}
                onChange={handleChange}
                placeholder="VD: 50"
              />
            </div>
          </div>
          <div className="discount-form-col">
            <div className="discount-form-group">
              <label className="discount-form-label">Trạng thái:</label>
              <select
                className="discount-form-select"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value={1}>Hoạt động</option>
                <option value={0}>Ngừng</option>
              </select>
            </div>
          </div>
        </div>

        {message && (
          <div
            className={`discount-alert ${
              message.startsWith("✅")
                ? "discount-alert-success"
                : message.startsWith("❌") || message.startsWith("🚫")
                ? "discount-alert-danger"
                : "discount-alert-info"
            }`}
          >
            {message}
          </div>
        )}

        <div className="discount-text-center discount-mt-3">
          <button 
            type="submit" 
            className="discount-btn-primary" 
            disabled={loading}
          >
            {loading ? "Đang lưu..." : "💾 Lưu mã giảm giá"}
          </button>
        </div>
      </form>
    </div>
  );
}