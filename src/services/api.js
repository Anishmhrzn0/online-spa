import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

// Services API
export const servicesAPI = {
  // Get all services
  getAll: async () => {
    const response = await api.get('/services');
    return response.data;
  },

  // Get service by ID
  getById: async (id) => {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },

  // Create new service (Admin only)
  create: async (serviceData) => {
    const response = await api.post('/services', serviceData);
    return response.data;
  },

  // Update service (Admin only)
  update: async (id, serviceData) => {
    const response = await api.put(`/services/${id}`, serviceData);
    return response.data;
  },

  // Delete service (Admin only)
  delete: async (id) => {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  },
};

// Bookings API
export const bookingsAPI = {
  // Create new booking
  create: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // Get user's bookings
  getUserBookings: async () => {
    const response = await api.get('/bookings/my');
    return response.data;
  },

  // Get all bookings (Admin only)
  getAll: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },

  // Get booking by ID
  getById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  // Update booking
  update: async (id, bookingData) => {
    const response = await api.put(`/bookings/${id}`, bookingData);
    return response.data;
  },

  // Delete booking
  delete: async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },
};

// Users API
export const usersAPI = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },

  // Get all users (Admin only)
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // Get user by ID (Admin only)
  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Update user (Admin only)
  update: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Delete user (Admin only)
  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  // Get admin dashboard data
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },
};

export default api; 