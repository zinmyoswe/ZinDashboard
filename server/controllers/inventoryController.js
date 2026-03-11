import InventoryItem from '../model/InventoryItem.js';

export const getInventoryItems = async (req, res) => {
  try {
    const items = await InventoryItem.find().sort({ productName: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInventoryItem = async (req, res) => {
  try {
    const item = await InventoryItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Inventory item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createInventoryItem = async (req, res) => {
  try {
    const { productId, productName, sku, stock, reorderLevel, location, imageUrl, notes } = req.body;

    const item = new InventoryItem({
      productId,
      productName,
      sku,
      stock,
      reorderLevel,
      location,
      imageUrl,
      notes,
    });

    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateInventoryItem = async (req, res) => {
  try {
    const { productId, productName, sku, stock, reorderLevel, location, imageUrl, notes } = req.body;

    const updateData = { productId, productName, sku, stock, reorderLevel, location, imageUrl, notes };

    const item = await InventoryItem.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!item) return res.status(404).json({ message: 'Inventory item not found' });
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteInventoryItem = async (req, res) => {
  try {
    const item = await InventoryItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Inventory item not found' });
    res.json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
