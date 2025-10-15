// 🧭 src/route/admin.js

import CategoryList from "../pages/admin/category/CategoryList";
import CategoryAdd from "../pages/admin/category/CategoryAdd";
import CategoryEdit from "../pages/admin/category/CategoryEdit";

import ProductList from "../pages/admin/product/ProductList";
import ProductAdd from "../pages/admin/product/ProductAdd";
import ProductTrash from "../pages/admin/product/ProductTrash";
import ProductShow from "../pages/admin/product/ProductShow";

import OrderList from "../pages/admin/order/OrderList";
import OrderDetail from "../pages/admin/order/OrderDetail";
import OrderByUser from "../pages/admin/order/OrderByUser";

//
import UserList from "../pages/admin/user/UserList";
//
import Inventory from "../pages/admin/inventory/Inventory";
//
import Dashboard from "../pages/admin/dashboard/Dashboard";
//
import DiscountAdd from "../pages/admin/discount/DiscountAdd";
import DiscountList from "../pages/admin/discount/DiscountList";

const AdminRoute = [
  // Category
  { path: "category", component: CategoryList },
  { path: "addCategory", component: CategoryAdd },
  { path: "editCategory/:documentId", component: CategoryEdit },

  // Product
  { path: "product", component: ProductList },
  { path: "product-add", component: ProductAdd },
  { path: "product-trash", component: ProductTrash },
  { path: "product-show/:id", component: ProductShow },

  // Order
  { path: "order-list", component: OrderList },
  { path: "orders/:id", component: OrderDetail },     // ✅ đổi thành “orders/:id”
  { path: "order-user/:id", component: OrderByUser }, // ✅ giữ nguyên

  // User
  { path: "user-list", component: UserList },
  //
  { path: "inventory", component: Inventory },
  //
  { path: "dashboard", component: Dashboard  },
  //Discount
  { path: "discount-add", component: DiscountAdd  },
  { path: "discount-list", component: DiscountList  },

];

export default AdminRoute;
