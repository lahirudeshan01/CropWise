import api from './apiUtils';

const API_URL = '/api'; // Use relative URL since baseURL is set in apiUtils

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
  
  const response = await api.get(`${API_URL}/transactions`, {
    params: cleanFilters,
  });
  return response.data;
};

// Add a new transaction
export const addTransaction = async (transactionData) => {
  const response = await api.post(`${API_URL}/transactions`, transactionData);
  return response.data;
};

// Generate financial report
export const generateReport = async () => {
  const response = await api.get(`${API_URL}/report`);
  return response.data;
};

// Generate monthly financial report
export const generateMonthlyReport = async (month, year) => {
  const response = await api.get(`${API_URL}/monthly-report`, {
    params: { month, year },
  });
  return response.data;
};

// Generate daily financial report
export const generateDailyReport = async (date) => {
  const response = await api.get(`${API_URL}/daily-report`, {
    params: { date },
  });
  return response.data;
};

// Update a transaction
export const updateTransaction = async (transaction) => {
  const response = await api.put(`${API_URL}/transactions/${transaction._id}`, transaction);
  return response.data;
};

// Delete a transaction
export const deleteTransaction = async (id) => {
  const response = await api.delete(`${API_URL}/transactions/${id}`);
  return response.data;
};

// Add to existing exports
export const processSalaries = async (month, year) => {
  const response = await api.post(`${API_URL}/salaries/process`, { month, year });
  return response.data;
};

export const getSalaries = async (filters = {}) => {
  // Convert month to number if it exists
  const processedFilters = { ...filters };
  if (processedFilters.month) {
    processedFilters.month = parseInt(processedFilters.month);
  }
  if (processedFilters.year) {
    processedFilters.year = parseInt(processedFilters.year);
  }
  
  const response = await api.get(`${API_URL}/salaries`, { 
    params: processedFilters 
  });
  return response.data;
};

export const markSalaryAsPaid = async (id) => {
  try {
    const response = await api.put(`${API_URL}/salaries/${id}/paid`);
    return response;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};
