import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // --- Helper: cart key theo user ---
  const getCartKey = (userObj = null) => {
    const u = userObj ?? JSON.parse(localStorage.getItem("user"));
    return u ? `cart_${u.id}` : "cart_guest";
  };

  // --- Cập nhật cartCount (tổng qty) dựa trên user hiện tại ---
  const updateCartCount = (userObj = null) => {
    try {
      const key = getCartKey(userObj);
      const cart = JSON.parse(localStorage.getItem(key)) || [];
      // tính tổng số lượng (qty) — fallback qty = 1 nếu không có
      const count = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
      setCartCount(count);
    } catch (err) {
      setCartCount(0);
      console.error("Error reading cart from localStorage:", err);
    }
  };

  // --- Load user & cart lần đầu ---
  const loadUserAndCart = () => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    setUser(parsedUser);
    updateCartCount(parsedUser);
  };

  // Khi mount: load category, user & cart, đăng ký listener
  useEffect(() => {
    loadUserAndCart();

    // Lấy danh mục
    fetch("http://127.0.0.1:8000/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCategories(data.data);
      })
      .catch((err) => console.error("Lỗi khi load category:", err));

    // Khi localStorage thay đổi ở tab khác -> storage event
    const onStorage = (e) => {
      // nếu thay đổi liên quan tới cart_* hoặc user -> reload
      if (!e.key) {
        // clear() gọi, just reload
        loadUserAndCart();
        return;
      }
      if (e.key.startsWith("cart_") || e.key === "user" || e.key === "token" || e.key === "cart_guest") {
        loadUserAndCart();
      }
    };

    // custom events (sử dụng trong cùng tab): 'cartUpdated' và 'userChanged'
    const onCartUpdated = () => updateCartCount();
    const onUserChanged = () => loadUserAndCart();

    window.addEventListener("storage", onStorage);
    window.addEventListener("cartUpdated", onCartUpdated);
    window.addEventListener("userChanged", onUserChanged);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("cartUpdated", onCartUpdated);
      window.removeEventListener("userChanged", onUserChanged);
    };
  }, []);

  // Khi route thay đổi (ví dụ redirect sau login), refresh user & cart để luôn đồng bộ
  useEffect(() => {
    loadUserAndCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleLogout = () => {
    // Xóa user & token (không xóa cart của user)
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Cập nhật state sang guest và load cart_guest
    setUser(null);
    updateCartCount(null);

    // Emit custom events để component khác (Cart, ProductAdd...) cập nhật
    window.dispatchEvent(new Event("userChanged"));
    window.dispatchEvent(new Event("cartUpdated"));

    navigate("/");
  };

  // Tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim() !== "") {
      navigate(`/search/${keyword}`);
      setKeyword("");
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* ==== HEADER ==== */}
      <header className="header bg-white border-bottom shadow-sm">
        <div className="container d-flex align-items-center justify-content-between py-2 flex-wrap">
          {/* LOGO */}
          <div className="logo">
            <Link to="/" className="text-decoration-none brand-text">
              🍦 iCream
            </Link>
          </div>

          {/* TÌM KIẾM */}
          <div className="search-container flex-grow-1 mx-4">
            <form onSubmit={handleSearch} className="search-form justify-content-center">
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm sản phẩm..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button type="submit" className="search-btn">
                🔍
              </button>
            </form>
          </div>

          {/* USER ACTIONS */}
          <div className="header-actions d-flex align-items-center gap-3">
            {user ? (
              <>
                <span className="text-dark">
  👋 Xin chào,{" "}
  <Link
    to="/account"
    className="text-decoration-none fw-bold"
    style={{ color: "#e91e63" }}
    title="Xem trang cá nhân"
  >
    {user.name}
  </Link>
</span>

                <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-primary btn-sm">
                  Đăng nhập
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Đăng ký
                </Link>
              </>
            )}

            {/* 🛒 Giỏ hàng */}
            <Link
              to="/cart"
              className="btn btn-outline-secondary btn-sm position-relative"
              title="Xem giỏ hàng"
            >
              🛒 Giỏ hàng
              {cartCount > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: "0.7rem" }}
                >
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* ==== BANNER ==== */}
      {!["/login", "/register"].includes(location.pathname) && (
        <>
          <div
            className="header-banner position-relative"
            style={{
              width: "100%",
              height: "380px",
              backgroundImage: "url('/src/assets/shop/images/header.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.3)",
              }}
            ></div>

            <div
              className="banner-text text-white text-center"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 2,
              }}
            >
              <h1 className="fw-bold display-5 text-uppercase" style={{ color: "#ff4081" }}>
                🍦 iCream – Sweet Every Moment
              </h1>
              <p className="lead">Hương vị tươi mát – Ngọt ngào từng phút giây</p>
            </div>
          </div>

          {/* PHẦN LỢI ÍCH */}
          <div className="benefits py-4 border-bottom bg-white">
            <div className="container d-flex justify-content-between align-items-center flex-wrap text-center">
              <div className="benefit-item d-flex align-items-center gap-2">
                <i className="bi bi-truck fs-3" style={{ color: "#e91e63" }}></i>
                <div>
                  <strong>Vận chuyển miễn phí</strong>
                  <div className="text-muted small">Cho đơn hàng &gt; 500.000đ</div>
                </div>
              </div>

              <div className="benefit-item d-flex align-items-center gap-2">
                <i className="bi bi-gift fs-3" style={{ color: "#e91e63" }}></i>
                <div>
                  <strong>Mua 2 được giảm giá</strong>
                  <div className="text-muted small">Lên đến 10% cho đơn hàng tiếp</div>
                </div>
              </div>

              <div className="benefit-item d-flex align-items-center gap-2">
                <i className="bi bi-award fs-3" style={{ color: "#e91e63" }}></i>
                <div>
                  <strong>Chứng nhận chất lượng</strong>
                  <div className="text-muted small">Sản phẩm kiểm định an toàn</div>
                </div>
              </div>

              <div className="benefit-item d-flex align-items-center gap-2">
                <i className="bi bi-headset fs-3" style={{ color: "#e91e63" }}></i>
                <div>
                  <strong>Hotline: 19002812</strong>
                  <div className="text-muted small">Hỗ trợ trực tiếp nhanh chóng</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* NAVIGATION */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
        <div className="container">
          <div className="navbar-nav mx-auto">
            <Link
              to="/about"
              className={`nav-link mx-3 ${isActive("/about") ? "active fw-bold" : ""}`}
              style={{ color: isActive("/about") ? "#e91e63" : "#333" }}
            >
              GIỚI THIỆU
            </Link>

            {/* DROPDOWN SẢN PHẨM */}
            <div className="nav-item dropdown mx-3">
              <Link
                to="/product"
                className={`nav-link dropdown-toggle ${
                  location.pathname.includes("/category") ? "fw-bold" : ""
                }`}
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{
                  color: location.pathname.includes("/category") ? "#e91e63" : "#333",
                }}
              >
                SẢN PHẨM
              </Link>

              <ul className="dropdown-menu">
                <li>
                  <Link to="/product" className="dropdown-item">
                    🌟 Tất cả sản phẩm
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>

                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <li key={cat.id}>
                      <Link to={`/category/${cat.id}`} className="dropdown-item">
                        {cat.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="dropdown-item text-muted">Đang tải...</li>
                )}
              </ul>
            </div>

            <Link
              to="/contact"
              className={`nav-link mx-3 ${isActive("/contact") ? "fw-bold" : ""}`}
              style={{ color: isActive("/contact") ? "#e91e63" : "#333" }}
            >
              LIÊN HỆ
            </Link>

            <Link
              to="/news"
              className={`nav-link mx-3 ${isActive("/news") ? "fw-bold" : ""}`}
              style={{ color: isActive("/news") ? "#e91e63" : "#333" }}
            >
              TIN TỨC
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
