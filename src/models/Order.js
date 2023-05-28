const mongoose = require('mongoose');

const { Schema } = mongoose;

const OrderSchema = new mongoose.Schema({
    products: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    total: { type: Number, required: true },
    quantity: { type: Number, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    date: { type: Date, default: Date.now },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', required: true
    },
    status: {
        type: String,
        enum: ["pending", "Delivered", "Cancelled"],
        default: "pending",
    },

});





module.exports = mongoose.model("Order", OrderSchema);
