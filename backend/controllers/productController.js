import Product from "../models/productModel.js";
import Order from '../models/orderModel.js';

// @desc    Lấy tất cả sản phẩm (Có tìm kiếm & lọc danh mục)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  //Xử lý tìm kiếm (Keyword)
  const keyword = req.query.keyword
    ? {
        $or: [
            { name: { $regex: req.query.keyword, $options: 'i' } },
            { author: { $regex: req.query.keyword, $options: 'i' } },
        ]
      }
    : {};

  const category = req.query.category
    ? { category: req.query.category }
    : {};

  const products = await Product.find({ ...keyword, ...category });
  
  res.json(products);
};

// @desc    Lấy chi tiết một sản phẩm
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Không tìm thấy sách' });
    }
  } catch (error) {
    res.status(404).json({ message: 'Không tìm thấy sách' });
  }
};

// @desc    Lấy TẤT CẢ sản phẩm cho Admin (không filter, có sort)
// @route   GET /api/products/admin/all
// @access  Private/Admin
const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .select('-__v'); // Bỏ field __v không cần thiết
    
    res.json({
      success: true,
      count: products.length,
      products: products
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Lỗi khi lấy danh sách sản phẩm',
      error: error.message 
    });
  }
};

// @desc    Tạo sản phẩm mới
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      description,
      image,
      countInStock,
      author,
      publisher,
      publicationYear,
      language,
      pageCount
    } = req.body;

    // Tạo sản phẩm mới với dữ liệu từ frontend
    const product = new Product({
      user: req.user._id,
      name: name || 'Tên sản phẩm mới',
      category: category || 'Khác',
      price: price || 0,
      description: description || '',
      image: image || '/images/sample.jpg',
      countInStock: countInStock || 0,
      author: author || '',
      publisher: publisher || '',
      publicationYear: publicationYear || new Date().getFullYear(),
      language: language || 'Tiếng Việt',
      pageCount: pageCount || 0
    });

    const createdProduct = await product.save();
    console.log('✅ Product created:', createdProduct.name);
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('❌ Error creating product:', error);
    res.status(500).json({ 
      message: error.message || 'Tạo sản phẩm thất bại' 
    });
  }
};

// @desc    Cập nhật sản phẩm
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    // Lấy các trường dữ liệu từ Frontend gửi lên
    const { 
        name, 
        price, 
        description, 
        image, 
        category, 
        countInStock,
        author,
        publisher,
        publicationYear,
        language,
        pageCount
    } = req.body;

    console.log('📝 Update product request:', req.params.id, req.body);

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ 
        message: 'Không tìm thấy sản phẩm' 
      });
    }

    // Validate required fields nếu được gửi lên
    if (name !== undefined && (!name || !name.trim())) {
      return res.status(400).json({ message: 'Tên sản phẩm không được để trống' });
    }
    if (category !== undefined && (!category || !category.trim())) {
      return res.status(400).json({ message: 'Danh mục không được để trống' });
    }
    if (description !== undefined && (!description || !description.trim())) {
      return res.status(400).json({ message: 'Mô tả không được để trống' });
    }
    if (image !== undefined && (!image || !image.trim())) {
      return res.status(400).json({ message: 'URL hình ảnh không được để trống' });
    }

    // Cập nhật các trường, chỉ cập nhật nếu có giá trị hợp lệ được gửi lên
    if (name !== undefined && name.trim()) product.name = name.trim();
    if (price !== undefined && price >= 0) product.price = price;
    if (description !== undefined) product.description = description.trim() || product.description;
    if (image !== undefined) product.image = image.trim() || product.image;
    if (category !== undefined && category.trim()) product.category = category.trim();
    if (countInStock !== undefined && countInStock >= 0) product.countInStock = countInStock;
    
    // Cập nhật các trường sách (optional)
    if (author !== undefined) product.author = author || '';
    if (publisher !== undefined) product.publisher = publisher || '';
    if (publicationYear !== undefined) product.publicationYear = publicationYear;
    if (language !== undefined) product.language = language || 'Tiếng Việt';
    if (pageCount !== undefined) product.pageCount = pageCount;

    const updatedProduct = await product.save();
    console.log('✅ Product updated:', updatedProduct.name);
    res.json(updatedProduct);
  } catch (error) {
    console.error('❌ Error updating product:', error);
    
    // Xử lý validation errors từ Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message).join(', ');
      return res.status(400).json({ 
        message: `Lỗi validation: ${messages}` 
      });
    }
    
    res.status(error.statusCode || 500).json({ 
      message: error.message || 'Cập nhật sản phẩm thất bại' 
    });
  }
};

// @desc    Cập nhật số lượng tồn kho
// @route   PUT /api/products/:id/stock
// @access  Private/Admin
const updateProductStock = async (req, res) => {
  try {
    const { countInStock } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      product.countInStock = countInStock;
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Xóa sản phẩm
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Sách đã được xóa' });
  } else {
    res.status(404);
    throw new Error('Không tìm thấy sách');
  }
};

// @desc    Tạo đánh giá sản phẩm mới
// @route   POST /api/products/:id/reviews
// @access  Private (Cần đăng nhập)
const createProductReview = async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;

  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error('Không tìm thấy sách');
  }

  const user = req.user;

  // Kiểm tra xem user đã mua sách này chưa
  const orders = await Order.find({ 
    user: user._id, 
    'orderItems.product': productId,
    isPaid: true
  });

  if (orders.length === 0) {
    res.status(400);
    throw new Error('Bạn phải mua sách này trước khi được đánh giá');
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Bạn đã đánh giá sách này rồi');
  }

  const review = {
    name: user.name || user.fullName,
    rating: Number(rating),
    comment,
    user: user._id,
  };

  product.reviews.push(review);

  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();
  res.status(201).json({ message: 'Đánh giá đã được thêm' });
};

export {
  getProducts,
  getProductById,
  getAllProductsAdmin,
  createProduct,
  updateProduct,
  updateProductStock,
  deleteProduct,
  createProductReview,
};