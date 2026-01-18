import express from 'express';
import {
    getPurchaseDetails,
    getPurchaseDetailsByPurchase,
    getPurchaseDetail,
    createPurchaseDetail,
    updatePurchaseDetail,
    deletePurchaseDetail
} from '../controllers/purchaseDetailController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Admin only routes for purchase details
router.get('/', authenticate, authorize([0, 1]), getPurchaseDetails);
router.get('/purchase/:purchaseId', authenticate, authorize([0, 1]), getPurchaseDetailsByPurchase);
router.get('/:id', authenticate, authorize([0, 1]), getPurchaseDetail);
router.post('/', authenticate, authorize([0, 1]), createPurchaseDetail);
router.put('/:id', authenticate, authorize([0, 1]), updatePurchaseDetail);
router.delete('/:id', authenticate, authorize([0, 1]), deletePurchaseDetail);

export default router;