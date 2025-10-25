import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ReviewProductUser() {
  const { id } = useParams(); // 👈 Lấy productId từ URL
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/reviews/product/${id}`);
      setReviews(res.data.reviews || []);
    } catch (error) {
      console.error("❌ Lỗi khi tải đánh giá sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center py-5">⏳ Đang tải đánh giá...</p>;
  }

  if (reviews.length === 0) {
    return <p className="text-center py-5 text-gray-500">Chưa có đánh giá nào cho sản phẩm này.</p>;
  }

  return (
    <div className="product-reviews mt-4">
      <h3 className="text-lg font-semibold mb-4">💬 Đánh giá của khách hàng</h3>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border rounded-xl p-4 shadow-sm bg-white hover:shadow-md transition-all"
          >
            {/* Header: User + Rating + Date */}
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <img
                  src={
                    review.user?.avatar
                      ? `http://127.0.0.1:8000/${review.user.avatar}`
                      : "https://via.placeholder.com/40"
                  }
                  alt="user avatar"
                  className="w-10 h-10 rounded-full border"
                />
                <div>
                  <p className="font-medium">{review.user?.name || "Người dùng ẩn danh"}</p>
                  <div className="text-yellow-500">
                    {"⭐".repeat(review.rating)}{" "}
                    <span className="text-gray-500 text-sm">
                      ({new Date(review.created_at).toLocaleDateString("vi-VN")})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Comment */}
            <p className="text-gray-700 mb-2">{review.comment}</p>

            {/* Images */}
            {review.images?.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-2">
                {review.images.map((img) => (
                  <img
                    key={img.id}
                    src={`http://127.0.0.1:8000/${img.image}`}
                    alt="Ảnh đánh giá"
                    className="w-20 h-20 object-cover rounded-md border"
                  />
                ))}
              </div>
            )}

            {/* Admin reply */}
            {review.replies?.length > 0 && (
              <div className="bg-gray-50 border-l-4 border-blue-400 p-3 mt-2 rounded">
                <p className="text-sm text-gray-700">
                  💬 <strong>Phản hồi của cửa hàng:</strong>
                </p>
                {review.replies.map((reply) => (
                  <p key={reply.id} className="text-gray-600 ml-2 mt-1">
                    {reply.content}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
