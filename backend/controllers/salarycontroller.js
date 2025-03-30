const mongoose = require('mongoose'); 
const Salary = require('../models/salary');
const Transaction = require('../models/finance');

// Helper functions
const extractBaseEmployeeId = (name) => {
  const match = name.match(/^(EMP\d+)/i);
  return match ? match[1] : name.split(/[-:]/)[0].trim();
};

const calculateEPF = (salary) => salary * 0.08;
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

    const existingPaidSalaries = await Salary.find({ 
      monthYear,
      status: 'Paid'
    });

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

    const salaries = salaryPayments.map(payment => {
      const existingPaid = existingPaidSalaries.find(s => s.employeeId === payment._id);
      
      if (existingPaid) {
        return {
          ...existingPaid.toObject(),
          transactionRefs: payment.transactions,
          originalNames: payment.originalNames,
          transactionCount: payment.transactionCount,
          updatedAt: new Date()
        };
      }

      const basicSalary = payment.totalAmount;
      const epf = calculateEPF(basicSalary);
      const etf = calculateETF(basicSalary);
      const netSalary = basicSalary - epf;

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

const markAsPaid = async (req, res) => {
  try {
    const { id } = req.params;

    const salary = await Salary.findById(id);
    if (!salary) {
      return res.status(404).json({ 
        message: 'Salary record not found',
        details: { id, errorType: 'NotFound' }
      });
    }

    if (salary.status === 'Paid') {
      return res.status(400).json({
        message: 'Salary already paid',
        details: { 
          paymentDate: salary.paymentDate,
          errorType: 'AlreadyPaid' 
        }
      });
    }

    const updatedSalary = await Salary.findByIdAndUpdate(
      id,
      { 
        status: 'Paid',
        paymentDate: new Date()
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: `Salary marked as paid successfully`,
      salary: updatedSalary
    });

  } catch (error) {
    console.error('Payment Processing Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Payment processing failed',
      error: {
        message: error.message
      }
    });
  }
};

module.exports = {
  processSalaries,
  getSalaries,
  markAsPaid
};