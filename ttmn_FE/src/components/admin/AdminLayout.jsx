// AdminLayout.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import HeaderAD from "./HeaderAD";
import NavAD from "./NavAD";
import FooterAD from "./FooterAD";

const AdminLayout = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const closeNavOnMobile = () => {
    if (window.innerWidth <= 768) {
      setIsNavOpen(false);
    }
  };

  return (
    <div className="admin-layout">
      <NavAD className={isNavOpen ? 'mobile-open' : ''} onItemClick={closeNavOnMobile} />
      <div className="admin-main">
        <HeaderAD onToggleNav={toggleNav} />
        <main className="admin-content">
          <Outlet />
        </main>
        <FooterAD />
      </div>
    </div>
  );
};

export default AdminLayout;