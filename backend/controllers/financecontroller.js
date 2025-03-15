const Transaction = require('../models/finance');

// Log a transaction
exports.logTransaction = async (req, res) => {
  const { name, amount, status, reference } = req.body; // Destructure the request body
  const newTransaction = new Transaction({ name, amount, status, reference });
  await newTransaction.save();
  res.status(201).json({ message: 'Transaction logged successfully!' });
};

// Get all transactions
exports.getTransactions = async (req, res) => {
  const transactions = await Transaction.find();
  res.status(200).json(transactions); // Return transactions directly
};

// Add a new transaction
const addTransaction = async (req, res) => {
  try {
    const { name, amount, reference, status, date } = req.body;

    // Create a new transaction
    const newTransaction = new Finance({
      name,
      amount,
      reference,
      status,
      date: date || new Date(), // Use provided date or current date
    });

    // Save the transaction to the database
    await newTransaction.save();

    res.status(201).json({ message: "Transaction added successfully", newTransaction });
  } catch (error) {
    res.status(500).json({ message: "Error adding transaction", error: error.message });
  }
};

module.exports = { addTransaction };

// Generate financial report
exports.generateReport = async (req, res) => {
  const transactions = await Transaction.find();

  const totalIncome = transactions
    .filter((t) => t.status === 'Income') // Fix typo: 'income' -> 'Income'
    .reduce((sum, t) => sum + t.amount, 0); // Fix arrow function syntax

  const totalOutcome = transactions
    .filter((t) => t.status === 'Outcome') // Fix typo: 'fr)' -> '(t)'
    .reduce((sum, t) => sum + Math.abs(t.amount), 0); // Fix arrow function syntax

  const profit = totalIncome - totalOutcome;

  res.status(200).json({ totalIncome, totalOutcome, profit });
};