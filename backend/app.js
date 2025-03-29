const express = require('express');
const cors = require('cors');
// Import database connection
const connectDB = require('./config/db');
// Import routes
const financeRoutes = require('./routes/financeRoutes');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Use finance routes
app.use('/api', financeRoutes);

// Export the app
module.exports = app;