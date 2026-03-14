import express from 'express';
import {
  getLogisticsShipments,
  getLogisticsShipment,
  createLogisticsShipment,
  updateLogisticsShipment,
  deleteLogisticsShipment,
} from '../controllers/logisticsController.js';

const router = express.Router();

router.get('/', getLogisticsShipments);
router.get('/:id', getLogisticsShipment);
router.post('/', createLogisticsShipment);
router.put('/:id', updateLogisticsShipment);
router.delete('/:id', deleteLogisticsShipment);

export default router;
