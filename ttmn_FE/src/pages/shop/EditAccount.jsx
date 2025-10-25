import { useState, useEffect } from "react";
import axios from "axios";

export default function EditAccount() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    username: "",
    birthday: "",
    gender: "Nam",
    email: "",
    phone: "",
    address: "",
    avatar: null,
  });
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("update");

  const token = localStorage.getItem("token");

  // ✅ Lấy thông tin người dùng khi load trang
  useEffect(() => {
    if (!token) return;
    axios
      .get("http://127.0.0.1:8000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.success && res.data.user) {
          const u = res.data.user;
          setUser(u);
          setPreview(u.avatar || null);
          setForm({
            name: u.name || "",
            username: u.username || "",
            birthday: u.birthday || "",
            gender: u.gender || "Nam",
            email: u.email || "",
            phone: u.phone || "",
            address: u.address || "",
            avatar: null,
          });
        }
      })
      .catch(() => setMessage("❌ Lỗi tải thông tin người dùng."));
  }, [token]);

  // ✅ Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar" && files?.[0]) {
      setForm({ ...form, avatar: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // ✅ Gửi cập nhật hồ sơ
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    for (const key in form) {
      if (form[key] !== null && form[key] !== "") {
        formData.append(key, form[key]);
      }
    }

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/user/profile/update",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        const updatedUser = res.data.user;
        setUser(updatedUser);
        setPreview(updatedUser.avatar || null);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setMessage("✅ Cập nhật thành công!");
      } else {
        setMessage("❌ Cập nhật thất bại.");
      }
    } catch {
      setMessage("❌ Lỗi khi cập nhật hồ sơ.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Đổi mật khẩu
  const [pwdForm, setPwdForm] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [pwdMsg, setPwdMsg] = useState("");
  const [pwdErr, setPwdErr] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);

  const handlePwdChange = (e) => {
    setPwdForm({ ...pwdForm, [e.target.name]: e.target.value });
  };

  const handlePwdSubmit = async (e) => {
    e.preventDefault();
    setPwdMsg("");
    setPwdErr("");
    setPwdLoading(true);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/user/change-password",
        pwdForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setPwdMsg("✅ " + res.data.message);
        setPwdForm({
          current_password: "",
          new_password: "",
          new_password_confirmation: "",
        });
      } else {
        setPwdErr("❌ " + res.data.message);
      }
    } catch {
      setPwdErr("❌ Không thể đổi mật khẩu.");
    } finally {
      setPwdLoading(false);
    }
  };

  if (!user) return <div className="loading">⏳ Đang tải dữ liệu...</div>;

  // ✅ Giao diện
  return (
    <div className="profile-page">
      <h1 className="title">Thông tin tài khoản</h1>

      <div className="profile-container">
        {/* Cột trái */}
        <div className="profile-left">
          <h3>Hồ sơ cá nhân</h3>
          <div className="avatar-box">
            {preview ? (
              <img src={preview} alt="avatar" className="avatar-img" />
            ) : (
              <div className="no-avatar">Chưa có ảnh</div>
            )}
          </div>
          <div className="info">
            <p><b>Họ và tên:</b> {user.name || "Chưa có"}</p>
            <p><b>Tên người dùng:</b> {user.username || "Chưa có"}</p>
            <p><b>Ngày sinh:</b> {user.birthday || "Chưa có"}</p>
            <p><b>Giới tính:</b> {user.gender || "Chưa có"}</p>
            <p><b>Số điện thoại:</b> {user.phone || "Chưa có"}</p>
            <p><b>Email:</b> {user.email || "Chưa có"}</p>
            <p><b>Địa chỉ:</b> {user.address || "Chưa có"}</p>
          </div>
        </div>

        {/* Cột phải */}
        <div className="profile-right">
          <div className="tab-header">
            <button
              className={tab === "update" ? "active" : ""}
              onClick={() => setTab("update")}
            >
              Cập nhật thông tin
            </button>
            <button
              className={tab === "password" ? "active" : ""}
              onClick={() => setTab("password")}
            >
              Đổi mật khẩu
            </button>
          </div>

          {/* Tab cập nhật hồ sơ */}
          {tab === "update" && (
            <form onSubmit={handleSubmit} className="form">
              {message && <div className="alert">{message}</div>}

              <label>Họ và tên:</label>
              <input name="name" value={form.name} onChange={handleChange} required />

              <label>Tên người dùng:</label>
              <input name="username" value={form.username} onChange={handleChange} />

              <label>Ngày sinh:</label>
              <input type="date" name="birthday" value={form.birthday} onChange={handleChange} />

              <label>Giới tính:</label>
              <select name="gender" value={form.gender} onChange={handleChange}>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>

              <label>Email:</label>
              <input name="email" value={form.email} onChange={handleChange} disabled />

              <label>Số điện thoại:</label>
              <input name="phone" value={form.phone} onChange={handleChange} />

              <label>Địa chỉ:</label>
              <input name="address" value={form.address} onChange={handleChange} />

              <label>Ảnh đại diện:</label>
              <input type="file" name="avatar" accept="image/*" onChange={handleChange} />

              <button type="submit" disabled={loading}>
                {loading ? "⏳ Đang lưu..." : "💾 Lưu thay đổi"}
              </button>
            </form>
          )}

          {/* Tab đổi mật khẩu */}
          {tab === "password" && (
            <form onSubmit={handlePwdSubmit} className="form">
              {pwdMsg && <div className="alert success">{pwdMsg}</div>}
              {pwdErr && <div className="alert error">{pwdErr}</div>}

              <label>Mật khẩu hiện tại:</label>
              <input
                type="password"
                name="current_password"
                value={pwdForm.current_password}
                onChange={handlePwdChange}
                required
              />

              <label>Mật khẩu mới:</label>
              <input
                type="password"
                name="new_password"
                value={pwdForm.new_password}
                onChange={handlePwdChange}
                required
              />

              <label>Nhập lại mật khẩu mới:</label>
              <input
                type="password"
                name="new_password_confirmation"
                value={pwdForm.new_password_confirmation}
                onChange={handlePwdChange}
                required
              />

              <button type="submit" disabled={pwdLoading}>
                {pwdLoading ? "🔄 Đang xử lý..." : "Đổi mật khẩu"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
