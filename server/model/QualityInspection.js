import mongoose from "mongoose";

const inspectionItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  result: { type: String, enum: ["PASS", "FAIL"], required: true },
  defects: [{ type: String }],
  notes: { type: String },
});

const qualityInspectionSchema = new mongoose.Schema(
  {
    inspectionNumber: { type: String, required: true, unique: true },
    inspectionType: { type: String, enum: ["IQC", "IPQC", "FQC"], required: true },
    relatedId: { type: String }, // could link to purchase / production order / batch
    status: {
      type: String,
      enum: ["PENDING", "PASSED", "FAILED", "REWORK_REQUIRED", "SCRAPPED"],
      default: "PENDING",
    },
    inspector: { type: String },
    inspectionDate: { type: Date, default: Date.now },
    notes: { type: String },
    items: [inspectionItemSchema],
    defectReports: [{ type: String }],
    nonConformanceReports: [{ type: String }],
    reworkOrderId: { type: String },
    createdBy: { type: String },
  },
  { timestamps: true }
);

const QualityInspection = mongoose.model("QualityInspection", qualityInspectionSchema);

export default QualityInspection;
