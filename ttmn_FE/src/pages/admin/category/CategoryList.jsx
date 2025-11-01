import { useEffect, useState } from "react";
import apiCategory from "../../../api/apiCategory";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidEdit } from "react-icons/bi";
import { MdDelete, MdVisibility, MdRestore, MdDeleteForever } from "react-icons/md";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("active"); // 'active' or 'trash'
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, [viewMode]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res =
        viewMode === "active"
          ? await apiCategory.getAll()
          : await apiCategory.getTrash();

      if (res.data.success) {
        setCategories(res.data.data);
      } else {
        setError("Lỗi khi tải danh sách danh mục");
      }
    } catch (err) {
      console.error("API Error:", err);
      setError("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;
    try {
      const response = await apiCategory.delete(id);
      if (response.data.success) {
        alert("Xóa thành công");
        fetchCategories();
      } else {
        alert(response.data.message || "Xóa thất bại");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Xóa thất bại");
    }
  };

  const handleRestore = async (id) => {
    try {
      const response = await apiCategory.restore(id);
      if (response.data.success) {
        alert("Khôi phục thành công");
        fetchCategories();
      } else {
        alert(response.data.message || "Khôi phục thất bại");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Khôi phục thất bại");
    }
  };

  const handleForceDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa VĨNH VIỄN danh mục này?")) return;
    try {
      const response = await apiCategory.forceDelete(id);
      if (response.data.success) {
        alert("Xóa vĩnh viễn thành công");
        fetchCategories();
      } else {
        alert(response.data.message || "Xóa thất bại");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Xóa thất bại");
    }
  };

  const handleStatusToggle = async (id) => {
    try {
      const response = await apiCategory.updateStatus(id);
      if (response.data.success) {
        alert("Cập nhật trạng thái thành công");
        fetchCategories();
      } else {
        alert(response.data.message || "Cập nhật thất bại");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Cập nhật thất bại");
    }
  };

  const getParentName = (parent) => {
    return parent && parent.id !== 0 ? parent.name : "-";
  };

  const getStatusBadge = (status) => {
    return status ? (
      <span className="status-badge active">Kích hoạt</span>
    ) : (
      <span className="status-badge inactive">Ẩn</span>
    );
  };

  // ✅ Đã chỉnh để khớp CategoryEdit — BE trả URL đầy đủ, không cần nối chuỗi
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "http://127.0.0.1:8000/images/placeholder.jpg";
    // Nếu BE trả full URL, giữ nguyên — nếu chỉ là path, tự nối storage/
    return imagePath.startsWith("http")
      ? imagePath
      : `http://127.0.0.1:8000/storage/${imagePath}`;
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="category-admin">
      <div className="category-header">
        <h1>
          {viewMode === "active" ? "Danh Sách Danh Mục" : "Danh Mục Đã Xóa"}
        </h1>
        <div className="header-actions">
          <div className="view-mode-toggle">
            <button
              className={`btn ${
                viewMode === "active" ? "btn-primary" : "btn-secondary"
              }`}
              onClick={() => setViewMode("active")}
            >
              Danh Mục Active
            </button>
            <button
              className={`btn ${
                viewMode === "trash" ? "btn-primary" : "btn-secondary"
              }`}
              onClick={() => setViewMode("trash")}
            >
              Thùng Rác
            </button>
          </div>
          {viewMode === "active" && (
            <Link to="/admin/addCategory" className="btn btn-primary">
              + Thêm Danh Mục
            </Link>
          )}
        </div>
      </div>

      <div className="category-table-container">
        <table className="category-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Hình ảnh</th>
              <th>Tên danh mục</th>
              <th>Danh mục cha</th>
              <th>Slug</th>
              <th>Mô tả</th>
              <th>Thứ tự</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                    }}
                    onError={(e) =>
                      (e.target.src =
                        "http://127.0.0.1:8000/images/placeholder.jpg")
                    }
                  />
                </td>
                <td className="category-name">{item.name}</td>
                <td>{getParentName(item.parent)}</td>
                <td className="category-slug">{item.slug}</td>
                <td className="category-desc">
                  {item.description || "-"}
                </td>
                <td>{item.sort_order}</td>
                <td>
                  {viewMode === "active" ? (
                    <button
                      onClick={() => handleStatusToggle(item.id)}
                      className={`status-toggle ${
                        item.status ? "active" : "inactive"
                      }`}
                      title={item.status ? "Tắt" : "Bật"}
                    >
                      {item.status ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                  ) : (
                    getStatusBadge(item.status)
                  )}
                </td>
                <td className="actions">
                  {viewMode === "active" ? (
                    <>
                      <Link
                        to={`/admin/category/${item.id}`}
                        className="btn btn-view"
                        title="Xem chi tiết"
                      >
                        <MdVisibility />
                      </Link>
                      <Link
                        to={`/admin/editCategory/${item.id}`}
                        className="btn btn-edit"
                        title="Sửa danh mục"
                      >
                        <BiSolidEdit />
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="btn btn-delete"
                        title="Xóa danh mục"
                      >
                        <MdDelete />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleRestore(item.id)}
                        className="btn btn-restore"
                        title="Khôi phục"
                      >
                        <MdRestore />
                      </button>
                      <button
                        onClick={() => handleForceDelete(item.id)}
                        className="btn btn-force-delete"
                        title="Xóa vĩnh viễn"
                      >
                        <MdDeleteForever />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {categories.length === 0 && (
          <div className="no-data">
            {viewMode === "active"
              ? "Không có danh mục nào"
              : "Thùng rác trống"}
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryList;
