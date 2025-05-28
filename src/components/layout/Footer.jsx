import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPinterest } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">Về Chúng Tôi</h3>
            <p className="text-gray-400 mb-4">
              ShopSell là điểm đến hàng đầu cho các sản phẩm thời trang và phong cách sống.
              Chúng tôi cung cấp các sản phẩm chất lượng cao với giá cả cạnh tranh và dịch vụ khách hàng tuyệt vời.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <FaFacebook className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaTwitter className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaInstagram className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaLinkedin className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaPinterest className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Liên Kết Nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white">
                  Cửa Hàng
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-400 hover:text-white">
                  Danh Mục
                </Link>
              </li>
              <li>
                <Link to="/deals" className="text-gray-400 hover:text-white">
                  Khuyến Mãi
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white">
                  Về Chúng Tôi
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white">
                  Liên Hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xl font-bold mb-4">Dịch Vụ Khách Hàng</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white">
                  Câu Hỏi Thường Gặp
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-400 hover:text-white">
                  Thông Tin Vận Chuyển
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-400 hover:text-white">
                  Chính Sách Đổi Trả
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="text-gray-400 hover:text-white">
                  Theo Dõi Đơn Hàng
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white">
                  Chính Sách Bảo Mật
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-4">Đăng Ký Nhận Tin</h3>
            <p className="text-gray-400 mb-4">
              Đăng ký để nhận những cập nhật và ưu đãi độc quyền!
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 px-4 py-2 rounded-l-lg text-gray-900 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-3 rounded-r-lg hover:bg-blue-600 transition-colors"
              >
                Đăng Ký
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} ShopSell. Bản quyền được bảo lưu.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <img
                src="/images/payment/visa.png"
                alt="Visa"
                className="h-8 opacity-50 hover:opacity-100"
              />
              <img
                src="/images/payment/mastercard.png"
                alt="Mastercard"
                className="h-8 opacity-50 hover:opacity-100"
              />
              <img
                src="/images/payment/paypal.png"
                alt="PayPal"
                className="h-8 opacity-50 hover:opacity-100"
              />
              <img
                src="/images/payment/amex.png"
                alt="American Express"
                className="h-8 opacity-50 hover:opacity-100"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 