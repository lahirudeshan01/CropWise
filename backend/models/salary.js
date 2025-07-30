const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  employeeId: { 
    type: String, 
    required: true,
    index: true
  },
  monthYear: {
    type: String, 
    required: true,
    index: true,
    match: /^\d{4}-\d{2}$/
  },
  basicSalary: { 
    type: Number, 
    required: true,
    min: 0,
    set: v => parseFloat(v.toFixed(2))
  },
  epf: { 
    type: Number, 
    required: true,
    min: 0,
    set: v => parseFloat(v.toFixed(2))
  },
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
  transactionRefs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }],
  processedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

salarySchema.index({ employeeId: 1, monthYear: 1 }, { unique: true });

module.exports = mongoose.model('Salary', salarySchema);