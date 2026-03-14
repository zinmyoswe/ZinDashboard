import express from 'express';
import {
  getProductionOrders,
  getProductionOrder,
  createProductionOrder,
  updateProductionOrder,
  deleteProductionOrder,
} from '../controllers/productionController.js';

const router = express.Router();

router.get('/', getProductionOrders);
router.get('/:id', getProductionOrder);
router.post('/', createProductionOrder);
router.put('/:id', updateProductionOrder);
router.delete('/:id', deleteProductionOrder);

export default router;
