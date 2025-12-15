import express from 'express';
const router = express.Router();
import{
    registerCustomer,
    loginCustomer,
    getCustomerCart,
    addItemToCart,
    removeItemFromCart,
    getCustomerProfile,
    updateUserProfile,
    updateCartItemQuantity,
}from '../controllers/customerController.js';
import { protect } from '../middleware/authMiddleware.js';

console.log('📋 Customer routes loading...');

//cac routes cong khai
router.post('/', registerCustomer);
router.post('/login', loginCustomer);

console.log('  ✅ POST / (register) registered');
console.log('  ✅ POST /login registered');

//cac routes rieng tu
router
    .route('/cart')
    .get(protect, getCustomerCart)
    .post(protect, addItemToCart)
    .put(protect, updateCartItemQuantity);

//route xoa item
router.delete('/cart/:productId', protect, removeItemFromCart);

router
    .route('/profile')
    .get(protect, getCustomerProfile)
    .put(protect, updateUserProfile);

export default router;
