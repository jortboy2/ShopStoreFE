import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaShoppingCart, FaHeart, FaShare, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { useSnackbar } from "notistack";

const DetailProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const [promoCodeError, setPromoCodeError] = useState("");
  const [appliedPromoCode, setAppliedPromoCode] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/products/${id}`);
        setProduct(response.data.data);
        if (response.data.data.colors && response.data.data.colors.length > 0) {
          setSelectedColor(response.data.data.colors[0]);
        }
        if (response.data.data.sizes && response.data.data.sizes.length > 0) {
          setSelectedSize(response.data.data.sizes[0]);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        enqueueSnackbar("Không thể tải thông tin sản phẩm", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, enqueueSnackbar]);

  const handleAddToCart = () => {
    // Kiểm tra đăng nhập
    const token = localStorage.getItem("token");
    if (!token) {
      enqueueSnackbar("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng", {
        variant: "warning",
      });
      navigate("/login");
      return;
    }

    if (!selectedColor || !selectedSize) {
      enqueueSnackbar("Vui lòng chọn màu sắc và kích thước", {
        variant: "warning",
      });
      return;
    }

    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingItemIndex = cart.findIndex(
        (item) =>
          item.productId === product._id &&
          item.color === selectedColor &&
          item.size === selectedSize
      );

      const itemPrice = appliedPromoCode
        ? appliedPromoCode.type === "percentage"
          ? discountedPrice - (discountedPrice * appliedPromoCode.discountValue / 100)
          : discountedPrice - appliedPromoCode.discountValue
        : discountedPrice;

      if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += quantity;
        cart[existingItemIndex].price = itemPrice;
        if (appliedPromoCode) {
          cart[existingItemIndex].promoCode = appliedPromoCode.code;
          cart[existingItemIndex].promoDiscount = appliedPromoCode.type === "percentage" 
            ? (discountedPrice * appliedPromoCode.discountValue / 100)
            : appliedPromoCode.discountValue;
        }
      } else {
        cart.push({
          productId: product._id,
          name: product.name,
          price: itemPrice,
          originalPrice: product.price,
          discount: product.discount,
          image: product.images[0],
          quantity,
          size: selectedSize,
          color: selectedColor,
          ...(appliedPromoCode && {
            promoCode: appliedPromoCode.code,
            promoDiscount: appliedPromoCode.type === "percentage" 
              ? (discountedPrice * appliedPromoCode.discountValue / 100)
              : appliedPromoCode.discountValue
          })
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cart-updated"));
      enqueueSnackbar("Đã thêm vào giỏ hàng", { variant: "success" });
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      enqueueSnackbar("Có lỗi xảy ra khi thêm vào giỏ hàng", {
        variant: "error",
      });
    }
  };

  const handleBuyNow = () => {
    // Kiểm tra đăng nhập
    const token = localStorage.getItem("token");
    if (!token) {
      enqueueSnackbar("Vui lòng đăng nhập để mua hàng", {
        variant: "warning",
      });
      navigate("/login");
      return;
    }

    if (!selectedColor || !selectedSize) {
      enqueueSnackbar("Vui lòng chọn màu sắc và kích thước", {
        variant: "warning",
      });
      return;
    }

    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const itemPrice = appliedPromoCode
        ? appliedPromoCode.type === "percentage"
          ? discountedPrice - (discountedPrice * appliedPromoCode.discountValue / 100)
          : discountedPrice - appliedPromoCode.discountValue
        : discountedPrice;

      cart.push({
        productId: product._id,
        name: product.name,
        price: itemPrice,
        originalPrice: product.price,
        discount: product.discount,
        image: product.images[0],
        quantity,
        size: selectedSize,
        color: selectedColor,
        ...(appliedPromoCode && {
          promoCode: appliedPromoCode.code,
          promoDiscount: appliedPromoCode.type === "percentage" 
            ? (discountedPrice * appliedPromoCode.discountValue / 100)
            : appliedPromoCode.discountValue
        })
      });

      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cart-updated"));
      navigate("/cart");
    } catch (error) {
      console.error("Lỗi khi mua hàng:", error);
      enqueueSnackbar("Có lỗi xảy ra khi mua hàng", { variant: "error" });
    }
  };

  const handleApplyPromoCode = async () => {
    try {
      setPromoCodeError("");
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/promotions/validate`,
        { code: promoCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setAppliedPromoCode(response.data.data);
        setPromoCode("");
      } else {
        setPromoCodeError(response.data.message);
      }
    } catch (error) {
      console.error("Error validating promo code:", error);
      setPromoCodeError(error.response.data.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-semibold text-gray-700">Không tìm thấy sản phẩm</div>
      </div>
    );
  }

  const discountedPrice = product.discount 
    ? product.price - (product.price * product.discount / 100) 
    : product.price;

  const finalPrice = appliedPromoCode
    ? appliedPromoCode.type === "percentage"
      ? discountedPrice - (discountedPrice * appliedPromoCode.discountValue / 100)
      : discountedPrice - appliedPromoCode.discountValue
    : discountedPrice;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg border border-gray-200">
            <img 
              src={`https://shopstorebe.onrender.com/uploads/categories/${product.images[activeImage]}`} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Thumbnail Gallery */}
          <div className="grid grid-cols-5 gap-2">
            {product.images.map((image, index) => (
              <div 
                key={index}
                className={`aspect-square overflow-hidden rounded-md border cursor-pointer transition-all ${
                  activeImage === index ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-200'
                }`}
                onClick={() => setActiveImage(index)}
              >
                <img 
                  src={`https://shopstorebe.onrender.com/uploads/categories/${image}`} 
                  alt={`${product.name} - ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <div className="flex items-center mt-2">
              <div className="flex text-yellow-400">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStarHalfAlt />
              </div>
              <span className="ml-2 text-sm text-gray-500">(4.5 - 120 đánh giá)</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {product.discount > 0 && (
              <span className="text-2xl font-bold text-red-600">
                {new Intl.NumberFormat('vi-VN').format(finalPrice)}đ
              </span>
            )}
            <span className={`text-xl ${product.discount > 0 ? 'line-through text-gray-500' : 'font-bold text-gray-900'}`}>
              {new Intl.NumberFormat('vi-VN').format(product.price)}đ
            </span>
            {product.discount > 0 && (
              <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                -{product.discount}%
              </span>
            )}
            {appliedPromoCode && (
              <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm font-medium">
                -{appliedPromoCode.type === "percentage" ? `${appliedPromoCode.discountValue}%` : `${new Intl.NumberFormat('vi-VN').format(appliedPromoCode.discountValue)}đ`}
              </span>
            )}
          </div>

          <div className="border-t border-b border-gray-200 py-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Tồn kho:</span>
              <span className="font-medium">{product.stock || '0'}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-gray-500">Tình trạng:</span>
              <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
              </span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-gray-500">Giới tính:</span>
              <span className="font-medium">{product.gender || 'Unisex'}</span>
            </div>
          </div>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Màu sắc:</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 border rounded-md transition-all ${
                      selectedColor === color 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Kích thước:</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size, index) => (
                  <button
                    key={index}
                    className={`w-12 h-12 flex items-center justify-center border rounded-md transition-all ${
                      selectedSize === size 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Số lượng:</h3>
            <div className="flex items-center">
              <button 
                className="w-10 h-10 cursor-pointer flex items-center justify-center border border-gray-300 rounded-l-md"
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              >
                -
              </button>
              <input 
                type="number" 
                min="1" 
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                className="w-16 h-10 text-center border-t border-b border-gray-300"
              />
              <button 
                className="w-10 h-10 cur flex items-center justify-center border border-gray-300 rounded-r-md"
                onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
              >
                +
              </button>
            </div>
          </div>

          {/* Promo Code */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-900">Mã giảm giá:</h3>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Nhập mã giảm giá"
                  className="block w-full outline-none px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500 text-sm">CODE</span>
                </div>
              </div>
              <button
                onClick={handleApplyPromoCode}
                className="px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
              >
                Áp dụng
              </button>
            </div>
            {promoCodeError && (
              <p className="text-sm text-red-500">{promoCodeError}</p>
            )}
            {appliedPromoCode && (
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium text-green-700">
                    Đã áp dụng mã: {appliedPromoCode.code}
                  </span>
                </div>
                <button
                  onClick={() => setAppliedPromoCode(null)}
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  Xóa
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors"
            >
              <FaShoppingCart />
              <span>Thêm vào giỏ hàng</span>
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-6 rounded-md hover:bg-red-700 transition-colors"
            >
              <span>Mua ngay</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-4 pt-4">
            <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
              <FaHeart />
              <span>Yêu thích</span>
            </button>
            <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
              <FaShare />
              <span>Chia sẻ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="mt-12 border p-2 border-gray-200 rounded-lg pt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">Mô tả sản phẩm</h2>
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.description }}></div>
      </div>

      {/* Comments Section */}
      <div className="mt-12 border border-gray-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">Đánh giá sản phẩm</h2>
        
        {/* Comment Form */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Viết đánh giá của bạn</h3>
          <form className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-700">Đánh giá:</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="text-yellow-400 hover:text-yellow-500 focus:outline-none"
                  >
                    <FaStar className="w-6 h-6" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Gửi đánh giá
              </button>
            </div>
          </form>
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          {/* Sample Comment - Replace with actual comments from API */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-600 font-semibold">NV</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Nguyễn Văn</h4>
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                    </div>
                    <span className="ml-2 text-sm text-gray-500">5.0</span>
                  </div>
                </div>
              </div>
              <span className="text-sm text-gray-500">2 ngày trước</span>
            </div>
            <p className="text-gray-700">
              Sản phẩm rất đẹp, chất lượng tốt. Tôi rất hài lòng với sản phẩm này. Giao hàng nhanh, đóng gói cẩn thận.
            </p>
          </div>

          {/* Another Sample Comment */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-600 font-semibold">TH</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Trần Hương</h4>
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStarHalfAlt />
                    </div>
                    <span className="ml-2 text-sm text-gray-500">4.5</span>
                  </div>
                </div>
              </div>
              <span className="text-sm text-gray-500">1 tuần trước</span>
            </div>
            <p className="text-gray-700">
              Chất liệu vải mềm mại, thoáng mát. Màu sắc đúng như hình. Tuy nhiên size hơi nhỏ so với bảng size.
            </p>
          </div>
        </div>

        {/* Load More Comments Button */}
        <div className="mt-6 text-center">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            Xem thêm đánh giá
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailProduct;
