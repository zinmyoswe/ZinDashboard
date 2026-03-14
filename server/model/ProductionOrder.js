import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
  materialId: { type: String },
  materialName: { type: String, required: true },
  requiredQty: { type: Number, required: true },
  consumedQty: { type: Number, default: 0 },
});

const productionOrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    productId: { type: String },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    status: {
      type: String,
      enum: ['PLANNED', 'IN_PROGRESS', 'PAUSED', 'COMPLETED', 'CANCELLED'],
      default: 'PLANNED',
    },
    plannedStart: { type: Date },
    plannedEnd: { type: Date },
    materials: [materialSchema],
    notes: { type: String },
    createdBy: { type: String },
    completedAt: { type: Date },
    sentToWarehouseAt: { type: Date },
  },
  { timestamps: true }
);

const ProductionOrder = mongoose.model('ProductionOrder', productionOrderSchema);

export default ProductionOrder;
