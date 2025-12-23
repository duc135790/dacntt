// backend/patterns/Observer.js

/**
 * OBSERVER PATTERN
 * Thông báo cho khách hàng khi trạng thái đơn hàng thay đổi
 */

// Subject Interface
class OrderSubject {
  constructor() {
    this.observers = [];
  }

  attach(observer) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
      console.log(`✅ Observer attached: ${observer.constructor.name}`);
    }
  }

  detach(observer) {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
      console.log(`❌ Observer detached: ${observer.constructor.name}`);
    }
  }

  async notify(orderData, event) {
    console.log(`📢 Notifying ${this.observers.length} observers about: ${event}`);
    
    // ✅ Gửi thông báo song song
    const promises = this.observers.map(observer => 
      observer.update(orderData, event).catch(err => {
        console.error(`❌ Observer ${observer.constructor.name} failed:`, err.message);
        return null;
      })
    );
    
    await Promise.all(promises);
  }
}

// Observer Interface
class OrderObserver {
  update(orderData, event) {
    throw new Error("Method 'update()' must be implemented");
  }
}

// ========================================
// ✅ Concrete Observers - GỬI THÔNG BÁO THẬT
// ========================================

// Email Notification Observer
class EmailNotificationObserver extends OrderObserver {
  constructor() {
    super();
    // ✅ Kiểm tra có cấu hình email không
    this.canSendEmail = !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);
    
    if (this.canSendEmail) {
      // Chỉ import nodemailer khi có cấu hình
      try {
        const nodemailer = require('nodemailer');
        this.transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });
        console.log('📧 Email service configured');
      } catch (error) {
        console.warn('⚠️ Nodemailer not installed. Run: npm install nodemailer');
        this.canSendEmail = false;
      }
    } else {
      console.warn('⚠️ Email not configured. Set EMAIL_USER and EMAIL_PASS in .env');
    }
  }

  async update(orderData, event) {
    console.log('\n📧 EMAIL NOTIFICATION');
    console.log(`To: ${orderData.customerEmail || 'customer@example.com'}`);
    console.log(`Subject: ${this.getEmailSubject(event)}`);
    
    // ✅ Gửi email thật nếu có cấu hình
    if (this.canSendEmail) {
      try {
        await this.transporter.sendMail({
          from: `"SMART Store" <${process.env.EMAIL_USER}>`,
          to: orderData.customerEmail,
          subject: this.getEmailSubject(event),
          html: this.getEmailHTML(orderData, event)
        });
        
        console.log('✅ Email sent successfully to:', orderData.customerEmail);
        
        return {
          type: 'email',
          to: orderData.customerEmail,
          subject: this.getEmailSubject(event),
          status: 'sent',
          sentAt: new Date()
        };
      } catch (error) {
        console.error('❌ Failed to send email:', error.message);
        return {
          type: 'email',
          to: orderData.customerEmail,
          status: 'failed',
          error: error.message,
          sentAt: new Date()
        };
      }
    } else {
      // Chỉ log nếu không có cấu hình
      console.log(`Body: ${this.getEmailBody(orderData, event)}`);
      
      return {
        type: 'email',
        to: orderData.customerEmail,
        subject: this.getEmailSubject(event),
        body: this.getEmailBody(orderData, event),
        status: 'simulated',
        sentAt: new Date()
      };
    }
  }

  getEmailSubject(event) {
    const subjects = {
      'ORDER_CREATED': '✅ Đơn hàng đã được tạo thành công',
      'ORDER_CONFIRMED': '✓ Đơn hàng đã được xác nhận',
      'ORDER_SHIPPING': '🚚 Đơn hàng đang được giao',
      'ORDER_DELIVERED': '🎉 Đơn hàng đã được giao thành công',
      'ORDER_CANCELLED': '❌ Đơn hàng đã bị hủy'
    };
    return subjects[event] || 'Cập nhật đơn hàng';
  }

  getEmailBody(orderData, event) {
    return `
Xin chào ${orderData.customerName || 'Quý khách'},

Đơn hàng #${orderData.orderId} của bạn đã ${this.getStatusText(event)}.

Chi tiết đơn hàng:
- Tổng tiền: ${orderData.totalPrice?.toLocaleString()}đ
- Trạng thái: ${orderData.status}

Cảm ơn bạn đã tin tưởng SMART!
    `;
  }

  // ✅ THÊM: Email HTML đẹp hơn
  getEmailHTML(orderData, event) {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
    .order-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; color: #888; font-size: 12px; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 SMART Store</h1>
      <h2>${this.getEmailSubject(event)}</h2>
    </div>
    <div class="content">
      <p>Xin chào <strong>${orderData.customerName || 'Quý khách'}</strong>,</p>
      <p>Đơn hàng <strong>#${orderData.orderId}</strong> của bạn đã ${this.getStatusText(event)}.</p>
      
      <div class="order-info">
        <h3>📦 Chi tiết đơn hàng</h3>
        <p><strong>Mã đơn:</strong> #${orderData.orderId}</p>
        <p><strong>Tổng tiền:</strong> ${orderData.totalPrice?.toLocaleString()}₫</p>
        <p><strong>Trạng thái:</strong> ${orderData.status}</p>
      </div>
      
      <p>Cảm ơn bạn đã tin tưởng và mua sắm tại SMART Store!</p>
      
      <a href="http://localhost:5173/my-orders" class="button">Xem đơn hàng</a>
    </div>
    <div class="footer">
      <p>© 2024 SMART Store. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  getStatusText(event) {
    const texts = {
      'ORDER_CREATED': 'được tạo thành công',
      'ORDER_CONFIRMED': 'được xác nhận',
      'ORDER_SHIPPING': 'đang được vận chuyển',
      'ORDER_DELIVERED': 'được giao thành công',
      'ORDER_CANCELLED': 'bị hủy'
    };
    return texts[event] || 'cập nhật';
  }
}

// SMS Notification Observer
class SMSNotificationObserver extends OrderObserver {
  async update(orderData, event) {
    console.log('\n📱 SMS NOTIFICATION');
    console.log(`To: ${orderData.customerPhone || '0901234567'}`);
    console.log(`Message: ${this.getSMSMessage(orderData, event)}`);
    
    // ✅ TODO: Tích hợp Twilio hoặc SMS service
    // if (process.env.TWILIO_ACCOUNT_SID) { ... }
    
    return {
      type: 'sms',
      to: orderData.customerPhone,
      message: this.getSMSMessage(orderData, event),
      status: 'simulated',
      sentAt: new Date()
    };
  }

  getSMSMessage(orderData, event) {
    const messages = {
      'ORDER_CREATED': `SMART: Don hang #${orderData.orderId} da duoc tao. Tong: ${orderData.totalPrice?.toLocaleString()}d`,
      'ORDER_CONFIRMED': `SMART: Don hang #${orderData.orderId} da xac nhan. Dang chuan bi hang.`,
      'ORDER_SHIPPING': `SMART: Don hang #${orderData.orderId} dang giao. Ma van don: ${orderData.trackingCode || 'N/A'}`,
      'ORDER_DELIVERED': `SMART: Don hang #${orderData.orderId} da giao thanh cong. Cam on!`,
      'ORDER_CANCELLED': `SMART: Don hang #${orderData.orderId} da huy.`
    };
    return messages[event] || `SMART: Don hang #${orderData.orderId} cap nhat.`;
  }
}

// Push Notification Observer
class PushNotificationObserver extends OrderObserver {
  async update(orderData, event) {
    console.log('\n🔔 PUSH NOTIFICATION');
    console.log(`Title: ${this.getPushTitle(event)}`);
    console.log(`Body: ${this.getPushBody(orderData, event)}`);
    
    // ✅ TODO: Tích hợp Firebase Cloud Messaging
    
    return {
      type: 'push',
      userId: orderData.userId,
      title: this.getPushTitle(event),
      body: this.getPushBody(orderData, event),
      data: {
        orderId: orderData.orderId,
        event: event
      },
      status: 'simulated',
      sentAt: new Date()
    };
  }

  getPushTitle(event) {
    const titles = {
      'ORDER_CREATED': '✅ Đặt hàng thành công',
      'ORDER_CONFIRMED': '✓ Đơn hàng đã xác nhận',
      'ORDER_SHIPPING': '🚚 Đang giao hàng',
      'ORDER_DELIVERED': '🎉 Đã giao hàng',
      'ORDER_CANCELLED': '❌ Đơn hàng đã hủy'
    };
    return titles[event] || '📦 Cập nhật đơn hàng';
  }

  getPushBody(orderData, event) {
    return `Đơn hàng #${orderData.orderId} - ${orderData.totalPrice?.toLocaleString()}đ`;
  }
}

// Admin Dashboard Observer
class AdminDashboardObserver extends OrderObserver {
  async update(orderData, event) {
    console.log('\n🖥️ ADMIN DASHBOARD UPDATE');
    console.log(`Event: ${event}`);
    console.log(`Order: #${orderData.orderId}`);
    console.log(`Status: ${orderData.status}`);
    
    // ✅ TODO: Tích hợp WebSocket để update real-time dashboard
    
    return {
      type: 'dashboard',
      event: event,
      orderData: {
        orderId: orderData.orderId,
        status: orderData.status,
        totalPrice: orderData.totalPrice,
        updatedAt: new Date()
      },
      status: 'simulated'
    };
  }
}

// Concrete Subject - Order
class Order extends OrderSubject {
  constructor(orderData) {
    super();
    this.orderId = orderData._id || orderData.orderId;
    this.status = orderData.status || orderData.orderStatus || 'Đang xử lý';
    this.totalPrice = orderData.totalPrice;
    this.customerName = orderData.user?.name || orderData.customerName;
    this.customerEmail = orderData.user?.email || orderData.customerEmail;
    this.customerPhone = orderData.shippingAddress?.phone || orderData.customerPhone;
    this.userId = orderData.user?._id || orderData.userId;
  }

  async setStatus(newStatus) {
    const oldStatus = this.status;
    this.status = newStatus;
    
    console.log(`\n🔄 Order #${this.orderId}: ${oldStatus} → ${newStatus}`);
    
    // Map status to event
    const eventMap = {
      'Đang xử lý': 'ORDER_CREATED',
      'Đã xác nhận': 'ORDER_CONFIRMED',
      'Đang giao': 'ORDER_SHIPPING',
      'Đã giao': 'ORDER_DELIVERED',
      'Đã hủy': 'ORDER_CANCELLED'
    };
    
    const event = eventMap[newStatus] || 'ORDER_UPDATED';
    await this.notify(this.getOrderData(), event);
  }

  getOrderData() {
    return {
      orderId: this.orderId,
      status: this.status,
      totalPrice: this.totalPrice,
      customerName: this.customerName,
      customerEmail: this.customerEmail,
      customerPhone: this.customerPhone,
      userId: this.userId
    };
  }
}

// Helper class để quản lý observers
class NotificationManager {
  constructor() {
    this.defaultObservers = [
      new EmailNotificationObserver(),
      new SMSNotificationObserver(),
      new PushNotificationObserver(),
      new AdminDashboardObserver()
    ];
  }

  createOrder(orderData, observers = null) {
    const order = new Order(orderData);
    
    // Attach observers
    const observersToAttach = observers || this.defaultObservers;
    observersToAttach.forEach(observer => {
      order.attach(observer);
    });
    
    return order;
  }

  attachDefaultObservers(order) {
    this.defaultObservers.forEach(observer => {
      order.attach(observer);
    });
  }
}

export {
  OrderSubject,
  OrderObserver,
  EmailNotificationObserver,
  SMSNotificationObserver,
  PushNotificationObserver,
  AdminDashboardObserver,
  Order,
  NotificationManager
};