import express from 'express';
import {
  getPurchaseRequisitions,
  getPurchaseRequisition,
  createPurchaseRequisition,
  updatePurchaseRequisition,
  deletePurchaseRequisition,
} from '../controllers/purchaseRequisitionController.js';

const router = express.Router();

router.get('/', getPurchaseRequisitions);
router.get('/:id', getPurchaseRequisition);
router.post('/', createPurchaseRequisition);
router.put('/:id', updatePurchaseRequisition);
router.delete('/:id', deletePurchaseRequisition);

export default router;
