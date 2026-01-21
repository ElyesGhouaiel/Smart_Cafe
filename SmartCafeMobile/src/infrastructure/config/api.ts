/**
 * API Configuration
 *
 * Central configuration for API endpoints and settings
 */

/**
 * API Base URL
 * - iOS simulator: Use localhost
 * - Android emulator: Use 10.0.2.2 (special alias for host machine)
 * - Real device: Use your machine's IP address
 */
export const API_CONFIG = {
  BASE_URL: __DEV__ ? 'http://localhost:3000/api' : 'https://api.smartcafe.fr/api',
  TIMEOUT: 30000, // 30 seconds
};

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
  // Users
  USERS: {
    ME: '/users/me',
    UPDATE: '/users/:id',
  },
  // Products
  PRODUCTS: {
    LIST: '/products',
    DETAIL: '/products/:id',
  },
  // Categories
  CATEGORIES: {
    LIST: '/categories',
    DETAIL: '/categories/:id',
  },
  // Orders
  ORDERS: {
    LIST: '/orders',
    CREATE: '/orders',
    DETAIL: '/orders/:id',
    UPDATE_STATUS: '/orders/:id/status',
  },
};
