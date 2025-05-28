import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaShoppingBag, FaTruck, FaHeadset, FaShieldAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Define features array
  const features = [
    {
      icon: <FaShoppingBag className="text-4xl" />,
      title: 'Miễn Phí Vận Chuyển',
      description: 'Giao hàng miễn phí cho đơn hàng trên 500.000đ',
    },
    {
      icon: <FaTruck className="text-4xl" />,
      title: 'Giao Hàng Nhanh',
      description: 'Giao hàng trong vòng 24 giờ',
    },
    {
      icon: <FaHeadset className="text-4xl" />,
      title: 'Hỗ Trợ Khách Hàng',
      description: 'Đội ngũ hỗ trợ 24/7',
    },
    {
      icon: <FaShieldAlt className="text-4xl" />,
      title: 'Bảo Mật Thanh Toán',
      description: 'Thanh toán an toàn và bảo mật',
    },
  ];

  // Tự động chuyển slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Chuyển slide mỗi 5 giây

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
        // Lọc lấy 4 danh mục được hiển thị trên trang chủ
        const homeCategories = response.data.data
          .filter(category => category.isShowHome && category.isActive)
          .slice(0, 4);
        setCategories(homeCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Xử lý chuyển slide thủ công
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Bộ Sưu Tập Hè 2024',
      subtitle: 'Khám phá xu hướng mới nhất',
      buttonText: 'Mua Ngay',
      buttonLink: '/products'
    },
    {
      image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Ưu Đãi Đặc Biệt',
      subtitle: 'Giảm giá lên đến 50% cho các sản phẩm được chọn',
      buttonText: 'Xem Ưu Đãi',
      buttonLink: '/deals'
    },
    {
      image: 'https://images.unsplash.com/photo-1600201319331-27d31ecd7850?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Sản Phẩm Mới',
      subtitle: 'Khám phá các sản phẩm mới nhất',
      buttonText: 'Khám Phá',
      buttonLink: '/products?sort=newest'
    }
  ];

  const featuredProducts = [
    {
      id: 1,
      name: 'Giày Sneaker Trắng Cổ Điển',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c25lYWtlcnxlbnwwfHwwfHx8MA%3D%3D',
      category: 'Giày',
      rating: 4.8,
      reviewCount: 128,
      isNew: true,
      isBestSeller: true,
      discount: 15
    },
    {
      id: 2,
      name: 'Áo Khoác Denim',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8amFja2V0fGVufDB8fDB8fHww',
      category: 'Quần Áo',
      rating: 4.6,
      reviewCount: 89,
      isBestSeller: true,
      discount: 10
    },
    {
      id: 3,
      name: 'Ba Lô Da',
      price: 159.99,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFja3BhY2t8ZW58MHx8MHx8fDA%3D',
      category: 'Phụ Kiện',
      rating: 4.9,
      reviewCount: 156,
      isNew: true,
      isBestSeller: true
    },
    {
      id: 4,
      name: 'Đồng Hồ Thông Minh',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c21hcnQlMjB3YXRjaHxlbnwwfHwwfHx8MA%3D%3D',
      category: 'Điện Tử',
      rating: 4.7,
      reviewCount: 203,
      isBestSeller: true,
      discount: 20
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroSlides[currentSlide].image}
            alt={heroSlides[currentSlide].title}
            className="w-full h-full object-cover transition-opacity duration-1000"
          />
          <div className="absolute inset-0 bg-black/60 bg-opacity-40" />
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transition-colors z-10"
        >
          <FaChevronLeft className="text-xl" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transition-colors z-10"
        >
          <FaChevronRight className="text-xl" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'bg-white w-6' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl font-bold mb-4">{heroSlides[currentSlide].title}</h1>
            <p className="text-xl mb-8">{heroSlides[currentSlide].subtitle}</p>
            <Link
              to={heroSlides[currentSlide].buttonLink}
              className="inline-flex items-center bg-white text-gray-900 px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
            >
              {heroSlides[currentSlide].buttonText}
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-blue-500 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Mua Sắm Theo Danh Mục</h2>
          {loading ? (
            <div className="mt-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/products?category=${category._id}`}
                  className="group relative overflow-hidden rounded-lg"
                >
                  <img
                    src={`https://shopstorebe.onrender.com/uploads/categories/${category.image}`}
                    alt={category.name}
                    className="w-full h-64 object-cover bg-center transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/60 bg-opacity-40 flex flex-col items-center justify-center text-white">
                    <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                    <p className="text-sm">{category.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12"
          >
            Sản Phẩm Nổi Bật
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg shadow-md overflow-hidden group"
              >
                <Link to={`/products/${product.id}`} className="relative">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                  {product.discount && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm"
                    >
                      -{product.discount}%
                    </motion.span>
                  )}
                  {product.isNew && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-sm"
                    >
                      Mới
                    </motion.span>
                  )}
                  {product.isBestSeller && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute top-12 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-sm"
                    >
                      Bán chạy
                    </motion.span>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{product.category}</p>
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">({product.reviewCount})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-blue-500 font-bold">
                        {product.discount ? (
                          <>
                            <span className="text-gray-400 line-through mr-2">
                              {product.price.toLocaleString('vi-VN')}đ
                            </span>
                            {(product.price * (1 - product.discount / 100)).toLocaleString('vi-VN')}đ
                          </>
                        ) : (
                          `${product.price.toLocaleString('vi-VN')}đ`
                        )}
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors"
                      >
                        Mua ngay
                      </motion.button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-blue-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Đăng Ký Nhận Tin</h2>
          <p className="text-lg mb-8">Nhận những cập nhật và ưu đãi độc quyền!</p>
          <form className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 px-4 py-3 rounded-l-lg text-gray-900 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-white text-blue-500 px-6 py-3 rounded-r-lg hover:bg-gray-100 transition-colors"
            >
              Đăng Ký
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;