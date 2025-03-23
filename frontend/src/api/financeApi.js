import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Replace with your backend URL

// Get transactions with optional filters
export const getTransactions = async (filters = {}) => {
  console.log("Sending filters to backend:", filters);
  
  // Remove empty filters to avoid sending unnecessary parameters
  const cleanFilters = {};
  Object.keys(filters).forEach(key => {
    if (filters[key] !== "" && filters[key] !== null && filters[key] !== undefined) {
      cleanFilters[key] = filters[key];
    }
  });
  
  console.log("Clean filters:", cleanFilters);
  
  const response = await axios.get(`${API_URL}/transactions`, {
    params: cleanFilters,
  });
  return response.data;
};

// Add a new transaction
export const addTransaction = async (transactionData) => {
  const response = await axios.post(`${API_URL}/transactions`, transactionData);
  return response.data;
};

// Generate financial report
export const generateReport = async () => {
  const response = await axios.get(`${API_URL}/report`);
  return response.data;
};

// Generate monthly financial report
export const generateMonthlyReport = async (month, year) => {
  const response = await axios.get(`${API_URL}/monthly-report`, {
    params: { month, year },
  });
  return response.data;
};

// Generate daily financial report
export const generateDailyReport = async (date) => {
  const response = await axios.get(`${API_URL}/daily-report`, {
    params: { date },
  });
  return response.data;
};

// Update a transaction
export const updateTransaction = async (transaction) => {
  const response = await axios.put(`${API_URL}/transactions/${transaction._id}`, transaction);
  return response.data;
};

// Delete a transaction
export const deleteTransaction = async (id) => {
  const response = await axios.delete(`${API_URL}/transactions/${id}`);
  return response.data;
};

// For backward compatibility
export const logTransaction = addTransaction;