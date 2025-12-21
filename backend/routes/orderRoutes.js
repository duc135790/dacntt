import express from 'express';
const router = express.Router();
import { addOrderItems, getMyOrders, getOrders, updateOrderToDelivered, getOrderById, cancelOrder} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
//route cua admin
router
  .route('/')
  .post(protect, addOrderItems) // (ham nay user cung dung)
  .get(protect, admin, getOrders); // (chi admin)
  
//route cua user
router.get('/myorders', protect, getMyOrders);

//route cap nhat cau admin (phai dat truoc /:id)
router.put('/:id/deliver', protect, admin, updateOrderToDelivered);

//route huy don hang (phai dat truoc /:id de tranh xung dot)
router.delete('/:id', protect, cancelOrder);

//route chung(co bao mat ben trong) - dat cuoi cung
router.get('/:id', protect, getOrderById);

export default router;