import { ConfigProvider, App as AppAntd } from "antd";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./page/Login";
import Signup from "./page/Signup";
import Layout from "./layouts/Layout";
import UserProfile from "./page/UserProfile";
import { AuthProvider } from "./contexts/AuthContext";
import DetailProduct from "./page/detail";
import Home from "./page";
import Contact from "./page/contact";
import ProductPage from "./page/ProductPage";
import CartPage from "./page/cart";
import SuccessPage from "./page/orderSuccess";
import OrderListPage from "./page/OrderListPage";
import Payments from "./page/payment";
import LoadingCommon from "./components/LoadingCommon";
import AdminLayout from "./layouts/Admin/Layout";
import UserManagement from "./page/UserManagement/page";
import ProductManagement from "./page/ProductManagement/page";
import Categories from "./page/admin/categories";
import OrdersManagement from "./page/admin/orders-list";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/profile",
        element: <UserProfile />,
      },
      {
        path: "/products/:id",
        element: <DetailProduct />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/products",
        element: <ProductPage />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
      {
        path: "/success_purchase",
        element: <SuccessPage />,
      },
      {
        path: "/orders",
        element: <OrderListPage />,
      },
      {
        path: "/payments",
        element: <Payments />,
      }
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "dashboard",
        element: <>Dashboard</>,
      },
      {
        path: "users",
        element: <UserManagement />,
      },
      {
        path: "products",
        element: <ProductManagement />,
      },
      {
        path: "categories",
        element: <Categories />,
      },
      {
        path: "orders",
        element: <OrdersManagement />,
      }
    ],
  }
]);

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#22c55e", // Màu chính của theme
        },
      }}
    >
      <AppAntd>
        <AuthProvider>
          <LoadingCommon />
          <RouterProvider router={router} />
        </AuthProvider>
      </AppAntd>
    </ConfigProvider>
  );
}

export default App;
