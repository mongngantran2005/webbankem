// HeaderAD.jsx
import React from 'react';

const HeaderAD = ({ onToggleNav }) => {
  return (
    <header className="header-ad">
      <div className="header-left">
        <button className="menu-toggle" onClick={onToggleNav}>
          ☰
        </button>
        <div className="header-search">
          <input 
            type="text" 
            placeholder="Tìm kiếm..." 
            className="search-input"
          />
        </div>
      </div>
      <div className="header-right">
        <div className="header-actions">
          <button className="action-btn">
            <span>🔔</span>
            <span>Thông báo</span>
          </button>
          <button className="action-btn">
            <span>💬</span>
            <span>Tin nhắn</span>
          </button>
          <div className="user-profile">
            <div className="user-avatar">A</div>
            <span className="user-name">Quản trị viên</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderAD;