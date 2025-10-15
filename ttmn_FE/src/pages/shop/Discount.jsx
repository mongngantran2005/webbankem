import { useEffect, useState } from "react";

function Discount() {
  const [discounts, setDiscounts] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/discounts");
        const data = await res.json();

        if (Array.isArray(data)) {
          setDiscounts(data);
        } else if (Array.isArray(data.discounts)) {
          setDiscounts(data.discounts);
        } else if (Array.isArray(data.data)) {
          setDiscounts(data.data);
        } else {
          setDiscounts([]);
        }
      } catch (err) {
        console.error("Lỗi tải danh sách giảm giá:", err);
        setDiscounts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscounts();
  }, []);

  // 🟢 Lưu mã giảm giá được chọn
  const handleSaveDiscount = () => {
    if (!selectedDiscount) {
      alert("Vui lòng chọn một mã giảm giá trước!");
      return;
    }

    localStorage.setItem("selectedDiscount", JSON.stringify(selectedDiscount));
    alert(`✅ Đã lưu mã giảm giá: ${selectedDiscount.code}`);
  };

  if (loading)
    return <div className="text-center py-5">⏳ Đang tải mã giảm giá...</div>;

  return (
    <div className="container py-5">
      <h3 className="text-center mb-4 fw-bold">🎟️ Chọn Mã Giảm Giá</h3>

      {discounts.length === 0 ? (
        <p className="text-center text-muted">Không có mã giảm giá khả dụng.</p>
      ) : (
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-hover align-middle text-center">
            <thead className="table-light">
              <tr>
                <th></th>
                <th>Mã</th>
                <th>Loại</th>
                <th>Giá trị</th>
                <th>Đơn tối thiểu</th>
                <th>Giảm tối đa</th>
                <th>Bắt đầu</th>
                <th>Kết thúc</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((d) => (
                <tr
                  key={d.id}
                  className={
                    selectedDiscount?.id === d.id ? "table-primary" : ""
                  }
                  onClick={() => setSelectedDiscount(d)}
                  style={{ cursor: "pointer" }}
                >
                  <td>
                    <input
                      type="radio"
                      name="selectedDiscount"
                      checked={selectedDiscount?.id === d.id}
                      onChange={() => setSelectedDiscount(d)}
                    />
                  </td>
                  <td className="fw-semibold">{d.code}</td>
                  <td>{d.type === "percent" ? "Phần trăm (%)" : "Cố định (₫)"}</td>
                  <td>
                    {d.type === "percent"
                      ? `${d.value}%`
                      : `${d.value.toLocaleString("vi-VN")}₫`}
                  </td>
                  <td>
                    {d.min_order_amount
                      ? `${d.min_order_amount.toLocaleString("vi-VN")}₫`
                      : "-"}
                  </td>
                  <td>
                    {d.max_discount
                      ? `${d.max_discount.toLocaleString("vi-VN")}₫`
                      : "-"}
                  </td>
                  <td>{d.start_date?.slice(0, 10) || "-"}</td>
                  <td>{d.end_date?.slice(0, 10) || "-"}</td>
                  <td>
                    {d.status === 1 ? (
                      <span className="badge bg-success">Hoạt động</span>
                    ) : (
                      <span className="badge bg-secondary">Ngừng</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Nút lưu mã */}
      <div className="text-center mt-4">
        <button
          className="btn btn-primary px-4 py-2"
          onClick={handleSaveDiscount}
        >
          💾 Lưu Mã Giảm Giá
        </button>
      </div>
    </div>
  );
}

export default Discount;
