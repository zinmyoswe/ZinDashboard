import express from 'express';
import {
  getFinanceInvoices,
  getFinanceInvoice,
  createFinanceInvoice,
  updateFinanceInvoice,
  deleteFinanceInvoice,
  payFinanceInvoice,
} from '../controllers/financeController.js';

const router = express.Router();

router.get('/', getFinanceInvoices);
router.get('/:id', getFinanceInvoice);
router.post('/', createFinanceInvoice);
router.put('/:id', updateFinanceInvoice);
router.delete('/:id', deleteFinanceInvoice);
router.post('/:id/pay', payFinanceInvoice);

export default router;
