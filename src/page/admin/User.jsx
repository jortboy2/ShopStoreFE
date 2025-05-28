import React, { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaPhone, FaUserShield, FaUserAlt, FaShoppingCart, FaTimes } from "react-icons/fa";
import { useSnackbar } from "notistack";
import axios from "axios";

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          setUsers(response.data.data);
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        enqueueSnackbar("Không thể tải danh sách người dùng", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [enqueueSnackbar]);

  const handleUserClick = async (user) => {
    try {
      setSelectedUser(user);
      setShowModal(true);
      
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/orders/user/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setUserOrders(response.data.data);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching user orders:", error);
      enqueueSnackbar("Không thể tải đơn hàng của người dùng", { variant: "error" });
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <FaUserShield className="text-red-500" />;
      case "user":
        return <FaUserAlt className="text-blue-500" />;
      default:
        return <FaUser className="text-gray-500" />;
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case "admin":
        return "Quản trị viên";
      case "user":
        return "Người dùng";
      default:
        return role;
    }
  };

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
        <div className="text-sm text-gray-500">
          Tổng số người dùng: {users.length}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleUserClick(user)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  {getRoleIcon(user.role)}
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-lg">{user.username}</h3>
                  <p className="text-sm text-gray-500">{getRoleText(user.role)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <FaEnvelope className="mr-2" />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaPhone className="mr-2" />
                <span className="text-sm">{user.phone || "Chưa cập nhật"}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Ngày tạo:</span>
                <span>
                  {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>Trạng thái:</span>
                <span className={`${
                  user.isActive ? "text-green-500" : "text-red-500"
                }`}>
                  {user.isActive ? "Đang hoạt động" : "Đã khóa"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* User Detail Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Chi tiết người dùng</h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedUser(null);
                    setUserOrders([]);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="font-semibold mb-4">Thông tin cá nhân</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Tên đăng nhập</p>
                      <p className="font-medium">{selectedUser.username}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Số điện thoại</p>
                      <p className="font-medium">{selectedUser.phone || "Chưa cập nhật"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Vai trò</p>
                      <p className="font-medium">{getRoleText(selectedUser.role)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Ngày tạo</p>
                      <p className="font-medium">
                        {new Date(selectedUser.createdAt).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Thống kê đơn hàng</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Tổng số đơn hàng</p>
                      <p className="font-medium">{userOrders.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tổng chi tiêu</p>
                      <p className="font-medium">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(
                          userOrders.reduce((sum, order) => sum + order.totalAmount, 0)
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Lịch sử đơn hàng</h3>
                <div className="space-y-4">
                  {userOrders.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Chưa có đơn hàng nào</p>
                  ) : (
                    userOrders.map((order) => (
                      <div
                        key={order._id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="font-medium">Đơn hàng #{order._id.slice(-6)}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleString("vi-VN")}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Sản phẩm</p>
                            <div className="mt-2 space-y-2">
                              {order.items.slice(0, 2).map((item, index) => (
                                <div key={index} className="flex items-center">
                                  <img
                                    src={`https://shopstorebe.onrender.com/uploads/categories/${item.image}`}
                                    alt={item.name}
                                    className="w-10 h-10 object-cover rounded"
                                  />
                                  <div className="ml-3">
                                    <p className="text-sm font-medium">{item.name}</p>
                                    <p className="text-xs text-gray-500">
                                      {item.quantity} x{" "}
                                      {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                      }).format(item.price * (1 - (item.discount || 0) / 100))}
                                    </p>
                                  </div>
                                </div>
                              ))}
                              {order.items.length > 2 && (
                                <p className="text-sm text-gray-500">
                                  +{order.items.length - 2} sản phẩm khác
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-sm text-gray-500">Tổng tiền</p>
                            <p className="text-lg font-semibold">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(order.totalAmount)}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                              {order.paymentMethod === "momo" ? "Ví MoMo" : 
                               order.paymentMethod === "bank_transfer" ? "Chuyển khoản ngân hàng" : 
                               "Thanh toán khi nhận hàng"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
