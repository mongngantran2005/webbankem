// NavAD.jsx cập nhật
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavAD = ({ className, onItemClick }) => {
  const location = useLocation();
  const menuItems = [
    { name: 'TỔNG QUAN', path: '/admin/dashboard' },
    { name: 'Quản lý Sản phẩm', path: '/admin/product' },
    { name: 'Quản lý Danh mục', path: '/admin/category' },
    { name: 'Quản lý Đơn hàng', path: '/admin/order-list' },
    { name: 'Quản lý Khách hàng', path: '/admin/user-list' },
    { name: 'Quản lý Thương hiệu', path: '/admin/brand-list' },
    { name: 'Quản lý Tồn Kho', path: '/admin/inventory' },
    { name: 'Quản lý Đánh giá', path: '/admin/danh-gia' },
    { name: 'Mã giảm giá', path: '/admin/discount-list' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`nav-ad ${className || ''}`}>
      <div className="nav-brand">
        <h2>HỆ THỐNG QUẢN TRỊ</h2>
      </div>
      
      <div className="nav-divider"></div>
      
      <ul className="nav-menu">
        {menuItems.map((item, index) => (
          <li key={index} className="nav-item">
            <Link 
              to={item.path} 
              className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              onClick={onItemClick}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
      
      <div className="nav-divider"></div>
      
      <div className="nav-stats">
        <div className="stat-section">
          <h4>Thống kê nhanh</h4>
          <div className="stat-item">
            <div className="stat-label">Doanh thu</div>
            <div className="stat-value">200.000.000₫</div>
            <div className="stat-change positive">+15% tháng trước</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-label">Đơn hàng</div>
            <div className="stat-value">1.250</div>
            <div className="stat-change positive">+8% tháng trước</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-label">Khách hàng</div>
            <div className="stat-value">3.500</div>
            <div className="stat-change positive">+12% tháng trước</div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavAD;