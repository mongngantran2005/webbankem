import { useEffect, useState } from "react";
import apiBrand from "../../../api/apiBrand";
import { Button, Modal } from "react-bootstrap";

export default function BrandList() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editBrand, setEditBrand] = useState(null);
  const [name, setName] = useState("");

  // ✅ Lấy danh sách thương hiệu
  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await apiBrand.getAll();
      if (res.data.success) setBrands(res.data.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách thương hiệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // ✅ Mở/đóng modal
  const handleOpenModal = (brand = null) => {
    setEditBrand(brand);
    setName(brand ? brand.name : "");
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setEditBrand(null);
    setName("");
  };

  // ✅ Lưu (thêm hoặc sửa)
  const handleSave = async () => {
    if (!name.trim()) return alert("Vui lòng nhập tên thương hiệu!");
    try {
      if (editBrand) {
        await apiBrand.update(editBrand.id, { name });
        alert("✅ Cập nhật thành công!");
      } else {
        await apiBrand.create({ name });
        alert("✅ Thêm thành công!");
      }
      handleCloseModal();
      fetchBrands();
    } catch (error) {
      console.error("Lỗi lưu thương hiệu:", error);
      alert("❌ Có lỗi xảy ra!");
    }
  };

  // ✅ Xóa mềm
  const handleDelete = async (id) => {
    if (window.confirm("Xóa thương hiệu này?")) {
      await apiBrand.delete(id);
      fetchBrands();
    }
  };

  // ✅ Khôi phục
  const handleRestore = async (id) => {
    if (window.confirm("Khôi phục thương hiệu này?")) {
      await apiBrand.restore(id);
      fetchBrands();
    }
  };

  // ✅ Xóa vĩnh viễn
  const handleForceDelete = async (id) => {
    if (window.confirm("⚠️ Xóa vĩnh viễn thương hiệu này?")) {
      await apiBrand.forceDelete(id);
      fetchBrands();
    }
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-danger"></div>
        <p>Đang tải danh sách thương hiệu...</p>
      </div>
    );

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold text-danger">Quản lý thương hiệu</h4>
        <Button variant="danger" onClick={() => handleOpenModal()}>
          + Thêm thương hiệu
        </Button>
      </div>

      <table className="table table-bordered align-middle">
        <thead className="table-danger text-center">
          <tr>
            <th style={{ width: "80px" }}>ID</th>
            <th>Tên thương hiệu</th>
            <th>Ngày tạo</th>
            <th style={{ width: "220px" }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {brands.length > 0 ? (
            brands.map((brand) => (
              <tr key={brand.id} className={brand.deleted_at ? "table-secondary" : ""}>
                <td className="text-center">{brand.id}</td>
                <td>{brand.name}</td>
                <td className="text-center">
                  {new Date(brand.created_at).toLocaleDateString()}
                </td>
                <td className="text-center">
                  {brand.deleted_at ? (
                    <>
                      <Button
                        variant="outline-success"
                        size="sm"
                        className="me-2"
                        onClick={() => handleRestore(brand.id)}
                      >
                        Khôi phục
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleForceDelete(brand.id)}
                      >
                        Xóa vĩnh viễn
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleOpenModal(brand)}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(brand.id)}
                      >
                        Xóa
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center text-muted py-4">
                Không có thương hiệu nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 🔹 Modal thêm/sửa */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editBrand ? "Cập nhật thương hiệu" : "Thêm thương hiệu mới"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label className="fw-semibold mb-2">Tên thương hiệu</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên thương hiệu..."
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleSave}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
