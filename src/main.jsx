import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./components/layout/RootLayout.jsx"; // Importing the RootLayout component
import AdminLayout from "./components/admin/layout/AdminLayout.jsx"; // Importing the AdminLayout component
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import "./index.css";
import Home from "./page/Home.jsx";
import Dashboard from "./components/Admin/Dashboard.jsx"; // Importing the Dashboard component
import Categories from "./page/admin/Categories.jsx";
import { SnackbarProvider } from "notistack";
import About from "./page/About.jsx";
import Product from "./page/admin/Product.jsx";
import CategoriesPage from "./page/Categories.jsx";
import Productpage from "./page/Product.jsx";
import DetailProduct from "./page/DetailProduct.jsx";
import Cart from "./page/Cart.jsx";
import Checkout from "./page/Checkout.jsx";
import OrderManagement from "./page/admin/OrderManagement.jsx";
import NotFound from "./page/NotFound.jsx";
import Contact from "./page/Contact.jsx";
import OrderDetail from "./page/OrderDetail.jsx";
import Orders from "./page/Orders.jsx";
import User from "./page/admin/User.jsx";
import Promocode from "./page/admin/Promocode.jsx";
import AdminChat from "./components/Admin/AdminChat.jsx";
const router = createBrowserRouter([
  // Public routes with RootLayout
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/categories",
        element: <CategoriesPage />,
      },
      {
        path: "/products",
        element: <Productpage />,
      },
      {
        path: "/product/:id",
        element: <DetailProduct />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/checkout",
        element: <Checkout />,
      },
      {
        path: "/order/:id",
        element: <OrderDetail />,
      },
      {
        path: "/orders",
        element: <Orders />,
      },
      {
        path: "/*",
        element: <NotFound />,
      },
    ],
  },
  // Admin routes with AdminLayout and ProtectedRoute
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "products",
        element: <Product />,
      },
      {
        path: "chat",
        element: <AdminChat />
      },
      {
        path: "categories",
        element: <Categories />,
      },
      {
        path: "users",
        element: <User />,
      },
      {
        path: "promocodes",
        element: <Promocode />,
      },
      {
        path: "orders",
        element: <OrderManagement />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <SnackbarProvider maxSnack={3}>
    {/* Your app components */}
    <RouterProvider router={router} />
  </SnackbarProvider>
);
