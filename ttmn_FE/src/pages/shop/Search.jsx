import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Search = () => {
  const { keyword } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!keyword || keyword.trim() === "") {
      setProducts([]);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(
          `http://127.0.0.1:8000/api/products/search/${keyword}`
        );

        if (res.data.success && Array.isArray(res.data.data)) {
          setProducts(res.data.data);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("❌ Lỗi khi tìm kiếm:", err);
        setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [keyword]);

  // ✅ Định dạng giá
  const formatPrice = (price) => Number(price || 0).toLocaleString("vi-VN");

  // ✅ Tính % giảm giá
  const calculateDiscount = (root, sale) =>
    Math.round((1 - sale / root) * 100);

  // ✅ Click sản phẩm
  const handleProductClick = (id) => navigate(`/product-detail/${id}`);

  // ✅ Thẻ sản phẩm
  const ProductCard = ({ product }) => (
    <div className="col-6 col-md-3 mb-4">
      <div
        className="card h-100 product-card clickable-card border-0 shadow-sm"
        onClick={() => handleProductClick(product.id)}
        style={{ cursor: "pointer" }}
      >
        {/* Badge giảm giá */}
        {product.price_sale && product.price_sale < product.price_root && (
          <div className="discount-badge">-{calculateDiscount(product.price_root, product.price_sale)}%</div>
        )}

        <img
          src={
            product.thumbnail
              ? `http://127.0.0.1:8000/images/products/${product.thumbnail}`
              : "/images/placeholder.jpg"
          }
          alt={product.name}
          className="card-img-top rounded"
          style={{ height: "230px", objectFit: "cover" }}
          onError={(e) => (e.target.src = "/images/placeholder.jpg")}
        />

        <div className="card-body d-flex flex-column">
          <h6 className="card-title fw-bold mb-2 text-dark">
            {product.name?.length > 50
              ? `${product.name.substring(0, 50)}...`
              : product.name}
          </h6>

          <p className="small text-muted mb-2">
            Còn lại:{" "}
            {product.qty > 0 ? (
              <span className="text-success fw-semibold">{product.qty}</span>
            ) : (
              <span className="text-danger fw-semibold">Hết hàng</span>
            )}
          </p>

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
        </div>
      </div>
    </div>
  );

  // ✅ Loading / Error / Empty
  if (loading)
    return (
      <div className="container py-5 text-center">
        <div
          className="spinner-border text-primary"
          style={{ width: "3rem", height: "3rem" }}
        />
        <p className="mt-3">Đang tìm kiếm sản phẩm...</p>
      </div>
    );

  if (error)
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center">
          <h5 className="alert-heading">Lỗi!</h5>
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

  return (
    <main className="container py-5">
      <h2 className="fw-bold text-center mb-4">
        Kết quả tìm kiếm cho:{" "}
        <span className="text-danger">"{keyword}"</span>
      </h2>

      {products.length > 0 ? (
        <div className="row">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="alert alert-info text-center py-4">
          Không tìm thấy sản phẩm nào.
        </div>
      )}
    </main>
  );
};

export default Search;
