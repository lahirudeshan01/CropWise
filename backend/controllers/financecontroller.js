const Transaction = require('../models/finance.js');

// Log a transaction
exports.logTransaction = async (req, res) => {
  const { name, amount, status } = req.body;
  const newTransaction = new Transaction({ name, amount, status });
  await newTransaction.save();
  res.status(201).json({ message: 'Transaction logged successfully!' });
};

// Get all transactions
exports.getTransactions = async (req, res) => {
  const transactions = await Transaction.find();
  res.status(200).json(transactions);
};

// Generate financial report
exports.generateReport = async (req, res) => {
  const transactions = await Transaction.find();

  const totalIncome = transactions
    .filter((t) => t.status === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOutcome = transactions
    .filter((t) => t.status === 'Outcome')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const profit = totalIncome - totalOutcome;

  res.status(200).json({ totalIncome, totalOutcome, profit });
};