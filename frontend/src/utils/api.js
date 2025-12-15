import axios from 'axios';

// Nếu có VITE_API_URL thì dùng, không thì dùng full URL trực tiếp
// Vite proxy đôi khi không hoạt động, nên dùng full URL để chắc chắn
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🔗 API Base URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Log request để debug
    console.log(`🚀 [API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.data || '');
    return config;
  },
  (error) => {
    console.error('❌ [API Request Error]', error);
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => {
    console.log(`✅ [API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, response.status);
    return response;
  },
  (error) => {
    console.error(`❌ [API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    });
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ✅ Auth API
export const authAPI = {
  login: (credentials) => api.post('/customers/login', credentials),  // Thêm chữ 's'
  register: (userData) => api.post('/customers', userData),           // Thêm chữ 's'
  getProfile: () => api.get('/customers/profile'),                    // Thêm chữ 's'
};

// ✅ Products API
export const productsAPI = {
  getProducts: (category) => api.get('/products', { params: { category: category } }),
  getProductById: (id) => api.get(`/products/${id}`),
  getAllProducts: () => api.get('/products/admin/all'),
  createProduct: (productData) => api.post('/products', productData),
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  updateStock: (id, countInStock) => api.put(`/products/${id}/stock`, { countInStock }),
};

// ✅ Orders API
export const ordersAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getMyOrders: () => api.get('/orders/myorders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  getAllOrders: () => api.get('/orders'),
  updateOrderToDelivered: (id) => api.put(`/orders/${id}/deliver`),
  cancelOrder: (id) => api.delete(`/orders/${id}`),
};

// ✅ Cart API
export const cartAPI = {
  getCart: () => api.get('/customers/cart'),
  addToCart: (productId, quantity) => api.post('/customers/cart', { productId, quantity }),
  updateCartItem: (productId, quantity) => api.put('/customers/cart', { productId, quantity }),
  removeFromCart: (productId) => api.delete(`/customers/cart/${productId}`),
};

export default api;