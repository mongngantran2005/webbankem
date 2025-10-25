import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
    address: "",
    birthday: "",
    gender: "Nam",
    avatar: null,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar" && files && files[0]) {
      setFormData({ ...formData, avatar: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/register", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        alert("🎉 Đăng ký thành công! Vui lòng đăng nhập.");
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      setError("❌ Đăng ký thất bại. Vui lòng kiểm tra lại thông tin!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white text-center">
              <h4>Đăng ký tài khoản</h4>
            </div>

            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <label>Họ tên</label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-control mb-3"
                      required
                    />

                    <label>Tên đăng nhập</label>
                    <input
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="form-control mb-3"
                      required
                    />

                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control mb-3"
                      required
                    />

                    <label>Số điện thoại</label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-control mb-3"
                    />

                    <label>Địa chỉ</label>
                    <input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="form-control mb-3"
                    />
                  </div>

                  <div className="col-md-6">
                    <label>Ngày sinh</label>
                    <input
                      type="date"
                      name="birthday"
                      value={formData.birthday}
                      onChange={handleChange}
                      className="form-control mb-3"
                    />

                    <label>Giới tính</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="form-select mb-3"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>

                    <label>Ảnh đại diện</label>
                    <input
                      type="file"
                      name="avatar"
                      onChange={handleChange}
                      className="form-control mb-3"
                    />
                    {preview && (
                      <img
                        src={preview}
                        alt="preview"
                        className="img-thumbnail mb-3"
                        style={{ width: "100px", height: "100px" }}
                      />
                    )}

                    <label>Mật khẩu</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="form-control mb-3"
                      required
                    />

                    <label>Xác nhận mật khẩu</label>
                    <input
                      type="password"
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      className="form-control mb-3"
                      required
                    />
                  </div>
                </div>

                <button className="btn btn-primary w-100" disabled={loading}>
                  {loading ? "Đang đăng ký..." : "Đăng ký"}
                </button>
              </form>

              <div className="text-center mt-3">
                <Link to="/login">Đã có tài khoản? Đăng nhập ngay</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
