const express = require('express');
const financeController = require('../controllers/financecontroller.js');

const router = express.Router();


//Add transactions
router.post('/transactions', financeController.addTransaction);

// Get all transactions
router.get('/transactions', financeController.getTransactions);

// Generate financial report
router.get('/report', financeController.generateReport);

// Generate monthly financial report
router.get('/monthly-report', financeController.generateMonthlyReport); 

// Generate daily financial report
router.get('/daily-report', financeController.generateDailyReport); 

//update transactions
router.put('/transactions/:id', financeController.updateTransaction);

//delete transactions
router.delete('/transactions/:id', financeController.deleteTransaction);

// Single endpoint for all modules
router.post('/transactions', financeController.logUniversalTransaction);

module.exports = router;