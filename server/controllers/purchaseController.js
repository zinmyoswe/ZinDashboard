import Purchase from '../model/Purchase.js';

// Get all purchases
export const getPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.find().sort({ createdAt: -1 });
        res.json(purchases);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single purchase
export const getPurchase = async (req, res) => {
    try {
        const purchase = await Purchase.findById(req.params.id);
        if (!purchase) return res.status(404).json({ message: 'Purchase not found' });
        res.json(purchase);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create purchase
export const createPurchase = async (req, res) => {
    try {
        const { supplierId, supplierName, items, totalAmount, status, date, notes } = req.body;

        console.log('Creating purchase with data:', req.body);

        // Calculate total if not provided
        let calculatedTotal = totalAmount;
        if (!calculatedTotal && items) {
            calculatedTotal = items.reduce((sum, item) => sum + item.total, 0);
        }

        const purchase = new Purchase({
            supplierId,
            supplierName,
            items,
            totalAmount: calculatedTotal,
            status: status || 'Pending',
            date: date ? new Date(date) : new Date(),
            notes,
            createdBy: req.user?._id,
        });

        const savedPurchase = await purchase.save();
        res.status(201).json(savedPurchase);
    } catch (error) {
        console.log('Error creating purchase:', error);
        res.status(400).json({ message: error.message });
    }
};

// Update purchase
export const updatePurchase = async (req, res) => {
    try {
        const { supplierId, supplierName, items, totalAmount, status, date, notes } = req.body;

        const updateData = { supplierId, supplierName, items, totalAmount, status, date: date ? new Date(date) : undefined, notes };

        const purchase = await Purchase.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!purchase) return res.status(404).json({ message: 'Purchase not found' });
        res.json(purchase);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete purchase
export const deletePurchase = async (req, res) => {
    try {
        const purchase = await Purchase.findByIdAndDelete(req.params.id);
        if (!purchase) return res.status(404).json({ message: 'Purchase not found' });
        res.json({ message: 'Purchase deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};