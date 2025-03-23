
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// Import routes
const financeRoutes = require('./routes/financeRoutes');


// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));



// Use finance routes
app.use('/api', financeRoutes);

// Export the app
module.exports = app;