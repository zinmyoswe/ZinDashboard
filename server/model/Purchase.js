import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
    supplierId: {type: String, required: true},
    supplierName: {type: String, required: true},
    items: [{
        productId: {type: String},
        productName: {type: String, required: true},
        quantity: {type: Number, required: true},
        price: {type: Number, required: true},
        total: {type: Number, required: true},
        imageUrl: {type: String},
    }],
    totalAmount: {type: Number, required: true},
    status: {type: String, default: 'Pending', enum: ['Pending', 'Approved', 'Received', 'Cancelled']},
    date: {type: Date, default: Date.now},
    notes: {type: String},
    createdBy: {type: String}, // user id
}, {timestamps: true})

const Purchase = mongoose.model('Purchase', purchaseSchema)

export default Purchase;