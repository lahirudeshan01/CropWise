const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  employeeId: { 
    type: String, 
    required: true,
    index: true // For faster queries
  },
  monthYear: { // Combined field for easier querying
    type: String, 
    required: true,
    index: true,
    match: /^\d{4}-\d{2}$/ // Format: YYYY-MM
  },
  basicSalary: { 
    type: Number, 
    required: true,
    min: 0,
    set: v => parseFloat(v.toFixed(2)) // Ensure 2 decimal places
  },
  epf: { 
    type: Number, 
    required: true,
    min: 0,
    set: v => parseFloat(v.toFixed(2))
  },
  // ... same for other amount fields
  etf: { 
    type: Number, 
    required: true,
    min: 0 
  },
  netSalary: { 
    type: Number, 
    required: true,
    min: 0 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Paid', 'Cancelled'],
    default: 'Pending' 
  },
  paymentDate: Date,
  transactionRefs: [{ // References to original salary payment transactions
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }],
  processedAt: {
    type: Date,
    default: Date.now
  },
  deductionTransactionRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Compound index for frequent queries
salarySchema.index({ employeeId: 1, monthYear: 1 }, { unique: true });

module.exports = mongoose.model('Salary', salarySchema);