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

  notify(orderData, event) {
    console.log(`📢 Notifying ${this.observers.length} observers about: ${event}`);
    this.observers.forEach(observer => {
      observer.update(orderData, event);
    });
  }
}

// Observer Interface
class OrderObserver {
  update(orderData, event) {
    throw new Error("Method 'update()' must be implemented");
  }
}

// Concrete Observers
class EmailNotificationObserver extends OrderObserver {
  update(orderData, event) {
    console.log('\n📧 EMAIL NOTIFICATION');
    console.log(`To: ${orderData.customerEmail || 'customer@example.com'}`);
    console.log(`Subject: ${this.getEmailSubject(event)}`);
    console.log(`Body: ${this.getEmailBody(orderData, event)}`);
    
    // Trong thực tế, sẽ gọi email service
    return {
      type: 'email',
      to: orderData.customerEmail,
      subject: this.getEmailSubject(event),
      body: this.getEmailBody(orderData, event),
      sentAt: new Date()
    };
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

Cảm ơn bạn đã mua hàng tại SMART!
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

class SMSNotificationObserver extends OrderObserver {
  update(orderData, event) {
    console.log('\n📱 SMS NOTIFICATION');
    console.log(`To: ${orderData.customerPhone || '0901234567'}`);
    console.log(`Message: ${this.getSMSMessage(orderData, event)}`);
    
    // Trong thực tế, sẽ gọi SMS service
    return {
      type: 'sms',
      to: orderData.customerPhone,
      message: this.getSMSMessage(orderData, event),
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

class PushNotificationObserver extends OrderObserver {
  update(orderData, event) {
    console.log('\n🔔 PUSH NOTIFICATION');
    console.log(`Title: ${this.getPushTitle(event)}`);
    console.log(`Body: ${this.getPushBody(orderData, event)}`);
    
    // Trong thực tế, sẽ gọi push notification service
    return {
      type: 'push',
      userId: orderData.userId,
      title: this.getPushTitle(event),
      body: this.getPushBody(orderData, event),
      data: {
        orderId: orderData.orderId,
        event: event
      },
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

class AdminDashboardObserver extends OrderObserver {
  update(orderData, event) {
    console.log('\n🖥️ ADMIN DASHBOARD UPDATE');
    console.log(`Event: ${event}`);
    console.log(`Order: #${orderData.orderId}`);
    console.log(`Status: ${orderData.status}`);
    
    // Trong thực tế, sẽ update real-time dashboard
    return {
      type: 'dashboard',
      event: event,
      orderData: {
        orderId: orderData.orderId,
        status: orderData.status,
        totalPrice: orderData.totalPrice,
        updatedAt: new Date()
      }
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

  setStatus(newStatus) {
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
    this.notify(this.getOrderData(), event);
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