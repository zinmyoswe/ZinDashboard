import QualityInspection from '../model/QualityInspection.js';

export const getQualityInspections = async (req, res) => {
  try {
    const inspections = await QualityInspection.find().sort({ createdAt: -1 });
    res.json(inspections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getQualityInspection = async (req, res) => {
  try {
    const inspection = await QualityInspection.findById(req.params.id);
    if (!inspection) return res.status(404).json({ message: 'Inspection not found' });
    res.json(inspection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createQualityInspection = async (req, res) => {
  try {
    const {
      inspectionNumber,
      inspectionType,
      relatedId,
      status,
      inspector,
      inspectionDate,
      notes,
      items,
      defectReports,
      nonConformanceReports,
      reworkOrderId,
    } = req.body;

    const inspection = new QualityInspection({
      inspectionNumber,
      inspectionType,
      relatedId,
      status: status || 'PENDING',
      inspector,
      inspectionDate: inspectionDate ? new Date(inspectionDate) : undefined,
      notes,
      items: items || [],
      defectReports: defectReports || [],
      nonConformanceReports: nonConformanceReports || [],
      reworkOrderId,
      createdBy: req.user?._id,
    });

    const savedInspection = await inspection.save();
    res.status(201).json(savedInspection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateQualityInspection = async (req, res) => {
  try {
    const {
      inspectionNumber,
      inspectionType,
      relatedId,
      status,
      inspector,
      inspectionDate,
      notes,
      items,
      defectReports,
      nonConformanceReports,
      reworkOrderId,
    } = req.body;

    const updateData = {
      inspectionNumber,
      inspectionType,
      relatedId,
      status,
      inspector,
      inspectionDate: inspectionDate ? new Date(inspectionDate) : undefined,
      notes,
      items,
      defectReports,
      nonConformanceReports,
      reworkOrderId,
    };

    const inspection = await QualityInspection.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!inspection) return res.status(404).json({ message: 'Inspection not found' });
    res.json(inspection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteQualityInspection = async (req, res) => {
  try {
    const inspection = await QualityInspection.findByIdAndDelete(req.params.id);
    if (!inspection) return res.status(404).json({ message: 'Inspection not found' });
    res.json({ message: 'Inspection deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateInspectionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const inspection = await QualityInspection.findById(req.params.id);
    if (!inspection) return res.status(404).json({ message: 'Inspection not found' });

    inspection.status = status;
    if (status === 'FAILED' || status === 'REWORK_REQUIRED' || status === 'SCRAPPED') {
      inspection.defectReports = inspection.defectReports || [];
      if (req.body.defectReports) {
        inspection.defectReports = [...inspection.defectReports, ...req.body.defectReports];
      }
    }

    await inspection.save();
    res.json(inspection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
