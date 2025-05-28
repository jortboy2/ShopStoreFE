import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaClock } from "react-icons/fa";
import { useSnackbar } from "notistack";
import axios from "axios";

const Promocode = () => {
  const [promocodes, setPromocodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCode, setEditingCode] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    type: "percentage",
    discountValue: 0,
    startDate: "",
    endDate: "",
    minPurchase: 0,
    maxDiscount: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchPromocodes();
  }, []);

  const fetchPromocodes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/promotions`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setPromocodes(response.data.data);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching promocodes:", error);
      enqueueSnackbar("Không thể tải danh sách mã giảm giá", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const url = editingCode
        ? `${import.meta.env.VITE_API_URL}/promotions/${editingCode._id}`
        : `${import.meta.env.VITE_API_URL}/promotions`;

      const response = await axios[editingCode ? "put" : "post"](
        url,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        enqueueSnackbar(
          editingCode
            ? "Cập nhật mã giảm giá thành công"
            : "Tạo mã giảm giá thành công",
          { variant: "success" }
        );
        setShowModal(false);
        setEditingCode(null);
        setFormData({
          code: "",
          type: "percentage",
          discountValue: 0,
          startDate: "",
          endDate: "",
          minPurchase: 0,
          maxDiscount: 0,
          isActive: true,
        });
        fetchPromocodes();
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error saving promocode:", error);
      enqueueSnackbar(
        editingCode
          ? "Không thể cập nhật mã giảm giá"
          : "Không thể tạo mã giảm giá",
        { variant: "error" }
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa mã giảm giá này?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/promotions/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        enqueueSnackbar("Xóa mã giảm giá thành công", { variant: "success" });
        fetchPromocodes();
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting promocode:", error);
      enqueueSnackbar("Không thể xóa mã giảm giá", { variant: "error" });
    }
  };

  const handleEdit = (code) => {
    setEditingCode(code);
    setFormData({
      code: code.code,
      type: code.type,
      discountValue: code.discountValue,
      startDate: new Date(code.startDate).toISOString().split("T")[0],
      endDate: new Date(code.endDate).toISOString().split("T")[0],
      minPurchase: code.minPurchase,
      maxDiscount: code.maxDiscount,
      isActive: code.isActive,
    });
    setShowModal(true);
  };

  const CountdownTimer = ({ endDate }) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
      const difference = new Date(endDate) - new Date();
      if (difference <= 0) return { expired: true };

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        expired: false,
      };
    }

    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);

      return () => clearInterval(timer);
    }, [endDate]);

    if (timeLeft.expired) {
      return <span className="text-red-500">Đã hết hạn</span>;
    }

    return (
      <div className="flex items-center space-x-2">
        <FaClock className="text-blue-500" />
        <span className="text-sm">
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </span>
      </div>
    );
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
        <h1 className="text-2xl font-bold text-gray-800">Quản lý mã giảm giá</h1>
        <button
          onClick={() => {
            setEditingCode(null);
            setFormData({
              code: "",
              type: "percentage",
              discountValue: 0,
              startDate: "",
              endDate: "",
              minPurchase: 0,
              maxDiscount: 0,
              isActive: true,
            });
            setShowModal(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
        >
          <FaPlus className="mr-2" />
          Tạo mã mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promocodes.map((code) => (
          <div
            key={code._id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{code.code}</h3>
                <p className="text-sm text-gray-500">
                  {code.type === "percentage"
                    ? `Giảm ${code.discountValue}%`
                    : `Giảm ${new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(code.discountValue)}`}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(code)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(code._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Đơn tối thiểu:</span>
                <span className="font-medium">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(code.minPurchase)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Giảm tối đa:</span>
                <span className="font-medium">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(code.maxDiscount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Trạng thái:</span>
                <span
                  className={`${
                    code.isActive ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {code.isActive ? "Đang hoạt động" : "Đã khóa"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Thời gian còn lại:</span>
                <CountdownTimer endDate={code.endDate} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {editingCode ? "Chỉnh sửa mã giảm giá" : "Tạo mã giảm giá mới"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Mã giảm giá
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({ ...formData, code: e.target.value.toUpperCase() })
                      }
                      className="block w-full outline-none px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      placeholder="Nhập mã giảm giá"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-gray-500 text-sm">CODE</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Loại giảm giá
                  </label>
                  <div className="relative">
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      className="block w-full outline-none px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 appearance-none"
                      required
                    >
                      <option value="percentage">Phần trăm (%)</option>
                      <option value="fixed">Số tiền cố định</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Giá trị giảm giá
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.discountValue}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discountValue: parseFloat(e.target.value),
                        })
                      }
                      className="block w-full outline-none px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      placeholder="0"
                      required
                      min="0"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-gray-500 text-sm">
                        {formData.type === "percentage" ? "%" : "₫"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Ngày bắt đầu
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) =>
                          setFormData({ ...formData, startDate: e.target.value })
                        }
                        className="block w-full outline-none px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        required
                      />
                   
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Ngày kết thúc
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) =>
                          setFormData({ ...formData, endDate: e.target.value })
                        }
                        className="block w-full outline-none px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        required
                      />
                      
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Đơn hàng tối thiểu
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.minPurchase}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            minPurchase: parseFloat(e.target.value),
                          })
                        }
                        className="block w-full outline-none px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="0"
                        required
                        min="0"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-gray-500 text-sm">₫</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Giảm tối đa
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.maxDiscount}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            maxDiscount: parseFloat(e.target.value),
                          })
                        }
                        className="block w-full outline-none px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="0"
                        required
                        min="0"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-gray-500 text-sm">₫</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition duration-200"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Kích hoạt mã giảm giá
                  </label>
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingCode(null);
                    }}
                    className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
                  >
                    {editingCode ? "Cập nhật" : "Tạo mới"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Promocode;
