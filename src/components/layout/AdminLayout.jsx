import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaBox,
  FaUsers,
  FaShoppingCart,
  FaSignOutAlt,
} from "react-icons/fa";

const AdminLayout = () => {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
        </div>
        <nav className="mt-4">
          <Link
            to="/admin"
            className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${
              isActive("/admin") ? "bg-gray-100" : ""
            }`}
          >
            <FaHome className="mr-3" />
            Dashboard
          </Link>
          <Link
            to="/admin/products"
            className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${
              isActive("/admin/products") ? "bg-gray-100" : ""
            }`}
          >
            <FaBox className="mr-3" />
            Sản phẩm
          </Link>
          <Link
            to="/admin/users"
            className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${
              isActive("/admin/users") ? "bg-gray-100" : ""
            }`}
          >
            <FaUsers className="mr-3" />
            Người dùng
          </Link>
          <Link
            to="/admin/orders"
            className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${
              isActive("/admin/orders") ? "bg-gray-100" : ""
            }`}
          >
            <FaShoppingCart className="mr-3" />
            Đơn hàng
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <FaSignOutAlt className="mr-3" />
            Đăng xuất
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
