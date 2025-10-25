import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axios";

const ProductReview = () => {
  const { id: productId } = useParams();

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [canReview, setCanReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Lấy user từ localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // ✅ Lấy danh sách đánh giá
  const fetchReviews = async () => {
    try {
      const res = await axiosInstance.get(`/products/${productId}/reviews`);
      if (res.data.success) {
        setReviews(res.data.reviews || []);
      }
    } catch (error) {
      console.error("❌ Lỗi khi tải đánh giá:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Kiểm tra quyền đánh giá
  const checkReviewPermission = async () => {
    if (!user) return;
    try {
      const res = await axiosInstance.get(`/orders/user/${user.id}/completed`);
      const completedOrders = res.data.orders || [];
      if (completedOrders.length === 0) {
        setCanReview(false);
        setMessage("Bạn chỉ có thể đánh giá khi đã mua và hoàn thành đơn hàng.");
        return;
      }
      const reviewed = reviews.some((r) => r.user_id === user.id);
      setHasReviewed(reviewed);
      setCanReview(true);
    } catch (error) {
      console.error("❌ Lỗi khi kiểm tra quyền đánh giá:", error);
    }
  };

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);

  useEffect(() => {
    if (user && reviews) checkReviewPermission();
  }, [user, reviews]);

  // ✅ Xử lý chọn ảnh
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      alert("Bạn chỉ có thể chọn tối đa 5 ảnh!");
      return;
    }
    setImages((prev) => [...prev, ...files]);
  };

  // ✅ Xóa ảnh đã chọn
  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Gửi đánh giá + ảnh
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Vui lòng đăng nhập để đánh giá!");
      return;
    }

    if (rating === 0) {
      alert("Vui lòng chọn số sao!");
      return;
    }

    try {
      // 🟢 Gửi phần đánh giá
      const reviewRes = await axiosInstance.post(`/products/${productId}/reviews`, {
        user_id: user.id,
        rating,
        comment,
      });

      if (!reviewRes.data.success) {
        alert(reviewRes.data.message || "Không thể gửi đánh giá!");
        return;
      }

      const reviewId = reviewRes.data.review.id;

      // 🟢 Nếu có ảnh thì upload
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((img) => formData.append("images[]", img));

        await axiosInstance.post(`/reviews/${reviewId}/images`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      alert("🎉 Cảm ơn bạn đã đánh giá sản phẩm!");
      setRating(0);
      setComment("");
      setImages([]);

      // 🟢 Sau khi gửi, tự động hiển thị lại (reload review list)
      fetchReviews();
    } catch (error) {
      console.error("❌ Lỗi khi gửi đánh giá:", error);
      alert(error.response?.data?.message || "Đã có lỗi xảy ra, vui lòng thử lại sau!");
    }
  };

  if (loading) return <p>Đang tải đánh giá...</p>;

  return (
    <div className="product-reviews mt-4 border-top pt-4">
      <h5 className="fw-bold mb-3">⭐ Đánh giá sản phẩm</h5>

      {/* ✅ Danh sách đánh giá */}
      {reviews.length === 0 ? (
        <p className="text-muted">Chưa có đánh giá nào.</p>
      ) : (
        <div className="review-list mb-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-bottom pb-3 mb-3 bg-white rounded p-3 shadow-sm"
            >
              <div className="d-flex justify-content-between align-items-center">
                <strong>{review.user?.name || "Người dùng ẩn danh"}</strong>
                <div>
                  {"⭐".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </div>
              </div>
              <p className="mb-1">{review.comment}</p>

              {/* ✅ Hiển thị ảnh đánh giá */}
              {review.images && review.images.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {review.images.map((img, index) => (
                    <img
                      key={index}
                      src={`http://127.0.0.1:8000/${img.image}`}
                      alt={`Ảnh đánh giá ${index + 1}`}
                      style={{
                        width: "90px",
                        height: "90px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                      }}
                    />
                  ))}
                </div>
              )}

              {/* ✅ HIỂN THỊ PHẢN HỒI CỦA ADMIN */}
              {review.replies && review.replies.length > 0 && (
                <div className="bg-light border rounded p-2 mt-3">
                  {review.replies.map((reply) => (
                    <div key={reply.id} className="mb-2">
                      <strong className="text-primary">
                        🛍️ Phản hồi từ người bán:
                      </strong>
                      <p className="mb-1">{reply.content}</p>
                      <small className="text-muted">
                        {new Date(reply.created_at).toLocaleString("vi-VN")}
                      </small>
                    </div>
                  ))}
                </div>
              )}

              <small className="text-muted d-block mt-2">
                {new Date(review.created_at).toLocaleString("vi-VN")}
              </small>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Form đánh giá */}
      {user && canReview && (
        <form
          onSubmit={handleSubmit}
          className="review-form bg-light p-3 rounded shadow-sm"
        >
          <div className="mb-2">
            <label className="fw-bold">Chọn số sao:</label>
            <div>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  style={{
                    cursor: "pointer",
                    fontSize: "1.6rem",
                    color: star <= rating ? "gold" : "#ccc",
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <div className="mb-2">
            <textarea
              className="form-control"
              rows="3"
              placeholder="Chia sẻ cảm nhận của bạn..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>

          {/* ✅ Upload ảnh */}
          <div className="mb-3">
            <label className="fw-bold">Thêm hình ảnh (tối đa 5):</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="form-control"
            />
            {images.length > 0 && (
              <div className="d-flex flex-wrap gap-2 mt-2">
                {images.map((img, i) => (
                  <div key={i} className="position-relative">
                    <img
                      src={URL.createObjectURL(img)}
                      alt="preview"
                      style={{
                        width: "90px",
                        height: "90px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      style={{
                        position: "absolute",
                        top: "2px",
                        right: "4px",
                        border: "none",
                        background: "rgba(0,0,0,0.6)",
                        color: "white",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary">
            Gửi đánh giá
          </button>
        </form>
      )}

      {/* ✅ Thông báo */}
      {!user && <p className="text-warning mt-2">⚠️ Vui lòng đăng nhập để đánh giá.</p>}
      {user && !canReview && <p className="text-muted mt-2">{message}</p>}
      {hasReviewed && canReview && (
        <p className="text-success mt-2">
          ✅ Bạn đã đánh giá, nhưng vẫn có thể đánh giá lại ở đơn hàng khác.
        </p>
      )}
    </div>
  );
};

export default ProductReview;
