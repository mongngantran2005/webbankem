import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import banner1 from "../../assets/shop/images/banner1.jpg";
import banner2 from "../../assets/shop/images/banner2.jpg";
import banner3 from "../../assets/shop/images/banner3.jpg";

const Home = () => {
  const [saleProducts, setSaleProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [savedDiscounts, setSavedDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  // 🔹 Lấy dữ liệu sản phẩm & mã giảm giá
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const resProducts = await axios.get("http://127.0.0.1:8000/api/products");
        const allProductsData = resProducts.data.data || [];
        setAllProducts(allProductsData);

        const saleList = allProductsData
          .filter((p) => p.price_sale && p.price_sale < p.price_root)
          .slice(0, 8);

        const newList = [...allProductsData]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 8);

        setSaleProducts(saleList);
        setNewProducts(newList);

        const resDiscounts = await axios.get("http://127.0.0.1:8000/api/discounts");
        const data = resDiscounts.data;
        let discountList = [];
        if (Array.isArray(data)) discountList = data;
        else if (Array.isArray(data.data)) discountList = data.data;
        else if (Array.isArray(data.discounts)) discountList = data.discounts;

        const now = new Date();
        discountList = discountList.filter((d) => !d.end_date || new Date(d.end_date) >= now);
        setDiscounts(discountList);
      } catch (err) {
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🔹 Lấy danh mục
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCategories(data.data);
      })
      .catch((err) => console.error("Lỗi khi load category:", err));
  }, []);

  const formatPrice = (price) => Number(price || 0).toLocaleString("vi-VN");
  const calculateDiscount = (root, sale) => Math.round((1 - sale / root) * 100);
  const handleProductClick = (id) => navigate(`/product-detail/${id}`);

  const handleSaveDiscount = async (discount) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("🚫 Bạn cần đăng nhập để lưu mã giảm giá!");
    if (savedDiscounts.includes(discount.id)) return alert("⚠️ Mã này đã được lưu!");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/user/discounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ discount_id: discount.id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(`✅ ${data.message}`);
        setSavedDiscounts((prev) => [...prev, discount.id]);
      } else {
        alert(`⚠️ ${data.message || "Không thể lưu mã giảm giá."}`);
      }
    } catch {
      alert("❌ Có lỗi xảy ra khi lưu mã giảm giá.");
    }
  };

  // ✅ Hàm lọc tổng hợp áp dụng cho tất cả danh sách
const applyFilters = () => {
  const min = parseFloat(minPrice) || 0;
  const max = parseFloat(maxPrice) || Infinity;

  const result = allProducts.filter((p) => {
    const price = p.price_sale && p.price_sale < p.price_root ? p.price_sale : p.price_root;
    const inPriceRange = price >= min && price <= max;
    const inCategory = selectedCategory ? Number(p.category_id) === Number(selectedCategory) : true;
    return inPriceRange && inCategory;
  });

  setFilteredProducts(result);
};


  // ✅ Khi thay đổi danh mục, tự động áp dụng bộ lọc
  const handleFilterByCategory = (catId) => {
    setSelectedCategory(catId);
  };

  // ✅ Khi thay đổi min/max price hoặc category thì tự cập nhật filter
  useEffect(() => {
    applyFilters();
  }, [minPrice, maxPrice, selectedCategory, allProducts]);

const clearFilters = () => {
  setFilteredProducts([]);
  setMinPrice("");
  setMaxPrice("");
  setSelectedCategory(null);
};


  const ProductCard = ({ product, isSale = false }) => (
    <div className="col-md-6 col-lg-3 mb-4">
      <div
        className="card h-100 product-card"
        onClick={() => handleProductClick(product.id)}
        style={{ cursor: "pointer" }}
      >
        {isSale && (
          <div className="discount-badge">
            -{calculateDiscount(product.price_root, product.price_sale)}%
          </div>
        )}
        <img
          src={product.thumbnail || "/images/placeholder.jpg"}
          alt={product.name}
          className="card-img-top"
          style={{ height: "200px", objectFit: "cover" }}
          onError={(e) => (e.target.src = "/images/placeholder.jpg")}
        />
        <div className="card-body text-center">
          <h6 className="fw-bold mb-2">
            {product.name?.length > 40 ? `${product.name.slice(0, 40)}...` : product.name}
          </h6>
          <div>
            {product.price_sale && product.price_sale < product.price_root ? (
              <>
                <span className="text-muted text-decoration-line-through me-2 small">
                  {formatPrice(product.price_root)}₫
                </span>
                <span className="text-danger fw-bold">{formatPrice(product.price_sale)}₫</span>
              </>
            ) : (
              <span className="fw-bold text-primary">
                {formatPrice(product.price_sale || product.price_root)}₫
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-danger" />
        <p className="mt-3">Đang tải dữ liệu...</p>
      </div>
    );

  if (error)
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center">{error}</div>
      </div>
    );

  return (
    <main className="home-container-fluid">
      <div className="row g-4">
        {/* 🍡 Bộ lọc */}
        <div className="col-lg-3">
          <div className="p-3 bg-white rounded shadow-sm">
            <h5 className="fw-bold mb-3 text-danger">🍡 Bộ lọc</h5>

            <div>
              <strong>Danh mục</strong>
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <div key={cat.id}>
                    <input
  type="radio"
  name="category"
  id={`cat-${cat.id}`}
  onChange={() => handleFilterByCategory(cat.id)}
  checked={Number(selectedCategory) === Number(cat.id)}
/>

                    <label htmlFor={`cat-${cat.id}`} className="ms-2">
                      {cat.name}
                    </label>
                  </div>
                ))
              ) : (
                <div className="text-muted small">Đang tải danh mục...</div>
              )}
            </div>

            <div className="mt-3">
              <strong>Khoảng giá</strong>
              <input
                type="number"
                className="form-control mb-2"
                placeholder="Từ ₫"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <input
                type="number"
                className="form-control mb-3"
                placeholder="Đến ₫"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
              <div className="d-flex gap-2">
                <button className="btn btn-danger flex-fill" onClick={applyFilters}>
                  Áp dụng
                </button>
                <button className="btn btn-secondary flex-fill" onClick={clearFilters}>
                  Xóa lọc
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 🖼 Banner */}
        <div className="col-lg-7">
          <section>
            <div id="bannerCarousel" className="carousel slide mb-4" data-bs-ride="carousel">
              <div className="carousel-inner rounded shadow-sm">
                {[banner1, banner2, banner3].map((src, i) => (
                  <div key={i} className={`carousel-item ${i === 0 ? "active" : ""}`}>
                    <img
                      src={src}
                      className="d-block w-100"
                      alt={`Banner ${i + 1}`}
                      style={{
                        height: "350px",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                  </div>
                ))}
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#bannerCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#bannerCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
              <div className="carousel-indicators">
                {[0, 1, 2].map((i) => (
                  <button
                    key={i}
                    type="button"
                    data-bs-target="#bannerCarousel"
                    data-bs-slide-to={i}
                    className={i === 0 ? "active" : ""}
                  />
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* 🎟️ Mã giảm giá */}
        <div className="col-lg-2">
          <div className="p-3 shadow-sm rounded bg-white discount-sidebar">
            <h5 className="fw-bold mb-3 text-center text-danger">🎟️ Mã giảm giá</h5>
            {discounts.length ? (
              discounts.map((d) => (
                <div
                  key={d.id}
                  className="mb-3 p-2 border border-danger-subtle rounded"
                  style={{ background: "#fff8f8" }}
                >
                  <div className="fw-bold text-danger mb-1">
                    {d.type === "percent"
                      ? `Giảm ${d.value}%`
                      : `Giảm ${Number(d.value).toLocaleString("vi-VN")}₫`}
                  </div>
                  <div className="small text-muted">
                    Đơn tối thiểu:{" "}
                    {d.min_order_amount
                      ? `${Number(d.min_order_amount).toLocaleString("vi-VN")}₫`
                      : "-"}
                  </div>
                  <div className="small text-secondary mb-2">
                    Hết hạn: {d.end_date?.slice(0, 10) || "Không"}
                  </div>
                  <button
                    className={`btn btn-sm w-100 ${
                      savedDiscounts.includes(d.id) ? "btn-success" : "btn-danger"
                    }`}
                    onClick={() => handleSaveDiscount(d)}
                    disabled={savedDiscounts.includes(d.id)}
                  >
                    {savedDiscounts.includes(d.id) ? "✅ Đã lưu" : "Lưu mã"}
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-muted">Không có mã giảm giá.</p>
            )}
          </div>
        </div>
      </div>

      {/* 🔸 Tabs sản phẩm */}
     {/* 🔸 Tabs sản phẩm */}
<div className="product-tabs mt-5 px-3">
  <ul className="nav nav-tabs justify-content-center" id="productTabs" role="tablist">
        <li className="nav-item" role="presentation">
      <button className="nav-link fw-bold" data-bs-toggle="tab" data-bs-target="#all-products">
        🛍️ Tất cả sản phẩm
      </button>
    </li>
    <li className="nav-item" role="presentation">
      <button className="nav-link active fw-bold" data-bs-toggle="tab" data-bs-target="#new-products">
        🆕 Sản phẩm mới
      </button>
    </li>
    <li className="nav-item" role="presentation">
      <button className="nav-link fw-bold" data-bs-toggle="tab" data-bs-target="#sale-products">
        💸 Sản phẩm giảm giá
      </button>
    </li>
  </ul>

  <div className="tab-content py-4">
    {/* 🛍️ Tất cả sản phẩm (có lọc) */}
    <div className="tab-pane fade" id="all-products">
      <div className="row">
        {(filteredProducts.length ? filteredProducts : allProducts).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
    {/* 🆕 Sản phẩm mới */}
    <div className="tab-pane fade show active" id="new-products">
      <div className="row">
        {newProducts.length > 0 ? (
          newProducts.map((p) => <ProductCard key={p.id} product={p} />)
        ) : (
          <p className="text-center text-muted">Không có sản phẩm mới.</p>
        )}
      </div>
    </div>

    {/* 💸 Sản phẩm giảm giá */}
    <div className="tab-pane fade" id="sale-products">
      <div className="row">
        {saleProducts.length > 0 ? (
          saleProducts.map((p) => <ProductCard key={p.id} product={p} isSale />)
        ) : (
          <p className="text-center text-muted">Không có sản phẩm giảm giá.</p>
        )}
      </div>
    </div>
  </div>
</div>

    </main>
  );
};

export default Home;
