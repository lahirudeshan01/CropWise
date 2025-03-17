const express = require('express');
const financeController = require('../controllers/financecontroller.js');

const router = express.Router();

// Log a transaction
router.post('/transactions', financeController.logTransaction);

// Get all transactions
router.get('/transactions', financeController.getTransactions);

// Generate financial report
router.get('/report', financeController.generateReport);

// Generate monthly financial report
router.get('/monthly-report', financeController.generateMonthlyReport); 

//Add transactions
router.post('/transactions', financeController.addTransaction);

router.put('/transactions/:id', financeController.updateTransaction);
router.delete('/transactions/:id', financeController.deleteTransaction);


module.exports = router;