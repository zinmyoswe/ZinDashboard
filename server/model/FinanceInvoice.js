import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  method: { type: String },
  note: { type: String },
});

const financeInvoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    type: { type: String, enum: ["Customer", "Supplier"], required: true },
    relatedPurchaseId: { type: String },
    grnNumber: { type: String },
    supplierInvoiceNumber: { type: String },
    amount: { type: Number, required: true },
    dueDate: { type: Date },
    status: { type: String, enum: ["Unpaid", "Paid", "Overdue"], default: "Unpaid" },
    payments: [paymentSchema],
    notes: { type: String },
    createdBy: { type: String },
  },
  { timestamps: true }
);

const FinanceInvoice = mongoose.model("FinanceInvoice", financeInvoiceSchema);

export default FinanceInvoice;
