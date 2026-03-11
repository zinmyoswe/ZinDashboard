import mongoose from "mongoose";

const purchaseRequisitionSchema = new mongoose.Schema({
  itemId: { type: String, required: true },
  itemName: { type: String, required: true },
  requestedQty: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Submitted', 'Approved', 'Rejected'], default: 'Pending' },
  notes: { type: String },
  createdBy: { type: String },
}, { timestamps: true });

const PurchaseRequisition = mongoose.model('PurchaseRequisition', purchaseRequisitionSchema);

export default PurchaseRequisition;
