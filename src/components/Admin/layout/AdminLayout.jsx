import { useState, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaShoppingBag,
  FaUsers,
  FaTags,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaBell,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaShoppingCart,
  FaFacebookMessenger,
} from "react-icons/fa";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
        document.body.classList.add("sidebar-hidden"); // Add class to hide sidebar
      } else {
        setIsSidebarOpen(true); // Ensure sidebar is open on larger screens
        document.body.classList.remove("sidebar-hidden"); // Remove class to show sidebar
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    { title: "Tổng Quan", icon: <FaHome />, path: "/admin" },
    { title: "Sản Phẩm", icon: <FaShoppingBag />, path: "/admin/products" },
    { title: "Người Dùng", icon: <FaUsers />, path: "/admin/users" },
    { title: "Danh Mục", icon: <FaTags />, path: "/admin/categories" },
    { title: "Đơn Hàng", icon: <FaShoppingCart />, path: "/admin/orders" },
    { title: "Mã Giảm Giá", icon: <FaTags />, path: "/admin/promocodes" },
    { title: "Tin nhắn", icon: <FaFacebookMessenger />, path: "/admin/chat" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed lg:relative bg-white border-r border-gray-200 text-gray-800 w-64 min-h-screen flex-shrink-0 transition-all duration-300 ease-in-out z-20
    ${
      isSidebarOpen
        ? "translate-x-0 max-w-64"
        : "-translate-x-full max-w-0 overflow-hidden"
    }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">ShopSell Admin</h1>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>
        <nav className="mt-4">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200
                ${
                  location.pathname === item.path
                    ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                    : ""
                }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              <span className="font-medium">{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 lg:px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {isSidebarOpen ? (
                  <FaChevronLeft size={20} />
                ) : (
                  <FaChevronRight size={20} />
                )}
              </button>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
                  <FaBell size={20} />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                >
                  <FaUserCircle size={24} />
                  <span className="hidden md:inline">Admin</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                    <Link
                      to="/admin/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Thông tin cá nhân
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-4 py-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-opacity-50 z-10 lg:hidden"
          onClick={() => {
            setIsSidebarOpen(false);
            document.body.classList.add("sidebar-hidden"); // Ensure sidebar is hidden
          }}
        />
      )}
    </div>
  );
};

export default AdminLayout;
