import axios from 'axios';
import { withCache } from './cacheManager';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// Axios instance with optimized config
const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/account';
    }
    return Promise.reject(error);
  }
);

// Raw API functions
const rawAPI = {
  // Products
  getAllProducts: async (params = {}) => {
    const response = await api.get('/api/products', { params });
    return response.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/api/categories');
    return response.data;
  },

  // Search products
  searchProducts: async (query, params = {}) => {
    const response = await api.get('/api/products', { 
      params: { ...params, search: query } 
    });
    return response.data;
  },

  // Cart operations
  addToCart: async (data) => {
    const response = await api.post('/api/cart/add', data);
    return response.data;
  },

  getCart: async () => {
    const response = await api.get('/api/cart');
    return response.data;
  },

  updateCartItem: async (productId, data) => {
    const response = await api.put(`/api/cart/item/${productId}`, data);
    return response.data;
  },

  removeFromCart: async (productId) => {
    const response = await api.delete(`/api/cart/item/${productId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete('/api/cart');
    return response.data;
  },

  // Orders
  createOrder: async (data) => {
    const response = await api.post('/api/orders', data);
    return response.data;
  },

  getOrders: async () => {
    const response = await api.get('/api/orders');
    return response.data;
  },

  // Auth
  register: async (data) => {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  },

  login: async (data) => {
    const response = await api.post('/api/auth/login', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/api/auth/me', data);
    return response.data;
  },

  // Contact
  submitContact: async (data) => {
    const response = await api.post('/api/contact', data);
    return response.data;
  },
};

// Cache key generators
const cacheKeys = {
  products: (params) => `products_${JSON.stringify(params)}`,
  product: (id) => `product_${id}`,
  categories: () => 'categories',
  search: (query, params) => `search_${query}_${JSON.stringify(params)}`,
  cart: () => 'cart',
  orders: () => 'orders',
  profile: () => 'profile',
};

// Cached API functions
const cachedAPI = {
  // Products - cached for 5 minutes
  getAllProducts: withCache(
    rawAPI.getAllProducts,
    cacheKeys.products,
    300000
  ),

  getProductById: withCache(
    rawAPI.getProductById,
    cacheKeys.product,
    300000
  ),

  getCategories: withCache(
    rawAPI.getCategories,
    cacheKeys.categories,
    600000 // 10 minutes
  ),

  // Search - cached for 2 minutes
  searchProducts: withCache(
    rawAPI.searchProducts,
    cacheKeys.search,
    120000
  ),

  // Cart - shorter cache time
  getCart: withCache(
    rawAPI.getCart,
    cacheKeys.cart,
    60000 // 1 minute
  ),

  // Orders - cached for 5 minutes
  getOrders: withCache(
    rawAPI.getOrders,
    cacheKeys.orders,
    300000
  ),

  // Profile - cached for 5 minutes
  getProfile: withCache(
    rawAPI.getProfile,
    cacheKeys.profile,
    300000
  ),

  // Non-cached operations (mutations)
  addToCart: rawAPI.addToCart,
  updateCartItem: rawAPI.updateCartItem,
  removeFromCart: rawAPI.removeFromCart,
  clearCart: rawAPI.clearCart,
  createOrder: rawAPI.createOrder,
  register: rawAPI.register,
  login: rawAPI.login,
  updateProfile: rawAPI.updateProfile,
  submitContact: rawAPI.submitContact,
};

export default cachedAPI;