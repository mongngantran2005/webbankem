// src/route/shop.js

import Home from "../pages/shop/Home";
import About from "../pages/shop/About";
// import Contact from "../pages/shop/Contact";
import Products from "../pages/shop/Products";
import ProductDetail from "../pages/shop/ProductDetail";
import ProductsByCat from "../pages/shop/ProductsByCat";
import Cart from "../pages/shop/Cart";
import Checkout from "../pages/shop/Checkout";
import Login from "../pages/shop/Login";
import Register from "../pages/shop/Register";
import Account from "../pages/shop/Account";
import Search from '../pages/shop/Search';
import ProductReview from '../pages/shop/ProductReview';
import Discount from '../pages/shop/Discount';
import EditAccount from "../pages/shop/EditAccount";
import ChangePassword from "../pages/shop/ChangePassword";
import PaymentSuccess from "../pages/shop/PaymentSuccess";
import ChatBox from "../pages/shop/ChatBox";


const ShopRoute = [
  { path: "/", component: Home },
  { path: "/about", component: About },
  { path: "/product", component: Products },
  { path: "/product-detail/:id", component: ProductDetail },
  { path: "/category/:id", component: ProductsByCat },
  { path: "/cart", component: Cart },
  { path: "/checkout", component: Checkout },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/account", component: Account },
  { path: "/search/:keyword", component: Search },
  { path: "/product-review/:id",component: ProductReview, },
  { path: "/discount", component: Discount },
  { path: "/edit-account", component: EditAccount },
  { path: "/change-password", component: ChangePassword },
  { path: "/payment-success", component: PaymentSuccess  },
  { path: "/chat-box", component: ChatBox  },


];


export default ShopRoute;
