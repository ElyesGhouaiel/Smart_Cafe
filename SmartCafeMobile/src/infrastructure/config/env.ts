/**
 * Environment Configuration
 *
 * Centralizes all environment variables and configuration
 */

const ENV = {
  // API Configuration
  // ADAPTER: Backend actuel n'a pas de préfixe /api/v1, on s'adapte
  API_BASE_URL: __DEV__
    ? 'http://localhost:3000' // SANS /api/v1 pour compatibilité backend actuel
    : 'https://api.smartcafe.com',

  // Stripe Configuration
  STRIPE_PUBLISHABLE_KEY: __DEV__
    ? 'pk_test_51234567890' // TODO: Replace with actual test key
    : 'pk_live_51234567890', // TODO: Replace with actual live key

  // Firebase Configuration
  FIREBASE_PROJECT_ID: __DEV__
    ? 'smart-cafe-staging'
    : 'smart-cafe-prod',

  // API Timeouts
  API_TIMEOUT: 10000, // 10 seconds

  // JWT Token Configuration
  ACCESS_TOKEN_KEY: '@smart_cafe_access_token',
  REFRESH_TOKEN_KEY: '@smart_cafe_refresh_token',

  // Storage Keys
  CART_STORAGE_KEY: '@smart_cafe_cart',
  USER_STORAGE_KEY: '@smart_cafe_user',

  // App Configuration
  APP_NAME: 'Smart Café',
  APP_VERSION: '1.0.0',
};

export default ENV;
