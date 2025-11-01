import { useLocation } from "react-router-dom";

function PaymentSuccess() {
  const query = new URLSearchParams(useLocation().search);
  const resultCode = query.get("resultCode");

  return (
    <div className="container py-5 text-center">
      {resultCode === "0" ? (
        <>
          <h2>🎉 Thanh toán thành công!</h2>
          <p>Cảm ơn bạn đã mua hàng.</p>
          <a href="/" className="btn btn-primary mt-3">Về trang chủ</a>
        </>
      ) : (
        <>
          <h2>❌ Thanh toán thất bại</h2>
          <p>Vui lòng thử lại hoặc chọn phương thức khác.</p>
        </>
      )}
    </div>
  );
}

export default PaymentSuccess;
