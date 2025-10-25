import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ProductsByCat = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Xử lý ảnh thống nhất
  const getImageUrl = (thumbnail) => {
    if (!thumbnail) return "/images/placeholder.jpg";
    if (thumbnail.startsWith("http://") || thumbnail.startsWith("https://"))
      return thumbnail;
    if (thumbnail.startsWith("/"))
      return `http://127.0.0.1:8000${thumbnail}`;
    return `http://127.0.0.1:8000/uploads/products/${thumbnail}`;
  };

  // ✅ Lấy danh mục
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/categories/${id}`)
      .then((res) => setCategory(res.data.data || null))
      .catch(() => setCategory(null));
  }, [id]);

  // ✅ Lấy danh sách brand theo category
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/categories/${id}/brands`)
      .then((res) => setBrands(res.data.data || []))
      .catch(() => setBrands([]));
  }, [id]);

  // ✅ Lấy danh sách sản phẩm trong category
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(
          `http://127.0.0.1:8000/api/products/category/${id}?include=brand`
        );
        setProducts(res.data.data || []);
      } catch (err) {
        setError("Không thể tải sản phẩm.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [id]);

  // ✅ Lọc sản phẩm theo brand
  const filteredProducts =
    selectedBrand === "all"
      ? products
      : products.filter((p) => {
          if (!p.brand) return false;
          const brandId = p.brand.id || p.brand;
          return brandId == selectedBrand;
        });

  // ✅ Format tiền + giảm giá
  const formatPrice = (price) => Number(price || 0).toLocaleString("vi-VN");
  const calculateDiscount = (root, sale) =>
    Math.round((1 - sale / root) * 100);

  // ✅ Xem chi tiết
  const handleProductClick = (productId) =>
    navigate(`/product-detail/${productId}`);

  // ✅ Thêm vào giỏ hàng
  const addToCart = (product, e) => {
    e.stopPropagation();
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

  // ✅ Component sản phẩm
  const ProductCard = ({ product }) => (
    <div className="col-md-3 col-6 mb-4">
      <div
        className="card h-100 shadow-sm product-card"
        onClick={() => handleProductClick(product.id)}
        style={{ cursor: "pointer" }}
      >
        <div className="position-relative">
          <img
            src={getImageUrl(product.thumbnail)}
            className="card-img-top"
            alt={product.name}
            style={{ height: "220px", objectFit: "cover" }}
            onError={(e) => (e.target.src = "/images/placeholder.jpg")}
          />
          {product.price_sale && product.price_sale < product.price_root && (
            <span className="badge bg-danger position-absolute top-0 start-0 m-2">
              -{calculateDiscount(product.price_root, product.price_sale)}%
            </span>
          )}
        </div>

        <div className="card-body d-flex flex-column">
          <h6 className="fw-bold mb-2">
            {product.name?.length > 50
              ? `${product.name.substring(0, 50)}...`
              : product.name}
          </h6>
          <p className="text-muted small mb-2">
            {product.brand?.name || "Không có thương hiệu"}
          </p>

          <div className="mt-auto">
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

  // ✅ Trạng thái loading / lỗi
  if (loading)
    return (
      <div className="container text-center mt-5">
        <div
          className="spinner-border text-primary"
          style={{ width: "3rem", height: "3rem" }}
        ></div>
        <p className="mt-3 fs-5">Đang tải sản phẩm...</p>
      </div>
    );

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

  // ✅ Giao diện chính
  return (
    <main className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary mb-0">
          <i className="fas fa-box-open me-2"></i>
          {category?.name?.toUpperCase() || "SẢN PHẨM THEO DANH MỤC"}
        </h2>

        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="form-select"
          style={{ width: "300px" }}
        >
          <option value="all">Tất cả thương hiệu</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="row">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="alert alert-info text-center py-4">
          <i className="fas fa-info-circle me-2"></i>
          Không có sản phẩm phù hợp.
        </div>
      )}
    </main>
  );
};

export default ProductsByCat;
