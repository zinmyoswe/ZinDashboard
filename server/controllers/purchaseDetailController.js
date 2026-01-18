import PurchaseDetail from '../model/PurchaseDetail.js';

// Get all purchase details
export const getPurchaseDetails = async (req, res) => {
    try {
        const purchaseDetails = await PurchaseDetail.find().sort({ createdAt: -1 });
        res.json(purchaseDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get purchase details by purchase id
export const getPurchaseDetailsByPurchase = async (req, res) => {
    try {
        const purchaseDetails = await PurchaseDetail.find({ purchaseId: req.params.purchaseId });
        res.json(purchaseDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single purchase detail
export const getPurchaseDetail = async (req, res) => {
    try {
        const purchaseDetail = await PurchaseDetail.findById(req.params.id);
        if (!purchaseDetail) return res.status(404).json({ message: 'Purchase detail not found' });
        res.json(purchaseDetail);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create purchase detail
export const createPurchaseDetail = async (req, res) => {
    try {
        const { purchaseId, productId, productName, quantity, price, total, status } = req.body;

        const purchaseDetail = new PurchaseDetail({
            purchaseId,
            productId,
            productName,
            quantity,
            price,
            total,
            status: status || 'Pending',
        });

        const savedPurchaseDetail = await purchaseDetail.save();
        res.status(201).json(savedPurchaseDetail);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update purchase detail
export const updatePurchaseDetail = async (req, res) => {
    try {
        const { purchaseId, productId, productName, quantity, price, total, status } = req.body;

        const updateData = { purchaseId, productId, productName, quantity, price, total, status };

        const purchaseDetail = await PurchaseDetail.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!purchaseDetail) return res.status(404).json({ message: 'Purchase detail not found' });
        res.json(purchaseDetail);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete purchase detail
export const deletePurchaseDetail = async (req, res) => {
    try {
        const purchaseDetail = await PurchaseDetail.findByIdAndDelete(req.params.id);
        if (!purchaseDetail) return res.status(404).json({ message: 'Purchase detail not found' });
        res.json({ message: 'Purchase detail deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};