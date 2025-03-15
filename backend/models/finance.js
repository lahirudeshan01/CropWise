const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Income', 'Outcome'], required: true },
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;