const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Income', 'Outcome'], required: true },
  reference: { type: String, required: true }, // New field
});

// Explicitly set the collection name to "transaction"
const Transaction = mongoose.model('Transaction', transactionSchema, 'transaction');
module.exports = Transaction;