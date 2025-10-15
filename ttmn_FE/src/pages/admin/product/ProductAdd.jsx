
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiProduct from "../../../api/apiProduct";
import apiCategory from "../../../api/apiCategory";
import apiBrand from "../../../api/apiBrand";

function ProductAdd() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    brand_id: "",
    category_id: "",
    price_root: "",
    price_sale: "",
    qty: "",
    description: "",
    detail: "",
    status: true,
    thumbnail: null,
  });

  const [thumbnailPreview, setThumbnailPreview] = useState("");

  // 🔹 Lấy thương hiệu & danh mục
  useEffect(() => {
    (async () => {
      try {
        const [resBrand, resCat] = await Promise.all([
          apiBrand.getAll(),
          apiCategory.getAll(),
        ]);
        if (resBrand.data?.success) setBrands(resBrand.data.data);
        if (resCat.data?.success) setCategories(resCat.data.data);
      } catch (err) {
        console.error("Lỗi khi tải danh mục/brand:", err);
      }
    })();
  }, []);

  // 🔹 Xử lý nhập liệu
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, thumbnail: file }));
      setThumbnailPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (name === "name") {
        const slug = value
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^\w\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-");
        setFormData((prev) => ({ ...prev, slug }));
      }
    }
  };

  // 🔹 Gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) return setError("Tên sản phẩm là bắt buộc");
    if (!formData.price_root || formData.price_root <= 0)
      return setError("Giá gốc phải lớn hơn 0");
    if (!formData.brand_id) return setError("Vui lòng chọn thương hiệu");
    if (!formData.category_id) return setError("Vui lòng chọn danh mục");
    if (!formData.qty || formData.qty < 0)
      return setError("Số lượng không hợp lệ");
    if (!formData.thumbnail) return setError("Ảnh đại diện là bắt buộc");

    setLoading(true);
    try {
      const submitData = new FormData();

      // 🔹 Ép kiểu cho đúng Laravel validation
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          if (key === "status") {
            submitData.append(key, value ? "1" : "0");
          } else {
            submitData.append(key, value);
          }
        }
      });

      const res = await apiProduct.admin.create(submitData);

      if (res.success) {
        alert("✅ Thêm sản phẩm thành công!");
        navigate("/admin/product");
      } else {
        setError(res.message || "Thêm sản phẩm thất bại");
      }
    } catch (err) {
      console.error("Add product error:", err);
      if (err.response?.status === 422) {
        const errs = err.response.data.errors;
        const msg = Object.values(errs || {}).flat().join(", ");
        setError("Lỗi xác thực: " + msg);
      } else {
        setError(err.response?.data?.message || "Lỗi kết nối server");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Reset form
  const handleReset = () => {
    if (window.confirm("Bạn có chắc muốn reset form?")) {
      setFormData({
        name: "",
        slug: "",
        brand_id: "",
        category_id: "",
        price_root: "",
        price_sale: "",
        qty: "",
        description: "",
        detail: "",
        status: true,
        thumbnail: null,
      });
      setThumbnailPreview("");
      setError("");
    }
  };

  // 🔹 JSX
  return (
    <div className="product-admin">
      <div className="product-header">
        <h1>Thêm Sản Phẩm Mới</h1>
        <div className="header-actions">
          <Link to="/admin/product" className="btn btn-secondary">
            ← Quay lại
          </Link>
        </div>
      </div>

      <div className="product-form-container">
        {error && (
          <div className="error-message" style={{ color: "red", marginBottom: 10 }}>
            <strong>Lỗi:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="product-form">
          {/* Thông tin cơ bản */}
          <div className="form-section">
            <h3>Thông tin cơ bản</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Tên sản phẩm *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nhập tên sản phẩm"
                  required
                />
              </div>
              <div className="form-group">
                <label>Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="Slug tự tạo từ tên"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Thương hiệu *</label>
                <select
                  name="brand_id"
                  value={formData.brand_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Chọn thương hiệu --</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Danh mục *</label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Giá & Số lượng */}
          <div className="form-section">
            <h3>Giá và số lượng</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Giá gốc *</label>
                <input
                  type="number"
                  name="price_root"
                  value={formData.price_root}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label>Giá khuyến mãi</label>
                <input
                  type="number"
                  name="price_sale"
                  value={formData.price_sale}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Số lượng *</label>
                <input
                  type="number"
                  name="qty"
                  value={formData.qty}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
            </div>
          </div>

          {/* Mô tả */}
          <div className="form-section">
            <h3>Mô tả sản phẩm</h3>
            <div className="form-group">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                placeholder="Mô tả ngắn về sản phẩm"
              ></textarea>
            </div>
          </div>

          {/* Ảnh */}
          <div className="form-section">
            <h3>Ảnh đại diện</h3>
            <input
              type="file"
              name="thumbnail"
              accept="image/*"
              onChange={handleInputChange}
              required
            />
            {thumbnailPreview && (
              <div style={{ marginTop: 10 }}>
                <img
                  src={thumbnailPreview}
                  alt="preview"
                  style={{ width: 120, borderRadius: 8 }}
                />
              </div>
            )}
          </div>

          {/* Trạng thái */}
          <div className="form-section">
            <label>
              <input
                type="checkbox"
                name="status"
                checked={formData.status}
                onChange={handleInputChange}
              />{" "}
              Kích hoạt sản phẩm
            </label>
          </div>

          {/* Action */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-secondary"
              disabled={loading}
            >
              Reset
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Thêm Sản Phẩm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductAdd;
