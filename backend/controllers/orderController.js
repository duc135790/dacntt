import Order from '../models/orderModel.js';
import Customer from '../models/customerModel.js';
import { NotificationManager } from '../patterns/Observer.js'; // ✅ IMPORT OBSERVER

const notificationManager = new NotificationManager(); // ✅ KHỞI TẠO

 //@desc Tao don hang moi
 //@route POST /api/orders
 //@access Private
 const addOrderItems = async (req, res) =>{
    //fe se gui len totalPrice, shippingAddress, paymentMethod
    const { shippingAddress, paymentMethod, totalPrice } = req.body;
    
    //lay gio hang tu req.user
    const customer = await Customer.findById(req.user._id);
    const cartItems = customer.cart;

    if(cartItems && cartItems.length === 0){
        res.status(400);
        throw new Error('Không có sản phẩm nào trong giỏ hàng');
    }else{
        //tao don hang moi
        const order = new Order({
            orderItems: cartItems.map((item) =>({
                ...item,
                product: item.product,
                _id: undefined,
            })),
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            totalPrice,
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