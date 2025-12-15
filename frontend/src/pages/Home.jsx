import { Link } from 'react-router-dom';
import { FaBook, FaShoppingCart, FaTruck, FaShieldAlt, FaHeadset, FaStar, FaBookOpen, FaGraduationCap } from 'react-icons/fa';

const Home = () => {
  const categories = [
    { name: 'Văn học', icon: '📚', color: 'from-blue-400 to-blue-600' },
    { name: 'Kinh tế', icon: '💼', color: 'from-green-400 to-green-600' },
    { name: 'Kỹ năng sống', icon: '🎯', color: 'from-purple-400 to-purple-600' },
    { name: 'Thiếu nhi', icon: '🎨', color: 'from-pink-400 to-pink-600' },
    { name: 'Giáo khoa', icon: '📖', color: 'from-orange-400 to-orange-600' },
    { name: 'Ngoại ngữ', icon: '🌍', color: 'from-indigo-400 to-indigo-600' },
  ];

  const features = [
    {
      icon: <FaTruck className="text-4xl text-blue-600" />,
      title: 'Giao hàng toàn quốc',
      description: 'Miễn phí vận chuyển cho đơn hàng từ 150.000đ',
    },
    {
      icon: <FaShieldAlt className="text-4xl text-green-600" />,
      title: 'Sách chính hãng',
      description: '100% sách chính hãng, nguyên seal',
    },
    {
      icon: <FaHeadset className="text-4xl text-purple-600" />,
      title: 'Hỗ trợ 24/7',
      description: 'Đội ngũ tư vấn nhiệt tình, chuyên nghiệp',
    },
    {
      icon: <FaStar className="text-4xl text-yellow-500" />,
      title: 'Ưu đãi hấp dẫn',
      description: 'Giảm giá lên đến 50% cho thành viên',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fadeIn">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-lg rounded-3xl mb-6 shadow-2xl">
              <FaBook className="text-4xl" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Khám phá thế giới
              <span className="block mt-2 bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                Tri thức vô tận
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-orange-100">
              Hàng ngàn đầu sách hay - Giá tốt nhất thị trường
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="inline-flex items-center justify-center bg-white text-orange-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-orange-50 transition-all duration-300 shadow-2xl hover:shadow-xl transform hover:scale-105"
              >
                <FaShoppingCart className="mr-2" />
                Mua sắm ngay
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              >
                Đăng ký thành viên
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Danh mục sách
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                to={`/products?category=${category.name}`}
                className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 card-hover animate-fadeIn border-2 border-transparent hover:border-orange-200"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-center">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <p className="font-bold text-gray-700 group-hover:text-orange-600 transition-colors">
                    {category.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      {/* Features Section */}
      <div className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Tại sao chọn chúng tôi?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 card-hover animate-fadeIn text-center"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="py-20 bg-gradient-to-r from-orange-500 to-pink-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto animate-fadeIn">
            <FaBookOpen className="text-6xl mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Sẵn sàng khám phá?
            </h2>
            <p className="text-xl mb-8 text-orange-100">
              Hàng ngàn đầu sách hay đang chờ bạn
            </p>
            <Link
              to="/products"
              className="inline-flex items-center justify-center bg-white text-orange-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-orange-50 transition-all duration-300 shadow-2xl hover:shadow-xl transform hover:scale-105"
            >
              <FaBook className="mr-2" />
              Xem tất cả sách
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="animate-fadeIn">
              <div className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">10,000+</div>
              <p className="text-gray-600 font-medium">Đầu sách</p>
            </div>
            <div className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl md:text-5xl font-bold text-pink-600 mb-2">50,000+</div>
              <p className="text-gray-600 font-medium">Độc giả</p>
            </div>
            <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">99%</div>
              <p className="text-gray-600 font-medium">Hài lòng</p>
            </div>
            <div className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">24/7</div>
              <p className="text-gray-600 font-medium">Hỗ trợ</p>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="py-16 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <FaGraduationCap className="text-5xl text-orange-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              Nhận tin khuyến mãi
            </h2>
            <p className="text-gray-600 mb-6">
              Đăng ký để nhận thông tin về sách mới và ưu đãi đặc biệt
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="px-6 py-3 rounded-xl border-2 border-gray-300 focus:border-orange-500 focus:outline-none flex-1 max-w-md"
              />
              <button className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl">
                Đăng ký ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;