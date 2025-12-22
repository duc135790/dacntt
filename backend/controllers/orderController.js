import Order from '../models/orderModel.js';
import Customer from '../models/customerModel.js';
import Product from '../models/productModel.js';
import { NotificationManager } from '../patterns/Observer.js'; // ✅ IMPORT OBSERVER

const notificationManager = new NotificationManager(); // ✅ KHỞI TẠO

 //@desc Tao don hang moi
 //@route POST /api/orders
 //@access Private
 const addOrderItems = async (req, res) =>{
    try {
        //fe se gui len totalPrice, shippingAddress, paymentMethod
        const { shippingAddress, paymentMethod, totalPrice } = req.body;
        
        // Validate shippingAddress
        if (!shippingAddress) {
            return res.status(400).json({ message: 'Thiếu thông tin địa chỉ giao hàng' });
        }
        
        if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.phone) {
            return res.status(400).json({ 
                message: 'Thiếu thông tin địa chỉ giao hàng',
                details: {
                    address: !shippingAddress.address ? 'Thiếu địa chỉ' : null,
                    city: !shippingAddress.city ? 'Thiếu thành phố' : null,
                    phone: !shippingAddress.phone ? 'Thiếu số điện thoại' : null
                }
            });
        }

        // Validate totalPrice
        if (!totalPrice || isNaN(totalPrice) || totalPrice <= 0) {
            return res.status(400).json({ message: 'Tổng tiền không hợp lệ' });
        }
        
        //lay gio hang tu req.user
        const customer = await Customer.findById(req.user._id);
        if (!customer) {
            return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
        }
        
        const cartItems = customer.cart;

        console.log('📦 Order data:', {
            shippingAddress,
            paymentMethod,
            totalPrice,
            cartItemsCount: cartItems?.length || 0
        });

        if(cartItems && cartItems.length === 0){
            return res.status(400).json({ message: 'Không có sản phẩm nào trong giỏ hàng' });
        }
        
        // Kiểm tra và trừ số lượng tồn kho
        for (const item of cartItems) {
            // cartItem lưu field 'product' là ObjectId tham chiếu Product
            const product = await Product.findById(item.product);
            
            if (!product) {
                return res.status(404).json({ message: `Không tìm thấy sản phẩm trong giỏ hàng` });
            }

            console.log(`📦 Trước khi trừ - Sản phẩm: ${product.name}, Tồn kho: ${product.countInStock}, Số lượng mua: ${item.quantity}`);

            // Kiểm tra số lượng tồn kho
            if (product.countInStock < item.quantity) {
                return res.status(400).json({ 
                    message: `Sản phẩm "${product.name}" chỉ còn ${product.countInStock} sản phẩm trong kho` 
                });
            }

            // Trừ số lượng tồn kho bằng findByIdAndUpdate để đảm bảo atomic
            const oldStock = product.countInStock;
            const updatedProduct = await Product.findByIdAndUpdate(
                item.product,
                { $inc: { countInStock: -item.quantity } },
                { new: true } // Trả về document đã được cập nhật
            );
            
            if (!updatedProduct) {
                return res.status(404).json({ message: `Không thể cập nhật số lượng sản phẩm "${product.name}"` });
            }
            
            console.log(`✅ Sau khi trừ - Sản phẩm: ${updatedProduct.name}, Tồn kho cũ: ${oldStock}, Tồn kho mới: ${updatedProduct.countInStock}`);
        }

        //tao don hang moi
        try {
            const orderItems = cartItems.map((item) => {
                // Đảm bảo tất cả field đều có giá trị
                if (!item.name || !item.image || !item.price || !item.quantity || !item.product) {
                    throw new Error(`Thiếu thông tin sản phẩm trong giỏ hàng: ${JSON.stringify(item)}`);
                }
                return {
                    name: item.name,
                    quantity: Number(item.quantity),
                    image: item.image,
                    price: Number(item.price),
                    product: item.product, // ObjectId tham chiếu Product
                };
            });

            const order = new Order({
                orderItems,
                user: req.user._id,
                shippingAddress,
                paymentMethod: paymentMethod || 'COD',
                totalPrice: Number(totalPrice) || 0,
            });

            //luu don hang vao db
            const createdOrder = await order.save();

            // ✅ DÙNG OBSERVER PATTERN - Gửi thông báo
            console.log('\n📢 Using Observer Pattern to send notifications');
            const orderObserver = notificationManager.createOrder({
                _id: createdOrder._id,
                orderId: createdOrder._id,
                status: createdOrder.orderStatus,
                totalPrice: createdOrder.totalPrice,
                user: {
                    name: customer.name,
                    email: customer.email,
                    _id: customer._id
                },
                shippingAddress: createdOrder.shippingAddress,
                customerName: customer.name,
                customerEmail: customer.email,
                customerPhone: createdOrder.shippingAddress.phone
            });
            orderObserver.setStatus('Đang xử lý'); // Trigger notifications

            //xoa gio hang cua nguoi dung sau khi dat hang
            customer.cart = [];
            await customer.save();

            //tra ve don hang da tao
            res.status(201).json(createdOrder);
        } catch (error) {
            console.error('❌ Lỗi khi tạo đơn hàng:', error);
            console.error('❌ Error details:', {
                name: error.name,
                message: error.message,
                errors: error.errors
            });
            
            if (error.name === 'ValidationError') {
                const messages = Object.values(error.errors).map(e => e.message);
                console.error('❌ Validation errors:', messages);
                return res.status(400).json({
                    message: 'Dữ liệu không hợp lệ',
                    errors: messages,
                    details: error.errors
                });
            }
            
            return res.status(500).json({
                message: error.message || 'Lỗi khi tạo đơn hàng'
            });
        }
    } catch (error) {
        console.error('❌ Lỗi ngoài:', error);
        return res.status(500).json({
            message: error.message || 'Lỗi server'
        });
    }
 };

// @desc    Lấy các đơn hàng của người dùng đã đăng nhập
// @route   GET /api/orders/myorders
// @access  Private (Cần đăng nhập)
const getMyOrders = async (req, res) => {
  //Lay req.user._id tu middleware 'protect'
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};


// @desc    Lấy TẤT CẢ đơn hàng
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  //Lay tat ca don hang, dong thoi 'populate' ten cua user
  const orders = await Order.find({}).populate('user', 'id name email');
  res.json(orders);
};

// @desc    Cập nhật trạng thái đơn hàng (Đã giao)
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.orderStatus = 'Đã giao';
    
    const updatedOrder = await order.save();

    // ✅ DÙNG OBSERVER PATTERN - Gửi thông báo khi đổi status
    console.log('\n📢 Using Observer Pattern for status change');
    const orderObserver = notificationManager.createOrder({
        _id: updatedOrder._id,
        orderId: updatedOrder._id,
        status: updatedOrder.orderStatus,
        totalPrice: updatedOrder.totalPrice,
        user: order.user,
        shippingAddress: updatedOrder.shippingAddress,
        customerName: order.user.name,
        customerEmail: order.user.email,
        customerPhone: updatedOrder.shippingAddress.phone
    });
    orderObserver.setStatus('Đã giao'); // Trigger notifications
    
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Không tìm thấy đơn hàng');
  }
};

// @desc    Lấy đơn hàng bằng ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    // Kiem tra bao mat
    // 1. User co phai la Admin khong?
    // 2. User co phai la chu cua don hang nay khong?
    if (req.user.isAdmin || order.user._id.equals(req.user._id)) {
      res.json(order);
    } else {
      res.status(401);
      throw new Error('Không có quyền truy cập đơn hàng này');
    }
  } else {
    res.status(404);
    throw new Error('Không tìm thấy đơn hàng');
  }
};

// @desc    Hủy đơn hàng
// @route   DELETE /api/orders/:id
// @access  Private (User hoặc Admin)
const cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Không tìm thấy đơn hàng');
  }

  // Kiểm tra quyền: User phải là chủ đơn hàng hoặc Admin
  if (!req.user.isAdmin && !order.user._id.equals(req.user._id)) {
    res.status(401);
    throw new Error('Không có quyền hủy đơn hàng này');
  }

  // Chỉ cho phép hủy đơn hàng nếu chưa giao hàng
  if (order.isDelivered) {
    res.status(400);
    throw new Error('Không thể hủy đơn hàng đã được giao');
  }

  // Chỉ cho phép hủy nếu đơn hàng chưa bị hủy
  if (order.orderStatus === 'Đã hủy') {
    res.status(400);
    throw new Error('Đơn hàng đã được hủy trước đó');
  }

  // Hoàn trả số lượng sản phẩm về kho khi hủy đơn hàng
  for (const item of order.orderItems) {
    const product = await Product.findById(item.product);
    if (product) {
      product.countInStock += item.quantity;
      await product.save();
      console.log(`  ✅ Đã hoàn trả ${item.quantity} sản phẩm "${product.name}". Tồn kho: ${product.countInStock}`);
    }
  }

  // Cập nhật trạng thái đơn hàng thành "Đã hủy"
  order.orderStatus = 'Đã hủy';
  const updatedOrder = await order.save();

  // ✅ DÙNG OBSERVER PATTERN - Gửi thông báo khi hủy
  console.log('\n📢 Using Observer Pattern for order cancellation');
  const orderObserver = notificationManager.createOrder({
      _id: updatedOrder._id,
      orderId: updatedOrder._id,
      status: 'Đã hủy',
      totalPrice: updatedOrder.totalPrice,
      user: order.user,
      shippingAddress: updatedOrder.shippingAddress,
      customerName: order.user.name,
      customerEmail: order.user.email,
      customerPhone: updatedOrder.shippingAddress.phone
  });
  orderObserver.setStatus('Đã hủy'); // Trigger notifications

  res.json({
    message: 'Đơn hàng đã được hủy thành công',
    order: updatedOrder,
  });
};

export { addOrderItems, getMyOrders, getOrders, updateOrderToDelivered, getOrderById, cancelOrder };