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

// Public routes for purchases
router.get('/', getPurchases);
router.get('/:id', getPurchase);
router.post('/', createPurchase);
router.put('/:id', updatePurchase);
router.delete('/:id', deletePurchase);

export default router;