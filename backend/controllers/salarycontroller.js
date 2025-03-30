
const mongoose = require('mongoose'); 
const Salary = require('../models/salary');
const Transaction = require('../models/finance');

// Helper functions
const extractBaseEmployeeId = (name) => {
  // Extract just the base employee ID (e.g., "EMP002" from "EMP002-Seeding")
  const match = name.match(/^(EMP\d+)/i);
  return match ? match[1] : name.split(/[-:]/)[0].trim();
};

const calculateEPF = (salary) => salary * 0.12;
const calculateETF = (salary) => salary * 0.03;

// Get all salaries
const getSalaries = async (req, res) => {
  try {
    const { month, year, status } = req.query;
    const filter = {};
    
    if (month && year) {
      filter.monthYear = `${year}-${String(month).padStart(2, '0')}`;
    } else if (year) {
      filter.monthYear = new RegExp(`^${year}-`);
    }
    
    if (status) filter.status = status;

    const salaries = await Salary.find(filter).sort({ monthYear: 1, employeeId: 1 });
    res.status(200).json(salaries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const processSalaries = async (req, res) => {
    try {
      const { month, year } = req.body;
      const monthYear = `${year}-${String(month).padStart(2, '0')}`;
      const monthStart = new Date(year, month-1, 1);
      const monthEnd = new Date(year, month, 0, 23, 59, 59);
  
      // 1. Get existing paid salaries for this month
      const existingPaidSalaries = await Salary.find({ 
        monthYear,
        status: 'Paid'
      });
  
      // 2. Find and aggregate salary transactions by base employee ID
      const salaryPayments = await Transaction.aggregate([
        {
          $match: {
            reference: { $regex: /salary payment/i },
            status: 'Outcome',
            date: { $gte: monthStart, $lte: monthEnd }
          }
        },
        {
          $addFields: {
            baseEmployeeId: {
              $let: {
                vars: {
                  parts: { $split: ["$name", "-"] }
                },
                in: { $arrayElemAt: ["$$parts", 0] }
              }
            }
          }
        },
        {
          $group: {
            _id: "$baseEmployeeId",
            totalAmount: { $sum: "$amount" },
            transactionCount: { $sum: 1 },
            transactions: { $push: "$_id" },
            originalNames: { $addToSet: "$name" }
          }
        }
      ]);
  
      // 3. Transform to salary records, preserving paid status where applicable
      const salaries = salaryPayments.map(payment => {
        const existingPaid = existingPaidSalaries.find(s => s.employeeId === payment._id);
        
        if (existingPaid) {
          // Return existing paid salary with updated transaction references
          return {
            ...existingPaid.toObject(),
            transactionRefs: payment.transactions,
            originalNames: payment.originalNames,
            transactionCount: payment.transactionCount,
            updatedAt: new Date()
          };
        }
  
        // Create new pending salary record
        const basicSalary = payment.totalAmount;
        const epf = calculateEPF(basicSalary);
        const etf = calculateETF(basicSalary);
        const netSalary = basicSalary - epf - etf;
  
        return {
          employeeId: payment._id,
          monthYear,
          basicSalary,
          epf,
          etf,
          netSalary,
          status: 'Pending',
          transactionRefs: payment.transactions,
          originalNames: payment.originalNames,
          transactionCount: payment.transactionCount
        };
      });
  
      // 4. Bulk upsert operation (update existing or insert new)
      const bulkOps = salaries.map(salary => ({
        updateOne: {
          filter: { 
            employeeId: salary.employeeId,
            monthYear: salary.monthYear
          },
          update: { $set: salary },
          upsert: true
        }
      }));
  
      const result = await Salary.bulkWrite(bulkOps);
      
      res.status(201).json({
        message: `Processed ${result.upsertedCount + result.modifiedCount} employee salaries`,
        stats: {
          inserted: result.upsertedCount,
          updated: result.modifiedCount,
          unchanged: result.matchedCount - result.modifiedCount
        },
        debug: {
          monthYear,
          start: monthStart,
          end: monthEnd,
          foundTransactions: salaryPayments
        }
      });
  
    } catch (error) {
      console.error('Error processing salaries:', error);
      res.status(500).json({ 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  };
// Update salary status to Paid
const markAsPaid = async (req, res) => {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const { id } = req.params;
  
      // 1. Validate salary exists
      const salary = await Salary.findById(id).session(session);
      if (!salary) {
        await session.abortTransaction();
        return res.status(404).json({ 
          message: 'Salary record not found',
          details: { id, errorType: 'NotFound' }
        });
      }
  
      // 2. Validate not already paid
      if (salary.status === 'Paid') {
        await session.abortTransaction();
        return res.status(400).json({
          message: 'Salary already paid',
          details: { 
            paymentDate: salary.paymentDate,
            errorType: 'AlreadyPaid' 
          }
        });
      }
  
      // 3. Create deduction transaction
      const deductionTransaction = new Transaction({
        name: `${salary.employeeId}-Salary-Deductions`,
        amount: salary.epf + salary.etf,
        date: new Date(),
        status: 'Income',
        reference: 'Salary Deductions',
        type: 'Salary Contributions',
        breakdown: { 
          epf: salary.epf,
          etf: salary.etf,
          netSalary: salary.netSalary
        }
      });
  
      // 4. Execute operations
      const createdTransaction = await deductionTransaction.save({ session });
      const updatedSalary = await Salary.findByIdAndUpdate(
        id,
        { 
          status: 'Paid',
          paymentDate: new Date(),
          deductionTransactionRef: createdTransaction._id
        },
        { new: true, session }
      );
  
      await session.commitTransaction();
      
      return res.status(200).json({
        success: true,
        message: `Marked as paid with Rs.${deductionTransaction.amount} deductions`,
        salary: updatedSalary,
        deduction: createdTransaction
      });
  
    } catch (error) {
      await session.abortTransaction();
      
      console.error('Payment Processing Error:', {
        error: error.message,
        stack: error.stack,
        timestamp: new Date(),
        requestId: req.id
      });
  
      return res.status(500).json({
        success: false,
        message: 'Payment processing failed',
        error: {
          name: error.name,
          message: error.message,
          details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }
      });
    } finally {
      session.endSession();
    }
  };
module.exports = {
  processSalaries,
  getSalaries,
  markAsPaid
};