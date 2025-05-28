import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCreditCard, FaMobileAlt, FaMoneyBillWave } from "react-icons/fa";
import { useSnackbar } from "notistack";
import axios from "axios";

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    note: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (savedCart.length === 0) {
      navigate("/cart");
      return;
    }
    setCart(savedCart);
    calculateTotal(savedCart);
  }, [navigate]);

  const calculateTotal = (cartItems) => {
    const total = cartItems.reduce((sum, item) => {
      const price = item.price * (1 - (item.discount || 0) / 100);
      return sum + price * item.quantity;
    }, 0);
    setTotal(total);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate form
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      enqueueSnackbar("Vui lòng điền đầy đủ thông tin", { variant: "warning" });
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        enqueueSnackbar("Vui lòng đăng nhập để đặt hàng", { variant: "warning" });
        return;
      }

      // Lấy thông tin user từ localStorage
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData || !userData.id) {
        throw new Error("Không tìm thấy thông tin người dùng");
      }

      // Chuẩn bị dữ liệu đơn hàng
      const orderData = {
        userId: userData.id,
        items: cart.map(item => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: item.price,
          discount: item.discount || 0,
          image: item.image
        })),
        shippingAddress: formData.address,
        phone: formData.phone,
        email: formData.email,
        fullName: formData.name,
        paymentMethod: paymentMethod === "bank" ? "bank_transfer" : paymentMethod === "cod" ? "cash_on_delivery" : "momo",
        totalAmount: total,
        note: formData.note || "",
        status: "pending"
      };

      console.log("Sending order data:", orderData); // Debug log

      // Gửi request tạo đơn hàng
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/orders`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("Order response:", response.data); // Debug log

      if (response.data.success) {
        // Xóa giỏ hàng
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cart-updated"));
        enqueueSnackbar(
            response.data.message || "Đặt hàng thành công",
            { variant: "success" }
          );
        // Chuyển hướng đến trang thành công
        navigate(`/`);
      } else {
        throw new Error(response.data.message || "Có lỗi xảy ra khi đặt hàng");
      }
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      enqueueSnackbar(
        error.response?.data?.message || "Có lỗi xảy ra khi đặt hàng",
        { variant: "error" }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/cart")}
        className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
      >
        <FaArrowLeft className="mr-2" />
        Quay lại giỏ hàng
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Đơn Hàng</h2>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="divide-y divide-gray-200">
              {cart.map((item, index) => (
                <div key={index} className="py-4 flex items-center">
                  <img
                    src={`https://shopstorebe.onrender.com/uploads/categories/${item.image}`}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-600 text-sm">
                      {item.quantity} x{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.price * (1 - (item.discount || 0) / 100))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between font-semibold text-lg">
                <span>Tổng cộng:</span>
                <span>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Thông Tin Thanh Toán</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2">Họ và tên</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Số điện thoại</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Địa chỉ</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Ghi chú</label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>

            {/* Payment Methods */}
            <div>
              <label className="block text-gray-700 mb-4">Phương thức thanh toán</label>
              <div className="space-y-4">
                <div
                  className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                    paymentMethod === "momo"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                  onClick={() => setPaymentMethod("momo")}
                >
                  <FaMobileAlt className="text-pink-500 text-2xl mr-4" />
                  <div>
                    <h3 className="font-semibold">Ví Momo</h3>
                    <p className="text-sm text-gray-600">
                      Thanh toán nhanh chóng qua ứng dụng Momo
                    </p>
                  </div>
                </div>

                <div
                  className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                    paymentMethod === "bank"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                  onClick={() => setPaymentMethod("bank")}
                >
                  <FaCreditCard className="text-green-500 text-2xl mr-4" />
                  <div>
                    <h3 className="font-semibold">Chuyển khoản ngân hàng</h3>
                    <p className="text-sm text-gray-600">
                      Chuyển khoản trực tiếp đến tài khoản ngân hàng
                    </p>
                  </div>
                </div>

                <div
                  className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                    paymentMethod === "cod"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                  onClick={() => setPaymentMethod("cod")}
                >
                  <FaMoneyBillWave className="text-yellow-500 text-2xl mr-4" />
                  <div>
                    <h3 className="font-semibold">Thanh toán khi nhận hàng (COD)</h3>
                    <p className="text-sm text-gray-600">
                      Thanh toán bằng tiền mặt khi nhận hàng
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            {paymentMethod === "momo" && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Hướng dẫn thanh toán Momo</h3>
                <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2">
                  <li>Mở ứng dụng Momo trên điện thoại</li>
                  <li>Quét mã QR bên dưới hoặc nhập số điện thoại</li>
                  <li>Xác nhận thanh toán trong ứng dụng</li>
                </ol>
                <div className="mt-4 p-4 bg-white rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-2">Quét mã QR để thanh toán</p>
                  <div className="w-48 h-48 mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
                    {/* QR Code placeholder */}
                    <span className="text-gray-500">QR Code</span>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "bank" && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Thông tin chuyển khoản</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Ngân hàng: Vietcombank</p>
                    <p className="text-sm text-gray-600">Số tài khoản: 1234567890</p>
                    <p className="text-sm text-gray-600">Chủ tài khoản: ShopSell</p>
                    <p className="text-sm text-gray-600">Số tiền: {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(total)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Nội dung chuyển khoản:</p>
                    <p className="text-sm font-mono bg-white p-2 rounded">
                      DONHANG {Date.now()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "cod" && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Thông tin thanh toán khi nhận hàng</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Số tiền cần thanh toán: {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(total)}</p>
                    <p className="text-sm text-gray-600">Phương thức: Tiền mặt</p>
                    <p className="text-sm text-gray-600">Thời gian: Khi nhận hàng</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Lưu ý:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>Vui lòng kiểm tra hàng hóa trước khi thanh toán</li>
                      <li>Chỉ thanh toán khi đã kiểm tra và hài lòng với sản phẩm</li>
                      <li>Nhân viên giao hàng sẽ cung cấp hóa đơn sau khi thanh toán</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Đang xử lý..." : "Đặt Hàng"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 