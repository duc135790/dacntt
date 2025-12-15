import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { connectDB } from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try to load .env from backend directory first, then root directory
const envPath = path.join(__dirname, '.env');
const rootEnvPath = path.join(__dirname, '..', 'env');
const rootDotEnvPath = path.join(__dirname, '..', '.env');

// Load environment variables (try multiple locations)
let envLoaded = false;
const result1 = dotenv.config({ path: envPath });
if (!result1.error) {
    envLoaded = true;
    console.log('✅ Loaded .env from:', envPath);
} else {
    const result2 = dotenv.config({ path: rootEnvPath });
    if (!result2.error) {
        envLoaded = true;
        console.log('✅ Loaded env from:', rootEnvPath);
    } else {
        const result3 = dotenv.config({ path: rootDotEnvPath });
        if (!result3.error) {
            envLoaded = true;
            console.log('✅ Loaded .env from:', rootDotEnvPath);
        } else {
            console.warn('⚠️  No .env file found. Using system environment variables.');
        }
    }
}

// Verify MONGO_URI is loaded (warn but don't exit)
if (!process.env.MONGO_URI) {
    console.warn('⚠️  WARNING: MONGO_URI is not defined!');
    console.warn('   Please create a .env file in the backend directory with MONGO_URI');
    console.warn('   Server will start but database features will not work.');
}

//import các routes
import productRoutes from './routes/productRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

// Kết nối MongoDB (không chặn server khởi động)
connectDB().catch(err => {
    console.error('❌ Failed to connect to MongoDB:', err.message);
});

const app = express(); //khởi tạo express

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.use(express.json()); //middleware để express hiểu json

// Logging middleware để debug (đặt trước routes)
app.use((req, res, next) => {
  console.log(`\n📥 [${new Date().toISOString()}] ${req.method} ${req.path}`);
  if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
    console.log('📦 Body:', req.body);
  }
  next();
});

// Test route để kiểm tra server
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!', timestamp: new Date().toISOString() });
});

// Đăng ký routes
console.log('📋 Registering routes...');
app.use('/api/products', productRoutes);
console.log('  ✅ /api/products registered');
app.use('/api/customers', customerRoutes);
console.log('  ✅ /api/customers registered');
app.use('/api/staff', staffRoutes);
console.log('  ✅ /api/staff registered');
app.use('/api/orders', orderRoutes);
console.log('  ✅ /api/orders registered');

// 404 handler - phải đặt sau tất cả routes
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
});

// Error handling middleware - phải có 4 tham số (err, req, res, next)
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  console.error('Stack:', err.stack);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      message: 'Dữ liệu không hợp lệ',
      errors: messages
    });
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      message: 'Email đã tồn tại'
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Token không hợp lệ'
    });
  }
  
  // Default error
  res.status(err.status || 500).json({
    message: err.message || 'Lỗi máy chủ',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000; //cấu hình port
app.listen(PORT, ()=>{
    console.log(`✅ Server started at http://localhost:${PORT}`);
    console.log(`✅ API routes available at http://localhost:${PORT}/api`);
});