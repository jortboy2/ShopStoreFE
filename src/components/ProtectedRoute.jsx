import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token) {
    // Nếu không có token, chuyển hướng về trang login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user || user.role !== 'admin') {
    // Nếu không phải admin, chuyển hướng về trang chủ
    return <Navigate to="/" replace />;
  }

  // Nếu có token và là admin, cho phép truy cập
  return children;
};

export default ProtectedRoute; 