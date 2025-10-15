import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdRestore, MdDeleteForever } from "react-icons/md";
import apiProduct from "../../../api/apiProduct";

function ProductTrash() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchDeletedProducts();
  }, [currentPage]);

  // 🧠 Lấy danh sách sản phẩm trong thùng rác
  const fetchDeletedProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiProduct.admin.getTrash(currentPage, 5);
      setProducts(Array.isArray(res.data) ? res.data : []);
      setTotalPages(res.pagination?.last_page || 1);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm đã xóa:", error);
      setError(error.response?.data?.message || "Lỗi tải danh sách");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Khôi phục sản phẩm
  const handleRestore = async (id) => {
    if (window.confirm("Bạn có chắc muốn khôi phục sản phẩm này không?")) {
      try {
        const res = await apiProduct.admin.restore(id);
        if (res.success) {
          alert("✅ Khôi phục thành công!");
          fetchDeletedProducts();
        } else {
          alert("❌ Khôi phục thất bại: " + (res.message || "Không rõ nguyên nhân"));
        }
      } catch (err) {
        console.error("Restore error:", err);
        alert(err.response?.data?.message || "Khôi phục thất bại");
      }
    }
  };

  // 💥 Xóa vĩnh viễn
  const handleForceDelete = async (id) => {
    if (
      !window.confirm(
        "⚠️ Bạn có chắc chắn muốn xóa VĨNH VIỄN sản phẩm này?\nHành động này không thể hoàn tác!"
      )
    )
      return;
    try {
      const res = await apiProduct.admin.forceDelete(id);
      if (res.success) {
        alert("🧹 Xóa vĩnh viễn thành công!");
        fetchDeletedProducts();
      } else {
        alert(res.message || "Xóa thất bại");
      }
    } catch (err) {
      console.error("Force delete error:", err);
      alert(err.response?.data?.message || "Xóa thất bại");
    }
  };

  // 💰 Định dạng giá tiền
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  // 🖼️ Lấy URL ảnh
  const getImageUrl = (imagePath) =>
    imagePath ? `http://127.0.0.1:8000/uploads/products/${imagePath}` : null;

  // 🌀 Đang tải
  if (loading)
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        Đang tải danh sách sản phẩm đã xóa...
      </div>
    );

  // ⚠️ Lỗi
  if (error)
    return (
      <div className="error-container">
        <div className="error-message">
          <strong>Lỗi:</strong> {error}
        </div>
        <button onClick={fetchDeletedProducts} className="btn btn-primary">
          Thử lại
        </button>
      </div>
    );

  // 🧩 Giao diện chính
  return (
    <div className="product-admin">
      <div className="product-header">
        <h1>🗑️ Sản Phẩm Đã Xóa <span className="product-count">({products.length})</span></h1>
        <div className="header-actions">
          <Link to="/admin/product" className="btn btn-secondary">
            ← Quay lại danh sách
          </Link>
          <button onClick={fetchDeletedProducts} className="btn btn-secondary">
            🔄 Làm mới
          </button>
        </div>
      </div>

      <div className="product-table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Danh mục</th>
              <th>Thương hiệu</th>
              <th>Giá bán</th>
              <th>Số lượng</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>
                  <img
                    src={getImageUrl(product.thumbnail) || "http://127.0.0.1:8000/images/placeholder.jpg"}
                    alt={product.name}
                    className="product-image"
                    onError={(e) => (e.target.src = "http://127.0.0.1:8000/images/placeholder.jpg")}
                  />
                </td>
                <td>
                  <div className="product-name-main">{product.name}</div>
                  <div className="product-slug">{product.slug}</div>
                </td>
                <td>{product.category?.name || "-"}</td>
                <td>{product.brand?.name || "-"}</td>
                <td>{formatPrice(product.price_sale)}</td>
                <td>{product.qty}</td>
                <td className="actions">
                  <button
                    onClick={() => handleRestore(product.id)}
                    className="btn btn-restore"
                    title="Khôi phục"
                  >
                    <MdRestore />
                  </button>
                  <button
                    onClick={() => handleForceDelete(product.id)}
                    className="btn btn-force-delete"
                    title="Xóa vĩnh viễn"
                  >
                    <MdDeleteForever />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="no-data">🧺 Thùng rác trống</div>
        )}
      </div>

      {/* 🔢 Phân trang */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-secondary"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            ← Trước
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`btn ${currentPage === page ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="btn btn-secondary"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Sau →
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductTrash;
