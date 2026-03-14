import mongoose from "mongoose";

const logisticsShipmentSchema = new mongoose.Schema({
  referenceId: { type: String },
  carrierType: { type: String, enum: ['Truck', 'Courier', '3PL'], required: true },
  carrierName: { type: String, required: true },
  scheduledDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Scheduled', 'InTransit', 'Delivered'], default: 'Scheduled' },
  podUrl: { type: String },
  notes: { type: String },
  createdBy: { type: String },
}, { timestamps: true });

const LogisticsShipment = mongoose.model('LogisticsShipment', logisticsShipmentSchema);

export default LogisticsShipment;
