import { useState, useEffect } from "react";
import { FaUsers, FaShoppingCart, FaBox, FaDollarSign } from "react-icons/fa";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import { useSnackbar } from "notistack";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  // Sample data for charts
  const revenueData = {
    labels: [
      "T1",
      "T2",
      "T3",
      "T4",
      "T5",
      "T6",
      "T7",
      "T8",
      "T9",
      "T10",
      "T11",
      "T12",
    ],
    datasets: [
      {
        label: "Doanh Thu (triệu VNĐ)",
        data: [12, 19, 3, 5, 2, 3, 7, 8, 9, 10, 11, 12],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const orderData = {
    labels: [
      "T1",
      "T2",
      "T3",
      "T4",
      "T5",
      "T6",
      "T7",
      "T8",
      "T9",
      "T10",
      "T11",
      "T12",
    ],
    datasets: [
      {
        label: "Số Đơn Hàng",
        data: [65, 59, 80, 81, 56, 55, 40, 45, 50, 55, 60, 65],
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };

  const categoryData = {
    labels: ["Quần Áo", "Giày Dép", "Phụ Kiện", "Đồng Hồ", "Khác"],
    datasets: [
      {
        data: [300, 250, 200, 150, 100],
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (!token || !userData) {
          enqueueSnackbar("Vui lòng đăng nhập", { variant: "warning" });
          return;
        }

        const user = JSON.parse(userData);

        // Fetch user orders
        const ordersResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/orders/user/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Fetch total users
        const usersResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/users`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const productsResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/products`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (ordersResponse.data.success && usersResponse.data.success) {
          const orders = ordersResponse.data.data;
          const users = usersResponse.data.data;
          const total_user = users.filter(
            (user) => user.role === "user"
          ).length;
          // Calculate statistics
          const totalOrders = orders.length;
          const totalProducts = productsResponse.data.data.length;
          const totalRevenue = orders.reduce(
            (sum, order) => sum + order.totalAmount,
            0
          );

          setStats({
            totalUsers: total_user,
            totalOrders,
            totalProducts,
            totalRevenue,
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        enqueueSnackbar("Không thể tải thống kê", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [enqueueSnackbar]);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          enqueueSnackbar("Vui lòng đăng nhập", { variant: "warning" });
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/orders`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          const orders = response.data.data;
          const sortedOrders = orders.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setRecentOrders(sortedOrders.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching recent orders:", error);
        enqueueSnackbar("Không thể tải đơn hàng gần đây", { variant: "error" });
      }
    };

    fetchRecentOrders();
  }, [enqueueSnackbar]);

  useEffect(() => {
    const fetchRecentUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          enqueueSnackbar("Vui lòng đăng nhập", { variant: "warning" });
          return;
        }

        const usersResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/users`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const ordersResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/orders`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (usersResponse.data.success && ordersResponse.data.success) {
          const users = usersResponse.data.data;
          const orders = ordersResponse.data.data;

          // Filter recent users based on matching userId in orders
          const recentUsers = orders
            .map((order) => {
              const user = users.find((user) => user.id === order.userId);
              return user ? { id: user.id, name: user.name } : null;
            })
            .filter(Boolean);

          setRecentUsers(recentUsers);
        }
      } catch (error) {
        console.error("Error fetching recent users:", error);
        enqueueSnackbar("Không thể tải người dùng gần đây", {
          variant: "error",
        });
      }
    };

    fetchRecentUsers();
  }, [enqueueSnackbar]);

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color} text-white`}>{icon}</div>
        <div className="ml-4">
          <h2 className="text-gray-600 text-sm">{title}</h2>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Tổng Quan</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng Người Dùng"
          value={stats.totalUsers}
          icon={<FaUsers size={24} />}
          color="bg-blue-500"
        />
        <StatCard
          title="Tổng Đơn Hàng"
          value={stats.totalOrders}
          icon={<FaShoppingCart size={24} />}
          color="bg-green-500"
        />
        <StatCard
          title="Tổng Sản Phẩm"
          value={stats.totalProducts}
          icon={<FaBox size={24} />}
          color="bg-yellow-500"
        />
        <StatCard
          title="Tổng Doanh Thu"
          value={`${stats.totalRevenue.toLocaleString()} VNĐ`}
          icon={<FaDollarSign size={24} />}
          color="bg-purple-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Doanh Thu Theo Tháng</h2>
          <Line data={revenueData} />
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Đơn Hàng Theo Tháng</h2>
          <Bar data={orderData} />
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Phân Bố Danh Mục</h2>
          <Pie data={categoryData} />
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Đơn Hàng Gần Đây</h2>
          <div className="space-y-4">
            {recentOrders.map((order) => {
              return (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <p className="font-medium">Đơn hàng #{order._id}</p>
                    <p className="text-sm text-gray-500">
                      Người dùng: {order.fullName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {order.totalAmount.toLocaleString()} VNĐ
                    </p>
                    <p
                      className={`text-sm ${
                        order.status === "Đã giao hàng"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {order.status}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
