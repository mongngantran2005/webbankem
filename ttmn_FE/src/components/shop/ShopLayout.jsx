import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";
import Header from "./Header";
import Nav from "./Nav";
import ChatBox from "../../pages/shop/ChatBox";

function ShopLayout() {
  const [showChat, setShowChat] = useState(false);
  const [popupBanner, setPopupBanner] = useState(null);
  const [showPopup, setShowPopup] = useState(true);

  // ✅ Lấy banner popup từ API
  useEffect(() => {
    const fetchPopupBanner = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/banners/popup");
        if (res.data && res.data.success) {
          setPopupBanner(res.data.data);
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          console.log("Không có banner popup hoạt động.");
        } else {
          console.error("Lỗi khi tải banner popup:", err);
        }
      }
    };

    fetchPopupBanner();
  }, []);

  return (
    <div>
      {/* 🔝 Header + Navbar */}
      <Header />
      <Nav />

      {/* 🧱 Nội dung chính */}
      <div className="row-content">
        <Outlet />
      </div>

      {/* 👣 Footer */}
      <Footer />

      {/* 💬 Icon chat nổi */}
      <div
        className="chat-icon"
        onClick={() => setShowChat(!showChat)}
        title="Nhắn tin với shop"
      >
        💬
      </div>

      {/* 💬 Hộp chat popup */}
      {showChat && (
        <div className="chatbox-popup">
          <ChatBox onClose={() => setShowChat(false)} />
        </div>
      )}

      {/* 📢 Popup banner sự kiện */}
      {showPopup && popupBanner && (
        <div
          className="popup-banner-overlay"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="popup-banner-content"
            onClick={(e) => e.stopPropagation()} // tránh tắt khi click vào hình
          >
            <button
              className="popup-close-btn"
              onClick={() => setShowPopup(false)}
            >
              ✖
            </button>
            <a
              href={popupBanner.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={`http://127.0.0.1:8000/storage/${popupBanner.image}`}
                alt={popupBanner.name}
                className="popup-banner-img"
              />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShopLayout;
