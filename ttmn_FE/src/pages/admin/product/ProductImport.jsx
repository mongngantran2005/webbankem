import { useState } from "react";
import axios from "axios";

const ProductImport = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = async () => {
    if (!file) {
      setMessage("⚠️ Vui lòng chọn file Excel trước khi import.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/products/import",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("✅ " + res.data.message);
    } catch (err) {
      console.error(err);
      setMessage("❌ Import thất bại, vui lòng kiểm tra lại file hoặc API!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "0 auto" }}>
      <h2>📦 Import Sản phẩm từ Excel</h2>

      <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} />
      <br />
      <button
        onClick={handleImport}
        disabled={loading}
        style={{
          marginTop: 10,
          padding: "8px 16px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        {loading ? "Đang import..." : "Import"}
      </button>

      {message && (
        <p style={{ marginTop: 15, color: message.includes("❌") ? "red" : "green" }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default ProductImport;
