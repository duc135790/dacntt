import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

import mongoose from 'mongoose';
import Customer from './models/customerModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';
import { connectDB } from './config/db.js';

// Dữ liệu mẫu - CUSTOMERS
const customers = [
    {
        email: 'admin@bookstore.com',
        name: 'Admin',
        phone: '0901234567',
        password: 'admin123',
        isAdmin: true,
    },
    {
        email: 'user1@example.com',
        name: 'Nguyễn Văn A',
        phone: '0909876543',
        password: 'user123',
        isAdmin: false,
    },
];

// Dữ liệu mẫu - PRODUCTS (SÁCH)
const products = [
    {
        name: 'Nhà Giả Kim',
        author: 'Paulo Coelho',
        category: 'Văn học',
        price: 79000,
        description: 'Tác phẩm nổi tiếng của Paulo Coelho kể về hành trình tìm kiếm kho báu và ý nghĩa cuộc đời.',
        countInStock: 50,
        image: 'https://salt.tikicdn.com/cache/750x750/ts/product/45/3b/fc/aa3c737f1630d07c156eb8f5a72ce7f3.jpg.webp',
        publisher: 'NXB Hội Nhà Văn',
        publicationYear: 2020,
        pageCount: 227,
        language: 'Tiếng Việt',
    },
    {
        name: 'Đắc Nhân Tâm',
        author: 'Dale Carnegie',
        category: 'Kỹ năng sống',
        price: 86000,
        description: 'Cuốn sách kinh điển về nghệ thuật giao tiếp và ứng xử của Dale Carnegie.',
        countInStock: 100,
        image: 'https://salt.tikicdn.com/cache/750x750/ts/product/e6/28/7b/b9e9c1a7d5a2c3f3f9c3d8c9e0f3e6f7.jpg.webp',
        publisher: 'NXB Tổng Hợp',
        publicationYear: 2019,
        pageCount: 320,
        language: 'Tiếng Việt',
    },
    {
        name: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
        author: 'Rosie Nguyễn',
        category: 'Kỹ năng sống',
        price: 75000,
        description: 'Những bài học về tuổi trẻ, khát vọng và nỗ lực của tác giả Rosie Nguyễn.',
        countInStock: 80,
        image: 'https://salt.tikicdn.com/cache/750x750/ts/product/d8/c7/e5/b5c6f1a5e8c5c5d9e5c5d5e5c5e5c5e5.jpg.webp',
        publisher: 'NXB Hội Nhà Văn',
        publicationYear: 2018,
        pageCount: 264,
        language: 'Tiếng Việt',
    },
    {
        name: 'Sapiens: Lược Sử Loài Người',
        author: 'Yuval Noah Harari',
        category: 'Lịch sử',
        price: 189000,
        description: 'Câu chuyện về sự tiến hóa của loài người từ thời nguyên thủy đến hiện đại.',
        countInStock: 45,
        image: 'https://salt.tikicdn.com/cache/750x750/ts/product/3c/5b/3e/8c5e5c5e5c5e5c5e5c5e5c5e5c5e5c5e.jpg.webp',
        publisher: 'NXB Trẻ',
        publicationYear: 2021,
        pageCount: 544,
        language: 'Tiếng Việt',
    },
    {
        name: 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh',
        author: 'Nguyễn Nhật Ánh',
        category: 'Văn học',
        price: 95000,
        description: 'Tác phẩm văn học về tuổi thơ đẹp đẽ và đầy hoài niệm của Nguyễn Nhật Ánh.',
        countInStock: 60,
        image: 'https://salt.tikicdn.com/cache/750x750/ts/product/5c/3e/5c/5c5e5c5e5c5e5c5e5c5e5c5e5c5e5c5e.jpg.webp',
        publisher: 'NXB Trẻ',
        publicationYear: 2017,
        pageCount: 368,
        language: 'Tiếng Việt',
    },
    {
        name: 'Harry Potter và Hòn Đá Phù Thủy',
        author: 'J.K. Rowling',
        category: 'Thiếu nhi',
        price: 120000,
        description: 'Cuốn sách đầu tiên trong series Harry Potter nổi tiếng thế giới.',
        countInStock: 70,
        image: 'https://salt.tikicdn.com/cache/750x750/ts/product/1c/5e/5c/5c5e5c5e5c5e5c5e5c5e5c5e5c5e5c5e.jpg.webp',
        publisher: 'NXB Trẻ',
        publicationYear: 2020,
        pageCount: 396,
        language: 'Tiếng Việt',
    },
    {
        name: 'Toán Học Lớp 12',
        author: 'Bộ Giáo Dục',
        category: 'Giáo khoa',
        price: 45000,
        description: 'Sách giáo khoa Toán lớp 12 theo chương trình mới.',
        countInStock: 120,
        image: 'https://salt.tikicdn.com/cache/750x750/ts/product/3c/5e/5c/5c5e5c5e5c5e5c5e5c5e5c5e5c5e5c5e.jpg.webp',
        publisher: 'NXB Giáo Dục Việt Nam',
        publicationYear: 2023,
        pageCount: 200,
        language: 'Tiếng Việt',
    },
    {
        name: 'Tiếng Anh Giao Tiếp Cơ Bản',
        author: 'Nhiều tác giả',
        category: 'Ngoại ngữ',
        price: 65000,
        description: 'Giáo trình tiếng Anh giao tiếp cơ bản cho người mới bắt đầu.',
        countInStock: 90,
        image: 'https://salt.tikicdn.com/cache/750x750/ts/product/2c/5e/5c/5c5e5c5e5c5e5c5e5c5e5c5e5c5e5c5e.jpg.webp',
        publisher: 'NXB Đại Học Quốc Gia',
        publicationYear: 2022,
        pageCount: 280,
        language: 'Tiếng Việt',
    },
];

const importData = async () => {
    try {
        console.log('🔍 Checking MONGO_URI:', process.env.MONGO_URI ? '✅ Found' : '❌ Not found');
        
        await connectDB();

        // Xóa dữ liệu cũ
        await Order.deleteMany();
        await Product.deleteMany();
        await Customer.deleteMany();

        console.log('✅ Đã xóa dữ liệu cũ');

        // Tạo customers
        const createdCustomers = await Customer.insertMany(customers);
        console.log('✅ Đã tạo customers mẫu');

        // Tạo products
        const createdProducts = await Product.insertMany(products);
        console.log('✅ Đã tạo products mẫu');

        console.log('');
        console.log('🎉 Import dữ liệu thành công!');
        console.log('');
        console.log('📋 Thông tin đăng nhập:');
        console.log('   Admin:');
        console.log('   - Email: admin@bookstore.com');
        console.log('   - Password: admin123');
        console.log('');
        console.log('   Customer:');
        console.log('   - Email: user1@example.com');
        console.log('   - Password: user123');
        console.log('');

        process.exit();
    } catch (error) {
        console.error('❌ Lỗi:', error);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await connectDB();

        await Order.deleteMany();
        await Product.deleteMany();
        await Customer.deleteMany();

        console.log('✅ Đã xóa toàn bộ dữ liệu');

        process.exit();
    } catch (error) {
        console.error('❌ Lỗi:', error);
        process.exit(1);
    }
};

// Chạy script
if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}