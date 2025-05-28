import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaUser,
  FaSearch,
  FaBars,
  FaTimes,
  FaChevronDown,
} from "react-icons/fa";
import LoginModal from "../auth/LoginModal";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  // Kiểm tra trạng thái đăng nhập khi component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        if (parsedUser && typeof parsedUser === "object") {
          setIsAuthenticated(true);
          setUser(parsedUser);
        } else {
          console.warn("Dữ liệu người dùng không hợp lệ.");
        }
      } catch (error) {
        console.error("Lỗi khi parse dữ liệu người dùng:", error);
      }
    }
  }, []);

  // Theo dõi số lượng sản phẩm trong giỏ hàng
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
      setCartCount(totalItems);
    };

    // Cập nhật số lượng ban đầu
    updateCartCount();

    // Tạo một hàm để lắng nghe sự kiện storage
    const handleStorageChange = (e) => {
      if (e.key === "cart") {
        updateCartCount();
      }
    };

    // Lắng nghe sự kiện storage
    window.addEventListener("storage", handleStorageChange);
    
    // Lắng nghe sự kiện cart-updated (sẽ được gửi từ các component khác)
    window.addEventListener("cart-updated", updateCartCount);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cart-updated", updateCartCount);
    };
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/products?search=${searchQuery}`);
        const data = await response.json();
        if (data.success) {
          setSearchResults(data.products);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleProductClick = (productId) => {
    setSearchResults([]); // Clear dropdown
    navigate(`/products/${productId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    navigate("/");
  };

  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  return (
    <header className="bg-white shadow-md">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <a href="tel:+1234567890" className="text-sm hover:text-gray-300">
                <i className="fas fa-phone mr-1"></i> +84 123 456 789
              </a>
              <a
                href="mailto:info@example.com"
                className="text-sm hover:text-gray-300"
              >
                <i className="fas fa-envelope mr-1"></i> info@shopsell.com
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-sm hover:text-gray-300">
                <i className="fas fa-truck mr-1"></i> Miễn Phí Vận Chuyển
              </a>
              <a href="#" className="text-sm hover:text-gray-300">
                <i className="fas fa-undo mr-1"></i> Đổi Trả 30 Ngày
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-gray-800">
            ShopSell
          </Link>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500"
              >
                <FaSearch />
              </button>
              {searchResults.length > 0 && (
                <div className="absolute left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg mt-2 z-50">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded mr-2"
                      />
                      <span className="text-gray-700">{product.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </form>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-6">
            <Link
              to="/cart"
              className="text-gray-600 hover:text-blue-500 relative"
            >
              <FaShoppingCart className="text-xl" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex cursor-pointer items-center space-x-2 text-gray-700 hover:text-gray-900 font-bold"
                >
                  <span>{user?.username || "Tài khoản"}</span>
                  <FaChevronDown className="text-xs" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-100">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Thông tin cá nhân
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Đơn hàng của tôi
                    </Link>
                    <Link
                      to="/wishlist"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Sản phẩm yêu thích
                    </Link>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="text-gray-700 hover:text-gray-900"
              >
                Đăng nhập
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-600 hover:text-blue-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center justify-center space-x-8 mt-4">
          <Link to="/categories" className="text-gray-600 hover:text-blue-500">
            Danh Mục
          </Link>
          <Link to="/products" className="text-gray-600 hover:text-blue-500">
            Sản Phẩm
          </Link>
          {/* <Link to="/deals" className="text-gray-600 hover:text-blue-500">
            Khuyến Mãi
          </Link> */}
          <Link to="/about" className="text-gray-600 hover:text-blue-500">
            Về Chúng Tôi
          </Link>
          <Link to="/contact" className="text-gray-600 hover:text-blue-500">
            Liên Hệ
          </Link>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/products"
                className="text-gray-600 hover:text-blue-500"
              >
                Cửa Hàng
              </Link>
              <Link
                to="/categories"
                className="text-gray-600 hover:text-blue-500"
              >
                Danh Mục
              </Link>
              <Link to="/deals" className="text-gray-600 hover:text-blue-500">
                Khuyến Mãi
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-blue-500">
                Về Chúng Tôi
              </Link>
              <Link to="/contact" className="text-gray-600 hover:text-blue-500">
                Liên Hệ
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </header>
  );
};

export default Header;
