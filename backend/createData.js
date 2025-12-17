import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

// Kết nối MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`✅ Database: ${conn.connection.name}`);
    return true;
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

// Hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Tạo dữ liệu
const createData = async () => {
  try {
    await connectDB();

    // 1. TẠO CUSTOMERS
    console.log('\n📝 Đang tạo customers...');
    
    const customersCollection = mongoose.connection.collection('customers');
    
    // Xóa dữ liệu cũ
    await customersCollection.deleteMany({});
    
    const customers = [
      {
        email: 'admin@bookstore.com',
        name: 'Admin',
        phone: '0901234567',
        password: await hashPassword('admin123'),
        isAdmin: true,
        cart: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user1@example.com',
        name: 'Nguyễn Văn A',
        phone: '0909876543',
        password: await hashPassword('user123'),
        isAdmin: false,
        cart: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    await customersCollection.insertMany(customers);
    console.log('✅ Đã tạo 2 customers');

    // 2. TẠO PRODUCTS
    console.log('\n📚 Đang tạo products...');
    
    const productsCollection = mongoose.connection.collection('products');
    
    // Xóa dữ liệu cũ
    await productsCollection.deleteMany({});
    
    const products = [
      {
        name: 'Nhà Giả Kim',
        author: 'Paulo Coelho',
        category: 'Văn học',
        brand: 'Văn học',
        price: 79000,
        description: 'Tác phẩm nổi tiếng của Paulo Coelho kể về hành trình tìm kiếm kho báu và ý nghĩa cuộc đời.',
        countInStock: 50,
        stock: 50,
        inStock: true,
        image: 'https://salt.tikicdn.com/cache/750x750/ts/product/45/3b/fc/aa3c737f1630d07c156eb8f5a72ce7f3.jpg.webp',
        publisher: 'NXB Hội Nhà Văn',
        publicationYear: 2020,
        pageCount: 227,
        language: 'Tiếng Việt',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Đắc Nhân Tâm',
        author: 'Dale Carnegie',
        category: 'Kỹ năng sống',
        brand: 'Kỹ năng sống',
        price: 86000,
        description: 'Cuốn sách kinh điển về nghệ thuật giao tiếp và ứng xử của Dale Carnegie.',
        countInStock: 100,
        stock: 100,
        inStock: true,
        image: 'https://salt.tikicdn.com/cache/750x750/ts/product/e6/28/7b/b9e9c1a7d5a2c3f3f9c3d8c9e0f3e6f7.jpg.webp',
        publisher: 'NXB Tổng Hợp',
        publicationYear: 2019,
        pageCount: 320,
        language: 'Tiếng Việt',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
        author: 'Rosie Nguyễn',
        category: 'Kỹ năng sống',
        brand: 'Kỹ năng sống',
        price: 75000,
        description: 'Những bài học về tuổi trẻ, khát vọng và nỗ lực của tác giả Rosie Nguyễn.',
        countInStock: 80,
        stock: 80,
        inStock: true,
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500',
        publisher: 'NXB Hội Nhà Văn',
        publicationYear: 2018,
        pageCount: 264,
        language: 'Tiếng Việt',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sapiens: Lược Sử Loài Người',
        author: 'Yuval Noah Harari',
        category: 'Lịch sử',
        brand: 'Lịch sử',
        price: 189000,
        description: 'Câu chuyện về sự tiến hóa của loài người từ thời nguyên thủy đến hiện đại.',
        countInStock: 45,
        stock: 45,
        inStock: true,
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
        publisher: 'NXB Trẻ',
        publicationYear: 2021,
        pageCount: 544,
        language: 'Tiếng Việt',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh',
        author: 'Nguyễn Nhật Ánh',
        category: 'Văn học',
        brand: 'Văn học',
        price: 95000,
        description: 'Tác phẩm văn học về tuổi thơ đẹp đẽ và đầy hoài niệm của Nguyễn Nhật Ánh.',
        countInStock: 60,
        stock: 60,
        inStock: true,
        image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500',
        publisher: 'NXB Trẻ',
        publicationYear: 2017,
        pageCount: 368,
        language: 'Tiếng Việt',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Harry Potter và Hòn Đá Phù Thủy',
        author: 'J.K. Rowling',
        category: 'Thiếu nhi',
        brand: 'Thiếu nhi',
        price: 120000,
        description: 'Cuốn sách đầu tiên trong series Harry Potter nổi tiếng thế giới.',
        countInStock: 70,
        stock: 70,
        inStock: true,
        image: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=500',
        publisher: 'NXB Trẻ',
        publicationYear: 2020,
        pageCount: 396,
        language: 'Tiếng Việt',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Toán Học Lớp 12',
        author: 'Bộ Giáo Dục',
        category: 'Giáo khoa',
        brand: 'Giáo khoa',
        price: 45000,
        description: 'Sách giáo khoa Toán lớp 12 theo chương trình mới.',
        countInStock: 120,
        stock: 120,
        inStock: true,
        image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500',
        publisher: 'NXB Giáo Dục Việt Nam',
        publicationYear: 2023,
        pageCount: 200,
        language: 'Tiếng Việt',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Tiếng Anh Giao Tiếp Cơ Bản',
        author: 'Nhiều tác giả',
        category: 'Ngoại ngữ',
        brand: 'Ngoại ngữ',
        price: 65000,
        description: 'Giáo trình tiếng Anh giao tiếp cơ bản cho người mới bắt đầu.',
        countInStock: 90,
        stock: 90,
        inStock: true,
        image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500',
        publisher: 'NXB Đại Học Quốc Gia',
        publicationYear: 2022,
        pageCount: 280,
        language: 'Tiếng Việt',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    {
        name: 'Nhà Giả Kim',
        author: 'Paulo Coelho',
        category: 'Văn học',
        brand: 'Văn học',
        price: 79000,
        description: 'Tác phẩm nổi tiếng của Paulo Coelho kể về hành trình tìm kiếm kho báu và ý nghĩa cuộc đời của chàng chăn cừu Santiago.',
        countInStock: 50,
        stock: 50,
        inStock: true,
        image: 'https://salt.tikicdn.com/cache/750x750/ts/product/45/3b/fc/aa3c737f1630d07c156eb8f5a72ce7f3.jpg.webp',
        publisher: 'NXB Hội Nhà Văn',
        publicationYear: 2020,
        pageCount: 227,
        language: 'Tiếng Việt',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh',
        author: 'Nguyễn Nhật Ánh',
        category: 'Văn học',
        brand: 'Văn học',
        price: 95000,
        description: 'Tác phẩm văn học về tuổi thơ đẹp đẽ và đầy hoài niệm của Nguyễn Nhật Ánh.',
        countInStock: 60,
        stock: 60,
        inStock: true,
        image: 'https://salt.tikicdn.com/cache/750x750/ts/product/5e/18/24/2a6154ba08df6ce6161c13f4303fa19e.jpg.webp',
        publisher: 'NXB Trẻ',
        publicationYear: 2017,
        pageCount: 368,
        language: 'Tiếng Việt',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Mắt Biếc',
        author: 'Nguyễn Nhật Ánh',
        category: 'Văn học',
        brand: 'Văn học',
        price: 85000,
        description: 'Chuyện tình đẹp và buồn của Ngạn và Hà Lan qua ngòi bút tài hoa của Nguyễn Nhật Ánh.',
        countInStock: 45,
        stock: 45,
        inStock: true,
        image: 'https://salt.tikicdn.com/cache/750x750/ts/product/d7/c8/45/8c66e6e61c469c44e2f55f5c7a7c7d52.jpg.webp',
        publisher: 'NXB Trẻ',
        publicationYear: 2018,
        pageCount: 272,
        language: 'Tiếng Việt',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Số Đỏ',
        author: 'Vũ Trọng Phụng',
        category: 'Văn học',
        brand: 'Văn học',
        price: 68000,
        description: 'Tác phẩm kinh điển của văn học Việt Nam hiện đại, phê phán xã hội sắc sảo.',
        countInStock: 30,
        stock: 30,
        inStock: true,
        image: 'https://salt.tikicdn.com/cache/750x750/ts/product/c8/f3/5d/00ac2c2c95d1ab27c3e43c76a9e22e33.jpg.webp',
        publisher: 'NXB Văn Học',
        publicationYear: 2019,
        pageCount: 280,
        language: 'Tiếng Việt',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Chí Phèo',
        author: 'Nam Cao',
        category: 'Văn học',
        brand: 'Văn học',
        price: 55000,
        description: 'Tác phẩm văn học kinh điển về số phận con người trong xã hội cũ.',
        countInStock: 40,
        stock: 40,
        inStock: true,
        image: 'https://salt.tikicdn.com/cache/750x750/ts/product/6e/ff/fb/9c7ae7c5b61a5d4f75c9e5e5c3f0f5e5.jpg.webp',
        publisher: 'NXB Kim Đồng',
        publicationYear: 2020,
        pageCount: 156,
        language: 'Tiếng Việt',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Tắt Đèn',
        author: 'Ngô Tất Tố',
        category: 'Văn học',
        brand: 'Văn học',
        price: 72000,
        description: 'Tác phẩm văn học hiện thực chủ nghĩa xuất sắc của văn học Việt Nam.',
        countInStock: 35,
        stock: 35,
        inStock: true,
        image: 'https://salt.tikicdn.com/cache/750x750/ts/product/3e/ff/4b/c94af2fc5a2b3e2e3e3e3e3e3e3e3e3e.jpg.webp',
        publisher: 'NXB Văn Học',
        publicationYear: 2019,
        pageCount: 324,
        language: 'Tiếng Việt',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Vợ Nhặt',
        author: 'Kim Lân',
        category: 'Văn học',
        brand: 'Văn học',
        price: 48000,
        description: 'Truyện ngắn nổi tiếng về tình người và hoàn cảnh khó khăn trong nạn đói.',
        countInStock: 50,
        stock: 50,
        inStock: true,
        image: 'https://salt.tikicdn.com/cache/750x750/ts/product/e8/5f/3c/d5e8f5c3e3e3e3e3e3e3e3e3e3e3e3e3.jpg.webp',
        publisher: 'NXB Kim Đồng',
        publicationYear: 2020,
        pageCount: 128,
        language: 'Tiếng Việt',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Lão Hạc',
        author: 'Nam Cao',
        category: 'Văn học',
        brand: 'Văn học',
        price: 52000,
        description: 'Truyện ngắn cảm động về người nông dân nghèo khổ và lòng nhân ái.',
        countInStock: 45,
        stock: 45,
        inStock: true,
        image: 'https://salt.tikicdn.com/cache/750x750/ts/product/f2/8e/6d/a3f2c5e3e3e3e3e3e3e3e3e3e3e3e3e3.jpg.webp',
        publisher: 'NXB Kim Đồng',
        publicationYear: 2019,
        pageCount: 96,
        language: 'Tiếng Việt',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Dế Mèn Phiêu Lưu Ký',
        author: 'Tô Hoài',
        category: 'Văn học',
        brand: 'Văn học',
        price: 65000,
        description: 'Tác phẩm kinh điển cho thiếu nhi về cuộc phiêu lưu của chú dế mèn.',
        countInStock: 70,
        stock: 70,
        inStock: true,
        image: 'https://salt.tikicdn.com/cache/750x750/ts/product/c5/e8/9f/d7c5e3e3e3e3e3e3e3e3e3e3e3e3e3e3.jpg.webp',
        publisher: 'NXB Kim Đồng',
        publicationYear: 2020,
        pageCount: 216,
        language: 'Tiếng Việt',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Truyện Kiều',
        author: 'Nguyễn Du',
        category: 'Văn học',
        brand: 'Văn học',
        price: 88000,
        description: 'Tác phẩm kinh điển vĩ đại nhất của văn học Việt Nam.',
        countInStock: 55,
        stock: 55,
        inStock: true,
        image: 'https://salt.tikicdn.com/cache/750x750/ts/product/9d/e5/c8/f2c5e3e3e3e3e3e3e3e3e3e3e3e3e3e3.jpg.webp',
        publisher: 'NXB Văn Học',
        publicationYear: 2018,
        pageCount: 384,
        language: 'Tiếng Việt',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Chiếc Lá Cuối Cùng',
        author: 'O.Henry',
        category: 'Văn học',
        brand: 'Văn học',
        price: 58000,
        description: 'Tuyển tập truyện ngắn hay nhất của O.Henry.',
        countInStock: 42,
        stock: 42,
        inStock: true,
        image: 'https://salt.tikicdn.com/cache/750x750/ts/product/a7/c5/e8/d2c5e3e3e3e3e3e3e3e3e3e3e3e3e3e3.jpg.webp',
        publisher: 'NXB Văn Học',
        publicationYear: 2019,
        pageCount: 192,
        language: 'Tiếng Việt',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Những Người Khốn Khổ',
        author: 'Victor Hugo',
        category: 'Văn học',
        brand: 'Văn học',
        price: 198000,
        description: 'Kiệt tác văn học thế giới về tình người và sự công bằng xã hội.',
        countInStock: 28,
        stock: 28,
        inStock: true,
        image: 'https://salt.tikicdn.com/cache/750x750/ts/product/b3/c5/e8/e3c5e3e3e3e3e3e3e3e3e3e3e3e3e3e3.jpg.webp',
        publisher: 'NXB Văn Học',
        publicationYear: 2019,
        pageCount: 896,
        language: 'Tiếng Việt',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // KỸ NĂNG SỐNG (10 sách)
      {
        name: 'Đắc Nhân Tâm',
        author: 'Dale Carnegie',
        category: 'Kỹ năng sống',
        brand: 'Kỹ năng sống',
        price: 86000,
        description: 'Cuốn sách kinh điển về nghệ thuật giao tiếp và ứng xử của Dale Carnegie.',
        countInStock: 100,
        stock: 100,
        inStock: true,
        image: 'https://salt.tikicdn.com/cache/750x750/ts/product/e6/28/7b/b9e9c1a7d5a2c3f3f9c3d8c9e0f3e6f7.jpg.webp',
        publisher: 'NXB Tổng Hợp',
        publicationYear: 2019,
        pageCount: 320,
        language: 'Tiếng Việt',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
        author: 'Rosie Nguyễn',
        category: 'Kỹ năng sống',
        brand: 'Kỹ năng sống',
        price: 75000,
        description: 'Những bài học về tuổi trẻ, khát vọng và nỗ lực của tác giả Rosie Nguyễn.',
        countInStock: 80,
        stock: 80,
        inStock: true,
        image: 'https://salt.tikicdn.com/cache/750x750/ts/product/d5/3e/5e/46d6f0cdfbc95c1394e1508f63ea87b9.jpg.webp',
        publisher: 'NXB Hội Nhà Văn',
        publicationYear: 2018,
        pageCount: 264,
        language: 'Tiếng Việt',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Không Diệt Không Sinh Đừng Sợ Hãi',
        author: 'Thích Nhất Hạnh',
        category: 'Kỹ năng sống',
        brand: 'Kỹ năng sống',
        price: 92000,
        description: 'Những lời dạy của Thiền sư Thích Nhất Hạnh về nghệ thuật sống an lạc.',
        countInStock: 65,
        stock: 65,
        inStock: true,
        image: 'https://salt.tikicdn.com/cache/750x750/ts/product/f4/7b/7e/f15e6b7f5c25c1a5e8f7c5e3e3e3e3e3.jpg.webp',
        publisher: 'NXB Tổng Hợp',
        publicationYear: 2020,
        pageCount: 256,
        language: 'Tiếng Việt',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '7 Thói Quen Hiệu Quả',
        author: 'Stephen R. Covey',
        category: 'Kỹ năng sống',
        brand: 'Kỹ năng sống',
        price: 125000,
        description: 'Cuốn sách kinh điển về phát triển bản thân và quản lý thời gian hiệu quả.',
        countInStock: 72,
        stock: 72,
        inStock: true,
        image: 'https://salt.tikicdn.com/cache/750x750/ts/product/c8/5f/3e/a2c5e3e3e3e3e3e3e3e3e3e3e3e3e3e3.jpg.webp',
        publisher: 'NXB Tổng Hợp',
        publicationYear: 2019,
        pageCount: 448,
        language: 'Tiếng Việt',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Tư Duy Nhanh Và Chậm',
        author: 'Daniel Kahneman',
        category: 'Kỹ năng sống',
        brand: 'Kỹ năng sống',
        price: 168000,
        description: 'Nghiên cứu về hai hệ thống tư duy và cách chúng hình thành quyết định của chúng ta.',
        countInStock: 48,
        stock: 48,
        inStock: true,
        image: 'https://salt.tikicdn.com/cache/750x750/ts/product/d7/5f/8e/b3c5e3e3e3e3e3e3e3e3e3e3e3e3e3e3.jpg.webp',
        publisher: 'NXB Thế Giới',
        publicationYear: 2020,
        pageCount: 612,
        language: 'Tiếng Việt',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Nghĩ Giàu Làm Giàu',
        author: 'Napoleon Hill',
        category: 'Kỹ năng sống',
        brand: 'Kỹ năng sống',
        price: 98000,
        description: 'Bí quyết thành công từ những người giàu có nhất thế giới.',
        countInStock: 85,
        stock: 85,
        inStock: true,
        image: 'https://salt.tikicdn.com/cache/750x750/ts/product/e2/5f/9d/c4c5e3e3e3e3e3e3e3e3e3e3e3e3e3e3.jpg.webp',
        publisher: 'NXB Tổng Hợp',
        publicationYear: 2019,
        pageCount: 392,
        language: 'Tiếng Việt',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Quẳng Gánh Lo Đi Và Vui Sống',
        author: 'Dale Carnegie',
        category: 'Kỹ năng sống',
        brand: 'Kỹ năng sống',
        price: 82000,
        description: 'Nghệ thuật giảm căng thẳng và sống một cuộc đời hạnh phúc hơn.',
        countInStock: 92,
        stock: 92,
        inStock: true,
        image: 'https://salt.tikicdn.com/cache/750x750/ts/product/f8/5f/ad/d5c5e3e3e3e3e3e3e3e3e3e3e3e3e3e3.jpg.webp',
        publisher: 'NXB Tổng Hợp',
        publicationYear: 2018,
        pageCount: 368,
        language: 'Tiếng Việt',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Atomic Habits',
        author: 'James Clear',
        category: 'Kỹ năng sống',
        brand: 'Kỹ năng sống',
        price: 135000,
        description: 'Phương pháp thay đổi thói quen hiệu quả để đạt được mục tiêu lớn.',
        countInStock: 68,
        stock: 68,
        inStock: true,
        image: 'https://salt.tikicdn.com/cache/750x750/ts/product/a3/5f/bc/e6c5e3e3e3e3e3e3e3e3e3e3e3e3e3e3.jpg.webp',
        publisher: 'NXB Thế Giới',
        publicationYear: 2021,
        pageCount: 384,
        language: 'Tiếng Việt',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Khéo Ăn Nói Sẽ Có Được Thiên Hạ',
        author: 'Trác Nhã',
        category: 'Kỹ năng sống',
        brand: 'Kỹ năng sống',
        price: 78000,
        description: 'Nghệ thuật giao tiếp khéo léo trong cuộc sống và công việc.',
        countInStock: 75,
        stock: 75,
        inStock: true,
        image: 'https://salt.tikicdn.com/cache/750x750/ts/product/b8/5f/cd/f7c5e3e3e3e3e3e3e3e3e3e3e3e3e3e3.jpg.webp',
        publisher: 'NXB Lao Động',
        publicationYear: 2020,
        pageCount: 296,
        language: 'Tiếng Việt',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'The Power Of Now',
        author: 'Eckhart Tolle',
        category: 'Kỹ năng sống',
        brand: 'Kỹ năng sống',
        price: 142000,
        description: 'Sức mạnh của hiện tại - Hướng dẫn tu luyện tâm linh.',
        countInStock: 52,
        stock: 52,
        inStock: true,
        image: 'https://salt.tikicdn.com/cache/750x750/ts/product/c2/5f/de/a8c5e3e3e3e3e3e3e3e3e3e3e3e3e3e3.jpg.webp',
        publisher: 'NXB Thế Giới',
        publicationYear: 2020,
        pageCount: 328,
        language: 'Tiếng Việt',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // LỊCH SỬ (6 sách)
      {
        name: 'Sapiens: Lược Sử Loài Người',
        author: 'Yuval Noah Harari',
        category: 'Lịch sử',
        brand: 'Lịch sử',
        price: 189000,
        description: 'Câu chuyện về sự tiến hóa của loài người từ thời nguyên thủy đến hiện đại.',
        countInStock: 45,
        stock: 45,
        inStock: true,
        image: 'https://salt.tikicdn.com/cache/750x750/ts/product/bb/5f/43/b9e9c1a7d5a2c3f3f9c3d8c9e0f3e6f7.jpg.webp',
        publisher: 'NXB Trẻ',
        publicationYear: 2021,
        pageCount: 544,
        language: 'Tiếng Việt',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Homo Deus: Lược Sử Tương Lai',
        author: 'Yuval Noah Harari',
        category: 'Lịch sử',
        brand: 'Lịch sử',
        price: 195000,
        description: 'Những dự báo táo bạo về tương lai của loài người.',
        countInStock: 38,
        stock: 38,
        inStock: true,
        image: 'https://salt.tikicdn.com/cache/750x750/ts/product/cc/5f/54/c8c5e3e3e3e3e3e3e3e3e3e3e3e3e3e3.jpg.webp',
        publisher: 'NXB Trẻ',
        publicationYear: 2020,
        pageCount: 496,
        language: 'Tiếng Việt',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ];
    
    await productsCollection.insertMany(products);
    console.log('✅ Đã tạo 8 products');

    // 3. TẠO COLLECTION ORDERS (rỗng)
    console.log('\n📦 Đang tạo collection orders...');
    const ordersCollection = mongoose.connection.collection('orders');
    await ordersCollection.deleteMany({});
    console.log('✅ Collection orders đã sẵn sàng');

    // 4. HIỂN THỊ THÔNG TIN
    console.log('\n' + '='.repeat(60));
    console.log('🎉 TẠO DỮ LIỆU THÀNH CÔNG!');
    console.log('='.repeat(60));
    
    console.log('\n📊 Thống kê:');
    console.log(`   - Customers: ${await customersCollection.countDocuments()} tài khoản`);
    console.log(`   - Products: ${await productsCollection.countDocuments()} sách`);
    console.log(`   - Orders: ${await ordersCollection.countDocuments()} đơn hàng`);
    
    console.log('\n🔐 Tài khoản đăng nhập:');
    console.log('\n   📌 ADMIN:');
    console.log('      Email: admin@bookstore.com');
    console.log('      Password: admin123');
    console.log('\n   📌 USER:');
    console.log('      Email: user1@example.com');
    console.log('      Password: user123');
    
    console.log('\n💡 Bước tiếp theo:');
    console.log('   1. Chạy backend: npm run server');
    console.log('   2. Chạy frontend: npm run client');
    console.log('   3. Hoặc chạy cả 2: npm run dev');
    console.log('   4. Truy cập: http://localhost:5173');
    console.log('\n' + '='.repeat(60) + '\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ LỖI:', error.message);
    console.error(error);
    process.exit(1);
  }
};

// Chạy script
createData();