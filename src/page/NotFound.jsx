import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaArrowLeft } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="relative">
          {/* Animated 404 text */}
          <h1 className="text-9xl font-bold text-blue-600 opacity-20 absolute -top-20 left-1/2 transform -translate-x-1/2">
            404
          </h1>
          
          {/* Main content */}
          <div className="relative z-10">
            <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-transform duration-300">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Oops! Không tìm thấy trang
              </h2>
              <p className="text-gray-600 mb-8">
                Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không khả dụng.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/"
                  className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                  <FaHome className="mr-2" />
                  Về trang chủ
                </Link>
                <button
                  onClick={() => window.history.back()}
                  className="flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300"
                >
                  <FaArrowLeft className="mr-2" />
                  Quay lại
                </button>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-blue-200 rounded-full opacity-50"></div>
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-indigo-200 rounded-full opacity-50"></div>
            <div className="absolute top-20 right-20 w-12 h-12 bg-purple-200 rounded-full opacity-50"></div>
            <div className="absolute bottom-20 left-20 w-10 h-10 bg-pink-200 rounded-full opacity-50"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 