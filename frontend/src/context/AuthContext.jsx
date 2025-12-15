import { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('🔐 Đang đăng nhập với:', { email });
      const response = await authAPI.login({ email, password });
      console.log('✅ Đăng nhập thành công:', response.data);
      const { token, ...userData } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('❌ Lỗi đăng nhập:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Đăng nhập thất bại',
      };
    }
  };

  const register = async (userData) => {
    try {
      console.log('📝 Đang đăng ký với:', userData);
      const response = await authAPI.register(userData);
      console.log('✅ Đăng ký thành công:', response.data);
      const { token, ...userInfo } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userInfo));
      setUser(userInfo);
      return { success: true };
    } catch (error) {
      console.error('❌ Lỗi đăng ký:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Đăng ký thất bại',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAdmin = user?.isAdmin || false;

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

