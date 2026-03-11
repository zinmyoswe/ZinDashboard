import PurchaseRequisition from '../model/PurchaseRequisition.js';

export const getPurchaseRequisitions = async (req, res) => {
  try {
    const requisitions = await PurchaseRequisition.find().sort({ createdAt: -1 });
    res.json(requisitions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPurchaseRequisition = async (req, res) => {
  try {
    const requisition = await PurchaseRequisition.findById(req.params.id);
    if (!requisition) return res.status(404).json({ message: 'Purchase requisition not found' });
    res.json(requisition);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPurchaseRequisition = async (req, res) => {
  try {
    const { itemId, itemName, requestedQty, status, notes } = req.body;

    const requisition = new PurchaseRequisition({
      itemId,
      itemName,
      requestedQty,
      status: status || 'Pending',
      notes,
      createdBy: req.user?._id,
    });

    const saved = await requisition.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePurchaseRequisition = async (req, res) => {
  try {
    const { itemId, itemName, requestedQty, status, notes } = req.body;

    const updateData = { itemId, itemName, requestedQty, status, notes };

    const requisition = await PurchaseRequisition.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!requisition) return res.status(404).json({ message: 'Purchase requisition not found' });
    res.json(requisition);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePurchaseRequisition = async (req, res) => {
  try {
    const requisition = await PurchaseRequisition.findByIdAndDelete(req.params.id);
    if (!requisition) return res.status(404).json({ message: 'Purchase requisition not found' });
    res.json({ message: 'Purchase requisition deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
