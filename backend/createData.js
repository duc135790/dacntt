import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';  // ✅ Phải có dòng này
import bcrypt from 'bcryptjs';     // ✅ Phải có dòng này

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env từ thư mục cha
dotenv.config({ path: path.join(__dirname, '..', '.env') });

console.log('MONGO_URI:', process.env.MONGO_URI ? '✅ Loaded' : '❌ Not found');

// Tiếp tục phần connectDB...
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env file');
    }
    
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`✅ Database: ${conn.connection.name}`);
    return true;
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const createData = async () => {
  try {
    await connectDB();

    // 1. TẠO CUSTOMERS
    console.log('\n📝 Đang tạo customers...');
    
    const customersCollection = mongoose.connection.collection('customers');
    await customersCollection.deleteMany({});
    
    const customers = [
      {
        email: 'admin@shoponline.com',
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
      },
      {
        email: 'user2@example.com',
        name: 'Trần Thị B',
        phone: '0912345678',
        password: await hashPassword('user123'),
        isAdmin: false,
        cart: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    await customersCollection.insertMany(customers);
    console.log('✅ Đã tạo 3 customers');

    // 2. TẠO PRODUCTS
    console.log('\n🛍️ Đang tạo products...');
    
    const productsCollection = mongoose.connection.collection('products');
    await productsCollection.deleteMany({});
    
    const products = [
      // ===== ĐIỆN THOẠI & PHỤ KIỆN (10 sản phẩm) =====
      {
        name: 'iPhone 15 Pro Max 256GB',
        category: 'Điện thoại',
        brand: 'Apple',
        price: 29990000,
        description: 'iPhone 15 Pro Max với chip A17 Pro, camera 48MP, màn hình Super Retina XDR 6.7 inch',
        countInStock: 50,
        stock: 50,
        inStock: true,
        image: 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg',
        specifications: {
          screen: '6.7 inch, Super Retina XDR',
          camera: '48MP + 12MP + 12MP',
          chip: 'Apple A17 Pro',
          ram: '8GB',
          storage: '256GB',
          battery: '4422mAh'
        },
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Samsung Galaxy S24 Ultra 512GB',
        category: 'Điện thoại',
        brand: 'Samsung',
        price: 31990000,
        description: 'Galaxy S24 Ultra với camera 200MP, S Pen tích hợp, màn hình Dynamic AMOLED 2X',
        countInStock: 45,
        stock: 45,
        inStock: true,
        image: 'https://cdn.tgdd.vn/Products/Images/42/320471/samsung-galaxy-s24-ultra-grey-thumbnew-600x600.jpg',
        specifications: {
          screen: '6.8 inch, Dynamic AMOLED 2X',
          camera: '200MP + 50MP + 12MP + 10MP',
          chip: 'Snapdragon 8 Gen 3',
          ram: '12GB',
          storage: '512GB',
          battery: '5000mAh'
        },
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Xiaomi 14 Ultra 16GB/512GB',
        category: 'Điện thoại',
        brand: 'Xiaomi',
        price: 24990000,
        description: 'Xiaomi 14 Ultra camera Leica, chip Snapdragon 8 Gen 3, sạc nhanh 90W',
        countInStock: 35,
        stock: 35,
        inStock: true,
        image: 'https://cdn.tgdd.vn/Products/Images/42/321771/xiaomi-14-ultra-den-thumbnew-600x600.jpg',
        specifications: {
          screen: '6.73 inch, AMOLED',
          camera: '50MP + 50MP + 50MP + 50MP',
          chip: 'Snapdragon 8 Gen 3',
          ram: '16GB',
          storage: '512GB',
          battery: '5000mAh'
        },
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'OPPO Find X7 Ultra 16GB/512GB',
        category: 'Điện thoại',
        brand: 'OPPO',
        price: 22990000,
        description: 'OPPO Find X7 Ultra với 4 camera Hasselblad, chip Snapdragon 8 Gen 3',
        countInStock: 30,
        stock: 30,
        inStock: true,
        image: 'https://cdn.tgdd.vn/Products/Images/42/322096/oppo-find-x7-ultra-xanh-thumbnew-600x600.jpg',
        specifications: {
          screen: '6.82 inch, AMOLED',
          camera: '50MP + 50MP + 50MP + 50MP',
          chip: 'Snapdragon 8 Gen 3',
          ram: '16GB',
          storage: '512GB',
          battery: '5000mAh'
        },
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'AirPods Pro 2 USB-C',
        category: 'Phụ kiện điện thoại',
        brand: 'Apple',
        price: 6290000,
        description: 'Tai nghe AirPods Pro 2 với chip H2, chống ồn chủ động thế hệ mới',
        countInStock: 100,
        stock: 100,
        inStock: true,
        image: 'https://cdn.tgdd.vn/Products/Images/54/325503/tai-nghe-bluetooth-airpods-pro-2-usb-c-charge-apple-mqd83-thumb-600x600.jpg',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sạc nhanh Anker 735 GaNPrime 65W',
        category: 'Phụ kiện điện thoại',
        brand: 'Anker',
        price: 1490000,
        description: 'Sạc nhanh 65W với 3 cổng (2 USB-C, 1 USB-A), công nghệ GaN',
        countInStock: 80,
        stock: 80,
        inStock: true,
        image: 'https://cdn.tgdd.vn/Products/Images/58/309282/anker-735-ganprime-65w-a2667-den-thumb-600x600.jpg',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Ốp lưng MagSafe iPhone 15 Pro Max',
        category: 'Phụ kiện điện thoại',
        brand: 'Apple',
        price: 1290000,
        description: 'Ốp lưng Silicone MagSafe chính hãng Apple cho iPhone 15 Pro Max',
        countInStock: 150,
        stock: 150,
        inStock: true,
        image: 'https://cdn.tgdd.vn/Products/Images/60/309156/op-lung-magsafe-iphone-15-pro-max-silicone-trang-thumb-600x600.jpg',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Cáp sạc Type-C to Lightning Apple 1m',
        category: 'Phụ kiện điện thoại',
        brand: 'Apple',
        price: 690000,
        description: 'Cáp sạc nhanh USB-C to Lightning chính hãng Apple',
        countInStock: 200,
        stock: 200,
        inStock: true,
        image: 'https://cdn.tgdd.vn/Products/Images/58/230212/cap-type-c-lightning-1-m-apple-mqgh2-thumb-600x600.jpg',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Miếng dán cường lực iPhone 15 Pro Max',
        category: 'Phụ kiện điện thoại',
        brand: 'JCPAL',
        price: 450000,
        description: 'Miếng dán cường lực full màn hình, chống vân tay, độ cứng 9H',
        countInStock: 180,
        stock: 180,
        inStock: true,
        image: 'https://cdn.tgdd.vn/Products/Images/5475/309098/mieng-dan-cuong-luc-iphone-15-pro-max-jcpal-preserver-super-hardness-glass-thumb-600x600.jpg',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Pin dự phòng Anker PowerCore 20000mAh',
        category: 'Phụ kiện điện thoại',
        brand: 'Anker',
        price: 990000,
        description: 'Pin dự phòng 20000mAh, sạc nhanh 20W, 2 cổng USB-C và USB-A',
        countInStock: 70,
        stock: 70,
        inStock: true,
        image: 'https://cdn.tgdd.vn/Products/Images/57/313289/pin-du-phong-20000mah-20w-anker-powercore-essential-a1287-den-thumb-600x600.jpg',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // ===== LAPTOP (8 sản phẩm) =====
      {
        name: 'MacBook Air 15 inch M3 8GB/256GB',
        category: 'Laptop',
        brand: 'Apple',
        price: 32990000,
        description: 'MacBook Air 15 inch với chip M3, màn hình Liquid Retina 15.3 inch, pin 18 giờ',
        countInStock: 25,
        stock: 25,
        inStock: true,
        image: 'https://cdn.tgdd.vn/Products/Images/44/322096/macbook-air-15-inch-m3-2024-xam-thumb-600x600.jpg',
        specifications: {
          cpu: 'Apple M3 8-core',
          ram: '8GB',
          storage: '256GB SSD',
          screen: '15.3 inch, Liquid Retina',
          graphics: 'Apple M3 10-core GPU',
          weight: '1.51kg'
        },
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Dell XPS 13 Plus 9320 i7/16GB/512GB',
        category: 'Laptop',
        brand: 'Dell',
        price: 42990000,
        description: 'Dell XPS 13 Plus với thiết kế cao cấp, màn hình OLED 3.5K, Intel Core i7 Gen 12',
        countInStock: 20,
        stock: 20,
        inStock: true,
        image: 'https://cdn.tgdd.vn/Products/Images/44/289090/dell-xps-13-plus-9320-i7-5z105-glr-thumb-600x600.jpg',
        specifications: {
          cpu: 'Intel Core i7-1260P',
          ram: '16GB LPDDR5',
          storage: '512GB SSD',
          screen: '13.4 inch, OLED 3.5K',
          graphics: 'Intel Iris Xe',
          weight: '1.26kg'
        },
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Asus ROG Zephyrus G14 Ryzen 9/16GB/1TB RTX 4060',
        category: 'Laptop',
        brand: 'Asus',
        price: 39990000,
        description: 'Laptop gaming Asus ROG Zephyrus G14 với Ryzen 9 7940HS, RTX 4060, màn hình 165Hz',
        countInStock: 18,
        stock: 18,
        inStock: true,
        image: 'https://cdn.tgdd.vn/Products/Images/44/307209/asus-rog-zephyrus-g14-ga402xv-r9-n6059w-glr-thumb-600x600.jpg',
        specifications: {
          cpu: 'AMD Ryzen 9 7940HS',
          ram: '16GB DDR5',
          storage: '1TB SSD',
          screen: '14 inch, QHD+ 165Hz',
          graphics: 'NVIDIA RTX 4060 8GB',
          weight: '1.65kg'
        },
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Lenovo ThinkPad X1 Carbon Gen 11 i7/16GB/512GB',
        category: 'Laptop',
        brand: 'Lenovo',
        price: 45990000,
        description: 'ThinkPad X1 Carbon cao cấp cho doanh nhân, siêu nhẹ, bảo mật vượt trội',
        countInStock: 15,
        stock: 15,
        inStock: true,
        image: 'https://cdn.tgdd.vn/Products/Images/44/309674/lenovo-thinkpad-x1-carbon-gen-11-i7-21hm00c3vn-glr-thumb-600x600.jpg',
        specifications: {
          cpu: 'Intel Core i7-1355U',
          ram: '16GB LPDDR5',
          storage: '512GB SSD',
          screen: '14 inch, WUXGA IPS',
          graphics: 'Intel Iris Xe',
          weight: '1.12kg'
        },
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'HP Pavilion 15 i5/8GB/512GB',
        category: 'Laptop',
        brand: 'HP',
        price: 16990000,
        description: 'Laptop HP Pavilion 15 phù hợp văn phòng, học tập với hiệu năng ổn định',
        countInStock: 40,
        stock: 40,
        inStock: true,
        image: 'https://cdn.tgdd.vn/Products/Images/44/316572/hp-pavilion-15-eg3091tu-i5-8c5n6pa-glr-thumb-600x600.jpg',
        specifications: {
          cpu: 'Intel Core i5-1335U',
          ram: '8GB DDR4',
          storage: '512GB SSD',
          screen: '15.6 inch, FHD IPS',
          graphics: 'Intel UHD',
          weight: '1.75kg'
        },
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Acer Aspire 5 Ryzen 5/8GB/512GB',
        category: 'Laptop',
        brand: 'Acer',
        price: 14990000,
        description: 'Laptop Acer Aspire 5 giá rẻ, cấu hình tốt cho sinh viên',
        countInStock: 50,
        stock: 50,
        inStock: true,
        image: 'https://cdn.tgdd.vn/Products/Images/44/313108/acer-aspire-5-a515-58m-53s6-i5-nxkq8sv003-glr-thumb-600x600.jpg',
        specifications: {
          cpu: 'AMD Ryzen 5 7520U',
          ram: '8GB DDR4',
          storage: '512GB SSD',
          screen: '15.6 inch, FHD IPS',
          graphics: 'AMD Radeon',
          weight: '1.8kg'
        },
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'MSI GF63 Thin i5/8GB/512GB RTX 3050',
        category: 'Laptop',
        brand: 'MSI',
        price: 19990000,
        description: 'Laptop gaming MSI GF63 mỏng nhẹ, card RTX 3050, phù hợp gaming cơ bản',
        countInStock: 30,
        stock: 30,
        inStock: true,
        image: 'https://cdn.tgdd.vn/Products/Images/44/309078/msi-gf63-thin-11uc-i5-664vn-glr-thumb-600x600.jpg',
        specifications: {
          cpu: 'Intel Core i5-11400H',
          ram: '8GB DDR4',
          storage: '512GB SSD',
          screen: '15.6 inch, FHD 144Hz',
          graphics: 'NVIDIA RTX 3050 4GB',
          weight: '1.86kg'
        },
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'LG Gram 16 2024 i5/16GB/512GB',
        category: 'Laptop',
        brand: 'LG',
        price: 29990000,
        description: 'LG Gram siêu nhẹ 1.2kg, màn hình 16 inch, pin 22 giờ',
        countInStock: 22,
        stock: 22,
        inStock: true,
        image: 'https://cdn.tgdd.vn/Products/Images/44/322063/lg-gram-16-2024-i5-16z90rs-g-ah55a5-glr-thumb-600x600.jpg',
        specifications: {
          cpu: 'Intel Core i5-1340P',
          ram: '16GB LPDDR5',
          storage: '512GB SSD',
          screen: '16 inch, WQXGA IPS',
          graphics: 'Intel Iris Xe',
          weight: '1.2kg'
        },
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // ===== THỜI TRANG NAM (8 sản phẩm) =====
      {
        name: 'Áo thun nam basic cotton 100%',
        category: 'Thời trang nam',
        brand: 'Routine',
        price: 179000,
        description: 'Áo thun nam form regular, chất cotton 100% thoáng mát, nhiều màu',
        countInStock: 200,
        stock: 200,
        inStock: true,
        image: 'https://routine.vn/media/catalog/product/cache/e26d6c1d99f82befea2c/a/o/ao-thun-nam-basic-10s22tsh10_trang_1__1.jpg',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Áo polo nam cao cấp',
        category: 'Thời trang nam',
        brand: 'Aristino',
        price: 395000,
        description: 'Áo polo nam chất liệu Pique cao cấp, form slim fit thanh lịch',
        countInStock: 150,
        stock: 150,
        inStock: true,
        image: 'https://aristino.com/Data/upload/images/AO/POLO/APS20602/APS20602.webp',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Quần jean nam slim fit',
        category: 'Thời trang nam',
        brand: 'Levi\'s',
        price: 1290000,
        description: 'Quần jean Levi\'s 511 Slim Fit, chất denim cao cấp, bền đẹp',
        countInStock: 80,
        stock: 80,
        inStock: true,
        image: 'https://product.hstatic.net/200000033444/product/045114891_quan_jeans_slim_fit_10_inch_xanh_den_1__6cea12ae5e5b4f12b5ee74f44b5d8c9a_master.jpg',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Quần kaki nam túi hộp',
        category: 'Thời trang nam',
        brand: 'Owen',
        price: 599000,
        description: 'Quần kaki Owen form regular, chất liệu thoáng mát, phù hợp đi làm',
        countInStock: 120,
        stock: 120,
        inStock: true,
        image: 'https://owen.cdn.vccloud.vn/media/catalog/product/cache/01755127bd64f5dde3182fd2f139143a/q/u/quan-kaki-tui-hop-qkd23223-rk-11.jpg',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Áo sơ mi nam dài tay',
        category: 'Thời trang nam',
        brand: 'Pierre Cardin',
        price: 695000,
        description: 'Áo sơ mi dài tay Pierre Cardin, chống nhăn, phù hợp công sở',
        countInStock: 100,
        stock: 100,
        inStock: true,
        image: 'https://pierrecardin.com.vn/wp-content/uploads/2023/03/SGDTS2023.1WH-1.jpg',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Áo khoác hoodie nam',
        category: 'Thời trang nam',
        brand: 'MLB',
        price: 2190000,
        description: 'Áo khoác hoodie MLB chính hãng, form oversize trendy',
        countInStock: 60,
        stock: 60,
        inStock: true,
        image: 'https://product.hstatic.net/200000033444/product/31bsh2241-07bks__1__f4c6e7c9ed834b40876fea85df2c4bc5_master.jpg',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Giày thể thao nam Sneaker',
        category: 'Thời trang nam',
        brand: 'Nike',
        price: 2890000,
        description: 'Giày Nike Air Max 270 chính hãng, đế êm ái, thoải mái',
        countInStock: 45,
        stock: 45,
        inStock: true,
        image: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/6e7ee59b-c80d-42bf-8d76-ddb428b08ac5/jordan-air-200e-shoes-MHgbnm.png',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Balo laptop 15.6 inch chống nước',
        category: 'Thời trang nam',
        brand: 'The Toppu',
        price: 490000,
        description: 'Balo laptop The Toppu chống nước, nhiều ngăn tiện lợi',
        countInStock: 90,
        stock: 90,
        inStock: true,
        image: 'https://thetoppu.vn/wp-content/uploads/2023/08/z4620089453765_f6dcaa00af2efcc85871ba5bfd41a4d9-1.jpg',
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // ===== THỜI TRANG NỮ (8 sản phẩm) =====
      {
        name: 'Váy dạ hội dài tay ren cao cấp',
        category: 'Thời trang nữ',
        brand: 'Elise',
        price: 1590000,
        description: 'Váy dạ hội ren sang trọng, phù hợp dự tiệc, form A tôn dáng',
        countInStock: 40,
        stock: 40,
        inStock: true,
        image: 'https://product.hstatic.net/200000033444/product/vds2024052gy-31_a1a9f7f0f5fa4b9fb6f5b4f74c9f42c0_master.jpg',
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