import express from 'express';
import {
  getQualityInspections,
  getQualityInspection,
  createQualityInspection,
  updateQualityInspection,
  deleteQualityInspection,
  updateInspectionStatus,
} from '../controllers/qualityController.js';

const router = express.Router();

router.get('/', getQualityInspections);
router.get('/:id', getQualityInspection);
router.post('/', createQualityInspection);
router.put('/:id', updateQualityInspection);
router.delete('/:id', deleteQualityInspection);
router.post('/:id/status', updateInspectionStatus);

export default router;
