import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
    {
        // Tham chiếu đến người dùng đặt hàng
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Customer',
        },

        // Array chứa các sản phẩm đã mua
        orderItems: [
            {
                name: { type: String, required: true },
                quantity: { type: Number, required: true },
                image: { type: String, required: true },
                price: { type: Number, required: true },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product',
                },
            },
        ],

        // Thông tin giao hàng
        shippingAddress: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            phone: { type: String, required: true },
        },

        // Thông tin thanh toán
        paymentMethod: {
            type: String,
            required: true,
            default: 'COD',
        },

        // Giá trị đơn hàng
        totalPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },

        // Trạng thái đơn hàng
        orderStatus: {
            type: String,
            required: true,
            default: 'Đang xử lý',
        },
        isPaid: {
            type: Boolean,
            required: true,
            default: false,
        },
        paidAt: {
            type: Date,
        },
        isDelivered: {
            type: Boolean,
            required: true,
            default: false,
        },
        deliveredAt: {
            type: Date,
        },

        // ========================================
        // ✅ THÊM: Lưu thông tin Design Patterns
        // ========================================
        
        // DECORATOR PATTERN - Các tính năng bổ sung
        decorators: [{
            type: { type: String },  // 'giftWrap', 'expressShipping', 'insurance', 'priorityPackaging'
            enabled: { type: Boolean, default: true },
            cost: Number,
            description: String
        }],

        // STRATEGY PATTERN - Thông tin thanh toán chi tiết
        paymentInfo: {
            transactionId: String,
            method: String,  // 'COD', 'BANK_TRANSFER', 'CREDIT_CARD', 'MOMO'
            status: String,  // 'PENDING', 'PAID', 'WAITING_CONFIRMATION', etc.
            bankInfo: {
                bankName: String,
                accountNumber: String,
                transferContent: String
            },
            cardInfo: {
                last4Digits: String,
                brand: String
            },
            momoInfo: {
                deepLink: String,
                qrCode: String
            }
        },

        // ABSTRACT FACTORY - Thông tin về loại sản phẩm đã xử lý
        productsMetadata: [
            {
                productId: mongoose.Schema.Types.ObjectId,
                productType: String,  // 'Book', 'Electronic', 'Clothing'
                category: String,
                shippingFee: Number,
                factoryUsed: String
            }
        ],

        // OBSERVER PATTERN - Log các thông báo đã gửi
        notifications: [
            {
                type: String,  // 'email', 'sms', 'push', 'dashboard'
                sentAt: Date,
                status: String,  // 'sent', 'failed'
                recipient: String,
                message: String
            }
        ]
    },
    {
        timestamps: true,
    }
);

// ========================================
// Methods để làm việc với Patterns
// ========================================

// Thêm decorator
orderSchema.methods.addDecorator = function(decoratorType, cost, description) {
    this.decorators.push({
        type: decoratorType,
        enabled: true,
        cost: cost,
        description: description
    });
    return this;
};

// Tính tổng chi phí decorators
orderSchema.methods.getDecoratorsTotal = function() {
    return this.decorators
        .filter(d => d.enabled)
        .reduce((sum, d) => sum + (d.cost || 0), 0);
};

// Log notification
orderSchema.methods.logNotification = function(type, recipient, message, status = 'sent') {
    this.notifications.push({
        type,
        sentAt: new Date(),
        status,
        recipient,
        message
    });
    return this;
};

// Lấy tất cả decorators đang active
orderSchema.methods.getActiveDecorators = function() {
    return this.decorators.filter(d => d.enabled);
};

// ========================================
// Virtual Fields
// ========================================

// Tổng tiền cuối cùng (bao gồm decorators)
orderSchema.virtual('finalTotalPrice').get(function() {
    const decoratorsCost = this.getDecoratorsTotal();
    return this.totalPrice + decoratorsCost;
});

// Số lượng notifications đã gửi
orderSchema.virtual('notificationCount').get(function() {
    return this.notifications.length;
});

// Ensure virtuals are included in JSON
orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;