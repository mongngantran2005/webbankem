import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BiSolidEdit } from "react-icons/bi";
import { MdDelete, MdAddCircleOutline } from "react-icons/md";

export default function BannerList() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBanners = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/banners/admin/all");
      setBanners(res.data.data || []);
    } catch (err) {
      console.error("Lỗi khi tải banner:", err);
      setError("Không thể tải danh sách banner. Vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa banner này không?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/banners/admin/${id}`);
      setBanners((prev) => prev.filter((b) => b.id !== id));
      alert("✅ Đã xóa banner thành công!");
    } catch (err) {
      console.error("Lỗi khi xóa banner:", err);
      alert("❌ Lỗi khi xóa banner!");
    }
  };

  if (loading) return <p className="bannerlist-loading">Đang tải dữ liệu...</p>;
  if (error) return <p className="bannerlist-error">{error}</p>;

  return (
    <div className="bannerlist-container">
      <div className="bannerlist-header">
        <h2>📢 Quản lý Banner / Sự kiện</h2>
        <Link to="/admin/banner-add" className="bannerlist-btn-add">
          <MdAddCircleOutline size={20} /> Thêm Banner
        </Link>
      </div>

      <div className="bannerlist-table-wrapper">
        <table className="bannerlist-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tiêu đề</th>
              <th>Ảnh</th>
              <th>Vị trí</th>
              <th>Liên kết</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {banners.length > 0 ? (
              banners.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.name || b.title}</td>
                  <td>
                    {b.image ? (
                      <img
                        src={`http://127.0.0.1:8000/storage/${b.image}`}
                        alt={b.name || b.title}
                        className="bannerlist-img"
                      />
                    ) : (
                      <span className="bannerlist-noimage">Không có ảnh</span>
                    )}
                  </td>
                  <td>
                    {b.position === "slideshow"
                      ? "Slideshow"
                      : b.position === "popup"
                      ? "Popup"
                      : "Khác"}
                  </td>
                  <td>
                    {b.link ? (
                      <a
                        href={b.link}
                        className="bannerlist-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {b.link}
                      </a>
                    ) : (
                      "Không có"
                    )}
                  </td>
                  <td>
                    {b.start_date
                      ? new Date(b.start_date).toLocaleDateString("vi-VN")
                      : "—"}
                  </td>
                  <td>
                    {b.end_date
                      ? new Date(b.end_date).toLocaleDateString("vi-VN")
                      : "—"}
                  </td>
                  <td
                    className={
                      b.status === 1
                        ? "bannerlist-status-active"
                        : "bannerlist-status-hide"
                    }
                  >
                    {b.status === 1 ? "Hiển thị" : "Ẩn"}
                  </td>
                  <td className="bannerlist-action-cell">
                    <Link
                      to={`/admin/banner-edit/${b.id}`}
                      className="bannerlist-btn-edit"
                      title="Sửa"
                    >
                      <BiSolidEdit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="bannerlist-btn-delete"
                      title="Xóa"
                    >
                      <MdDelete size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="bannerlist-nodata">
                  Không có banner nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
