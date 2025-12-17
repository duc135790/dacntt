import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaShoppingCart } from 'react-icons/fa';

const Cart = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Giỏ hàng của bạn</h1>

        {!user ? (
          // Chưa đăng nhập - Hiện message thân thiện
          <div className="max-w-2xl mx-auto text-center py-20 bg-white rounded-lg shadow">
            <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Giỏ hàng trống</h2>
            <p className="text-gray-600 mb-6">
              Đăng nhập để xem giỏ hàng hoặc khám phá sản phẩm ngay!
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/login"
                className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                to="/products"
                className="bg-white border-2 border-red-600 text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors"
              >
                Mua sắm ngay
              </Link>
            </div>
          </div>
        ) : (
          // Đã đăng nhập - Giỏ hàng trống
          <div className="max-w-2xl mx-auto text-center py-20 bg-white rounded-lg shadow">
            <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-xl font-medium mb-2">Giỏ hàng trống</p>
            <p className="text-gray-500 mb-6">Hãy thêm sản phẩm vào giỏ hàng!</p>
            <Link
              to="/products"
              className="inline-block bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Mua sắm ngay
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;