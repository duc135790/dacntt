# BÁO CÁO KIỂM TRA API ENDPOINTS

## 📋 TỔNG QUAN
Base URL Backend: `http://localhost:5000/api`
Base URL Frontend: `http://localhost:5000/api` (từ VITE_API_URL hoặc mặc định)

---

## ✅ CÁC API ENDPOINT HOẠT ĐỘNG TỐT

### 1. **Customer API** (`/api/customers`)
| Method | Endpoint | Frontend Call | Backend Route | Status |
|--------|----------|---------------|---------------|--------|
| POST | `/api/customers` | `authAPI.register()` | ✅ Có | ✅ OK |
| POST | `/api/customers/login` | `authAPI.login()` | ✅ Có | ✅ OK |
| GET | `/api/customers/profile` | `authAPI.getProfile()` | ✅ Có | ✅ OK |
| GET | `/api/customers/cart` | `cartAPI.getCart()` | ✅ Có | ✅ OK |
| POST | `/api/customers/cart` | `cartAPI.addToCart()` | ✅ Có | ✅ OK |
| PUT | `/api/customers/cart` | `cartAPI.updateCartItem()` | ✅ Có | ✅ OK |
| DELETE | `/api/customers/cart/:productId` | `cartAPI.removeFromCart()` | ✅ Có | ✅ OK |

### 2. **Products API** (`/api/products`)
| Method | Endpoint | Frontend Call | Backend Route | Status |
|--------|----------|---------------|---------------|--------|
| GET | `/api/products` | `productsAPI.getProducts()` | ✅ Có | ✅ OK |
| GET | `/api/products/:id` | `productsAPI.getProductById()` | ✅ Có | ✅ OK |
| GET | `/api/products/admin/all` | `productsAPI.getAllProducts()` | ✅ Có | ✅ OK |
| POST | `/api/products` | `productsAPI.createProduct()` | ✅ Có | ✅ OK |
| PUT | `/api/products/:id` | `productsAPI.updateProduct()` | ✅ Có | ✅ OK |
| PUT | `/api/products/:id/stock` | `productsAPI.updateStock()` | ✅ Có | ✅ OK |
| DELETE | `/api/products/:id` | `productsAPI.deleteProduct()` | ✅ Có | ✅ OK |

### 3. **Orders API** (`/api/orders`)
| Method | Endpoint | Frontend Call | Backend Route | Status |
|--------|----------|---------------|---------------|--------|
| POST | `/api/orders` | `ordersAPI.createOrder()` | ✅ Có | ✅ OK |
| GET | `/api/orders/myorders` | `ordersAPI.getMyOrders()` | ✅ Có | ✅ OK |
| GET | `/api/orders/:id` | `ordersAPI.getOrderById()` | ✅ Có | ✅ OK |
| GET | `/api/orders` | `ordersAPI.getAllOrders()` | ✅ Có | ✅ OK |
| PUT | `/api/orders/:id/deliver` | `ordersAPI.updateOrderToDelivered()` | ✅ Có | ✅ OK |
| DELETE | `/api/orders/:id` | `ordersAPI.cancelOrder()` | ✅ Có | ✅ OK (MỚI THÊM) |

### 4. **Vouchers API** (`/api/vouchers`)
| Method | Endpoint | Frontend Call | Backend Route | Status |
|--------|----------|---------------|---------------|--------|
| GET | `/api/vouchers` | `vouchersAPI.getActiveVouchers()` | ✅ Có | ✅ OK |
| POST | `/api/vouchers/apply` | `vouchersAPI.applyVoucher()` | ✅ Có | ✅ OK |
| GET | `/api/vouchers/admin/all` | `vouchersAPI.getAllVouchersAdmin()` | ✅ Có | ✅ OK |
| POST | `/api/vouchers/create` | `vouchersAPI.createVoucher()` | ✅ Có | ✅ OK |
| PUT | `/api/vouchers/:id` | `vouchersAPI.updateVoucher()` | ✅ Có | ✅ OK |
| DELETE | `/api/vouchers/:id` | `vouchersAPI.deleteVoucher()` | ✅ Có | ✅ OK |
| PUT | `/api/vouchers/:id/use` | `vouchersAPI.useVoucher()` | ✅ Có | ✅ OK |

### 5. **Staff API** (`/api/staff`)
| Method | Endpoint | Frontend Call | Backend Route | Status |
|--------|----------|---------------|---------------|--------|
| POST | `/api/staff` | - | ✅ Có | ✅ OK (không dùng ở frontend) |
| POST | `/api/staff/login` | - | ✅ Có | ✅ OK (không dùng ở frontend) |

### 6. **Test API**
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/test` | Kiểm tra server | ✅ OK |

---

## ✅ ĐÃ SỬA CHỮA

### ✅ ĐÃ THÊM: Endpoint DELETE Order (cancelOrder)
**Trạng thái:** ✅ ĐÃ SỬA

**Mô tả:**
- Đã thêm function `cancelOrder` vào `orderController.js`
- Đã thêm route `DELETE /api/orders/:id` vào `orderRoutes.js`
- Function sẽ cập nhật `orderStatus` thành "Đã hủy" thay vì xóa đơn hàng (giữ lại lịch sử)

**Tính năng:**
- Kiểm tra quyền: User phải là chủ đơn hàng hoặc Admin
- Chỉ cho phép hủy nếu đơn hàng chưa được giao
- Không cho phép hủy đơn hàng đã bị hủy trước đó

**Vị trí đã cập nhật:**
- `web/backend/controllers/orderController.js` - Thêm function `cancelOrder`
- `web/backend/routes/orderRoutes.js` - Thêm route `DELETE /:id`

---

## ⚠️ CÁC VẤN ĐỀ CẦN LƯU Ý

### ⚠️ VẤN ĐỀ 1: File userRoutes.js không được sử dụng

---

**Mức độ:** ⚠️ THÔNG TIN

**Mô tả:**
- File `web/backend/routes/userRoutes.js` tồn tại nhưng KHÔNG được import/register trong `server.js`
- File này import từ `userController.js` nhưng file controller này KHÔNG TỒN TẠI
- Ứng dụng sử dụng `customerRoutes` thay vì `userRoutes`

**Vị trí:**
- File không dùng: `web/backend/routes/userRoutes.js` (import từ userController.js - không tồn tại)
- File đang dùng: `web/backend/routes/customerRoutes.js`
- Server: `web/backend/server.js` - chỉ import customerRoutes

**Gợi ý:**
- Nên xóa file `web/backend/routes/userRoutes.js` để tránh nhầm lẫn (file này sẽ gây lỗi nếu được import vì thiếu controller)

---

## 📝 CÁC THAY ĐỔI ĐÃ THỰC HIỆN

### ✅ 1. Đã thêm endpoint DELETE Order
Đã thêm:
- `web/backend/controllers/orderController.js`: Function `cancelOrder` với logic kiểm tra quyền và trạng thái
- `web/backend/routes/orderRoutes.js`: Route `DELETE /:id` với middleware `protect`

### ⚠️ 2. File userRoutes.js chưa xóa
- File `web/backend/routes/userRoutes.js` vẫn tồn tại nhưng không được sử dụng
- File này có thể gây lỗi nếu được import vì thiếu `userController.js`
- Có thể xóa file này để làm sạch codebase

---

## 📊 THỐNG KÊ

- **Tổng số endpoints:** ~26 (đã thêm cancelOrder)
- **Endpoints hoạt động tốt:** ~26 ✅
- **Endpoints đã sửa:** 1 (cancelOrder) ✅
- **Files không sử dụng:** 1 (userRoutes.js - có thể xóa)

---

## 🔍 LƯU Ý BỔ SUNG

1. **Thứ tự routes quan trọng:**
   - Routes cụ thể (như `/admin/all`, `/myorders`) phải đặt TRƯỚC routes động (`/:id`)
   - Đã đúng trong các file routes hiện tại

2. **Authentication:**
   - Hầu hết routes đều có middleware `protect`
   - Admin routes có thêm middleware `admin`

3. **CORS:**
   - Đã cấu hình CORS cho frontend URL
   - Mặc định: `http://localhost:5173`

