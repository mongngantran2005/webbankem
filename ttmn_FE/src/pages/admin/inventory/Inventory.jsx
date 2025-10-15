import { useEffect, useState } from "react";
import apiProduct from "../../../api/apiProduct"; // ✅ dùng cùng API như ProductList
import { FaSync } from "react-icons/fa";

function Inventory() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Lấy danh sách sản phẩm từ API admin
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await apiProduct.admin.getAll(1, 1000); // lấy tối đa 1000 sp
      console.log("📦 API products:", res);

      // nếu API trả về { data: [...], pagination: {...} }
      const list = Array.isArray(res.data) ? res.data : res.products || [];
      setProducts(list);
    } catch (error) {
      console.error("❌ Lỗi khi tải sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Lọc theo từ khóa
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Cập nhật số lượng tồn kho
  const handleUpdateStock = async (id, newQty) => {
  if (newQty < 0 || isNaN(newQty)) return alert("❌ Số lượng không hợp lệ!");

  try {
    const res = await fetch(`http://127.0.0.1:8000/api/products/${id}/update-stock`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: newQty }), // 👈 gửi đúng key
    });

    const data = await res.json();
    if (data.success) {
      alert("✅ Cập nhật tồn kho thành công!");
      fetchProducts(); // ✅ tự reload sản phẩm sau khi nhấn OK
    } else {
      alert("⚠️ " + (data.message || "Không thể cập nhật tồn kho"));
    }
  } catch (error) {
    alert("🚫 Lỗi kết nối server khi cập nhật tồn kho!");
  }
};



  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3">Đang tải dữ liệu...</p>
      </div>
    );

  return (
    <div className="container py-4">
      <h3 className="mb-4 fw-bold text-center">📦 Quản lý Tồn Kho</h3>

      {/* Thanh tìm kiếm */}
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-50"
          placeholder="🔍 Tìm sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-outline-secondary" onClick={fetchProducts}>
          <FaSync className="me-2" /> Làm mới
        </button>
      </div>

      {/* Bảng danh sách sản phẩm */}
      <div className="table-responsive">
        <table className="table table-bordered align-middle text-center">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Tồn kho</th>
              <th>Trạng thái</th>
              <th>Cập nhật</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id}>
                <td>{i + 1}</td>
                <td>
                  <img
                    src={
                      p.thumbnail
                        ? `http://127.0.0.1:8000/uploads/products/${p.thumbnail}`
                        : "http://127.0.0.1:8000/images/placeholder.jpg"
                    }
                    alt={p.name}
                    style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }}
                  />
                </td>
                <td className="text-start">{p.name}</td>
                <td>
                  <input
                    type="number"
                    defaultValue={p.qty}
                    min="0"
                    className="form-control text-center"
                    style={{ width: "100px", margin: "auto" }}
                    onBlur={(e) => handleUpdateStock(p.id, parseInt(e.target.value))}
                  />
                </td>
                <td className={p.qty > 0 ? "text-success" : "text-danger"}>
                  {p.qty > 0 ? "Còn hàng" : "Hết hàng"}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() =>
                      handleUpdateStock(p.id, prompt("Nhập số lượng tồn mới:", p.qty))
                    }
                  >
                    Sửa
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-muted py-4">
                  Không tìm thấy sản phẩm nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Inventory;
