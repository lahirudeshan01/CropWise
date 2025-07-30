const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    Character: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    // Include any other product fields from your actual product model
  },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  deliveryInfo: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true }
  },
  paymentMethod: { type: String, required: true },
  paymentDetails: { type: mongoose.Schema.Types.Mixed },
  status: { type: String, default: 'Pending' },
  dateCreated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);