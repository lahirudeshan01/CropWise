import api from './apiUtils';

const API_URL = '/api/tasks';

// Get all tasks for current user
export const getTasks = async () => {
  const response = await api.get(API_URL);
  return response.data;
};

// Get a specific task by ID
export const getTaskById = async (id) => {
  const response = await api.get(`${API_URL}/${id}`);
  return response.data;
};

// Add a new task
export const addTask = async (taskData) => {
  const response = await api.post(API_URL, taskData);
  return response.data;
};

// Update a task
export const updateTask = async (id, taskData) => {
  const response = await api.put(`${API_URL}/${id}`, taskData);
  return response.data;
};

// Delete a task
export const deleteTask = async (id) => {
  const response = await api.delete(`${API_URL}/${id}`);
  return response.data;
}; 