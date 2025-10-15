import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// --------CSS Shop--------
import "./assets/shop/css/style-header.css";
// import "./assets/shop/css/style-contact.css";
import "./assets/shop/css/style-header.css";
import "./assets/shop/css/style-footer.css";
// import "./assets/shop/css/style-nav.css";
import "./assets/shop/css/style-home.css";
import "./assets/shop/css/style-products.css";
import "./assets/shop/css/style-account.css";
// import "./assets/shop/css/style-product-detail.css";
// import "./assets/shop/css/style-menu.css";
// import "./assets/shop/css/style-log.css";
import "./assets/shop/css/style-cart.css";
// import "./assets/shop/css/style-product-bycat.css";
import "./assets/shop/css/style-register.css";
import "./assets/shop/css/style-about.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
// --------CSS ADMIN--------
import "./assets/admin/css/style-admin.css";
import "./assets/admin/css/style-CategoryList.css";
import "./assets/admin/css/style-CategoryEdit.css";
import "./assets/admin/css/style-ProductList.css";
import "./assets/admin/css/style-ProductAdd.css";
import "./assets/admin/css/style-ProductShow.css";
import "./assets/admin/css/style-OrderList.css";
import "./assets/admin/css/style-UserList.css";
import "./assets/admin/css/style-OrderDetail.css";
import "./assets/admin/css/style-OrderByUser.css";
import "./assets/admin/css/style-DiscountList.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import ShopLayout from "./components/shop/ShopLayout.jsx";
import ShopRoute from "./route/shop.js";
import AdminRoute from "./route/admin.js";
import AdminLayout from './components/admin/AdminLayout.jsx'; 


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Shop layout */}
        <Route path="/" element={<ShopLayout />}>
          {ShopRoute.map((route, index) => {
            const Page = route.component;
            return (
              <Route
                key={index}
                path={route.path}
                element={<Page />}
              />
            );
          })}
        </Route>
        {/* admin */}
        <Route path='/admin' element={<AdminLayout />}>
        {AdminRoute.map((route, index) => {
          const Page = route.component;
          return <Route key={index} path={route.path} element={<Page />} />;
        })}
      </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
