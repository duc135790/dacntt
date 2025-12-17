import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBook, FaUser, FaSignOutAlt, FaCog, FaShoppingCart, FaBoxOpen, FaSearch } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-[100] shadow-md">
      {/* Header Top - Dark */}
      <div className="bg-gray-900 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div>📞 Hotline: 1900-xxxx | 📧 support@bookstore.vn</div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span>Xin chào, <strong>{user.username}</strong></span>
                  <button 
                    onClick={handleLogout}
                    className="hover:text-red-400 transition-colors"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-blue-400 transition-colors">Đăng nhập</Link>
                  <Link to="/register" className="hover:text-blue-400 transition-colors">Đăng ký</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Header Main - White */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 text-2xl font-bold hover:scale-105 transition-transform">
              <span className="text-gray-800">BOOK</span>
              <span className="text-red-600">STORE</span>
            </Link>

            {/* Search Box */}
            <div className="flex-1 max-w-lg mx-10">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm sách..."
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                />
                <FaSearch className="absolute right-4 top-3 text-gray-400" />
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-1">
              <Link
                to="/products"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all font-medium"
              >
                <FaBook />
                <span className="hidden md:block">Sách</span>
              </Link>

              {user && (
                <>
                  <Link
                    to="/cart"
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all font-medium"
                  >
                    <FaShoppingCart />
                    <span className="hidden md:block">Giỏ hàng</span>
                  </Link>

                  <Link
                    to="/my-orders"
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all font-medium"
                  >
                    <FaBoxOpen />
                    <span className="hidden md:block">Đơn hàng</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all font-medium"
                    >
                      <FaCog />
                      <span className="hidden md:block">Quản trị</span>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;