import express from 'express';
import {
  getMarketingOrders,
  getMarketingOrder,
  createMarketingOrder,
  updateMarketingOrder,
  deleteMarketingOrder,
} from '../controllers/marketingController.js';

const router = express.Router();

// Public routes for marketing orders
router.get('/', getMarketingOrders);
router.get('/:id', getMarketingOrder);
router.post('/', createMarketingOrder);
router.put('/:id', updateMarketingOrder);
router.delete('/:id', deleteMarketingOrder);

export default router;
