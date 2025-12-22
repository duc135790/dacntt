// backend/routes/orderRoutesV2.js

/**
 * ROUTES SỬ DỤNG DESIGN PATTERNS
 * Tất cả routes này đều áp dụng các Design Patterns
 */

import express from 'express';
const router = express.Router();
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  createOrderWithPatterns,
  updateOrderStatusWithObserver,
  getPaymentMethods,
  getCartStats,
  demoAllPatterns
} from '../controllers/orderControllerWithPatterns.js';

// Public routes
router.get('/payment-methods', getPaymentMethods);
router.get('/demo-patterns', demoAllPatterns);

// Private routes (cần đăng nhập)
router.post('/v2', protect, createOrderWithPatterns);

// Admin routes
router.put('/v2/:id/status', protect, admin, updateOrderStatusWithObserver);
router.get('/cart-stats', protect, admin, getCartStats);

export default router;