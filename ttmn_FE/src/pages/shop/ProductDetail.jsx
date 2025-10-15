import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCart, saveCart } from "../../api/apiUser";
import ProductReview from "./ProductReview"; // ✅ thêm dòng này

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [qtyInput, setQtyInput] = useState(1);

  // ✅ Hàm xử lý URL ảnh
  const getImageUrl = (thumbnail) => {
    if (!thumbnail) return "/images/placeholder.jpg";
    if (thumbnail.startsWith("http://") || thumbnail.startsWith("https://"))
      return thumbnail;
    if (thumbnail.startsWith("/")) return `http://127.0.0.1:8000${thumbnail}`;
    return `http://127.0.0.1:8000/uploads/products/${thumbnail}`;
  };

  // ✅ Lấy chi tiết sản phẩm
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://127.0.0.1:8000/api/products/${id}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.data);
          fetchRelated(data.data.category_id);
        }
      } catch (err) {
        console.error("Lỗi:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // ✅ Lấy sản phẩm liên quan
  const fetchRelated = async (catId) => {
    try {
      setRelatedLoading(true);
      const res = await fetch("http://127.0.0.1:8000/api/products");
      const data = await res.json();
      if (data.success) {
        const rel = data.data
          .filter((p) => p.category_id === catId && p.id !== parseInt(id))
          .slice(0, 4);
        setRelatedProducts(rel);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRelatedLoading(false);
    }
  };

  // ✅ Thêm sản phẩm vào giỏ
  const handleAddToCart = () => {
    if (!product) return;
    if (qtyInput < 1) {
      alert("Vui lòng chọn số lượng hợp lệ!");
      return;
    }

    // 🔒 Kiểm tra đăng nhập
    const token = localStorage.getItem("token");
    if (!token) {
      alert("⚠️ Vui lòng đăng nhập trước khi thêm sản phẩm vào giỏ hàng!");
      navigate("/login");
      return;
    }

    // ✅ Nếu đã đăng nhập → thêm vào giỏ riêng của user
    setAddingToCart(true);

    const cart = getCart(); // 🟢 lấy đúng giỏ hàng theo user hiện tại
    const exists = cart.find((i) => i.id === product.id);
    let newCart;

    if (exists) {
      newCart = cart.map((i) =>
        i.id === product.id ? { ...i, qty: i.qty + qtyInput } : i
      );
    } else {
      newCart = [...cart, { ...product, qty: qtyInput }];
    }

    saveCart(newCart); // 🟢 lưu lại vào localStorage theo user

    setTimeout(() => {
      setAddingToCart(false);
      alert(`✅ Đã thêm ${qtyInput} sản phẩm vào giỏ hàng!`);
    }, 300);
  };

  // ✅ Hàm định dạng giá
  const format = (p) => Number(p || 0).toLocaleString("vi-VN");
  const discount = product
    ? Math.round((1 - product.price_sale / product.price_root) * 100)
    : 0;

  // ✅ Giao diện loading
  if (loading)
    return (
      <div className="loading text-center py-5">
        <div className="spinner-border text-danger"></div>
        <p>Đang tải sản phẩm...</p>
      </div>
    );

  // ✅ Nếu không tìm thấy sản phẩm
  if (!product)
    return (
      <div className="empty text-center py-5">
        <h4>Không tìm thấy sản phẩm</h4>
        <button onClick={() => navigate("/")} className="btn btn-danger mt-3">
          Quay về
        </button>
      </div>
    );

  return (
    <div className="product-detail container py-5">
      <div className="row">
        {/* ✅ Ảnh chính */}
        <div className="col-md-6 text-center">
          <div className="image-box position-relative">
            <img
              src={getImageUrl(product.thumbnail)}
              alt={product.name || "Ảnh sản phẩm"}
              className="main-img img-fluid rounded shadow-sm"
              onError={(e) => {
                e.target.src = "/images/placeholder.jpg";
              }}
            />

            {discount > 0 && (
              <span className="badge bg-danger position-absolute top-0 start-0 m-3">
                -{discount}%
              </span>
            )}
          </div>
        </div>

        {/* ✅ Thông tin sản phẩm */}
        <div className="col-md-6">
          <h2 className="fw-bold">{product.name}</h2>
          <p className="text-muted mb-2">
            Tình trạng:{" "}
            <span className={product.qty > 0 ? "text-success" : "text-danger"}>
              {product.qty > 0 ? "Còn hàng" : "Hết hàng"}
            </span>
          </p>

          {product.qty > 0 && (
            <p className="text-secondary mb-3">
              Còn lại:{" "}
              <span className="fw-semibold text-dark">
                {product.qty} sản phẩm
              </span>
            </p>
          )}

          <div className="price-block mb-3">
            {product.price_sale < product.price_root ? (
              <>
                <span className="text-muted text-decoration-line-through me-2">
                  {format(product.price_root)}₫
                </span>
                <span className="text-danger fs-4 fw-bold">
                  {format(product.price_sale)}₫
                </span>
              </>
            ) : (
              <span className="text-danger fs-4 fw-bold">
                {format(product.price_root)}₫
              </span>
            )}
          </div>

          {product.description && (
            <p className="text-secondary">{product.description}</p>
          )}

          {/* ✅ Số lượng */}
          {product.qty > 0 && (
            <div className="d-flex align-items-center gap-3 my-3">
              <label htmlFor="qty" className="fw-semibold">
                Số lượng:
              </label>
              <input
                id="qty"
                type="number"
                className="form-control"
                style={{ width: "90px" }}
                min="1"
                max={product.qty}
                value={qtyInput}
                onChange={(e) => setQtyInput(Number(e.target.value))}
              />
            </div>
          )}

          {/* ✅ Nút hành động */}
          <div className="buttons mt-4 d-flex gap-3">
            <button
              className="btn btn-outline-danger px-4"
              disabled={addingToCart || product.qty === 0}
              onClick={handleAddToCart}
            >
              {addingToCart ? "Đang thêm..." : "🛒 Thêm vào giỏ hàng"}
            </button>
            <button
              className="btn btn-danger px-4"
              disabled={product.qty === 0}
              onClick={() =>
                navigate("/checkout", {
                  state: { product: { ...product, qty: qtyInput } },
                })
              }
            >
              Mua ngay
            </button>
          </div>

          <div className="shipping mt-4 text-secondary small">
            <p>✓ Miễn phí giao hàng cho đơn từ 300.000₫</p>
            <p>✓ Giao hàng toàn quốc trong 2–4 ngày</p>
            <p>✓ Đổi trả trong 7 ngày</p>
          </div>
        </div>
      </div>

      {/* ✅ Sản phẩm liên quan */}
      <div className="related mt-5">
        <h4 className="fw-bold mb-3">Sản phẩm liên quan</h4>
        {relatedLoading ? (
          <div className="text-center py-3">Đang tải...</div>
        ) : (
          <div className="row mt-3">
            {relatedProducts.map((p) => (
              <div
                className="col-6 col-md-3 mb-4"
                key={p.id}
                onClick={() => navigate(`/product-detail/${p.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="card h-100 border-0 shadow-sm hover-shadow">
                  <img
                    src={getImageUrl(p.thumbnail)}
                    alt={p.name}
                    className="card-img-top rounded"
                    onError={(e) => (e.target.src = "/images/placeholder.jpg")}
                  />
                  <div className="card-body text-center">
                    <p className="fw-semibold mb-1">{p.name}</p>
                    <p className="text-danger fw-bold mb-0">
                      {format(p.price_sale || p.price_root)}₫
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ⭐ Đánh giá sản phẩm */}
      <div className="mt-5">
        <ProductReview productId={product.id} canReview={true} />
      </div>
    </div>
  );
}

export default ProductDetail;
