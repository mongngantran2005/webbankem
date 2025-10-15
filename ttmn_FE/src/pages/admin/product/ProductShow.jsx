import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function ProductShow() {
  const { id } = useParams(); // lấy id từ URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/products/${id}`);
      setProduct(res.data.data || res.data); // tùy cấu trúc response
    } catch (err) {
      console.error(err);
      setError("Không thể tải sản phẩm này.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Thêm vào giỏ hàng
  const handleAddToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = existingCart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      existingCart.push({
        id: product.id,
        name: product.name,
        price: product.price_sale,
        thumbnail: product.thumbnail,
        quantity: quantity,
      });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    alert("🛒 Đã thêm vào giỏ hàng!");
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="error">Không tìm thấy sản phẩm.</div>;

  return (
    <div className="product-show-container">
      <div className="back-link">
        <Link to="/admin/product">← Quay lại danh sách</Link>
      </div>

      <div className="product-show">
        <div className="product-image">
          <img
            src={`http://127.0.0.1:8000/uploads/products/${product.thumbnail}`}
            alt={product.name}
            onError={(e) => (e.target.src = "http://127.0.0.1:8000/images/placeholder.jpg")}
          />
        </div>

        <div className="product-info">
          <h2>{product.name}</h2>
          <p><strong>Slug:</strong> {product.slug}</p>
          <p><strong>Giá gốc:</strong> {product.price_root.toLocaleString()} ₫</p>
          <p><strong>Giá khuyến mãi:</strong> {product.price_sale.toLocaleString()} ₫</p>
          <p><strong>Số lượng còn:</strong> {product.qty}</p>
          <p><strong>Mô tả:</strong> {product.description || "Không có mô tả"}</p>
          <p><strong>Chi tiết:</strong> {product.detail || "Không có chi tiết"}</p>
          <p><strong>Danh mục ID:</strong> {product.category_id}</p>
          <p><strong>Thương hiệu ID:</strong> {product.brand_id}</p>
          <p><strong>Trạng thái:</strong> {product.status === 1 ? "Hiển thị" : "Ẩn"}</p>

          <div className="quantity-control">
            <label>Số lượng:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>

          <button onClick={handleAddToCart} className="btn-add-cart">
            🛒 Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductShow;
