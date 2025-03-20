const Transaction = require('../models/finance');

// Get transactions with filters
const getTransactions = async (req, res) => {
  try {
    const { startDate, endDate, type, reference, minAmount, maxAmount } = req.query;
    console.log("Received filters:", { startDate, endDate, type, reference, minAmount, maxAmount }); // Debugging line

    // Build the filter object
    const filter = {};
    if (startDate && endDate) {
      filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      filter.date = { $gte: new Date(startDate) };
    } else if (endDate) {
      filter.date = { $lte: new Date(endDate) };
    }
    if (type) {
      filter.status = type;
    }
    if (reference) {
      filter.reference = reference;
    }
    if (minAmount && maxAmount) {
      filter.amount = { $gte: parseFloat(minAmount), $lte: parseFloat(maxAmount) };
    } else if (minAmount) {
      filter.amount = { $gte: parseFloat(minAmount) };
    } else if (maxAmount) {
      filter.amount = { $lte: parseFloat(maxAmount) };
    }

    console.log("Filter object being used:", filter); // Debugging line

    // Fetch transactions with filters
    const transactions = await Transaction.find(filter);
    console.log("Filtered transactions:", transactions); // Debugging line
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error); // Debugging line
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
    const { month, year } = req.query;
    
    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required' });
    }

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

// Generate daily financial report
const generateDailyReport = async (req, res) => {
  try {
    const { date } = req.query;
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
    const { id } = req.params;
    const { name, amount, reference, status, date } = req.body;

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      { name, amount, reference, status, date },
      { new: true }
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
    const { id } = req.params;

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
  getTransactions,
  addTransaction,
  generateReport,
  generateMonthlyReport,
  generateDailyReport,
  updateTransaction,
  deleteTransaction,
  // Keep logTransaction for backward compatibility
  logTransaction: addTransaction,
};