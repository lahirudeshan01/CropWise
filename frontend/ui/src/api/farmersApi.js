import api from './apiUtils';

const API_URL = '/api/farmers';

// Get all farmers for current user
export const getFarmers = async () => {
  const response = await api.get(API_URL);
  return response.data;
};

// Get a specific farmer by ID
export const getFarmerById = async (id) => {
  const response = await api.get(`${API_URL}/${id}`);
  return response.data;
};

// Add a new farmer
export const addFarmer = async (formData) => {
  const response = await api.post(API_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Update a farmer
export const updateFarmer = async (id, formData) => {
  const response = await api.put(`${API_URL}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Delete a farmer
export const deleteFarmer = async (id) => {
  const response = await api.delete(`${API_URL}/${id}`);
  return response.data;
}; 