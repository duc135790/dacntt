import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaCog, FaMobileAlt, FaBoxOpen, FaLock, FaExclamationTriangle } from 'react-icons/fa';
import AdminProducts from '../components/AdminProducts';
import AdminOrders from '../components/AdminOrders';

const Admin = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('products');

  console.log('🔥 ADMIN PAGE - User:', user, 'Loading:', loading);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('❌ Chưa login');
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center py-20 bg-white rounded-lg shadow">
            <FaLock className="text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Yêu cầu đăng nhập</h2>
            <p className="text-gray-600 mb-6">Bạn cần đăng nhập để truy cập</p>
            <Link
              to="/login"
              className="inline-block bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (user.isAdmin !== true) {
    console.log('❌ Không phải admin');
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center py-20 bg-white rounded-lg shadow">
            <FaExclamationTriangle className="text-6xl text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Không có quyền</h2>
            <p className="text-gray-600 mb-6">Bạn cần quyền Admin</p>
            <Link
              to="/"
              className="inline-block bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  console.log('✅ Vào admin thành công');
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center space-x-2">
        <FaCog />
        <span>Quản trị hệ thống</span>
      </h1>

      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'products'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500'
            }`}
          >
            <FaMobileAlt className="inline mr-2" />
            Quản lý sản phẩm
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'orders'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500'
            }`}
          >
            <FaBoxOpen className="inline mr-2" />
            Quản lý đơn hàng
          </button>
        </nav>
      </div>

      <div>
        {activeTab === 'products' && <AdminProducts />}
        {activeTab === 'orders' && <AdminOrders />}
      </div>
    </div>
  );
};

export default Admin;