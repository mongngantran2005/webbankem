import { useEffect, useState } from "react";
import axios from "axios";

export default function ReviewList() {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    product_id: "",
    rating: "",
    date_from: "",
    date_to: "",
    search: "",
  });
  const [replyContent, setReplyContent] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchReviews();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/products/admin/all");
      setProducts(res.data.products || []);
    } catch (error) {
      console.error("Lỗi tải sản phẩm:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "")
      );
      const res = await axios.get("http://127.0.0.1:8000/api/reviews/admin/all", {
        params,
      });
      setReviews(res.data.reviews || []);
    } catch (error) {
      console.error("Lỗi tải đánh giá:", error);
    }
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleReplyChange = (id, value) => {
    setReplyContent({ ...replyContent, [id]: value });
  };

  const handleSendReply = async (reviewId) => {
    const content = replyContent[reviewId]?.trim();
    if (!content) {
      alert("Vui lòng nhập nội dung phản hồi!");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `http://127.0.0.1:8000/api/reviews/${reviewId}/reply`,
        {
          user_id: 1, // 👈 Tạm thời cố định, có thể lấy từ auth sau
          content,
        }
      );

      alert(res.data.message || "Trả lời thành công!");
      setReplyContent({ ...replyContent, [reviewId]: "" });
    } catch (error) {
      console.error("Lỗi khi gửi phản hồi:", error);
      alert("Lỗi khi gửi phản hồi!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-container">
      <h1 className="review-title">📋 Quản lý đánh giá sản phẩm</h1>

      {/* Bộ lọc */}
      <div className="review-filters">
        <select name="product_id" value={filters.product_id} onChange={handleChange}>
          <option value="">-- Tất cả sản phẩm --</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <select name="rating" value={filters.rating} onChange={handleChange}>
          <option value="">-- Tất cả sao --</option>
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} ⭐
            </option>
          ))}
        </select>

        <input type="date" name="date_from" value={filters.date_from} onChange={handleChange} />
        <input type="date" name="date_to" value={filters.date_to} onChange={handleChange} />
        <button onClick={fetchReviews}>Lọc</button>
      </div>

      {/* Bảng đánh giá */}
      <div className="review-table-container">
        <table className="review-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Sản phẩm</th>
              <th>Người dùng</th>
              <th>Sao</th>
              <th>Nhận xét</th>
              <th>Ảnh</th>
              <th>Ngày</th>
              <th>Phản hồi</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length > 0 ? (
              reviews.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.product?.name}</td>
                  <td>{r.user?.name}</td>
                  <td className="rating">{r.rating} ⭐</td>
                  <td>{r.comment}</td>
                  <td>
                    {r.images?.length > 0 ? (
                      <div className="review-images">
                        {r.images.map((img) => (
                          <img
                            key={img.id}
                            src={`http://127.0.0.1:8000/${img.image}`}
                            alt=""
                          />
                        ))}
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>{new Date(r.created_at).toLocaleDateString("vi-VN")}</td>
                  <td>
                    <div className="reply-section">
                      <textarea
                        rows="2"
                        placeholder="Nhập phản hồi..."
                        value={replyContent[r.id] || ""}
                        onChange={(e) => handleReplyChange(r.id, e.target.value)}
                      />
                      <button
                        onClick={() => handleSendReply(r.id)}
                        disabled={loading}
                      >
                        {loading ? "Đang gửi..." : "Gửi"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">
                  Không có đánh giá nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
