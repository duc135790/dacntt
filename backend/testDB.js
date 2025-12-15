import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

console.log('🔍 Testing MongoDB connection...');
console.log('📌 MONGO_URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully!');
    console.log('🎉 Kết nối thành công!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed!');
    console.error('❌ Error:', error.message);
    process.exit(1);
  });