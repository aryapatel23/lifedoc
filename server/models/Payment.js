const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    stripeCustomerId: { type: String, required: true },
    stripeInvoiceId: { type: String },
    stripePaymentIntentId: { type: String },
    amount: { type: Number, required: true }, // in cents
    currency: { type: String, default: 'usd' },
    status: { type: String, enum: ['succeeded', 'failed', 'pending'], required: true },
    description: { type: String },
    paymentDate: { type: Date, default: Date.now },
    metadata: { type: Map, of: String }
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
