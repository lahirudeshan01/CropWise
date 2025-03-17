const Transaction = require('../models/finance');

// Log a transaction
const logTransaction = async (req, res) => {
  try {
    const { name, amount, status, reference } = req.body;
    const newTransaction = new Transaction({ name, amount, status, reference });
    await newTransaction.save();
    res.status(201).json({ message: 'Transaction logged successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging transaction', error: error.message });
  }
};

// Get all transactions
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
};

// Add a new transaction
const addTransaction = async (req, res) => {
  try {
    const { name, amount, reference, status, date } = req.body;
    const newTransaction = new Transaction({
      name,
      amount,
      reference,
      status,
      date: date || new Date(),
    });
    await newTransaction.save();
    res.status(201).json({ message: 'Transaction added successfully', newTransaction });
  } catch (error) {
    res.status(500).json({ message: 'Error adding transaction', error: error.message });
  }
};

// Generate financial report
const generateReport = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    const totalIncome = transactions
      .filter((t) => t.status === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalOutcome = transactions
      .filter((t) => t.status === 'Outcome')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const profit = totalIncome - totalOutcome;

    res.status(200).json({ totalIncome, totalOutcome, profit });
  } catch (error) {
    res.status(500).json({ message: 'Error generating report', error: error.message });
  }
};
// Generate monthly financial report
const generateMonthlyReport = async (req, res) => {
  try {
    const { month, year } = req.query; // Get month and year from query params

    // Create start and end dates for the selected month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Fetch transactions for the selected month
    const transactions = await Transaction.find({
      date: { $gte: startDate, $lte: endDate },
    });

    // Calculate totals
    const totalIncome = transactions
      .filter((t) => t.status === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalOutcome = transactions
      .filter((t) => t.status === 'Outcome')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const profit = totalIncome - totalOutcome;

    res.status(200).json({ totalIncome, totalOutcome, profit, transactions });
  } catch (error) {
    res.status(500).json({ message: 'Error generating monthly report', error: error.message });
  }
};
const generateDailyReport = async (req, res) => {
  try {
    const { date } = req.query; // Get the date from query params
    if (!date) {
      return res.status(400).json({ message: 'Date is required in YYYY-MM-DD format' });
    }

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    const endDate = new Date(selectedDate);
    endDate.setHours(23, 59, 59, 999);

    // Fetch transactions for the selected day
    const transactions = await Transaction.find({
      date: { $gte: selectedDate, $lte: endDate },
    });

    // Calculate totals
    const totalIncome = transactions
      .filter((t) => t.status === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalOutcome = transactions
      .filter((t) => t.status === 'Outcome')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const profit = totalIncome - totalOutcome;

    res.status(200).json({ totalIncome, totalOutcome, profit, transactions });
  } catch (error) {
    res.status(500).json({ message: 'Error generating daily report', error: error.message });
  }
};

// Update a transaction
const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params; // Get the transaction ID from the URL
    const { name, amount, reference, status, date } = req.body; // Get updated fields from the request body

    // Find the transaction by ID and update it
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      { name, amount, reference, status, date },
      { new: true } // Return the updated transaction
    );

    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json({ message: 'Transaction updated successfully', updatedTransaction });
  } catch (error) {
    res.status(500).json({ message: 'Error updating transaction', error: error.message });
  }
};

// Delete a transaction
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params; // Get the transaction ID from the URL

    // Find the transaction by ID and delete it
    const deletedTransaction = await Transaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully", deletedTransaction });
  } catch (error) {
    res.status(500).json({ message: "Error deleting transaction", error: error.message });
  }
};

// Export all functions
module.exports = {
  logTransaction,
  getTransactions,
  addTransaction,
  generateReport,
  generateMonthlyReport,
  generateDailyReport,
  updateTransaction, // Add this
  deleteTransaction, // Add this
};