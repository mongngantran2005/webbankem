import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const [saleProducts, setSaleProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ Lấy sản phẩm
        const resProducts = await axios.get("http://127.0.0.1:8000/api/products");
        const allProducts = resProducts.data.data || [];

        const saleProducts = allProducts
          .filter(p => p.price_sale && p.price_sale < p.price_root)
          .slice(0, 8);

        const newProducts = [...allProducts]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 8);

        setSaleProducts(saleProducts);
        setNewProducts(newProducts);

        // ✅ Lấy mã giảm giá
        const resDiscounts = await axios.get("http://127.0.0.1:8000/api/discounts");
        const discountData =
          Array.isArray(resDiscounts.data)
            ? resDiscounts.data
            : resDiscounts.data.data || [];
        setDiscounts(discountData);
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatPrice = price => Number(price || 0).toLocaleString("vi-VN");
  const calculateDiscount = (root, sale) =>
    Math.round((1 - sale / root) * 100);

  const handleProductClick = id => navigate(`/product-detail/${id}`);

  const ProductCard = ({ product, isSale = false }) => (
    <div className="col-md-6 col-lg-4 col-xl-3 mb-4">
      <div
        className="card h-100 product-card"
        onClick={() => handleProductClick(product.id)}
        style={{ cursor: "pointer" }}
      >
        {isSale && product.price_sale < product.price_root && (
          <div className="discount-badge">
            -{calculateDiscount(product.price_root, product.price_sale)}%
          </div>
        )}

        <img
          src={product.thumbnail || "/images/placeholder.jpg"}
          alt={product.name}
          className="card-img-top"
          style={{ height: "200px", objectFit: "cover" }}
          onError={e => (e.target.src = "/images/placeholder.jpg")}
        />

        <div className="card-body d-flex flex-column">
          <h6 className="fw-bold mb-2">
            {product.name?.length > 40
              ? `${product.name.substring(0, 40)}...`
              : product.name}
          </h6>
          <div className="mt-auto">
            {product.price_sale && product.price_sale < product.price_root ? (
              <>
                <span className="text-muted text-decoration-line-through me-2 small">
                  {formatPrice(product.price_root)}₫
                </span>
                <span className="text-danger fw-bold">
                  {formatPrice(product.price_sale)}₫
                </span>
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
      <div className="container mt-5 text-center">
        <div
          className="spinner-border text-primary"
          style={{ width: "3rem", height: "3rem" }}
        />
        <p className="mt-3">Đang tải dữ liệu...</p>
      </div>
    );

  if (error)
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center">
          <p>{error}</p>
        </div>
      </div>
    );

  return (
    <main className="container mt-4">
      <div className="row">
        {/* 🟢 PHẦN TRÁI: Sản phẩm */}
        <div className="col-lg-8">
          {/* 🔥 Sản phẩm giảm giá */}
          <section className="mb-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="text-danger fw-bold">
                🔥 Sản phẩm giảm giá
              </h4>
              {saleProducts.length > 0 && (
                <Link to="/products/sale" className="btn btn-outline-danger btn-sm">
                  Xem tất cả
                </Link>
              )}
            </div>
            <div className="row">
              {saleProducts.length > 0 ? (
                saleProducts.map(p => (
                  <ProductCard key={p.id} product={p} isSale />
                ))
              ) : (
                <div className="alert alert-info text-center">Không có sản phẩm giảm giá.</div>
              )}
            </div>
          </section>

          {/* 🆕 Sản phẩm mới */}
          <section>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="text-success fw-bold">🆕 Sản phẩm mới</h4>
              {newProducts.length > 0 && (
                <Link to="/products/new" className="btn btn-outline-success btn-sm">
                  Xem tất cả
                </Link>
              )}
            </div>
            <div className="row">
              {newProducts.length > 0 ? (
                newProducts.map(p => <ProductCard key={p.id} product={p} />)
              ) : (
                <div className="alert alert-info text-center">Không có sản phẩm mới.</div>
              )}
            </div>
          </section>
        </div>

        {/* 🟣 PHẦN PHẢI: Mã giảm giá */}
        <div className="col-lg-4">
  <div className="discount-sidebar p-3 shadow-sm rounded bg-white">
    <h5 className="fw-bold mb-3 text-center text-danger">🎟️ Mã giảm giá</h5>

    {discounts.length > 0 ? (
      <div className="discount-list">
        {discounts.map((d) => (
          <div key={d.id} className="discount-card d-flex mb-3">
            {/* Bên trái thông tin */}
            <div className="flex-grow-1 px-3 py-2 border-end">
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
              {d.max_discount && (
                <div className="small text-muted">
                  Giảm tối đa:{" "}
                  {Number(d.max_discount).toLocaleString("vi-VN")}₫
                </div>
              )}
              <div className="small text-secondary">
                HSD: {d.end_date ? d.end_date.slice(0, 10) : "-"}
              </div>
            </div>

            {/* Bên phải nút Lưu */}
            <div className="p-2 d-flex flex-column align-items-center justify-content-center bg-light">
              <button
                className="btn btn-danger btn-sm px-3"
                onClick={() => {
                  localStorage.setItem("selectedDiscount", JSON.stringify(d));
                  alert(`✅ Đã lưu mã: ${d.code}`);
                }}
              >
                Lưu
              </button>
              <div className="small mt-1 fw-bold text-uppercase text-secondary">
                {d.code}
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-center text-muted">Không có mã giảm giá.</p>
    )}
  </div>

  <style>{`
    .discount-card {
      background: #fff5f5;
      border: 1px dashed #f15b5b;
      border-radius: 10px;
      overflow: hidden;
      transition: all 0.2s ease;
    }

    .discount-card:hover {
      transform: scale(1.02);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .discount-sidebar {
      max-height: 80vh;
      overflow-y: auto;
    }

    .discount-sidebar::-webkit-scrollbar {
      width: 6px;
    }

    .discount-sidebar::-webkit-scrollbar-thumb {
      background-color: #f15b5b55;
      border-radius: 3px;
    }
  `}</style>
</div>

      </div>
    </main>
  );
};

export default Home;
