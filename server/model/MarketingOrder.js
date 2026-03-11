import mongoose from "mongoose";

const marketingOrderSchema = new mongoose.Schema({
    storeId: { type: String },
    storeName: { type: String, required: true },
    campaignName: { type: String },
    items: [{
        productId: { type: String },
        productName: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        total: { type: Number, required: true },
        imageUrl: { type: String },
    }],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['Draft', 'HandedOver'], default: 'Draft' },
    date: { type: Date, default: Date.now },
    notes: { type: String },
    createdBy: { type: String },
}, { timestamps: true });

const MarketingOrder = mongoose.model('MarketingOrder', marketingOrderSchema);

export default MarketingOrder;
