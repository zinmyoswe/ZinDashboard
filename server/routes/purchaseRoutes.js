import express from 'express';
import {
    getPurchases,
    getPurchase,
    createPurchase,
    updatePurchase,
    deletePurchase
} from '../controllers/purchaseController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Admin only routes for purchases
router.get('/', authenticate, authorize([0, 1]), getPurchases);
router.get('/:id', authenticate, authorize([0, 1]), getPurchase);
router.post('/', authenticate, authorize([0, 1]), createPurchase);
router.put('/:id', authenticate, authorize([0, 1]), updatePurchase);
router.delete('/:id', authenticate, authorize([0, 1]), deletePurchase);

export default router;