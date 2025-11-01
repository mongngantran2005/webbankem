import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiCategory from "../../../api/apiCategory";

export default function CategoryEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    parent_id: 0,
    description: "",
    sort_order: 0,
    status: true,
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // ==================== LOAD CATEGORY ====================
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await apiCategory.getById(id);
        const data = res.data.data || res.data;

        setFormData({
          name: data.name || "",
          slug: data.slug || "",
          parent_id: data.parent_id || 0,
          description: data.description || "",
          sort_order: data.sort_order || 0,
          status: data.status === 1,
          image: null,
        });

        if (data.image) setPreview(data.image);
      } catch (error) {
        console.error("❌ Error fetching category:", error);
        alert("Không thể tải dữ liệu danh mục!");
      }
    };

    const fetchAllCategories = async () => {
      try {
        const res = await apiCategory.getAll();
        setCategories(res.data.data || res.data);
      } catch (error) {
        console.error("❌ Error fetching category list:", error);
      }
    };

    fetchCategory();
    fetchAllCategories();
  }, [id]);

  // ==================== HANDLE CHANGE ====================
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      if (file) setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "checkbox"
            ? checked
            : type === "number"
            ? parseInt(value) || 0
            : value,
      }));
    }
  };

  // ==================== HANDLE SUBMIT ====================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("⚠️ Tên danh mục là bắt buộc!");
      return;
    }

    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append(
        "slug",
        formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-")
      );
      submitData.append("parent_id", formData.parent_id || 0);
      submitData.append("description", formData.description);
      submitData.append("sort_order", formData.sort_order);
      submitData.append("status", formData.status ? 1 : 0);

      if (formData.image) {
        submitData.append("image", formData.image);
      }

      // ✅ Gửi request cập nhật
      const res = await apiCategory.admin.update(id, submitData);

      if (res.data.success) {
        alert("✅ Cập nhật danh mục thành công!");
        navigate("/admin/category");
      } else {
        alert("⚠️ Có lỗi xảy ra khi cập nhật!");
      }
    } catch (error) {
      console.error("❌ Error updating category:", error);
      if (error.response?.status === 422) {
        const msg =
          error.response.data?.errors?.name?.[0] ||
          "⚠️ Dữ liệu không hợp lệ. Vui lòng nhập đủ thông tin bắt buộc.";
        alert(msg);
      } else if (error.response?.status === 404) {
        alert("❌ Không tìm thấy danh mục!");
      } else {
        alert("❌ Lỗi máy chủ! Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ==================== RENDER FORM ====================
  return (
    <div className="category-edit" style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 20 }}>✏️ Cập nhật danh mục</h2>

      <form onSubmit={handleSubmit}>
        {/* --- Name --- */}
        <div className="form-group">
          <label>Tên danh mục *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        {/* --- Slug --- */}
        <div className="form-group" style={{ marginTop: 10 }}>
          <label>Slug</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="Tự động tạo nếu để trống"
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        {/* --- Parent Category --- */}
        <div className="form-group" style={{ marginTop: 10 }}>
          <label>Danh mục cha</label>
          <select
            name="parent_id"
            value={formData.parent_id}
            onChange={handleChange}
            style={{ width: "100%", padding: 8 }}
          >
            <option value={0}>-- Không có --</option>
            {categories
              .filter((cat) => cat.id !== parseInt(id))
              .map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
          </select>
        </div>

        {/* --- Description --- */}
        <div className="form-group" style={{ marginTop: 10 }}>
          <label>Mô tả</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={{ width: "100%", padding: 8, minHeight: 80 }}
          />
        </div>

        {/* --- Sort Order --- */}
        <div className="form-group" style={{ marginTop: 10 }}>
          <label>Thứ tự</label>
          <input
            type="number"
            name="sort_order"
            value={formData.sort_order}
            onChange={handleChange}
            min={0}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        {/* --- Image --- */}
        <div className="form-group" style={{ marginTop: 10 }}>
          <label>Ảnh danh mục</label>
          <input type="file" name="image" onChange={handleChange} />
          {preview && (
            <img
              src={preview}
              alt="preview"
              style={{
                width: 120,
                borderRadius: 8,
                marginTop: 10,
                border: "1px solid #ddd",
              }}
            />
          )}
        </div>

        {/* --- Status --- */}
        <div className="form-group" style={{ marginTop: 10 }}>
          <label>Trạng thái</label>
          <input
            type="checkbox"
            name="status"
            checked={formData.status}
            onChange={handleChange}
            style={{ marginLeft: 10 }}
          />
          <span style={{ marginLeft: 6 }}>
            {formData.status ? "Hiển thị" : "Ẩn"}
          </span>
        </div>

        {/* --- Submit Button --- */}
        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 20,
            padding: "8px 20px",
            backgroundColor: loading ? "#999" : "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Đang lưu..." : "💾 Lưu thay đổi"}
        </button>
      </form>
    </div>
  );
}
