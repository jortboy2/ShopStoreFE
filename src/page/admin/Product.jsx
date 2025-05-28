import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash, FaUpload, FaRobot } from "react-icons/fa";
import { useSnackbar } from "notistack";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [prompt, setPrompt] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    sizes: [],
    colors: [],
    images: [],
    stock: "",
    isActive: true,
    isNew: false,
    isBestSeller: false,
    discount: 0,
    gender: "Unisex",
  });

  const { enqueueSnackbar } = useSnackbar();

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/products`),
          axios.get(`${import.meta.env.VITE_API_URL}/categories`),
        ]);

        // Fetch category details for each product
        const productsWithCategories = await Promise.all(
          productsRes.data.data.map(async (product) => {
            if (product.category) {
              const categoryRes = await axios.get(
                `${import.meta.env.VITE_API_URL}/categories/${product.category}`
              );
              return {
                ...product,
                category: categoryRes.data.data,
              };
            }
            return product;
          })
        );

        setProducts(productsWithCategories);
        setCategories(categoriesRes.data.data);
      } catch (error) {
        enqueueSnackbar("Lỗi khi tải dữ liệu", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [enqueueSnackbar]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle size changes
  const handleSizeChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      sizes: checked
        ? [...prev.sizes, value]
        : prev.sizes.filter((size) => size !== value),
    }));
  };

  // Handle color changes
  const handleColorChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      colors: checked
        ? [...prev.colors, value]
        : prev.colors.filter((color) => color !== value),
    }));
  };

  // Handle image selection
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages((prev) => [...prev, ...files]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      const token = localStorage.getItem("token");

      // Add basic fields
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("stock", formData.stock);
      formDataToSend.append("isActive", formData.isActive);
      formDataToSend.append("isNew", formData.isNew);
      formDataToSend.append("isBestSeller", formData.isBestSeller);
      formDataToSend.append("discount", formData.discount);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("query", formData.query); // Added query field

      // Add arrays as JSON strings
      formDataToSend.append("sizes", JSON.stringify(formData.sizes));
      formDataToSend.append("colors", JSON.stringify(formData.colors));

      // Add existing images if editing and no new images selected
      if (editingProduct && selectedImages.length === 0) {
        formDataToSend.append(
          "existingImages",
          JSON.stringify(formData.images)
        );
      }

      // Add new images
      selectedImages.forEach((file) => {
        formDataToSend.append("images", file);
      });

      // Send request
      if (editingProduct) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/products/${editingProduct._id}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        enqueueSnackbar("Cập nhật sản phẩm thành công", { variant: "success" });
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/products`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        enqueueSnackbar("Tạo sản phẩm thành công", { variant: "success" });
      }

      setShowModal(false);
      setEditingProduct(null);
      setSelectedImages([]);
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        sizes: [],
        colors: [],
        images: [],
        stock: "",
        isActive: true,
        isNew: false,
        isBestSeller: false,
        discount: 0,
        gender: "Unisex",
        query: "", // Reset query
      });

      // Refresh products list with categories
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/products`
      );
      const productsWithCategories = await Promise.all(
        response.data.data.map(async (product) => {
          if (product.category) {
            const categoryRes = await axios.get(
              `${import.meta.env.VITE_API_URL}/categories/${product.category}`
            );
            return {
              ...product,
              category: categoryRes.data.data,
            };
          }
          return product;
        })
      );
      setProducts(productsWithCategories);
    } catch (error) {
      console.error("Error submitting product:", error);
      enqueueSnackbar(error.response?.data?.message || "Lỗi khi lưu sản phẩm", {
        variant: "error",
      });
    }
  };

  // Handle edit product
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category?._id || "",
      sizes: Array.isArray(product.sizes) ? product.sizes : [], // Ensure sizes is an array
      colors: Array.isArray(product.colors) ? product.colors : [], // Ensure colors is an array
      images: product.images || [],
      stock: product.stock || "",
      isActive: product.isActive || false,
      isNew: product.isNew || false,
      isBestSeller: product.isBestSeller || false,
      discount: product.discount || 0,
      gender: product.gender || "Unisex",
      query: product.query || "", // Ensure query is set
    });
    setShowModal(true);
  };

  // Handle delete product
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        enqueueSnackbar("Xóa sản phẩm thành công", { variant: "success" });
        setProducts(products.filter((product) => product._id !== id));
      } catch (error) {
        enqueueSnackbar("Lỗi khi xóa sản phẩm", { variant: "error" });
      }
    }
  };
  const handleCategoryChange = async (e) => {
    const categoryId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      category: categoryId,
    }));

    if (categoryId) {
      try {
        const categoryRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/products/category/${categoryId}`
        );
        const categoryProducts = categoryRes.data.data;

        if (categoryProducts.length === 0) {
          setProducts([]); // Nếu danh mục không có sản phẩm, cập nhật danh sách rỗng
        } else {
          setProducts(categoryProducts); // Nếu có sản phẩm, cập nhật danh sách sản phẩm
        }
      } catch (error) {
        setProducts([]); // Nếu lỗi, đặt danh sách sản phẩm rỗng
        enqueueSnackbar(
          "Lỗi khi tải danh mục: " + error.response.data.message,
          { variant: "error" }
        );
      }
    } else {
      // Khi không chọn danh mục nào, lấy tất cả sản phẩm
      try {
        const allProductsRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/products`
        );
        setProducts(allProductsRes.data.data);
      } catch (error) {
        setProducts([]);
        enqueueSnackbar(
          "Lỗi khi tải sản phẩm: " + error.response.data.message,
          { variant: "error" }
        );
      }
    }
  };

  useEffect(() => {
    console.log("Selected colors:", formData.colors);
  }, [formData.colors]);

  // Function to generate description using Gemini AI
  const generateDescription = async () => {
    try {
      setIsGeneratingDescription(true);
      
      // Lấy URL của hình ảnh đầu tiên được upload trong UI nếu có
      const imageUrl = selectedImages.length > 0 
        ? URL.createObjectURL(selectedImages[0])
        : null;

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/generate-description`, {
        prompt: prompt,
        productName: formData.name,
        category: categories.find(cat => cat._id === formData.category)?.name || "",
        price: formData.price,
        gender: formData.gender,
        imageUrl: imageUrl
      });

      if (response.data.success) {
        setFormData(prev => ({
          ...prev,
          description: response.data.description
        }));
        enqueueSnackbar("Đã tạo mô tả thành công", { variant: "success" });
      }
    } catch (error) {
      console.error("Error generating description:", error);
      enqueueSnackbar("Lỗi khi tạo mô tả", { variant: "error" });
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  // Handle gender filter change
  const handleGenderChange = async (e) => {
    const gender = e.target.value;
    setSelectedGender(gender);
    
    try {
      if (gender) {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/products/gender/${gender}`
        );
        setProducts(response.data.data);
      } else {
        // If no gender selected, fetch all products
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/products`
        );
        setProducts(response.data.data);
      }
    } catch (error) {
      enqueueSnackbar("Lỗi khi tải sản phẩm theo giới tính", { variant: "error" });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Đang tải...</div>
    );
  }
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Sản phẩm</h1>
        <button
          onClick={() => {
            setEditingProduct(null);
            setFormData({
              name: "",
              description: "",
              price: "",
              category: "",
              sizes: [],
              colors: [],
              images: [],
              stock: "",
              isActive: true,
              isNew: false,
              isBestSeller: false,
              discount: 0,
              gender: "Unisex",
              query: "",
            });
            setSelectedImages([]);
            setShowModal(true);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-300 transform hover:scale-105"
        >
          <FaPlus className="mr-2" /> Thêm Sản phẩm mới
        </button>
      </div>

      {/* Gender Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Lọc theo giới tính
        </label>
        <select
          value={selectedGender}
          onChange={handleGenderChange}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out transform hover:scale-[1.01]"
        >
          <option value="">Tất cả</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
          <option value="Unisex">Unisex</option>
        </select>
      </div>

      {/* Category Select */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Danh mục
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleCategoryChange} // Gọi hàm mới
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out transform hover:scale-[1.01]"
        >
          <option value="">Chọn danh mục</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tìm kiếm theo tên
        </label>
        <input
          type="text"
          name="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out transform hover:scale-[1.01]"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hình ảnh
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Danh mục
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tồn kho
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr
                key={product._id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={`https://shopstorebe.onrender.com/uploads/categories/${product.images[0]}`}
                    alt={product.name}
                    className="h-20 w-20 rounded-full object-cover ring-2 ring-gray-200"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.category?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.price.toLocaleString("vi-VN")}đ
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.isActive ? "Hoạt động" : "Không hoạt động"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-600 hover:text-blue-900 mr-4 transition-colors duration-200"
                  >
                    <FaEdit className="transform hover:scale-110 transition-transform duration-200" />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-600 hover:text-red-900 transition-colors duration-200"
                  >
                    <FaTrash className="transform hover:scale-110 transition-transform duration-200" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center backdrop-blur-sm z-20">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editingProduct ? "Chỉnh sửa Sản phẩm" : "Thêm Sản phẩm mới"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out transform hover:scale-[1.01]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={
                      formData.price
                        ? new Intl.NumberFormat("vi-VN").format(
                            formData.price
                          ) + " đ"
                        : ""
                    }
                    onChange={(e) => {
                      // Lấy giá trị nhập vào và loại bỏ các ký tự không phải số
                      const rawValue = e.target.value.replace(/[^\d]/g, "");

                      // Cập nhật state với số nguyên (không có dấu chấm/thập phân)
                      setFormData((prev) => ({
                        ...prev,
                        price: rawValue ? parseInt(rawValue, 10) : "", // Chuyển về số nguyên
                      }));
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out transform hover:scale-[1.01]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danh mục
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out transform hover:scale-[1.01]"
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tồn kho
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out transform hover:scale-[1.01]"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <div className="mb-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Nhập gợi ý để tạo mô tả sản phẩm..."
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={generateDescription}
                        disabled={isGeneratingDescription}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        <FaRobot />
                        {isGeneratingDescription ? "Đang tạo..." : "Tạo mô tả"}
                      </button>
                    </div>
                  </div>
                  <CKEditor
                    config={{
                      licenseKey: `eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NDQ1ODg3OTksImp0aSI6IjA1Y2I0OTc2LTQxMmItNDNmYy1hNWY3LTdmNmYwZDc1NzE4NCIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjRhMTQ0YTMyIn0.Rg4MT4Pci5V1UJyhLug2bO0bmlbG1CRNxMBuS4qKp0sMhPrCaEgzjXNs6lerLqbxX630BwDXNkiYILNqa67ulg`,
                    }}
                    editor={ClassicEditor}
                    data={formData.description}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setFormData((prev) => ({
                        ...prev,
                        description: data,
                      }));
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kích thước
                  </label>
                  <div className="mt-2 space-y-2">
                    {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                      <label
                        key={size}
                        className="inline-flex items-center mr-4 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          value={size}
                          checked={formData.sizes.includes(size)}
                          onChange={handleSizeChange}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        />
                        <span className="ml-2 select-none">{size}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Màu sắc
                  </label>
                  <div className="mt-2 space-y-2">
                    {[
                      "Đen",
                      "Trắng",
                      "Đỏ",
                      "Xanh dương",
                      "Xanh lá",
                      "Vàng",
                    ].map((color) => (
                      <label
                        key={color}
                        className="inline-flex items-center mr-4 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          value={color}
                          checked={formData.colors.includes(color)}
                          onChange={handleColorChange}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        />
                        <span className="ml-2 select-none">{color}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hình ảnh
                  </label>
                  <div className="mt-2 flex items-center space-x-4">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center transition-all duration-300 transform hover:scale-105"
                    >
                      <FaUpload className="mr-2" /> Tải ảnh lên
                    </label>
                    <div className="flex space-x-2">
                      {selectedImages.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="h-20 w-20 object-cover rounded-lg transition-transform duration-300 transform group-hover:scale-105"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedImages((prev) =>
                                prev.filter((_, i) => i !== index)
                              );
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      {formData.images.map((image, index) => (
                        <div
                          key={`existing-${index}`}
                          className="relative group"
                        >
                          <img
                            src={`https://shopstorebe.onrender.com/uploads/categories/${image}`}
                            alt={`Sản phẩm ${index + 1}`}
                            className="h-20 w-20 object-cover rounded-lg transition-transform duration-300 transform group-hover:scale-105"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                images: prev.images.filter(
                                  (_, i) => i !== index
                                ),
                              }));
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center space-x-6">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      />
                      <span className="ml-2 select-none">Hoạt động</span>
                    </label>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="isNew"
                        checked={formData.isNew}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      />
                      <span className="ml-2 select-none">Mới</span>
                    </label>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="isBestSeller"
                        checked={formData.isBestSeller}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      />
                      <span className="ml-2 select-none">Bán chạy</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giảm giá (%)
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out transform hover:scale-[1.01]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giới tính
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out transform hover:scale-[1.01]"
                    required
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>

              </div>
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
                >
                  {editingProduct ? "Cập nhật" : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
