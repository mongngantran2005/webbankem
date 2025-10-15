
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ✅ Hàm xử lý URL ảnh thống nhất
  const getImageUrl = (thumbnail) => {
    if (!thumbnail) return "/images/placeholder.jpg";

    if (thumbnail.startsWith("http://") || thumbnail.startsWith("https://")) {
      return thumbnail;
    }

    if (thumbnail.startsWith("/")) {
      return `http://127.0.0.1:8000${thumbnail}`;
    }

    return `http://127.0.0.1:8000/uploads/products/${thumbnail}`;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get("http://127.0.0.1:8000/api/products");
        if (response.data.success) {
          setProducts(response.data.data);
        } else {
          setError("Không thể tải danh sách sản phẩm.");
        }
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
        setError("Không thể kết nối đến máy chủ.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ✅ Định dạng giá tiền
  const formatPrice = (price) => Number(price || 0).toLocaleString("vi-VN");

  // ✅ Tính phần trăm giảm
  const calculateDiscount = (priceRoot, priceSale) =>
    Math.round((1 - priceSale / priceRoot) * 100);

  // ✅ Khi click xem chi tiết sản phẩm
  const handleProductClick = (productId) => {
    navigate(`/product-detail/${productId}`);
  };

  // ✅ Thêm vào giỏ hàng
  const addToCart = (product, e) => {
    e.stopPropagation(); // tránh chuyển trang khi click

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price_sale || product.price_root,
        image: getImageUrl(product.thumbnail),
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`✅ Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  // ✅ Component card sản phẩm
  const ProductCard = ({ product }) => (
    <div className="col-md-3 col-6 mb-4">
      <div
        className="card h-100 product-card shadow-sm clickable-card"
        onClick={() => handleProductClick(product.id)}
        style={{ cursor: "pointer" }}
      >
        <div className="position-relative">
          <img
            src={getImageUrl(product.thumbnail)}
            className="card-img-top"
            alt={product.name}
            style={{ height: "220px", objectFit: "cover" }}
            onError={(e) => {
              e.target.src = "/images/placeholder.jpg";
            }}
          />
          {product.price_sale && product.price_sale < product.price_root && (
            <span className="badge bg-danger position-absolute top-0 start-0 m-2">
              -{calculateDiscount(product.price_root, product.price_sale)}%
            </span>
          )}
        </div>

        <div className="card-body d-flex flex-column">
          <h6 className="card-title fw-bold product-name">
            {product.name?.length > 50
              ? `${product.name.substring(0, 50)}...`
              : product.name}
          </h6>

          <p className="text-muted small mb-2">{product.brand?.name}</p>

          <div className="product-prices mt-auto">
            {product.price_sale && product.price_sale < product.price_root ? (
              <>
                <span className="text-muted text-decoration-line-through me-2">
                  {formatPrice(product.price_root)}₫
                </span>
                <span className="text-danger fw-bold fs-6">
                  {formatPrice(product.price_sale)}₫
                </span>
              </>
            ) : (
              <span className="fw-bold text-primary fs-6">
                {formatPrice(product.price_sale || product.price_root)}₫
              </span>
            )}
          </div>

          <button
            className="btn btn-sm btn-outline-primary mt-3"
            onClick={(e) => addToCart(product, e)}
          >
            <i className="fas fa-cart-plus me-2"></i>Thêm vào giỏ
          </button>
        </div>
      </div>
    </div>
  );

  // ✅ Loading
  if (loading)
    return (
      <div className="container mt-5 text-center">
        <div
          className="spinner-border text-primary"
          style={{ width: "3rem", height: "3rem" }}
          role="status"
        ></div>
        <p className="mt-3 fs-5">Đang tải sản phẩm...</p>
      </div>
    );

  // ✅ Lỗi
  if (error)
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center" role="alert">
          <h4 className="alert-heading">Lỗi!</h4>
          <p>{error}</p>
          <button
            className="btn btn-outline-danger"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </button>
        </div>
      </div>
    );

  // ✅ Hiển thị danh sách sản phẩm
  return (
    <main className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary mb-0">
          <i className="fas fa-box-open me-2"></i>
          TẤT CẢ SẢN PHẨM
        </h2>
        <span className="text-muted small">
          Tổng cộng: {products.length} sản phẩm
        </span>
      </div>

      {products.length > 0 ? (
        <div className="row">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="alert alert-info text-center py-4">
          <i className="fas fa-info-circle me-2"></i>
          Không có sản phẩm nào để hiển thị.
        </div>
      )}
    </main>
  );
};

export default Products;
