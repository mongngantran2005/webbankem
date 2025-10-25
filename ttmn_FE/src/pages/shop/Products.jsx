import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [applyFilter, setApplyFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ✅ Hàm xử lý URL ảnh
  const getImageUrl = (thumbnail) => {
    if (!thumbnail) return "/images/placeholder.jpg";
    if (thumbnail.startsWith("http://") || thumbnail.startsWith("https://")) return thumbnail;
    if (thumbnail.startsWith("/")) return `http://127.0.0.1:8000${thumbnail}`;
    return `http://127.0.0.1:8000/uploads/products/${thumbnail}`;
  };

  // ✅ Lấy danh mục
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/categories")
      .then((res) => setCategories(res.data.data || []))
      .catch(() => setCategories([]));
  }, []);

  // ✅ Lấy thương hiệu
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/brands")
      .then((res) => setBrands(res.data.data || []))
      .catch(() => setBrands([]));
  }, []);

  // ✅ Lấy sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://127.0.0.1:8000/api/products?include=brand,category");
        if (response.data.success) setProducts(response.data.data);
        else setError("Không thể tải danh sách sản phẩm.");
      } catch (err) {
        console.error(err);
        setError("Không thể kết nối đến máy chủ.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ✅ Định dạng tiền
  const formatPrice = (price) => Number(price || 0).toLocaleString("vi-VN");
  const calculateDiscount = (priceRoot, priceSale) => Math.round((1 - priceSale / priceRoot) * 100);

  const handleProductClick = (id) => navigate(`/product-detail/${id}`);

  // ✅ Giỏ hàng
  const addToCart = (product, e) => {
    e.stopPropagation();
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item.id === product.id);
    if (existing) existing.quantity += 1;
    else
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price_sale || product.price_root,
        image: getImageUrl(product.thumbnail),
        quantity: 1,
      });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`✅ Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  // ✅ Lọc sản phẩm
  const filteredProducts = products.filter((p) => {
    const matchCategory = selectedCategory === "all" || p.category_id == selectedCategory;
    const matchBrand =
      selectedBrand === "all" ||
      (p.brand && (p.brand.id == selectedBrand || p.brand_id == selectedBrand));

    const price = p.price_sale || p.price_root;
    const matchMin = !minPrice || price >= parseFloat(minPrice);
    const matchMax = !maxPrice || price <= parseFloat(maxPrice);

    return matchCategory && matchBrand && matchMin && matchMax;
  });

  // ✅ Reset bộ lọc
  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedBrand("all");
    setMinPrice("");
    setMaxPrice("");
    setApplyFilter(false);
  };

  // ✅ Khi bấm "Áp dụng"
  const applyPriceFilter = () => {
    setApplyFilter(true);
  };

  // ✅ Component thẻ sản phẩm
  const ProductCard = ({ product }) => (
    <div className="col-md-3 col-6 mb-4">
      <div
        className="card h-100 product-card shadow-sm border-0"
        onClick={() => handleProductClick(product.id)}
        style={{ cursor: "pointer" }}
      >
        <div className="position-relative">
          <img
            src={getImageUrl(product.thumbnail)}
            className="card-img-top rounded-top"
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
          <h6 className="card-title fw-bold product-name">
            {product.name?.length > 50 ? `${product.name.substring(0, 50)}...` : product.name}
          </h6>

          <p className="text-muted small mb-2">{product.brand?.name || "Không có thương hiệu"}</p>

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

          <button className="btn btn-sm btn-outline-primary mt-3" onClick={(e) => addToCart(product, e)}>
            <i className="fas fa-cart-plus me-2"></i>Thêm vào giỏ
          </button>
        </div>
      </div>
    </div>
  );

  // ✅ Loading / Error
  if (loading)
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }}></div>
        <p className="mt-3 fs-5">Đang tải sản phẩm...</p>
      </div>
    );

  if (error)
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center" role="alert">
          <h4 className="alert-heading">Lỗi!</h4>
          <p>{error}</p>
          <button className="btn btn-outline-danger" onClick={() => window.location.reload()}>
            Thử lại
          </button>
        </div>
      </div>
    );

  return (
    <main className="container mt-5">
      <h2 className="text-primary mb-4">
        <i className="fas fa-box-open me-2"></i>TẤT CẢ SẢN PHẨM
      </h2>

      {/* 🔹 Bộ lọc nâng cao */}
      <div className="filter-bar bg-light rounded-3 shadow-sm p-3 d-flex flex-wrap gap-3 align-items-end mb-4">
        {/* Danh mục */}
        <div>
          <label className="form-label fw-semibold text-secondary mb-1">Danh mục</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-select"
            style={{ width: "200px" }}
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Thương hiệu */}
        <div>
          <label className="form-label fw-semibold text-secondary mb-1">Thương hiệu</label>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="form-select"
            style={{ width: "200px" }}
          >
            <option value="all">Tất cả thương hiệu</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Khoảng giá */}
        <div>
          <label className="form-label fw-semibold text-secondary mb-1">Khoảng giá (₫)</label>
          <div className="d-flex align-items-center gap-2">
            <input
              type="number"
              className="form-control"
              placeholder="Từ"
              style={{ width: "120px" }}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <span className="fw-bold text-secondary">-</span>
            <input
              type="number"
              className="form-control"
              placeholder="Đến"
              style={{ width: "120px" }}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>

        {/* Nút áp dụng và xóa lọc */}
        <div className="d-flex gap-2 mt-2">
          <button className="btn btn-danger px-3" onClick={applyPriceFilter}>
            <i className="fas fa-filter me-1"></i> Áp dụng
          </button>
          <button className="btn btn-outline-secondary px-3" onClick={resetFilters}>
            <i className="fas fa-times me-1"></i> Xóa lọc
          </button>
        </div>
      </div>

      <span className="text-muted small">Tổng cộng: {filteredProducts.length} sản phẩm</span>

      {filteredProducts.length > 0 ? (
        <div className="row mt-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="alert alert-info text-center py-4 mt-3">
          <i className="fas fa-info-circle me-2"></i>Không có sản phẩm phù hợp.
        </div>
      )}
    </main>
  );
};

export default Products;
