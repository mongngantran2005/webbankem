import axios from "axios";
import { useEffect, useState } from "react";
import apiProduct from "../../../api/apiProduct";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidEdit } from "react-icons/bi";
import { MdDelete, MdVisibility, MdRestore, MdDeleteForever } from "react-icons/md";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("active");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [viewMode, currentPage]);

  // 🧠 Lấy danh sách sản phẩm
  const fetchProducts = async () => {
  setLoading(true);
  setError("");

  try {
    console.log(`🔄 Fetching ${viewMode} products...`);

    // ✅ Gọi API có phân trang
    const res =
      viewMode === "active"
        ? await apiProduct.admin.getAll(currentPage, 5)
        : await apiProduct.admin.getTrash(currentPage, 5);

    console.log("📦 Products loaded:", res);

    // ✅ Gán lại danh sách và thông tin phân trang
    setProducts(Array.isArray(res.data) ? res.data : []);
    setTotalPages(res.pagination?.last_page || 1);
  } catch (error) {
    console.error("API Error:", error);
    setError(error.response?.data?.message || "Lỗi kết nối server");
  } finally {
    setLoading(false);
  }
};


 
  // 🗑️ Xóa sản phẩm (chuyển vào thùng rác)
const handleDelete = async (id) => {
  if (window.confirm("Bạn có chắc muốn xóa sản phẩm này không?")) {
    try {
      const res = await axios.delete(`http://127.0.0.1:8000/api/products/admin/${id}`);
      console.log("Phản hồi từ server:", res);

      if (res.data?.success) {
        alert("🗑️ Xóa thành công");
        fetchProducts();
      } else {
        alert("❌ Xóa thất bại: " + (res.data?.message || "Không xác định"));
      }
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      alert("🚫 Lỗi kết nối server hoặc API");
    }
  }
};


  // 🔄 Khôi phục sản phẩm
  const handleRestore = async (id) => {
  if (window.confirm("Bạn có chắc muốn khôi phục sản phẩm này không?")) {
    try {
      const res = await apiProduct.admin.restore(id);

      if (res.success) {
        alert("✅ Khôi phục thành công!");
        fetchProducts();
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
      if (res.data?.success) {
        alert("🧹 Xóa vĩnh viễn thành công");
        fetchProducts();
      } else {
        alert(res.data?.message || "Xóa thất bại");
      }
    } catch (err) {
      console.error("Force delete error:", err);
      alert(err.response?.data?.message || "Xóa thất bại");
    }
  };

  // 🔁 Cập nhật trạng thái
  const handleStatusToggle = async (id) => {
  try {
    const res = await apiProduct.admin.status(id);
    if (res.success) {
      alert("✅ Cập nhật trạng thái thành công");
      fetchProducts(); // load lại danh sách
    } else {
      alert(res.message || "Cập nhật thất bại");
    }
  } catch (err) {
    console.error("Status toggle error:", err);
    alert(err.response?.data?.message || "Cập nhật thất bại");
  }
};



  // 💰 Định dạng giá tiền
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  // 🖼️ Lấy URL ảnh
  const getImageUrl = (imagePath) =>
    imagePath ? `http://127.0.0.1:8000/uploads/products/${imagePath}` : null;

  // 🏷️ Trạng thái sản phẩm
  const getStatusBadge = (status) =>
    status ? (
      <span className="status-badge active">Kích hoạt</span>
    ) : (
      <span className="status-badge inactive">Ẩn</span>
    );

  const handleRefresh = () => fetchProducts();

  const handlePageChange = (page) => setCurrentPage(page);

  // 🌀 Hiển thị đang tải
  if (loading)
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        Đang tải danh sách sản phẩm...
      </div>
    );

  // ⚠️ Hiển thị lỗi
  if (error)
    return (
      <div className="error-container">
        <div className="error-message">
          <strong>Lỗi:</strong> {error}
        </div>
        <button onClick={handleRefresh} className="btn btn-primary">
          Thử lại
        </button>
      </div>
    );

  // 🧩 Hiển thị danh sách sản phẩm
  return (
    <div className="product-admin">
      <div className="product-header">
        <h1>
          {viewMode === "active" ? "Danh Sách Sản Phẩm" : "Sản Phẩm Đã Xóa"}{" "}
          <span className="product-count">({products.length})</span>
        </h1>

        <div className="header-actions">
          <div className="view-mode-toggle">
            <button
              className={`btn ${
                viewMode === "active" ? "btn-primary" : "btn-secondary"
              }`}
              onClick={() => {
                setViewMode("active");
                setCurrentPage(1);
              }}
            >
              Sản Phẩm Active
            </button>
            <Link
  to="/admin/product-trash"
  className={`btn ${
    viewMode === "trash" ? "btn-primary" : "btn-secondary"
  }`}
>
  Thùng Rác
</Link>

          </div>

          <div className="action-buttons">
            <button
              onClick={handleRefresh}
              className="btn btn-secondary"
              title="Làm mới danh sách"
            >
              🔄
            </button>
            {viewMode === "active" && (
              <Link to="/admin/product-add" className="btn btn-primary">
                + Thêm Sản Phẩm
              </Link>
            )}
          </div>
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
              <th>Giá gốc</th>
              <th>Giá bán</th>
              <th>Số lượng</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>
  <img
    src={
      product.thumbnail
        ? `http://127.0.0.1:8000/uploads/products/${product.thumbnail}`
        : "http://127.0.0.1:8000/images/placeholder.jpg"
    }
    alt={product.name}
    className="product-image"
    onError={(e) => {
      e.target.src = "http://127.0.0.1:8000/images/placeholder.jpg";
    }}
  />
</td>

                <td>
                  <div className="product-name-main">{product.name}</div>
                  <div className="product-slug">{product.slug}</div>
                </td>
                <td>{product.category?.name || "-"}</td>
                <td>{product.brand?.name || "-"}</td>
                <td>{formatPrice(product.price_root)}</td>
                <td>
                  <span className="sale-price">
                    {formatPrice(product.price_sale)}
                  </span>
                  {product.price_sale < product.price_root && (
                    <span className="discount-badge">
                      -
                      {Math.round(
                        (1 - product.price_sale / product.price_root) * 100
                      )}
                      %
                    </span>
                  )}
                </td>
                <td>
                  <span
                    className={`qty-badge ${
                      product.qty === 0
                        ? "out-of-stock"
                        : product.qty < 5
                        ? "low-stock"
                        : ""
                    }`}
                  >
                    {product.qty}
                  </span>
                </td>
                <td>
                  {viewMode === "active" ? (
                    <button
                      onClick={() => handleStatusToggle(product.id)}
                      className={`status-toggle ${
                        product.status ? "active" : "inactive"
                      }`}
                      title={product.status ? "Tắt" : "Bật"}
                    >
                      {product.status ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                  ) : (
                    getStatusBadge(product.status)
                  )}
                </td>
                <td className="actions">
                  {viewMode === "active" ? (
                    <>
                      <Link
                        to={`/admin/product-show/:id/${product.id}`}
                        className="btn btn-view"
                        title="Xem chi tiết"
                      >
                        <MdVisibility />
                      </Link>
                      <Link
                        to={`/admin/editProduct/${product.id}`}
                        className="btn btn-edit"
                        title="Sửa sản phẩm"
                      >
                        <BiSolidEdit />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="btn btn-delete"
                        title="Xóa sản phẩm"
                      >
                        <MdDelete />
                      </button>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="no-data">
            {viewMode === "active"
              ? "Không có sản phẩm nào"
              : "Thùng rác trống"}
            {viewMode === "active" && (
              <Link to="/admin/product-add" className="btn btn-primary mt-2">
                + Thêm Sản Phẩm Đầu Tiên
              </Link>
            )}
          </div>
        )}
      </div>

      {/* 🔢 Phân trang */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-secondary"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            ← Trước
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`btn ${
                currentPage === page ? "btn-primary" : "btn-secondary"
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="btn btn-secondary"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Sau →
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductList;
