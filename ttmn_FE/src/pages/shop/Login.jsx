import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Xử lý đăng nhập
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password,
      });

      if (res.data.success) {
        // Lưu thông tin người dùng & token
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // 🔥 Gửi sự kiện để Header cập nhật ngay
        window.dispatchEvent(new Event("userChanged"));

        alert("🎉 Đăng nhập thành công!");
        navigate("/");
      } else {
        setError("Sai email hoặc mật khẩu!");
      }
    } catch (err) {
      console.error(err);
      setError("❌ Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div className="card shadow-lg p-4" style={{ width: "400px" }}>
        <div className="card-header bg-primary text-white text-center rounded">
          <h4 className="mb-0">Đăng nhập</h4>
        </div>

        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Nhập email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Mật khẩu</label>
              <input
                type="password"
                className="form-control"
                placeholder="Nhập mật khẩu..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 mt-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Đang đăng nhập...
                </>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </form>

          <div className="text-center mt-3">
            <Link to="/register" className="text-decoration-none">
              Chưa có tài khoản? <strong>Đăng ký ngay</strong>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
