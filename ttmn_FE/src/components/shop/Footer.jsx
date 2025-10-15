import React from 'react';
import { Link } from 'react-router-dom';
import footerBg from '../../assets/shop/images/header.jpg'; // Ảnh nền của bạn

const Footer = () => {
  return (
    <footer
      className="footer"
      style={{
        backgroundImage: `url(${footerBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Lớp phủ màu hồng tím mờ */}
      <div className="footer-overlay">
        <div className="footer-container">

          {/* Giới thiệu */}
          <div className="footer-section">
            <h3 className="footer-logo">🍦 iCREAM</h3>
            <p className="footer-text">
              iCREAM mang đến những cây kem ngọt ngào, tươi mát và tự nhiên nhất.
              Chúng tôi luôn nỗ lực để mang đến trải nghiệm tuyệt vời cho bạn.
            </p>
          </div>

          {/* Liên kết nhanh */}
          <div className="footer-section">
            <h4 className="footer-title">Liên Kết Nhanh</h4>
            <ul>
              <li><Link to="/" className="footer-link">Trang Chủ</Link></li>
              <li><Link to="/about" className="footer-link">Giới Thiệu</Link></li>
              <li><Link to="/products" className="footer-link">Sản Phẩm</Link></li>
              <li><Link to="/contact" className="footer-link">Liên Hệ</Link></li>
            </ul>
          </div>

          {/* Danh mục */}
          <div className="footer-section">
            <h4 className="footer-title">Danh Mục</h4>
            <ul>
              <li>Kem Socola</li>
              <li>Kem Dâu Tây</li>
              <li>Kem Xoài</li>
              <li>Kem Vani</li>
            </ul>
          </div>

          {/* Liên hệ */}
          <div className="footer-section">
            <h4 className="footer-title">Liên Hệ</h4>
            <ul>
              <li>📍 123 Đường Kem Ngọt, Quận 1, TP. HCM</li>
              <li>📞 (028) 1234 5678</li>
              <li>📧 contact@icream.com</li>
              <li>🕒 9:00 - 21:00</li>
            </ul>
          </div>
        </div>

        {/* Bản quyền */}
        <div className="footer-bottom">
          © 2025 <span>iCREAM</span>. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
