import { useState } from 'react';
import { FaTimes, FaEnvelope, FaLock, FaGoogle, FaFacebook } from 'react-icons/fa';
import axios from 'axios';
import RegisterModal from './RegisterModal';
import { useSnackbar } from 'notistack';

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email không được để trống';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.post('https://shopstorebe.onrender.com/api/auth/login', formData);
      
      if (response.data.success) {
        // Đảm bảo userData là một object hợp lệ
        const userData = {
          id: response.data.user.id,
          username: response.data.user.username,
          email: response.data.user.email,
          role: response.data.user.role,
          phone: response.data.user.phone,
        };

        // Lưu token và thông tin user
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Thông báo thành công
        enqueueSnackbar('Đăng nhập thành công!', {
          variant: 'success',
          autoHideDuration: 2000,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });

        // Đóng modal và cập nhật trạng thái
        onClose();
        onLoginSuccess(userData);
      }
    } catch (error) {
      // Xử lý các loại lỗi khác nhau
      if (error.response) {
        // Lỗi từ server
        setErrorMessage(error.response.data.message || 'Có lỗi xảy ra khi đăng nhập');
        enqueueSnackbar(error.response.data.message || 'Có lỗi xảy ra khi đăng nhập', {
          variant: 'error',
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
      } else if (error.request) {
        // Lỗi kết nối
        setErrorMessage('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
        enqueueSnackbar('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.', {
          variant: 'error',
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
      } else {
        // Lỗi khác
        setErrorMessage('Có lỗi xảy ra. Vui lòng thử lại.');
        enqueueSnackbar('Có lỗi xảy ra. Vui lòng thử lại.', {
          variant: 'error',
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // Xử lý đăng nhập mạng xã hội
    console.log(`Đăng nhập với ${provider}`);
  };

  const handleRegisterSuccess = (userData) => {
    // Sau khi đăng ký thành công, tự động đăng nhập
    formData.email = userData.email;
    formData.password = userData.password;
    handleSubmit();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${showRegister ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        {/* Overlay with blur effect */}
        <div 
          className="fixed inset-0 bg-black/60 transition-opacity"
          onClick={() => {
            onClose();
            setShowRegister(false);
          }}
        />

        {/* Modal with glass effect */}
        <div className="relative bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 border border-white/20">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>

          {/* Header */}
          <div className="px-6 py-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Đăng Nhập</h2>
            <p className="mt-2 text-sm text-gray-600">
              Chào mừng bạn trở lại! Vui lòng đăng nhập vào tài khoản của bạn.
            </p>
          </div>

          {/* Social Login */}
          <div className="px-6">
            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => handleSocialLogin('google')}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 hover:bg-white transition-colors shadow-sm"
              >
                <FaGoogle className="text-red-500 text-xl" />
              </button>
              <button
                onClick={() => handleSocialLogin('facebook')}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 hover:bg-white transition-colors shadow-sm"
              >
                <FaFacebook className="text-blue-600 text-xl" />
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/80 backdrop-blur-sm text-gray-500">Hoặc đăng nhập với email</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-8">
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
                {errorMessage}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90 backdrop-blur-sm ${
                      errors.email ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="example@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90 backdrop-blur-sm ${
                      errors.password ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                 
                  
                </div>
                <button
                  type="button"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Quên mật khẩu?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                  isLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="px-6 py-4 bg-white/50 backdrop-blur-sm rounded-b-2xl border-t border-white/20">
            <p className="text-center text-sm text-gray-600">
              Chưa có tài khoản?{' '}
              <button
                className="font-medium text-blue-600 hover:text-blue-500"
                onClick={() => setShowRegister(true)}
              >
                Đăng ký ngay
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Register Modal */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${showRegister ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
        <RegisterModal
          isOpen={showRegister}
          onClose={() => {
            setShowRegister(false);
            onClose();
          }}
          onRegisterSuccess={handleRegisterSuccess}
        />
      </div>
    </>
  );
};

export default LoginModal; 