import api from './apiUtils';

const API_URL = '/api/inventory';

// Get all inventory items for current user
export const getInventory = async () => {
  const response = await api.get(API_URL);
  return response.data;
};

// Get a specific inventory item by ID
export const getInventoryById = async (id) => {
  const response = await api.get(`${API_URL}/${id}`);
  return response.data;
};

// Add a new inventory item
export const addInventoryItem = async (itemData) => {
  const response = await api.post(API_URL, itemData);
  return response.data;
};

// Update an inventory item
export const updateInventoryItem = async (id, itemData) => {
  const response = await api.put(`${API_URL}/${id}`, itemData);
  return response.data;
};

// Delete an inventory item
export const deleteInventoryItem = async (id) => {
  const response = await api.delete(`${API_URL}/${id}`);
  return response.data;
}; 