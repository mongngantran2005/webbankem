import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * BannerAdd.jsx — Form thêm banner (Slideshow / Popup)
 * Cho phép chọn thời gian (ngày + giờ)
 */

export default function BannerAdd() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    image: null,
    link: "",
    position: "slideshow",
    sort_order: 0,
    description: "",
    start_date: "",
    end_date: "",
    status: true,
  });

  const [preview, setPreview] = useState("");

  // xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm((p) => ({ ...p, [name]: checked }));
    } else if (type === "file") {
      const file = files?.[0] ?? null;
      setForm((p) => ({ ...p, image: file }));
      setPreview(file ? URL.createObjectURL(file) : "");
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name?.trim()) return setError("Tên banner là bắt buộc");
    if (!form.image) return setError("Ảnh banner là bắt buộc");

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (val === null) return;
        if (typeof val === "string" && val.trim() === "") return;
        if (key === "status") {
          fd.append(key, val ? "1" : "0");
        } else {
          fd.append(key, val);
        }
      });

      const res = await axios.post(
        "http://127.0.0.1:8000/api/banners/admin",
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data?.success || res.data?.banner) {
        alert("✅ Thêm banner thành công!");
        navigate("/admin/banner-list");
      } else {
        setError(res.data?.message || "Không thể thêm banner");
      }
    } catch (err) {
      console.error("Lỗi thêm banner:", err);
      if (err.response?.status === 422) {
        const msg = Object.values(err.response.data.errors || {})
          .flat()
          .join(", ");
        setError("Lỗi xác thực: " + msg);
      } else {
        setError(err.response?.data?.message || "Lỗi kết nối server");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (!window.confirm("Bạn có chắc muốn làm mới form?")) return;
    setForm({
      name: "",
      image: null,
      link: "",
      position: "slideshow",
      sort_order: 0,
      description: "",
      start_date: "",
      end_date: "",
      status: true,
    });
    setPreview("");
    setError("");
  };

  return (
    <div className="banner-add-container">
      <div className="banner-add-header">
        <h1>🖼️ Thêm Banner Mới</h1>
        <Link to="/admin/banner-list" className="btn-back">
          ← Quay lại
        </Link>
      </div>

      {error && <p className="error-msg">{error}</p>}

      <form onSubmit={handleSubmit} className="banner-add-form">
        {/* Tên banner */}
        <div className="form-group">
          <label>Tên Banner *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nhập tiêu đề banner"
            required
          />
        </div>

        {/* Ảnh banner */}
        <div className="form-group">
          <label>Ảnh Banner *</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            required
          />
          {preview && (
            <div className="preview">
              <img
                src={preview}
                alt="Preview"
                style={{ width: 250, borderRadius: 8 }}
              />
            </div>
          )}
        </div>

        {/* Liên kết */}
        <div className="form-group">
          <label>Liên kết (URL)</label>
          <input
            type="text"
            name="link"
            value={form.link}
            onChange={handleChange}
            placeholder="Ví dụ: https://example.com"
          />
        </div>

        {/* Vị trí và thứ tự */}
        <div className="form-row">
          <div className="form-group">
            <label>Vị trí hiển thị *</label>
            <select
              name="position"
              value={form.position}
              onChange={handleChange}
            >
              <option value="slideshow">Slideshow</option>
              <option value="popup">Popup</option>
            </select>
          </div>

          <div className="form-group">
            <label>Thứ tự hiển thị</label>
            <input
              type="number"
              name="sort_order"
              value={form.sort_order}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>

        {/* Ngày & Giờ bắt đầu / kết thúc */}
        <div className="form-row">
          <div className="form-group">
            <label>Thời gian bắt đầu</label>
            <input
              type="datetime-local"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Thời gian kết thúc</label>
            <input
              type="datetime-local"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Mô tả */}
        <div className="form-group">
          <label>Mô tả</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
          />
        </div>

        {/* Trạng thái */}
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="status"
              checked={form.status}
              onChange={handleChange}
            />{" "}
            Kích hoạt banner
          </label>
        </div>

        {/* Nút hành động */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
            disabled={loading}
          >
            Làm mới
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Đang lưu..." : "Thêm Banner"}
          </button>
        </div>
      </form>
    </div>
  );
}
