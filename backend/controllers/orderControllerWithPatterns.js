// backend/controllers/orderControllerWithPatterns.js

/**
 * TÍCH HỢP TẤT CẢ DESIGN PATTERNS VÀO ORDER CONTROLLER
 * 
 * Patterns được sử dụng:
 * 1. Abstract Factory - Tạo sản phẩm
 * 2. Decorator - Thêm tính năng cho đơn hàng
 * 3. Strategy - Xử lý thanh toán
 * 4. Observer - Thông báo trạng thái
 * 5. Singleton - Quản lý cart
 */

import Order from '../models/orderModel.js';
import Customer from '../models/customerModel.js';

// Import Design Patterns
import { ProductFactoryProducer } from '../patterns/AbstractFactory.js';
import { OrderDecoratorFactory } from '../patterns/Decorator.js';
import { PaymentStrategyFactory, PaymentProcessor } from '../patterns/Strategy.js';
import { NotificationManager } from '../patterns/Observer.js';
import { CartManager } from '../patterns/Singleton.js';

// Singleton instance
const cartManager = CartManager.getInstance();
const notificationManager = new NotificationManager();

/**
 * @desc    Tạo đơn hàng mới với Design Patterns
 * @route   POST /api/orders/v2
 * @access  Private
 */
const createOrderWithPatterns = async (req, res) => {
  try {
    const { 
      shippingAddress, 
      paymentMethod, 
      decorators, // [{ type: 'giftWrap', enabled: true }, ...]
      paymentInfo 
    } = req.body;

    // 1. SINGLETON PATTERN - Lấy giỏ hàng
    console.log('\n📦 Step 1: Get cart using Singleton');
    const customer = await Customer.findById(req.user._id);
    const cartItems = customer.cart;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ 
        message: 'Không có sản phẩm nào trong giỏ hàng' 
      });
    }

    // 2. ABSTRACT FACTORY PATTERN - Tạo products với factory
    console.log('\n🏭 Step 2: Create products using Abstract Factory');
    const productsWithFactory = cartItems.map(item => {
      const productData = {
        ...item,
        category: item.product.category || item.product.brand
      };
      return ProductFactoryProducer.createProduct(productData);
    });

    // Log product details
    productsWithFactory.forEach(product => {
      console.log('Product:', product.getDetails());
      console.log('Shipping Fee:', product.calculateShipping());
    });

    // Calculate base total
    let totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // 3. DECORATOR PATTERN - Thêm các tính năng bổ sung
    console.log('\n🎨 Step 3: Apply decorators to order');
    const baseOrderData = {
      orderItems: cartItems,
      totalPrice: totalPrice,
      shippingAddress,
      paymentMethod
    };

    const decoratedOrder = OrderDecoratorFactory.applyDecorators(
      baseOrderData, 
      decorators || []
    );

    const orderDetails = decoratedOrder.getDetails();
    console.log('Decorated Order:', orderDetails);

    // Update total price with decorators
    totalPrice = decoratedOrder.getCost();

    // 4. STRATEGY PATTERN - Xử lý thanh toán
    console.log('\n💳 Step 4: Process payment using Strategy');
    const paymentStrategy = PaymentStrategyFactory.createStrategy(paymentMethod);
    const paymentProcessor = new PaymentProcessor(paymentStrategy);

    // Validate payment
    const validation = paymentProcessor.validatePayment(paymentInfo || {});
    if (!validation.valid) {
      return res.status(400).json({ 
        message: validation.message 
      });
    }

    // Process payment
    const paymentResult = paymentProcessor.processPayment(totalPrice, {
      orderId: Date.now(),
      customerId: req.user._id
    });

    console.log('Payment Result:', paymentResult);

    if (!paymentResult.success) {
      return res.status(400).json({ 
        message: paymentResult.message 
      });
    }

    // 5. Create order in database
    console.log('\n💾 Step 5: Save order to database');
    const order = new Order({
      orderItems: cartItems.map(item => ({
        ...item,
        product: item.product,
        _id: undefined
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      totalPrice,
      orderStatus: 'Đang xử lý',
      isPaid: paymentResult.status === 'PAID',
      paidAt: paymentResult.paidAt || null,
      paymentInfo: {
        transactionId: paymentResult.transactionId,
        method: paymentResult.method,
        status: paymentResult.status
      },
      decorators: decorators || [],
      extras: orderDetails.extras || []
    });

    const createdOrder = await order.save();

    // 6. OBSERVER PATTERN - Gửi thông báo
    console.log('\n📢 Step 6: Send notifications using Observer');
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

    // Trigger notification
    orderObserver.setStatus('Đang xử lý');

    // 7. Clear cart using Singleton
    console.log('\n🧹 Step 7: Clear cart');
    customer.cart = [];
    await customer.save();

    // 8. Return response with all pattern information
    res.status(201).json({
      success: true,
      message: 'Đơn hàng đã được tạo thành công',
      order: createdOrder,
      patterns: {
        abstractFactory: {
          products: productsWithFactory.map(p => p.getDetails())
        },
        decorator: {
          applied: decorators || [],
          extras: orderDetails.extras || [],
          totalCost: orderDetails.cost
        },
        strategy: {
          paymentMethod: paymentResult.method,
          paymentStatus: paymentResult.status,
          transactionId: paymentResult.transactionId
        },
        observer: {
          notificationsSent: 4, // Email, SMS, Push, Dashboard
          status: 'Đang xử lý'
        },
        singleton: {
          cartCleared: true,
          cartStats: cartManager.getCartStats()
        }
      }
    });

  } catch (error) {
    console.error('❌ Error creating order with patterns:', error);
    res.status(500).json({ 
      message: error.message || 'Lỗi khi tạo đơn hàng' 
    });
  }
};

/**
 * @desc    Cập nhật trạng thái đơn hàng (sử dụng Observer)
 * @route   PUT /api/orders/v2/:id/status
 * @access  Private/Admin
 */
const updateOrderStatusWithObserver = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    // OBSERVER PATTERN - Thông báo khi thay đổi trạng thái
    console.log('\n📢 Using Observer Pattern for status update');
    
    const orderObserver = notificationManager.createOrder({
      _id: order._id,
      orderId: order._id,
      status: status,
      totalPrice: order.totalPrice,
      user: order.user,
      shippingAddress: order.shippingAddress,
      customerName: order.user.name,
      customerEmail: order.user.email,
      customerPhone: order.shippingAddress.phone
    });

    // Update status (this triggers notifications)
    orderObserver.setStatus(status);

    // Update in database
    order.orderStatus = status;
    if (status === 'Đã giao') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }
    
    const updatedOrder = await order.save();

    res.json({
      success: true,
      message: 'Cập nhật trạng thái thành công',
      order: updatedOrder,
      notifications: {
        sent: ['email', 'sms', 'push', 'dashboard']
      }
    });

  } catch (error) {
    console.error('❌ Error updating order status:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Lấy các phương thức thanh toán có sẵn (Strategy Pattern)
 * @route   GET /api/orders/payment-methods
 * @access  Public
 */
const getPaymentMethods = async (req, res) => {
  try {
    console.log('\n💳 Getting available payment methods using Strategy Pattern');
    
    const methods = PaymentStrategyFactory.getAllMethods();

    res.json({
      success: true,
      methods: methods,
      default: 'COD'
    });

  } catch (error) {
    console.error('❌ Error getting payment methods:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Lấy thống kê giỏ hàng (Singleton Pattern)
 * @route   GET /api/orders/cart-stats
 * @access  Private/Admin
 */
const getCartStats = async (req, res) => {
  try {
    console.log('\n📊 Getting cart statistics using Singleton Pattern');
    
    const stats = cartManager.getCartStats();

    res.json({
      success: true,
      stats: stats
    });

  } catch (error) {
    console.error('❌ Error getting cart stats:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Demo tất cả Design Patterns
 * @route   GET /api/orders/demo-patterns
 * @access  Public
 */
const demoAllPatterns = async (req, res) => {
  try {
    console.log('\n🎯 DEMO: ALL DESIGN PATTERNS\n');

    // 1. ABSTRACT FACTORY
    console.log('1️⃣ ABSTRACT FACTORY PATTERN');
    const bookProduct = ProductFactoryProducer.createProduct({
      name: 'Clean Code',
      price: 150000,
      category: 'Văn học',
      author: 'Robert Martin'
    });
    console.log('Book:', bookProduct.getDetails());
    console.log('Shipping:', bookProduct.calculateShipping());

    // 2. DECORATOR
    console.log('\n2️⃣ DECORATOR PATTERN');
    const { OrderComponent, GiftWrapDecorator, ExpressShippingDecorator } = 
      await import('../patterns/Decorator.js');
    
    let order = new OrderComponent({ totalPrice: 500000, orderItems: [] });
    console.log('Base order:', order.getDetails());
    
    order = new GiftWrapDecorator(order);
    order = new ExpressShippingDecorator(order);
    console.log('Decorated order:', order.getDetails());

    // 3. STRATEGY
    console.log('\n3️⃣ STRATEGY PATTERN');
    const codStrategy = PaymentStrategyFactory.createStrategy('COD');
    const processor = new PaymentProcessor(codStrategy);
    const payment = processor.processPayment(500000, { orderId: '123' });
    console.log('Payment:', payment);

    // 4. OBSERVER
    console.log('\n4️⃣ OBSERVER PATTERN');
    const { Order: ObserverOrder } = await import('../patterns/Observer.js');
    const observerOrder = new ObserverOrder({
      _id: '123',
      totalPrice: 500000,
      user: { name: 'Test User', email: 'test@example.com' }
    });
    
    notificationManager.attachDefaultObservers(observerOrder);
    observerOrder.setStatus('Đã xác nhận');

    // 5. SINGLETON
    console.log('\n5️⃣ SINGLETON PATTERN');
    const cart1 = CartManager.getInstance();
    const cart2 = CartManager.getInstance();
    console.log('Same instance?', cart1 === cart2);
    console.log('Stats:', cart1.getCartStats());

    res.json({
      success: true,
      message: 'Demo completed! Check console for details',
      patterns: {
        abstractFactory: 'Created different product types',
        decorator: 'Added gift wrap and express shipping',
        strategy: 'Processed COD payment',
        observer: 'Sent notifications on status change',
        singleton: 'CartManager is a singleton'
      }
    });

  } catch (error) {
    console.error('❌ Error in demo:', error);
    res.status(500).json({ message: error.message });
  }
};

export {
  createOrderWithPatterns,
  updateOrderStatusWithObserver,
  getPaymentMethods,
  getCartStats,
  demoAllPatterns
};