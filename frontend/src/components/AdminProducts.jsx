import { useState, useEffect } from 'react';
import { productsAPI } from '../utils/api';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    description: '',
    stock: '',
    image: '',
    specs: {
      author: '',
      publisher: '',
      pages: '',
    },
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAllProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('specs.')) {
      const specKey = name.split('.')[1];
      setFormData({
        ...formData,
        specs: {
          ...formData.specs,
          [specKey]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productsAPI.updateProduct(editingProduct._id, formData);
      } else {
        await productsAPI.createProduct(formData);
      }
      setShowModal(false);
      setEditingProduct(null);
      setFormData({
        name: '',
        brand: '',
        price: '',
        description: '',
        stock: '',
        image: '',
        specs: {
          author: '',
          publisher: '',
          pages: '',
        },
      });
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand,
      price: product.price,
      description: product.description || '',
      stock: product.stock,
      image: product.image || '',
      specs: product.specs || {
        author: '',
        publisher: '',
        pages: '',
      },
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sách này?')) {
      return;
    }
    try {
      await productsAPI.deleteProduct(id);
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || 'Xóa sách thất bại');
    }
  };

  const handleToggleStock = async (id, inStock) => {
    try {
      await productsAPI.updateStock(id, !inStock);
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || 'Cập nhật thất bại');
    }
  };

  if (loading) {
    return <div className="text-center">Đang tải...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Danh sách sách</h2>
        <button
          onClick={() => {
            setEditingProduct(null);
            setFormData({
              name: '',
              brand: '',
              price: '',
              description: '',
              stock: '',
              image: '',
              specs: {
                author: '',
                publisher: '',
                pages: '',
              },
            });
            setShowModal(true);
          }}
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 flex items-center space-x-2"
        >
          <FaPlus />
          <span>Thêm sách mới</span>
        </button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Sách
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Thể loại
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Giá
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Kho
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      {product.image ? (
                        <img
                          className="h-10 w-10 rounded object-contain"
                          src={product.image}
                          alt={product.name}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded bg-gray-200"></div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{product.brand}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.price.toLocaleString()} ₫
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleStock(product._id, product.inStock)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      product.inStock
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {product.inStock ? 'Còn hàng' : 'Hết hàng'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-orange-600 hover:text-orange-900"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editingProduct ? 'Chỉnh sửa sách' : 'Thêm sách mới'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên sách
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Danh mục
                </label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Chọn danh mục</option>
                  <option value="Văn học">Văn học</option>
                  <option value="Kinh tế">Kinh tế</option>
                  <option value="Kỹ năng sống">Kỹ năng sống</option>
                  <option value="Thiếu nhi">Thiếu nhi</option>
                  <option value="Giáo khoa">Giáo khoa</option>
                  <option value="Ngoại ngữ">Ngoại ngữ</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá (₫)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số lượng
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL hình ảnh
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Thông tin chi tiết</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tác giả
                    </label>
                    <input
                      type="text"
                      name="specs.author"
                      value={formData.specs.author}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="VD: Nguyễn Nhật Ánh"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nhà xuất bản
                    </label>
                    <input
                      type="text"
                      name="specs.publisher"
                      value={formData.specs.publisher}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="VD: NXB Trẻ"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số trang
                    </label>
                    <input
                      type="text"
                      name="specs.pages"
                      value={formData.specs.pages}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="VD: 300"
                    />
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 text-white py-2 rounded hover:bg-orange-700"
                >
                  {editingProduct ? 'Cập nhật' : 'Thêm'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProduct(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
