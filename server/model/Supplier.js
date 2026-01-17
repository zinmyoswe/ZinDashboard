import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // UUID / custom ID
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    country: { type: String },
    contactPerson: { type: String },
    imageUrl: {
      type: String,
      default:
        "https://img.freepik.com/premium-vector/user-profile-icon-circle_1256048-12499.jpg?semt=ais_hybrid&w=740&q=80",
    },

    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

const Supplier = mongoose.model("Supplier", supplierSchema);

export default Supplier;
