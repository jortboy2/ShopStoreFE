import React, { useState, useEffect } from "react";
import { useSearchParams, Link, useParams } from "react-router-dom";
import axios from "axios";
import { FaFilter, FaSearch, FaStar, FaShoppingCart, FaHeart } from "react-icons/fa";
import { useSnackbar } from "notistack";

const Productpage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categorySlug } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    gender: searchParams.get("gender") || "",
    search: searchParams.get("search") || "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
        setCategories(response.data.data.filter(cat => cat.isActive));
        
        // If we have a category slug, find the corresponding category ID
        if (categorySlug) {
          const category = response.data.data.find(cat => cat.slug === categorySlug);
          if (category) {
            setFilters(prev => ({
              ...prev,
              category: category._id
            }));
          }
        }
      } catch (error) {
        enqueueSnackbar("Không thể tải danh mục sản phẩm", { variant: "error" });
      }
    };

    fetchCategories();
  }, [categorySlug, enqueueSnackbar]);

  // Update the API call to fetch products based on search
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = `${import.meta.env.VITE_API_URL}/products/search`;

        // Build query parameters for filters
        const params = new URLSearchParams();
        if (filters.category) params.append("category", filters.category);
        if (filters.minPrice) params.append("minPrice", filters.minPrice);
        if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
        if (filters.gender) params.append("gender", filters.gender);
        if (filters.search) params.append("name", filters.search);

        const queryString = params.toString();
        if (queryString) {
          url += `?${queryString}`;
        }else if (filters.category) {
          url = `${import.meta.env.VITE_API_URL}/products/category/${filters.category}`;
        }

        const response = await axios.get(url);
        setProducts(response.data.data);
      } catch (error) {
        // enqueueSnackbar("Không thể tải sản phẩm", { variant: "error" });
        return [];
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    // Update URL params
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  }, [filters, setSearchParams, enqueueSnackbar]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearchChange = (e) => {
    setFilters(prev => ({
      ...prev,
      search: e.target.value
    }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // The useEffect will handle the search
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      gender: "",
      search: filters.search, // Keep search term
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  // Get current category name if a category is selected
  const getCurrentCategoryName = () => {
    if (!filters.category) return "Tất cả sản phẩm";
    const category = categories.find(cat => cat._id === filters.category);
    return category ? category.name : "Sản phẩm";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{getCurrentCategoryName()}</h1>
        <p className="text-gray-600">Khám phá bộ sưu tập sản phẩm của chúng tôi</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </form>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Bộ lọc</h2>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden text-blue-600 hover:text-blue-800"
              >
                {showFilters ? 'Đóng' : 'Mở'}
              </button>
            </div>

            <div className="space-y-6">
              {/* Category Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Danh mục</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={filters.category === ""}
                      onChange={handleFilterChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">Tất cả</span>
                  </label>
                  {categories.map(category => (
                    <label key={category._id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category._id}
                        checked={filters.category === category._id}
                        onChange={handleFilterChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Khoảng giá</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    name="minPrice"
                    placeholder="Từ"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="Đến"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Gender Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Giới tính</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value=""
                      checked={filters.gender === ""}
                      onChange={handleFilterChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">Tất cả</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="Nam"
                      checked={filters.gender === "Nam"}
                      onChange={handleFilterChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">Nam</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="Nữ"
                      checked={filters.gender === "Nữ"}
                      onChange={handleFilterChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">Nữ</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="Unisex"
                      checked={filters.gender === "Unisex"}
                      onChange={handleFilterChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">Unisex</span>
                  </label>
                </div>
              </div>

              {/* Clear Filters Button */}
              <button
                onClick={clearFilters}
                className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:w-3/4">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              <FaFilter className="mr-2" />
              {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
            </button>
          </div>

          {/* Products Count */}
          <div className="mb-4">
            <p className="text-gray-600">
              Hiển thị <span className="font-medium">{products.length}</span> sản phẩm
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
              <p className="text-gray-600">Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <Link 
                  to={`/product/${product._id}`} 
                  key={product._id}
                  className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img 
                      src={`https://shopstorebe.onrender.com/uploads/categories/${product.images[0]}`} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.discount > 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                        -{product.discount}%
                      </div>
                    )}
                    {product.isNew && (
                      <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-sm font-medium">
                        Mới
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex justify-center space-x-4">
                        <button className="bg-white text-gray-800 p-2 rounded-full hover:bg-blue-500 hover:text-white transition-colors">
                          <FaShoppingCart />
                        </button>
                        <button className="bg-white text-gray-800 p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors">
                          <FaHeart />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-1 truncate">{product.name}</h3>
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400">
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                      </div>
                      <span className="ml-1 text-sm text-gray-500">(4.0)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {product.discount > 0 && (
                        <span className="text-lg font-bold text-red-600">
                          {formatPrice(product.price - (product.price * product.discount / 100))}
                        </span>
                      )}
                      <span className={`${product.discount > 0 ? 'line-through text-gray-500' : 'text-lg font-bold text-gray-900'}`}>
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Productpage;
