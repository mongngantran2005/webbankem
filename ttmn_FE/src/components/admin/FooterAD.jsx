// FooterAD.jsx
import React from 'react';

const FooterAD = () => {
  return (
    <footer className="footer-ad">
      <div className="footer-content">
        <div className="footer-info">
          <div className="footer-stats">
            <div className="stat">
              <span className="stat-value">200M₫</span>
              <span className="stat-label">Doanh thu</span>
            </div>
            <div className="stat">
              <span className="stat-value">1.250</span>
              <span className="stat-label">Đơn hàng</span>
            </div>
            <div className="stat">
              <span className="stat-value">3.5K</span>
              <span className="stat-label">Khách hàng</span>
            </div>
          </div>
        </div>
        
        <div className="footer-copyright">
          <strong>ICE CREAM</strong> &copy; 2024 - Hệ thống Quản trị
        </div>
      </div>
    </footer>
  );
};

export default FooterAD;