import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { productsAPI } from '../utils/api';
import { FaBook, FaSearch } from 'react-icons/fa';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchProducts();
  }, [filter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getProducts(filter || null);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (value) => {
    setFilter(value);
    if (value) {
      setSearchParams({ category: value });
    } else {
      setSearchParams({});
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-lg mt-4">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="text-sm text-gray-600">
            <Link to="/" className="hover:text-red-600">Trang chủ</Link> / <span>Tất cả sản phẩm</span>
          </div>
        </div>
      </div>

      {/* Page Title */}
      <div className="text-center py-8 bg-white mb-5">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Sách Hay Chính Hãng</h1>
        <p className="text-gray-600">Tìm thấy {products.length} sản phẩm</p>
      </div>

      <div className="container mx-auto px-4 py-5">
        {/* Filter & Sort Bar */}
        <div className="bg-white p-5 rounded-lg mb-5 border border-gray-200 shadow-sm">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-gray-700">Thể loại:</label>
              <select
                value={filter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="border-2 border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="">Tất cả</option>
                <option value="Văn học">Văn học</option>
                <option value="Kinh tế">Kinh tế</option>
                <option value="Kỹ năng sống">Kỹ năng sống</option>
                <option value="Thiếu nhi">Thiếu nhi</option>
                <option value="Giáo khoa">Giáo khoa</option>
                <option value="Ngoại ngữ">Ngoại ngữ</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-gray-700">Sắp xếp:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border-2 border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="newest">Mới nhất</option>
                <option value="price_asc">Giá tăng dần</option>
                <option value="price_desc">Giá giảm dần</option>
                <option value="name_asc">Tên A-Z</option>
              </select>
            </div>

            <button
              onClick={() => handleFilterChange('')}
              className="ml-auto px-5 py-2 bg-white border-2 border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              ↻ Đặt lại
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg">
            <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-xl">Không có sản phẩm nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all hover:-translate-y-2 relative"
              >
                {/* Badge */}
                {product.inStock && (
                  <span className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                    Mới
                  </span>
                )}

                {/* Image */}
                <Link to={`/products/${product._id}`} className="block relative pt-[100%] overflow-hidden bg-gray-50">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="absolute top-0 left-0 w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <FaBook className="text-white text-6xl opacity-50" />
                    </div>
                  )}
                </Link>

                {/* Info */}
                <div className="p-4">
                  <div className="mb-2">
                    <Link
                      to={`/products/${product._id}`}
                      className="text-sm font-semibold text-gray-800 hover:text-red-600 line-clamp-2 min-h-[40px]"
                    >
                      {product.name}
                    </Link>
                  </div>
                  
                  <div className="text-lg font-bold text-red-600 mb-2">
                    {product.price.toLocaleString()}₫
                  </div>
                  
                  <div className="text-xs text-green-600 mb-3">
                    Còn: {product.stock} sản phẩm
                  </div>

                  <Link
                    to={`/products/${product._id}`}
                    className="block w-full text-center bg-red-600 text-white py-2 rounded-md font-medium hover:bg-red-700 transition-colors"
                  >
                    Thêm vào giỏ
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;