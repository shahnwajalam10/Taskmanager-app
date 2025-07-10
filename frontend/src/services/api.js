import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = async (userData) => {
  return await api.post('/auth/register', userData);
};

export const login = async (credentials) => {
  return await api.post('/auth/login', credentials);
};

export const getTasks = async () => {
  return await api.get('/tasks');
};

export const createTask = async (taskData) => {
  return await api.post('/tasks', taskData);
};

export const updateTask = async (id, taskData) => {
  return await api.put(`/tasks/${id}`, taskData);
};

export const deleteTask = async (id) => {
  return await api.delete(`/tasks/${id}`);
};

export default api;