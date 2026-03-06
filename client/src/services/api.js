// client/src/services/api.js
// Centralized Axios instance for all API calls

import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' },
});

// ─── Ingredients ──────────────────────────────────────────
export const ingredientService = {
    getAll: () => api.get('/ingredients'),
    getById: (id) => api.get(`/ingredients/${id}`),
    getLowStock: () => api.get('/ingredients/low-stock'),
    create: (data) => api.post('/ingredients', data),
    update: (id, data) => api.put(`/ingredients/${id}`, data),
    remove: (id) => api.delete(`/ingredients/${id}`),
};

// ─── Dishes ───────────────────────────────────────────────
export const dishService = {
    getAll: () => api.get('/dishes'),
    getById: (id) => api.get(`/dishes/${id}`),
    create: (data) => api.post('/dishes', data),
    update: (id, data) => api.put(`/dishes/${id}`, data),
    remove: (id) => api.delete(`/dishes/${id}`),
};

// ─── Recipe Mapping ───────────────────────────────────────
export const recipeService = {
    getByDish: (dishId) => api.get(`/recipes/dish/${dishId}`),
    create: (data) => api.post('/recipes', data),
    update: (id, data) => api.put(`/recipes/${id}`, data),
    remove: (id) => api.delete(`/recipes/${id}`),
};

// ─── Sales ────────────────────────────────────────────────
export const saleService = {
    getAll: (params) => api.get('/sales', { params }),
    getById: (id) => api.get(`/sales/${id}`),
    create: (data) => api.post('/sales', data),
};

// ─── Restocking ───────────────────────────────────────────
export const restockService = {
    getAll: (params) => api.get('/restocks', { params }),
    create: (data) => api.post('/restocks', data),
};

// ─── Waste ────────────────────────────────────────────────
export const wasteService = {
    getAll: (params) => api.get('/waste', { params }),
    create: (data) => api.post('/waste', data),
};

// ─── Analytics ────────────────────────────────────────────
export const analyticsService = {
    getDashboard: (period) => api.get('/analytics/dashboard', { params: { period } }),
    getSalesTrend: (days) => api.get('/analytics/sales-trend', { params: { days } }),
};

export default api;
