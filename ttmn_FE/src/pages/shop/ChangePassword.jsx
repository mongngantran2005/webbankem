import React, { useState } from "react";
import axios from "axios";

export default function ChangePassword() {
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/user/change-password",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setMessage("✅ " + response.data.message);
        setForm({
          current_password: "",
          new_password: "",
          new_password_confirmation: "",
        });
      } else {
        setError("❌ " + (response.data.message || "Đổi mật khẩu thất bại."));
      }
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        setError("❌ Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        localStorage.removeItem("token");
      } else if (err.response?.status === 422) {
        // Laravel trả lỗi dạng object — cần gom lại
        const errors = err.response?.data?.errors;
        if (errors) {
          const firstError = Object.values(errors)[0][0];
          setError("❌ " + firstError);
        } else {
          setError("❌ Dữ liệu không hợp lệ.");
        }
      } else if (err.response?.status === 400) {
        setError("❌ " + (err.response.data?.message || "Mật khẩu cũ không đúng."));
      } else {
        setError("❌ Lỗi hệ thống. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-page">
      <h2>Đổi mật khẩu</h2>
      <p>Vui lòng nhập mật khẩu hiện tại và mật khẩu mới của bạn.</p>

      {message && <div className="alert success">{message}</div>}
      {error && <div className="alert error">{error}</div>}

      <form onSubmit={handleSubmit} className="change-password-form">
        <label>Mật khẩu hiện tại:</label>
        <input
          type="password"
          name="current_password"
          value={form.current_password}
          onChange={handleChange}
          required
        />

        <label>Mật khẩu mới:</label>
        <input
          type="password"
          name="new_password"
          value={form.new_password}
          onChange={handleChange}
          required
        />

        <label>Nhập lại mật khẩu mới:</label>
        <input
          type="password"
          name="new_password_confirmation"
          value={form.new_password_confirmation}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "🔄 Đang xử lý..." : "Đổi mật khẩu"}
        </button>
      </form>
    </div>
  );
}
