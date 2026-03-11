import mongoose from "mongoose";

const inventoryItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  sku: { type: String },
  stock: { type: Number, default: 0 },
  reorderLevel: { type: Number, default: 0 },
  location: { type: String },
  imageUrl: { type: String },
  notes: { type: String },
}, { timestamps: true });

const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema);

export default InventoryItem;
