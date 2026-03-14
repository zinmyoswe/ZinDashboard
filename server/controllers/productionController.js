import ProductionOrder from '../model/ProductionOrder.js';

export const getProductionOrders = async (req, res) => {
  try {
    const orders = await ProductionOrder.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductionOrder = async (req, res) => {
  try {
    const order = await ProductionOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Production order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProductionOrder = async (req, res) => {
  try {
    const {
      orderNumber,
      productId,
      productName,
      quantity,
      status,
      plannedStart,
      plannedEnd,
      materials,
      notes,
    } = req.body;

    const order = new ProductionOrder({
      orderNumber,
      productId,
      productName,
      quantity,
      status: status || 'PLANNED',
      plannedStart: plannedStart ? new Date(plannedStart) : undefined,
      plannedEnd: plannedEnd ? new Date(plannedEnd) : undefined,
      materials: materials || [],
      notes,
      createdBy: req.user?._id,
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProductionOrder = async (req, res) => {
  try {
    const {
      orderNumber,
      productId,
      productName,
      quantity,
      status,
      plannedStart,
      plannedEnd,
      materials,
      notes,
      sentToWarehouseAt,
    } = req.body;

    const updateData = {
      orderNumber,
      productId,
      productName,
      quantity,
      status,
      plannedStart: plannedStart ? new Date(plannedStart) : undefined,
      plannedEnd: plannedEnd ? new Date(plannedEnd) : undefined,
      materials,
      notes,
      sentToWarehouseAt: sentToWarehouseAt ? new Date(sentToWarehouseAt) : undefined,
    };

    if (status === 'COMPLETED') {
      updateData.completedAt = new Date();
    }

    const order = await ProductionOrder.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!order) return res.status(404).json({ message: 'Production order not found' });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProductionOrder = async (req, res) => {
  try {
    const order = await ProductionOrder.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Production order not found' });
    res.json({ message: 'Production order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
