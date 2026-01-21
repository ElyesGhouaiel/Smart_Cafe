export const API_CONFIG = {
  BASE_URL: __DEV__ ? 'http://localhost:3000/api' : 'https://api.smartcafe.fr/api',
  TIMEOUT: 30000,
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
  USERS: {
    ME: '/users/me',
    UPDATE: '/users/:id',
  },
  PRODUCTS: {
    LIST: '/products',
    DETAIL: '/products/:id',
  },
  CATEGORIES: {
    LIST: '/categories',
    DETAIL: '/categories/:id',
  },
  ORDERS: {
    LIST: '/orders',
    CREATE: '/orders',
    DETAIL: '/orders/:id',
    UPDATE_STATUS: '/orders/:id/status',
  },
};
