import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTruck, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useSnackbar } from "notistack";
import axios from "axios";

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          enqueueSnackbar("Vui lòng đăng nhập để xem đơn hàng", { variant: "warning" });
          navigate("/login");
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setOrder(response.data.data);
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        enqueueSnackbar("Không thể tải thông tin đơn hàng", { variant: "error" });
        navigate("/orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, enqueueSnackbar, navigate]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "processing":
        return "Đang xử lý";
      case "shipped":
        return "Đang giao hàng";
      case "delivered":
        return "Đã giao hàng";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-semibold text-gray-700">Không tìm thấy đơn hàng</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/orders")}
        className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
      >
        <FaArrowLeft className="mr-2" />
        Quay lại danh sách đơn hàng
      </button>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Đơn hàng #{order._id}</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            {getStatusText(order.status)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Timeline */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Trạng thái đơn hàng</h2>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              <div className="space-y-6">
                {[
                  { status: "pending", icon: <FaCheckCircle />, text: "Đơn hàng đã được đặt" },
                  { status: "processing", icon: <FaCheckCircle />, text: "Đơn hàng đang được xử lý" },
                  { status: "shipped", icon: <FaTruck />, text: "Đơn hàng đang được giao" },
                  { status: "delivered", icon: <FaCheckCircle />, text: "Đơn hàng đã được giao" },
                ].map((step, index) => (
                  <div key={index} className="relative flex items-center">
                    <div className={`z-10 flex items-center justify-center w-8 h-8 rounded-full ${
                      order.status === step.status || 
                      (step.status === "delivered" && order.status === "delivered") ||
                      (step.status === "shipped" && (order.status === "shipped" || order.status === "delivered")) ||
                      (step.status === "processing" && (order.status === "processing" || order.status === "shipped" || order.status === "delivered")) ||
                      (step.status === "pending" && order.status !== "cancelled")
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}>
                      {step.icon}
                    </div>
                    <div className="ml-4">
                      <p className={`text-sm ${
                        order.status === step.status ||
                        (step.status === "delivered" && order.status === "delivered") ||
                        (step.status === "shipped" && (order.status === "shipped" || order.status === "delivered")) ||
                        (step.status === "processing" && (order.status === "processing" || order.status === "shipped" || order.status === "delivered")) ||
                        (step.status === "pending" && order.status !== "cancelled")
                          ? "text-gray-900"
                          : "text-gray-500"
                      }`}>
                        {step.text}
                      </p>
                      {order.status === step.status && (
                        <p className="text-xs text-gray-500">
                          {new Date(order.updatedAt).toLocaleString("vi-VN")}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {order.status === "cancelled" && (
                  <div className="relative flex items-center">
                    <div className="z-10 flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white">
                      <FaTimesCircle />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-900">Đơn hàng đã bị hủy</p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.updatedAt).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Thông tin đơn hàng</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Ngày đặt hàng</p>
                <p className="font-medium">{new Date(order.createdAt).toLocaleString("vi-VN")}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phương thức thanh toán</p>
                <p className="font-medium">
                  {order.paymentMethod === "momo" ? "Ví MoMo" : "Chuyển khoản ngân hàng"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Địa chỉ giao hàng</p>
                <p className="font-medium">{order.shippingAddress}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Số điện thoại</p>
                <p className="font-medium">{order.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{order.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Sản phẩm</h2>
        <div className="divide-y divide-gray-200">
          {order.items.map((item, index) => (
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
                <p className="text-gray-600 text-sm">
                  Màu: {item.color} | Size: {item.size}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(
                    item.price * (1 - (item.discount || 0) / 100) * item.quantity
                  )}
                </p>
                {item.discount > 0 && (
                  <p className="text-sm text-gray-500 line-through">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.price * item.quantity)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Order Total */}
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between mb-2">
            <span>Tạm tính:</span>
            <span>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(order.totalAmount)}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Phí vận chuyển:</span>
            <span>Miễn phí</span>
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Tổng cộng:</span>
            <span>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(order.totalAmount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail; 