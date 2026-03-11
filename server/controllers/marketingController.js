import MarketingOrder from '../model/MarketingOrder.js';

// Get all marketing orders
export const getMarketingOrders = async (req, res) => {
  try {
    const orders = await MarketingOrder.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single marketing order
export const getMarketingOrder = async (req, res) => {
  try {
    const order = await MarketingOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Marketing order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create marketing order
export const createMarketingOrder = async (req, res) => {
  try {
    const { storeId, storeName, campaignName, items, totalAmount, status, date, notes } = req.body;

    let calculatedTotal = totalAmount;
    if (!calculatedTotal && items) {
      calculatedTotal = items.reduce((sum, item) => sum + item.total, 0);
    }

    const order = new MarketingOrder({
      storeId,
      storeName,
      campaignName,
      items,
      totalAmount: calculatedTotal,
      status: status || 'Draft',
      date: date ? new Date(date) : new Date(),
      notes,
      createdBy: req.user?._id,
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update marketing order
export const updateMarketingOrder = async (req, res) => {
  try {
    const { storeId, storeName, campaignName, items, totalAmount, status, date, notes } = req.body;

    const updateData = {
      storeId,
      storeName,
      campaignName,
      items,
      totalAmount,
      status,
      date: date ? new Date(date) : undefined,
      notes,
    };

    const order = await MarketingOrder.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!order) return res.status(404).json({ message: 'Marketing order not found' });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete marketing order
export const deleteMarketingOrder = async (req, res) => {
  try {
    const order = await MarketingOrder.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Marketing order not found' });
    res.json({ message: 'Marketing order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
