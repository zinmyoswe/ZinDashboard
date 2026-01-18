import mongoose from "mongoose";

const purchaseDetailSchema = new mongoose.Schema({
    purchaseId: {type: String, required: true},
    productId: {type: String},
    productName: {type: String, required: true},
    quantity: {type: Number, required: true},
    price: {type: Number, required: true},
    total: {type: Number, required: true},
    imageUrl: {type: String},
    status: {type: String, default: 'Pending'},
}, {timestamps: true})

const PurchaseDetail = mongoose.model('PurchaseDetail', purchaseDetailSchema)

export default PurchaseDetail;