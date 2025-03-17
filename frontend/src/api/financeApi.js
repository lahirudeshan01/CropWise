import axios from 'axios';

const API_URL = 'http://localhost:5002/api'; // Replace with your backend URL

// Log a transaction
export const logTransaction = async (transactionData) => {
  const response = await axios.post(`${API_URL}/transactions`, transactionData);
  return response.data;
};

// Get all transactions
export const getTransactions = async () => {
  const response = await axios.get(`${API_URL}/transactions`);
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
    params: { month, year }, // Pass month and year as query parameters
  });
  return response.data;
};
// Generate daily financial report
export const generateDailyReport = async (date) => {
  const response = await axios.get(`${API_URL}/daily-report`, {
    params: { date }, // Pass date as query parameter
  });
  return response.data;
};

// Update a transaction
export const updateTransaction = async (transaction) => {
  const response = await axios.put(`${API_URL}/transactions/${transaction.id}`, transaction);
  return response.data;
};

// Delete a transaction
export const deleteTransaction = async (id) => {
  const response = await axios.delete(`${API_URL}/transactions/${id}`);
  return response.data;
};